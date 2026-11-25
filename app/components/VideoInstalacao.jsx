'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ESPERA_CONTROLES = 2000;
const SALTO = 5;

const icones = {
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8.4 5.2v13.6a1 1 0 0 0 1.53.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8a1 1 0 0 0-1.53.85Z" />
    </svg>
  ),
  pausa: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="7" y="5" width="3.6" height="14" rx="1.2" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.2" />
    </svg>
  ),
  expandir: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  ),
  recolher: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h3a2 2 0 0 0 2-2V3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    </svg>
  ),
};

function formatar(segundos) {
  const total = Number.isFinite(segundos) && segundos > 0 ? Math.floor(segundos) : 0;
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  return `${minutos}:${String(resto).padStart(2, '0')}`;
}

export default function VideoInstalacao() {
  const raizRef = useRef(null);
  const videoRef = useRef(null);
  const trilhoRef = useRef(null);
  const esconderRef = useRef(null);
  const arrastandoRef = useRef(false);
  const ultimoMovRef = useRef(0);

  const [visivel, setVisivel] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [atual, setAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [telaCheia, setTelaCheia] = useState(false);

  const programarOcultacao = useCallback(() => {
    clearTimeout(esconderRef.current);
    esconderRef.current = setTimeout(() => {
      const video = videoRef.current;
      /* pausado (ou arrastando a barra) os controles ficam à mão */
      if (!video || video.paused || arrastandoRef.current) return;
      setVisivel(false);
    }, ESPERA_CONTROLES);
  }, []);

  const mostrar = useCallback(() => {
    setVisivel(true);
    programarOcultacao();
  }, [programarOcultacao]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* o React não emite o atributo `muted` no HTML do SSR; sem o mudo
       aplicado aqui o navegador bloqueia a reprodução automática */
    video.muted = true;

    const aoTocar = () => {
      setTocando(true);
      programarOcultacao();
    };
    const aoPausar = () => {
      setTocando(false);
      clearTimeout(esconderRef.current);
      setVisivel(true);
    };
    const aoAndar = () => setAtual(video.currentTime);
    const aoCarregar = () => setDuracao(Number.isFinite(video.duration) ? video.duration : 0);

    aoCarregar();

    video.addEventListener('play', aoTocar);
    video.addEventListener('pause', aoPausar);
    video.addEventListener('ended', aoPausar);
    video.addEventListener('timeupdate', aoAndar);
    video.addEventListener('loadedmetadata', aoCarregar);
    video.addEventListener('durationchange', aoCarregar);

    let observador = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observador = new IntersectionObserver(
        ([entrada]) => {
          if (entrada.isIntersecting) {
            /* se o navegador recusar, o controle de play continua ali */
            video.play().catch(() => setVisivel(true));
          } else {
            video.pause();
          }
        },
        { threshold: 0.5 }
      );
      observador.observe(video);
    }

    return () => {
      clearTimeout(esconderRef.current);
      observador?.disconnect();
      video.removeEventListener('play', aoTocar);
      video.removeEventListener('pause', aoPausar);
      video.removeEventListener('ended', aoPausar);
      video.removeEventListener('timeupdate', aoAndar);
      video.removeEventListener('loadedmetadata', aoCarregar);
      video.removeEventListener('durationchange', aoCarregar);
    };
  }, [programarOcultacao]);

  useEffect(() => {
    const aoMudarTela = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', aoMudarTela);
    return () => document.removeEventListener('fullscreenchange', aoMudarTela);
  }, []);

  function alternar() {
    const video = videoRef.current;
    if (!video) return;
    mostrar();
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function saltar(segundos) {
    const video = videoRef.current;
    if (!video) return;
    mostrar();
    const limite = Number.isFinite(video.duration) ? video.duration : 0;
    const alvo = Math.min(Math.max(0, video.currentTime + segundos), limite);
    video.currentTime = alvo;
    setAtual(alvo);
  }

  async function alternarTelaCheia() {
    const alvo = raizRef.current;
    if (!alvo) return;
    mostrar();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await alvo.requestFullscreen();
    } catch {
      /* navegador sem suporte: o vídeo continua no tamanho normal */
    }
  }

  function buscar(evento) {
    const video = videoRef.current;
    const trilho = trilhoRef.current;
    if (!video || !trilho) return;
    const caixa = trilho.getBoundingClientRect();
    if (!caixa.width) return;
    const razao = Math.min(1, Math.max(0, (evento.clientX - caixa.left) / caixa.width));
    const alvo = razao * (video.duration || 0);
    if (!Number.isFinite(alvo)) return;
    video.currentTime = alvo;
    setAtual(alvo);
    setVisivel(true);
  }

  function comecarArrasto(evento) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;
    arrastandoRef.current = true;
    try {
      evento.currentTarget.setPointerCapture(evento.pointerId);
    } catch {
      /* sem captura o arrasto continua enquanto o ponteiro estiver na barra */
    }
    buscar(evento);
    programarOcultacao();
  }

  function moverArrasto(evento) {
    if (!arrastandoRef.current) return;
    buscar(evento);
  }

  function terminarArrasto(evento) {
    if (!arrastandoRef.current) return;
    arrastandoRef.current = false;
    try {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    } catch {}
    mostrar();
  }

  function aoMover(evento) {
    if (evento.pointerType === 'touch') return;
    const agora = Date.now();
    if (agora - ultimoMovRef.current < 200) return;
    ultimoMovRef.current = agora;
    mostrar();
  }

  function aoTeclar(evento) {
    const video = videoRef.current;
    if (!video) return;
    const emBotao = Boolean(evento.target.closest?.('button'));

    if (evento.key === ' ' || evento.key === 'k' || evento.key === 'K') {
      /* no botão, o espaço já dispara o clique nativo */
      if (evento.key === ' ' && emBotao) return;
      evento.preventDefault();
      alternar();
      return;
    }

    if (evento.key === 'f' || evento.key === 'F') {
      evento.preventDefault();
      alternarTelaCheia();
      return;
    }

    if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
      evento.preventDefault();
      saltar(evento.key === 'ArrowRight' ? SALTO : -SALTO);
      return;
    }

    if (evento.key === 'Home' || evento.key === 'End') {
      evento.preventDefault();
      mostrar();
      const alvo = evento.key === 'Home' ? 0 : video.duration || 0;
      video.currentTime = alvo;
      setAtual(alvo);
    }
  }

  const progresso = duracao > 0 ? Math.min(1, Math.max(0, atual / duracao)) : 0;

  return (
    <div
      className="vplayer"
      ref={raizRef}
      tabIndex={-1}
      data-visivel={visivel ? 'true' : 'false'}
      onPointerEnter={mostrar}
      onPointerMove={aoMover}
      onPointerDown={mostrar}
      onKeyDown={aoTeclar}
    >
      <video
        ref={videoRef}
        className="vplayer__video"
        width={1280}
        height={720}
        muted
        playsInline
        preload="metadata"
        aria-label="Tutorial de instalação da extensão"
        onClick={alternar}
      >
        <source src="/video/tutorial_instalacao.webm" type="video/webm" />
        <source src="/video/tutorial_instalacao.mp4" type="video/mp4" />
        Seu navegador não reproduz o vídeo.{' '}
        <a href="/video/tutorial_instalacao.mp4">Baixar o arquivo</a>.
      </video>

      <div className="vplayer__bar">
        <button
          type="button"
          className="vplayer__play"
          onClick={alternar}
          aria-label={tocando ? 'Pausar' : 'Reproduzir'}
        >
          {tocando ? icones.pausa : icones.play}
        </button>

        <div
          className="vplayer__seek"
          ref={trilhoRef}
          role="slider"
          tabIndex={0}
          aria-label="Progresso do vídeo"
          aria-valuemin={0}
          aria-valuemax={Math.max(1, Math.round(duracao))}
          aria-valuenow={Math.round(atual)}
          aria-valuetext={`${formatar(atual)} de ${formatar(duracao)}`}
          style={{ '--p': progresso.toFixed(4) }}
          onPointerDown={comecarArrasto}
          onPointerMove={moverArrasto}
          onPointerUp={terminarArrasto}
          onPointerCancel={terminarArrasto}
        >
          <span className="vplayer__track" aria-hidden="true">
            <span className="vplayer__fill" />
          </span>
          <span className="vplayer__dot" aria-hidden="true" />
        </div>

        <span className="vplayer__time">
          {formatar(atual)} / {formatar(duracao)}
        </span>

        <button
          type="button"
          className="vplayer__full"
          onClick={alternarTelaCheia}
          aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {telaCheia ? icones.recolher : icones.expandir}
        </button>
      </div>
    </div>
  );
}
