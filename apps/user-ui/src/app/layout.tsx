import Header from '../shared/widgets/header';
import './global.css';
import { Poppins,Roboto,Jost,Oregano } from 'next/font/google'
import Providers from './providers';

export const metadata = {
  title: 'Marketplace',
  description: 'Marketplace',
};

const jost= Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-jost'
});

const roboto= Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto'
});

const poppins= Poppins({
  subsets: ['latin'],
  weight: ['100', '200','300', '400', '500','600', '700','800', '900'],
  variable: '--font-poppins'
});

const oregano= Oregano({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-oregano'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} ${jost.variable} ${oregano.variable} `}>
        <Providers>
          <Header/>        
          {children}
        </Providers>
        </body>
    </html>
  )
}
