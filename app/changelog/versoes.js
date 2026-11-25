/* Changelog reconstruído a partir do histórico do repositório da extensão
   (`git log --date=short`) e do README. Datas são as dos commits de versão. */
export const versoes = [
  {
    versao: '1.5.1',
    data: '2026-11-20',
    itens: [
      {
        tipo: 'novo',
        texto:
          'Certificados da Central de Eventos em ZIP, com uma pasta por evento e um botão que percorre todos os eventos inscritos.',
      },
      {
        tipo: 'novo',
        texto:
          'Notas alteradas: o botão da engrenagem guarda as notas e, nas próximas vezes, mostra o que mudou de uma varredura para outra.',
      },
      {
        tipo: 'novo',
        texto:
          'Painel lateral na página inicial, com os menus do SIGAA em pastas e largura ajustável de 200 a 340 px.',
      },
      {
        tipo: 'novo',
        texto:
          'Turma Virtual em dashboard: menu lateral de 300 px, grupos animados e a coluna da direita em uma gaveta.',
      },
      {
        tipo: 'novo',
        texto:
          'Compositor de imagem no Fórum do Curso, com prévia, só https e Enter sem enviar.',
      },
      {
        tipo: 'melhoria',
        texto: 'Home em largura total, sem o vão abaixo de Dados Institucionais.',
      },
      {
        tipo: 'melhoria',
        texto:
          'O alerta de sessão expirada não aparece mais; o redirecionamento para o login continua.',
      },
      {
        tipo: 'melhoria',
        texto:
          'Notas com cabeçalho de trimestres no Local e chevron que abre a tabela na própria home.',
      },
    ],
  },
  {
    versao: '1.4.0',
    data: '2026-11-20',
    itens: [
      {
        tipo: 'novo',
        texto:
          'Imagens nos posts do Fórum do Curso: quem tem a extensão vê a imagem, quem não tem vê o código.',
      },
      {
        tipo: 'novo',
        texto: 'Campo de link da imagem no novo tópico e nas respostas, com crédito ao SIGAA utils.',
      },
      {
        tipo: 'correcao',
        texto: 'Fallback para o código quando a imagem não abre.',
      },
      {
        tipo: 'correcao',
        texto: 'Respiro e guarda do layout da home para não quebrar com o SIGAA atualizado.',
      },
    ],
  },
  {
    versao: '1.3.1',
    data: '2026-10-01',
    itens: [
      { tipo: 'melhoria', texto: 'Horários acadêmicos atualizados.' },
      { tipo: 'correcao', texto: 'Correção das datas do progresso do ano letivo.' },
    ],
  },
  {
    versao: '1.3.0',
    data: '2026-09-23',
    itens: [
      {
        tipo: 'novo',
        texto:
          'Horário da turma direto na página inicial, com a opção “Nenhum” para ocultar e atalhos para os horários acadêmicos.',
      },
      {
        tipo: 'melhoria',
        texto:
          'Projeto reorganizado em core/, features/, content/ e tools/, com checks próprios para cada módulo.',
      },
    ],
  },
];
