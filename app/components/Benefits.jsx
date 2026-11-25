'use client';

import { useEffect, useId, useRef, useState } from 'react';

const RETOMADA = 5000;

const icones = {
  lua: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  ),
  calendario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  grafico: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="M8 17v-5M13 17V8M18 17v-8" />
    </svg>
  ),
  relogio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  forum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  painel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  ),
  zip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M10 13h4M10 17h4" />
    </svg>
  ),
};

/* Cada item tem uma duração: 6 s para as capturas e o tempo real do vídeo
   nos que rodam sozinhos, para a aba não trocar antes do fim da gravação. */
const abas = [
  {
    slug: 'tela-inicial',
    titulo: 'Modo escuro e claro',
    resumo: 'Claro e escuro na página inteira.',
    texto: 'A página inteira troca de visual com um clique.',
    legenda: 'Página inicial com o tema escuro, papel de parede e o progresso do ano letivo.',
    tom: 'verde',
    icone: 'lua',
    video: '/video/modo-escuro.mp4',
    poster: '/img/tela-inicial-1600.webp',
    duracao: 4400,
  },
  {
    slug: 'calendario',
    titulo: 'Calendário de avaliações',
    resumo: 'As avaliações dos próximos 30 dias.',
    texto: 'As avaliações da página inicial viram um calendário dos próximos 30 dias.',
    legenda: 'Calendário com as avaliações dos próximos 30 dias.',
    tom: 'azul',
    icone: 'calendario',
    larguras: [800, 1600],
    duracao: 6000,
  },
  {
    slug: 'horarios',
    titulo: 'Horários da turma',
    resumo: 'O horário da sua turma na página inicial.',
    texto:
      'O horário da turma aparece na home, com atalhos para os horários acadêmicos e para a Central de Eventos.',
    legenda: 'Página inicial com o horário semanal da turma.',
    tom: 'indigo',
    icone: 'relogio',
    larguras: [800, 1600],
    duracao: 6000,
  },
  {
    slug: 'mostrar-notas',
    titulo: 'Notas na página inicial',
    resumo: 'Médias parciais e aprovação sem abrir a Turma Virtual.',
    texto:
      'Andamento das aulas, médias parciais e o banner de aprovação sem abrir a Turma Virtual.',
    legenda: 'Cada matéria ganha um botão que abre a tabela de notas na própria home.',
    tom: 'roxo',
    icone: 'grafico',
    video: '/video/notas-home.mp4',
    poster: '/img/mostrar-notas-1600.webp',
    duracao: 4100,
  },
  {
    slug: 'painel',
    titulo: 'Painel lateral',
    resumo: 'Os menus do SIGAA numa barra fixa à esquerda.',
    texto:
      'Os botões do cabeçalho e o menu do portal viram uma barra fixa à esquerda, com largura ajustável.',
    legenda: 'Painel lateral com os menus do SIGAA em pastas expansíveis.',
    tom: 'rosa',
    icone: 'painel',
    larguras: [800, 1600],
    duracao: 6000,
  },
  {
    slug: 'forum-imagens',
    titulo: 'Imagens no fórum',
    resumo: 'Foto publicada direto no tópico.',
    texto:
      'No Fórum do Curso, o campo “Link da imagem” publica a foto com crédito ao SIGAAutils.',
    legenda: 'Tópico do fórum com a imagem publicada e o crédito à extensão.',
    tom: 'laranja',
    icone: 'forum',
    video: '/video/forum-imagens.mp4',
    duracao: 7000,
  },
  {
    slug: 'certificados',
    titulo: 'Certificados em ZIP',
    resumo: 'Todos os certificados de um evento num download só.',
    texto:
      'Na Central de Eventos, um botão baixa todos os certificados da página atual num único ZIP.',
    legenda: 'Tela da Central de Eventos com o botão de baixar certificados em ZIP.',
    tom: 'teal',
    icone: 'zip',
    video: '/video/certificados.mp4',
    duracao: 14800,
  },
];

