'use client';

import { useEffect } from 'react';

const DURACAO = 700;
const TOPO_RESERVADO = 80;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* Rolagem animada para âncoras da mesma página. O `scroll-behavior: smooth` do
   CSS saiu para não brigar com o requestAnimationFrame. */
export default function ScrollSuave() {
  useEffect(() => {
    let quadro = 0;

    const parar = () => cancelAnimationFrame(quadro);

    const aoClicar = (evento) => {
      if (evento.defaultPrevented || evento.button !== 0) return;
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

      const link = evento.target.closest('a[href]');
      if (!link || link.target === '_blank') return;

      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const alvo = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!alvo) return;

      evento.preventDefault();
      parar();

      const inicio = window.scrollY;
      const destino = Math.max(
        0,
        inicio + alvo.getBoundingClientRect().top - TOPO_RESERVADO
      );
      const distancia = destino - inicio;

      history.replaceState(null, '', url.hash);
      if (Math.abs(distancia) < 2) return;

      let partida = null;
      const passo = (agora) => {
        if (partida === null) partida = agora;
        const t = Math.min(1, (agora - partida) / DURACAO);
        window.scrollTo(0, inicio + distancia * easeInOutCubic(t));
        if (t < 1) {
          quadro = requestAnimationFrame(passo);
        } else {
          clearTimeout(socorro);
        }
      };
      quadro = requestAnimationFrame(passo);

      /* navegador que engasga o rAF (aba em segundo plano, modo economia):
         entrega a rolagem ao scroll suave nativo em vez de não rolar nada */
      const socorro = setTimeout(() => {
        if (Math.abs(window.scrollY - inicio) < 4) {
          cancelAnimationFrame(quadro);
          window.scrollTo({ top: destino, behavior: 'smooth' });
        }
      }, 250);
    };

    document.addEventListener('click', aoClicar);
    window.addEventListener('wheel', parar, { passive: true });
    window.addEventListener('touchstart', parar, { passive: true });
    window.addEventListener('keydown', parar);

    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener('click', aoClicar);
      window.removeEventListener('wheel', parar);
      window.removeEventListener('touchstart', parar);
      window.removeEventListener('keydown', parar);
    };
  }, []);

  return null;
}
