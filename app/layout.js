import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import PageTransition from '@/components/layout/PageTransition';
import SettingsProvider from '@/components/providers/SettingsProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'FlowType — Typing Practice & Learning',
  description: 'A premium, modern typing practice platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SettingsProvider>
          <div className="bg-glow bg-glow-1"></div>
          <div className="bg-glow bg-glow-2"></div>
          <div className="bg-glow bg-glow-3"></div>

          <div className="app-layout">
            <Sidebar />
            <div className="app-main">
              <Topbar />
              <main className="app-content">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