export default function Benefits() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [aguardando, setAguardando] = useState(false);
  const [prazo, setPrazo] = useState(null);
  const baseId = useId();
  const listaRef = useRef(null);
  const retomadaRef = useRef(null);
  const restanteRef = useRef(abas[0].duracao);

  useEffect(() => {
    setPrazo(Date.now() + abas[0].duracao);
    return () => clearTimeout(retomadaRef.current);
  }, []);

  useEffect(() => {
    if (pausado || prazo === null) return;
    const proximo = (ativo + 1) % abas.length;
    const id = setTimeout(() => {
      setAtivo(proximo);
      restanteRef.current = abas[proximo].duracao;
      setPrazo(Date.now() + abas[proximo].duracao);
    }, Math.max(0, prazo - Date.now()));
    return () => clearTimeout(id);
  }, [prazo, pausado, ativo]);

  useEffect(() => {
    const lista = listaRef.current;
    const item = lista?.querySelector('[aria-selected="true"]');
    if (!lista || !item || lista.scrollWidth <= lista.clientWidth) return;

    /* rola só o trilho horizontal; scrollIntoView puxava a página inteira */
    const deslocamento =
      item.getBoundingClientRect().left -
      lista.getBoundingClientRect().left +
      lista.scrollLeft -
      (lista.clientWidth - item.offsetWidth) / 2;

    lista.scrollTo({ left: deslocamento, behavior: 'smooth' });
  }, [ativo]);

  function escolher(indice) {
    setAtivo(indice);
    setPrazo(null);
    setAguardando(true);
    restanteRef.current = abas[indice].duracao;
    clearTimeout(retomadaRef.current);
    retomadaRef.current = setTimeout(() => {
      setAguardando(false);
      setPrazo(Date.now() + abas[indice].duracao);
    }, RETOMADA);
  }

  function pausar() {
    if (prazo !== null) restanteRef.current = Math.max(0, prazo - Date.now());
    setPrazo(null);
    setPausado(true);
  }

  function retomar() {
    setPausado(false);
    if (!aguardando && prazo === null) {
      setPrazo(Date.now() + (restanteRef.current || abas[ativo].duracao));
    }
  }

  function mover(evento, indice) {
    const teclas = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!teclas.includes(evento.key)) return;
    evento.preventDefault();

    let proximo = indice;
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
      proximo = (indice + 1) % abas.length;
    } else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
      proximo = (indice - 1 + abas.length) % abas.length;
    } else if (evento.key === 'Home') {
      proximo = 0;
    } else if (evento.key === 'End') {
      proximo = abas.length - 1;
    }

    escolher(proximo);
    listaRef.current?.querySelectorAll('[role="tab"]')[proximo]?.focus();
  }

  const aba = abas[ativo];

  return (
    <section className="section section--soft" id="beneficios">
      <div className="container" data-aos="fade-up">
        <h2>O que muda no SIGAA</h2>
        <p className="section__intro">
          Sete coisas que aparecem assim que a extensão liga. Escolha uma para ver.
        </p>

        <div className="showcase" data-pausado={pausado}>
          <div
            className="showcase__tabs"
            role="tablist"
            aria-label="Benefícios"
            aria-orientation="vertical"
            ref={listaRef}
            onMouseEnter={pausar}
            onMouseLeave={retomar}
          >
            {abas.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={ativo === i}
                aria-controls={`${baseId}-panel`}
                tabIndex={ativo === i ? 0 : -1}
                data-tone={item.tom}
                data-rodando={ativo === i && !aguardando}
                className="showcase__tab"
                onClick={() => escolher(i)}
                onKeyDown={(e) => mover(e, i)}
              >
                <span className="showcase__icon" aria-hidden="true">
                  {icones[item.icone]}
                </span>
                <span className="showcase__tab-text">
                  <span className="showcase__tab-title">{item.titulo}</span>
                  <span className="showcase__tab-sub">{item.resumo}</span>
                </span>
                {ativo === i && (
                  <span
                    className="showcase__bar"
                    aria-hidden="true"
                    style={{ '--duracao': `${item.duracao}ms` }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="showcase__panel" key={aba.slug}>
            <article
              className="showcase__card"
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${ativo}`}
              data-tone={aba.tom}
            >
              <header className="showcase__head">
                <span className="showcase__icon showcase__icon--lg" aria-hidden="true">
                  {icones[aba.icone]}
                </span>
                <div>
                  <h3>{aba.titulo}</h3>
                  <p>{aba.texto}</p>
                </div>
              </header>

              <div className="showcase__frame">
                {aba.video ? (
                  <figure className="showcase__shot">
                    <video
                      src={aba.video}
                      poster={aba.poster}
                      width={1280}
                      height={720}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-label={aba.legenda}
                      ref={(video) => {
                        /* o React não emite o atributo `muted` no HTML do SSR e o
                           navegador bloqueia o autoplay com som; ligar o mudo e
                           chamar play() aqui é o que dá partida na gravação. */
                        if (!video) return;
                        video.muted = true;
                        video.play().catch(() => {});
                      }}
                    />
                  </figure>
                ) : (
                  <figure className="showcase__shot">
                    <img
                      src={`/img/${aba.slug}-1600.webp`}
                      srcSet={aba.larguras.map((l) => `/img/${aba.slug}-${l}.webp ${l}w`).join(', ')}
                      sizes="(max-width: 959px) calc(100vw - 72px), (max-width: 1184px) calc(100vw - 96px), 700px"
                      width={1600}
                      height={900}
                      alt={aba.legenda}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                )}
              </div>
            </article>
          </div>
        </div>

        <div className="showcase__dots">
          {abas.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              className="showcase__dot"
              aria-current={ativo === i}
              aria-label={`Mostrar ${item.titulo}`}
              onClick={() => escolher(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
