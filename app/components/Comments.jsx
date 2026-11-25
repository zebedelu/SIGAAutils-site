/* Comentários provisórios: o autor vai substituir pelos reais.
   `nome` é por comentário e sai em itálico; hoje é o rótulo genérico. */
const comentarios = [
  {
    nome: 'Tiago Bernieri - 2G',
    texto:
      'A extensão é muito útil, porque facilita bastante a vida do aluno, descartando botões inuteis.',
  },
  {
    nome: 'Lucas Masquio - 2G',
    texto:
      'muito interessante o fato de salvar as credenciais para abrir automaticamente e as notas ficarem por cor, facilitando a visibilidade e economizando tempo.',
  },
  {
    nome: 'Gabriel Bessegato - 2G',
    texto: 'Muito útil, me ajudou a vizualizar melhor as notas, e é interessante a opção de baixar os certificados.',
  },
];

export default function Comments() {
  return (
    <section className="section" id="comentarios">
      <div className="container" data-aos="fade-up">
        <h2>Quem usa, conta</h2>
        <p className="section__intro">
          Três recados de quem já instalou.
        </p>

        <div className="comments">
          {comentarios.map(({ nome, texto }) => (
            <figure className="comment" key={texto}>
              <span className="comment__mark" aria-hidden="true">
                “
              </span>
              <blockquote>
                <p>{texto}</p>
              </blockquote>
              <figcaption className="comment__meta">
                <em>{nome}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
