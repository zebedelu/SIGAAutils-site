export default function Header({ naHome = true }) {
  const base = naHome ? '' : '/';

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href={`${base}#top`}>
          <img className="brand__logo" src="/logo-96.png" width="32" height="32" alt="" />
          SIGAA utils
        </a>

        <nav className="site-nav" aria-label="Seções">
          <a href={`${base}#beneficios`}>Benefícios</a>
          <a href={`${base}#comentarios`}>Comentários</a>
          <a href={`${base}#perguntas`}>Perguntas</a>
          <a href="/changelog">Changelog</a>
        </nav>

        <a className="site-header__cta" href={`${base}#instalar`}>
          Instalar
        </a>
      </div>
    </header>
  );
}
