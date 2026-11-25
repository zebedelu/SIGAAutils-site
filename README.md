# SIGAAutils — site

Landing page da extensão [SIGAAutils](https://github.com/zebedelu/SIGAAutils). Fica em [sigaautils.pages.dev](https://sigaautils.pages.dev).

## O que é

Uma página estática que apresenta a extensão e ensina a instalar em cinco passos. A home tem sete destaques visuais, três comentários de quem usa, o passo a passo e sete perguntas frequentes. O histórico de versões fica em `/changelog`, numa rota separada.

Tudo o que a página afirma sobre a extensão vem do README dela. A instalação divulgada é a manual ("Carregar sem compactação" em `chrome://extensions`), não a Chrome Web Store.

Stack: Next.js 15.5 (App Router) e React 19, JavaScript puro (`.jsx`), exportação estática (`output: 'export'` com `trailingSlash: true`). Tema claro apenas. AOS 2.3.4 anima a entrada das seções; o hero anima por CSS.

## Rodando localmente

Node 20 (`.nvmrc`) e npm.

```bash
npm install
npm run dev      # http://localhost:3000
```

Para ver exatamente o que é publicado:

```bash
npm run build    # gera out/
npm run preview  # python -m http.server -d out 8080
```

Abrir `out/index.html` por `file://` não serve, porque o Next emite caminhos absolutos (`/_next/...`). Build e `next dev` não convivem: feche o dev antes de compilar, senão o dev passa a responder 500.

Ferramentas opcionais:

```bash
node tools/check-contraste.mjs      # 12 pares de tokens + regra de :focus-visible
python tools/otimizar-imagens.py    # capturas -> WebP 1600x900 / 800x450 + og.jpg (Pillow)
python tools/otimizar-videos.py     # gravações -> MP4 1280x720 sem áudio (pip install av)
python tools/gerar-marca.py         # logo-fonte.png -> favicon e logos
```

Os scripts de imagem e vídeo leem arquivos do projeto da extensão e da pasta acima deste repositório. Só leem, nunca escrevem lá.

Não há ESLint, TypeScript, testes nem CI. O build é o único gate automático; a verificação de verdade é build, `preview` e `check-contraste`.

## Estrutura

```
app/
  layout.jsx          metadata, fontes locais, AOS, scroll suave, noscript
  page.jsx            home: Header, Hero, Notice, Benefits, Comments, Install, Faq, Footer
  globals.css         tokens e todos os estilos
  fonts/              archivo-latin-var.woff2, jetbrains-mono-latin-var.woff2
  components/         Header, Hero, Notice, Benefits, Comments, Install, Faq,
                      Footer, AOSInit, ScrollSuave, EsquemaNavegador
  changelog/          page.jsx + versoes.js
assets/               logo-fonte.png, capturas/ (origem das capturas novas)
public/
  logo-96.png, logo-512.png, apple-touch-icon.png
  img/                <slug>-<largura>.webp (1600x900 / 800x450) + og.jpg
  video/              <slug>.mp4 (1280x720, sem áudio)
tools/                check-contraste.mjs e os scripts Python
docs/plans/           plano do desenho e registro das versões
```

Cinco componentes rodam no cliente: `Benefits` (carrossel), `Notice` (fechar aviso), `EsquemaNavegador` (adapta o texto ao navegador), `AOSInit` e `ScrollSuave`. O resto renderiza no servidor.

As imagens são `<img>` com `width` e `height` explícitos, nunca `next/image`, que exigiria loader no export. O contrato é `public/img/<slug>-<largura>.webp` em duas larguras, sempre 16:9: trocar uma foto é rodar o script, sem mexer no layout.

## Publicação

Cloudflare Pages, ligado a este repositório. Cada push na branch `main` gera um deployment de produção; as demais branches geram preview.

- Comando de build: `npm run build`
- Diretório de saída: `out`
- Node: 20, pela variável `NODE_VERSION`

O `metadataBase` em `app/layout.jsx` aponta para `https://sigaautils.pages.dev`. Se o domínio mudar, é esse valor que corrige o `og:image`.

## Créditos

- Extensão: [github.com/zebedelu/SIGAAutils](https://github.com/zebedelu/SIGAAutils)
- Issues: [github.com/zebedelu/SIGAAutils/issues](https://github.com/zebedelu/SIGAAutils/issues)

Feito por um estudante do IFC. Projeto independente, sem vínculo oficial com o Instituto Federal Catarinense.
