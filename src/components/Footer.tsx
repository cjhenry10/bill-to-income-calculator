import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='border-t text-sm text-muted-foreground flex flex-wrap justify-around py-4 bg-card'>
      <div className='my-auto text-center'>
        <p>&copy; 2024 Connor Henry</p>
      </div>
      <ul className='flex flex-row gap-4'>
        <li>
          <a
            className='underline text-primary'
            href='https://connorhenry.dev'
            target='_blank'
          >
            Portfolio
          </a>
        </li>
        <li>
          <a
            className='underline text-primary'
            href='https://www.linkedin.com/in/cjhenry10/'
            target='_blank'
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            className='underline text-primary'
            href='https://github.com/cjhenry10'
            target='_blank'
          >
            GitHub
          </a>
        </li>
        <li className='text-primary'>|</li>
        <li>
          <Link className='underline text-primary' to='cookie-policy'>
            Cookie Policy
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
