import EsquemaNavegador from './EsquemaNavegador';
import VideoInstalacao from './VideoInstalacao';

const passos = [
  {
    titulo: 'Baixe o projeto',
    texto: (
      <>
        Na página do GitHub (
        <a href="https://github.com/zebedelu/SIGAAutils" target="_blank" rel="noreferrer">
          github.com/zebedelu/SIGAAutils
        </a>
        ), use <strong>Code → Download ZIP</strong> e extraia o arquivo.
      </>
    ),
  },
  {
    titulo: 'Abra o gerenciador de extensões',
    texto: (
      <>
        Digite{' '}
        <code>
          <EsquemaNavegador />://extensions
        </code>{' '}
        na barra de endereço.
      </>
    ),
  },
  {
    titulo: 'Ative o Modo desenvolvedor',
    texto: <>É o interruptor no canto superior direito da página de extensões.</>,
  },
  {
    titulo: 'Carregue a extensão',
    texto: (
      <>
        Clique em <strong>Carregar sem compactação</strong> e escolha a pasta que contém o{' '}
        <code>manifest.json</code>.
      </>
    ),
  },
  {
    titulo: 'Abra o SIGAA',
    texto: (
      <>
        Entre em <strong>sig.ifc.edu.br</strong>. A engrenagem aparece no canto superior esquerdo.
      </>
    ),
  },
];

export default function Install() {
  return (
    <section className="section section--soft" id="instalar">
      <div className="container" data-aos="fade-up">
        <h2>Instalar em menos de 2 minutos</h2>
        <p className="section__intro">
          Cinco passos e uma pasta extraída, sem instalador.
        </p>
        <p className="install__aviso">
          A extensão não está na Chrome Web Store. Como ela é carregada sem compactação, o navegador
          avisa que não é verificada. É o comportamento esperado.
        </p>

        <div className="install">
          <div>
            <ol className="steps" role="list">
              {passos.map((p, i) => (
                <li className="step" key={p.titulo}>
                  <span className="step__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="step__body">
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="install__notes">
              <p>
                Saiu versão nova? O aviso aparece no canto da tela. Volte em{' '}
                <code>
                  <EsquemaNavegador />://extensions
                </code>{' '}
                e clique no botão de recarregar do cartão do SIGAA utils.
              </p>
            </div>
          </div>

          <aside className="video" aria-label="Vídeo do passo a passo">
            <div className="video__frame">
              <VideoInstalacao />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
