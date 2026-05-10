import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Floor — Practice investing',
  description: 'Learn investing through real historical scenarios. Earn XP, unlock levels, build your skill.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
