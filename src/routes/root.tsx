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
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import { Menu } from 'lucide-react';

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
        className='p-2 border-[1px] rounded mx-auto px-8 justify-center [&>div:first-child]:w-full xl:max-w-[1200px] max-w-full sticky top-0 left-0 right-0 bg-card z-50 shadow-lg'
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
              <NavigationMenuTrigger className='border-[1px] text-neutral-600 dark:text-neutral-300'>
                <Menu />
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
      {/* <div className='h-[58px]'></div> */}
      <CookieConsent />
      <main className='max-w-[1200px] mx-auto px-4 md:px-2'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Root;
