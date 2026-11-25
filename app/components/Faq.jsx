import EsquemaNavegador from './EsquemaNavegador';

const perguntas = [
  {
    q: 'Funciona no SIGAA de outra instituição?',
    a: 'Não. A extensão age no SIGAA do IFC e na Central de Eventos do IFC.',
  },
  {
    q: 'Preciso criar alguma conta?',
    a: 'Não. Só a sua conta do SIGAA.',
  },
  {
    q: 'O Chrome avisou que a extensão não é verificada. É normal?',
    a: 'Sim. O aviso aparece em toda extensão carregada sem compactação, fora da loja.',
  },
  {
    q: 'O login automático guarda minha senha?',
    a: 'Guarda, sim: fica no armazenamento local do navegador, em texto puro. Use só no seu computador.',
  },
  {
    q: 'Como atualizo?',
    a: (
      <>
        A extensão avisa no canto da tela quando sai versão nova, mas não se atualiza
        sozinha: baixe o ZIP, substitua a pasta e clique no botão de recarregar do cartão em{' '}
        <code>
          <EsquemaNavegador />://extensions
        </code>
        .
      </>
    ),
  },
  {
    q: 'E se o SIGAA mudar e algum recurso parar?',
    a: 'Pode acontecer: os módulos saem em silêncio quando a página muda. Abra uma issue no GitHub.',
  },
  {
    q: 'É um projeto oficial do IFC?',
    a: 'Não. Foi feito por um estudante do IFC para os colegas.',
  },
];

export default function Faq() {
  return (
    <section className="section" id="perguntas">
      <div className="container" data-aos="fade-up">
        <h2>Perguntas</h2>

        <div className="faq">
          {perguntas.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
