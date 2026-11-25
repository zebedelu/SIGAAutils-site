import localFont from 'next/font/local';
import 'aos/dist/aos.css';
import './globals.css';

import AOSInit from './components/AOSInit';
import ScrollSuave from './components/ScrollSuave';

const archivo = localFont({
  src: './fonts/archivo-latin-var.woff2',
  variable: '--font-archivo',
  weight: '400 700',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const jetbrains = localFont({
  src: './fonts/jetbrains-mono-latin-var.woff2',
  variable: '--font-jetbrains',
  weight: '400 500',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
});

export const metadata = {
  metadataBase: new URL('https://sigaautils.pages.dev'),
  title: 'SIGAA utils — o SIGAA com a sua cara',
  description:
    'Modo escuro, papel de parede, calendário de avaliações e login automático no SIGAA do IFC. Extensão gratuita, instalação manual em menos de 2 minutos.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'SIGAA utils',
    title: 'SIGAA utils — o SIGAA com a sua cara',
    description:
      'Modo escuro, papel de parede, calendário de avaliações e login automático no SIGAA do IFC. Instalação manual em menos de 2 minutos.',
    images: [{ url: '/img/og.jpg', width: 1200, height: 630 }],
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body>
        <noscript>
          <style>{'[data-aos]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <AOSInit />
        <ScrollSuave />
        {children}
      </body>
    </html>
  );
}
