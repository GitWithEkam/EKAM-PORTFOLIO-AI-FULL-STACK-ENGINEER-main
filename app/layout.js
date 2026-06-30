import './globals.css';
import { Providers } from './providers';
import { Space_Grotesk, Inter } from 'next/font/google';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: 'Ekamnoor Singh \u2014 Full Stack AI Engineer',
  description:
    'Portfolio of Ekamnoor Singh \u2014 Full Stack AI Engineer & Distributed Systems builder from Punjab. Projects, achievements, tech stack and an AI assistant.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-body antialiased" style={{ background: '#070A14' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
