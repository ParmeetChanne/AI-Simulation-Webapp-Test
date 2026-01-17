import type { Metadata } from 'next';
import { Luckiest_Guy, Inter } from 'next/font/google';
import './globals.css';

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luckiest-guy',
});

const inter = Inter({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Macroeconomic Simulation - Learn Economics by Running an Economy',
  description: 'Interactive simulations that turn theory into real decisions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${luckiestGuy.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
