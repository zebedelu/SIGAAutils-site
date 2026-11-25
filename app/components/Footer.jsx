export default function Footer({ naHome = true }) {
  const base = naHome ? '' : '/';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <a className="brand" href={`${base}#top`}>
              <img className="brand__logo" src="/logo-96.png" width="28" height="28" alt="" />
              SIGAA utils
            </a>
            <p className="footer__desc">
              Siga o SIGAA com a sua cara.
            </p>
          </div>

          <nav aria-label="Produto">
            <p className="footer__title">Produto</p>
            <div className="footer__links">
              <a href={`${base}#beneficios`}>Benefícios</a>
              <a href={`${base}#instalar`}>Como instalar</a>
              <a href="/changelog">Changelog</a>
              <a href={`${base}#perguntas`}>Perguntas</a>
            </div>
          </nav>

          <nav aria-label="Projeto">
            <p className="footer__title">Projeto</p>
            <div className="footer__links">
              <a href="https://github.com/zebedelu/SIGAAutils" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                href="https://github.com/zebedelu/SIGAAutils/issues"
                target="_blank"
                rel="noreferrer"
              >
                Issues
              </a>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© 2026 SIGAA utils. Extensão gratuita, distribuída pelo GitHub.</p>
          <p>
            Feito por um estudante do IFC para os colegas. Projeto independente, sem vínculo
            oficial com o Instituto Federal Catarinense.
          </p>
        </div>
      </div>
    </footer>
  );
}
