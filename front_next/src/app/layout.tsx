import './globals.css';
import { Inter } from 'next/font/google';
import Chat from './components/chatbot';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children } : {children: React.ReactNode}
) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}
        <Chat />
      </body>
    </html>
  );
}