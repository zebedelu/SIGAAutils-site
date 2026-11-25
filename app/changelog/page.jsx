import Header from '../components/Header';
import Footer from '../components/Footer';
import { versoes } from './versoes';

export const metadata = {
  title: 'Changelog — SIGAA utils',
  description:
    'Todas as versões do SIGAA utils: o que entrou, o que melhorou e o que foi corrigido em cada atualização da extensão.',
  alternates: { canonical: '/changelog' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/changelog',
    siteName: 'SIGAA utils',
    title: 'Changelog — SIGAA utils',
    description: 'Todas as versões do SIGAA utils, da mais nova para a mais antiga.',
    images: [{ url: '/img/og.jpg', width: 1200, height: 630 }],
  },
};

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const dataCurta = (iso) => {
  const [ano, mes, dia] = iso.split('-');
  return `${dia} ${meses[Number(mes) - 1]} ${ano}`;
};

export default function Changelog() {
  const anos = [...new Set(versoes.map((v) => v.data.slice(0, 4)))];

  return (
    <>
      <Header naHome={false} />

      <main className="changelog">
        <div className="container">
          <div className="changelog__head">
            <h1>Changelog</h1>
            <p className="changelog__sub">
              Tudo o que muda no SIGAA utils, da versão mais nova para a mais antiga.
            </p>
          </div>

          <div className="changelog__body">
            {anos.map((ano) => (
              <section key={ano} aria-labelledby={`ano-${ano}`}>
                <h2 className="changelog__year" id={`ano-${ano}`}>
                  <span>{ano}</span>
                </h2>

                {versoes
                  .filter((v) => v.data.startsWith(ano))
                  .map((v) => (
                    <article className="changelog__entry" key={v.versao}>
                      <div className="changelog__rail" aria-hidden="true">
                        <span className="changelog__dot" />
                      </div>
                      <div>
                        <div className="changelog__version">
                          <strong>v{v.versao}</strong>
                          <time dateTime={v.data}>{dataCurta(v.data)}</time>
                        </div>
                        <ul className="changelog__list">
                          {v.itens.map((item) => (
                            <li key={item.texto} data-tipo={item.tipo}>
                              {item.tipo === 'novo' && <span className="sr-only">Novidade: </span>}
                              {item.texto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
              </section>
            ))}

            <p className="changelog__back">
              <a href="/">Voltar para o site</a>
            </p>
          </div>
        </div>
      </main>

      <Footer naHome={false} />
    </>
  );
}
