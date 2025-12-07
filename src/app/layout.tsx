import type { Metadata } from 'next';
import { Lora, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-brand-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-brand-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EverNest - Prenatal Story Companion',
  description:
    'Create personalized, calming bedtime stories for your unborn baby. A gentle AI companion for expectant parents.',
  keywords: [
    'prenatal',
    'baby',
    'bedtime stories',
    'pregnancy',
    'parenting',
    'AI stories',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${lora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

