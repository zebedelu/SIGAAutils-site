const nextConfig = {
  output: 'export',
  trailingSlash: true,
  outputFileTracingRoot: import.meta.dirname,
  /* O export estático não tem servidor, então os .nft.json do build trace nunca são
     lidos. Sem esta linha, "Collecting build traces" custava ~17 s em cada build.
     Se o projeto virar deploy de servidor/standalone, remover esta linha. */
  outputFileTracingExcludes: { '*': ['**/*'] },
};

export default nextConfig;
