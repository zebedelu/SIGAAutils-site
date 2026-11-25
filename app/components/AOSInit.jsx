'use client';

import { useEffect } from 'react';
import AOS from 'aos';

/* Animações sempre ligadas, uma vez por seção: `once: true` e `disable: false`.
   O `data-aos` fica no `.container` de cada seção, não em cada item, para que a seção
   entre inteira de uma vez. O hero não usa AOS (o título é o LCP) — entra por keyframes em globals.css. */
export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: 'ease-out-quad',
      offset: 90,
      disable: false,
      startEvent: 'DOMContentLoaded',
    });

    /* imagens e fontes mudam a altura da página depois do init */
    const aoCarregar = () => AOS.refresh();
    window.addEventListener('load', aoCarregar);
    return () => window.removeEventListener('load', aoCarregar);
  }, []);

  return null;
}
