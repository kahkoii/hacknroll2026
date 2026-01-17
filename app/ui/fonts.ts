import { Roboto, Oxygen } from 'next/font/google';

const robotoFont = Roboto({
  weight: '100',
  subsets: ['latin'],
});
const oxygenFont = Oxygen({ weight: '300', subsets: ['latin'] });

export { robotoFont, oxygenFont };
