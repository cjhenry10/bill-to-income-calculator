import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';

function Root() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [value, setValue] = useState('');

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <NavigationMenu
        value={value}
        onValueChange={setValue}
        className='p-2 border-[1px] rounded mx-auto px-8 justify-center [&>div:first-child]:w-full mb-2 max-w-[1200px]'
      >
        <NavigationMenuList className='gap-4'>
          {screenWidth > 768 ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onClick={() => setValue('')}>
                  <Link to='/'>
                    <Button variant={'outline'}>Salary Estimator</Button>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onClick={() => setValue('')}>
                  <Link to='/expense-splitter'>
                    <Button variant={'outline'}>Expense Splitter</Button>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuTrigger className='border-[1px] border-neutral-800'>
                Menu
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuIndicator />
                <NavigationMenuList className='flex flex-col'>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to='/'>
                        <Button variant={'ghost'} className='w-36'>
                          Salary Estimator
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to='/expense-splitter'>
                        <Button variant={'ghost'} className='w-36'>
                          Expense Splitter
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          <li className='!ml-auto'>
            <ModeToggle />
          </li>
        </NavigationMenuList>
      </NavigationMenu>
      <main className='p-1'>
        <Outlet />
      </main>
    </>
  );
}

export default Root;
