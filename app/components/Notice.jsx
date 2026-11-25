'use client';

import { useState } from 'react';

export default function Notice() {
  const [aberto, setAberto] = useState(true);

  if (!aberto) return null;

  return (
    <aside className="notice">
      <div className="container notice__inner">
        <p className="notice__text">
          <strong>A extensão não está na Chrome Web Store.</strong> Como ela é carregada sem
          compactação, o navegador avisa que não é verificada. É o comportamento esperado.
        </p>
        <button
          type="button"
          className="notice__close"
          onClick={() => setAberto(false)}
          aria-label="Fechar aviso"
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
