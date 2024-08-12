import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function CookieConsent() {
  const [accepted, setAccepted] = useLocalStorage('cookies-accepted', false);
  if (accepted) return null;

  return (
    <Card
      className={`z-50 border-2 border-primary/50 rounded bg-card fixed mb-4 w-[70vw] min-w-[300px] p-8 shadow-xl bottom-0 right-1/2 transform translate-x-1/2`}
    >
      <CardTitle className='text-xl'>Cookie Policy</CardTitle>
      <CardDescription>
        We use local storage to save your form inputs so you can continue your
        work without losing information. By continuing to use this site, you
        agree to this.{' '}
        <Link className='underline text-primary' to='cookie-policy'>
          Learn More
        </Link>
      </CardDescription>
      <CardContent className='p-0 pt-6'>
        <Button
          size='lg'
          className='w-full text-lg bg-primary/70'
          onClick={() => {
            setAccepted(true);
          }}
        >
          Ok
        </Button>
      </CardContent>
    </Card>
  );
}

export default CookieConsent;
