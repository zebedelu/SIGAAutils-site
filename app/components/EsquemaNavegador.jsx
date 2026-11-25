'use client';

import { useEffect, useState } from 'react';

/* Devolve o esquema da página de extensões do navegador em uso. O SSR sai com
   "chrome" (o caso mais comum); depois de montar, o esquema é corrigido para
   Edge, Opera, Vivaldi ou Brave. */
export default function EsquemaNavegador() {
  const [esquema, setEsquema] = useState('chrome');

  useEffect(() => {
    const agente = navigator.userAgent;

    if (/Edg\//.test(agente)) return setEsquema('edge');
    if (/OPR\//.test(agente)) return setEsquema('opera');
    if (/Vivaldi\//.test(agente)) return setEsquema('vivaldi');

    navigator.brave
      ?.isBrave?.()
      .then((brave) => {
        if (brave) setEsquema('brave');
      })
      .catch(() => {});
  }, []);

  return esquema;
}
