# AGENTS.md

Landing page de divulgação da extensão SIGAAutils, no espírito de https://www.wawplus.com. Fica em `SIGAAutils site/`, dentro da raiz `..` — o projeto pai (`../AGENTS.md`) descreve a extensão e o modo como ela é distribuída. **Esta pasta é o repositório `zebedelu/SIGAAutils-site`** (público, branch `main`), separado de `../SIGAAutils extensão/`, de onde saem as datas do changelog. O desenho está em `docs/plans/2026-11-24-landing-page.md` (v1, com o registro de execução; v2 e v3 nas seções 12 e 13). A direção visual atual é a v3, descrita aqui.

## Stack

- Next.js 15.5 (App Router) + React 19, JavaScript puro (`.jsx`, sem TypeScript).
- `output: 'export'` + `trailingSlash: true`: o que se publica é `out/`, HTML/CSS/JS estático, e cada rota vira `<rota>/index.html` (funciona no `npm run preview` e no Cloudflare Pages).
- **Cinco componentes cliente:** `Benefits` (carrossel, `useState`/`useEffect`), `Notice` (botão de fechar), `EsquemaNavegador` (troca `chrome://extensions` pelo esquema do navegador: edge, brave, opera, vivaldi), `AOSInit` e `ScrollSuave`, montados no layout. O resto é servidor. Só existe tema claro; FAQ por `<details>`, navegação por âncora.
- Fontes em `app/fonts/*.woff2` via `next/font/local` (não em `public/`, que duplicaria o arquivo no build): `archivo-latin-var.woff2` e `jetbrains-mono-latin-var.woff2`.
- AOS 2.3.4 (fixado, de 2018, sem manutenção) para as animações de entrada; o hero usa keyframes CSS porque o `h1` é o candidato a LCP.
- Imagens são `<img>` puro com `width`/`height` explícitos, nunca `next/image`: com `output: 'export'` ele exigiria loader ou `unoptimized`. O `srcSet` do carrossel é montado à mão. Os vídeos do carrossel são `<video>` com `autoPlay muted loop playsInline` e sem `controls`.

## Comandos

- `npm run dev` — `http://localhost:3000`.
- `npm run build` — regenera `out/`.
- `npm run preview` — `python -m http.server -d out 8080`. **É assim que se verifica**: `file://` não serve, porque o Next emite caminhos absolutos (`/_next/...`).
- `node tools/check-contraste.mjs` — mede 12 pares de tokens do `:root` (só tema claro) e exige `outline: 2px solid var(--focus)` com `outline-offset` >= 2px dentro do bloco `:focus-visible`. Sai com código 1 se qualquer par ou a regra falhar.
- `python tools/otimizar-imagens.py` — converte as capturas em WebP **16:9** (1600×900 e 800×450) em `public/img/` e regenera `og.jpg` (1200×630). Lê as três antigas de `../SIGAAutils extensão/assets` (somente leitura) e as novas de `assets/capturas/` (`painel.png`, `horarios.png`, e `boletim.png` quando existir). Captura fora de 16:9 entra inteira sobre o tom médio das bordas.
- `python tools/otimizar-videos.py` — converte as quatro gravações da raiz do projeto pai em MP4 H.264 1280×720, CRF 34, **sem áudio**, em `public/video/` (931 KB no total, 35% dos originais). Precisa de `pip install av`.
- `python tools/gerar-marca.py` — lê `assets/logo-fonte.png`, remove o fundo preto, arredonda os cantos a 30% do lado e escreve `app/favicon.ico`, `public/logo-96.png`, `public/logo-512.png` e `public/apple-touch-icon.png` (este opaco, para o iOS).
- Não há ESLint, TypeScript, testes nem CI. `npm run build` é o único gate automático: ele pega referência quebrada e `useState` em componente servidor, e nada mais. A verificação de verdade é build + `preview` + contraste.
- Build e `next dev` não convivem: rodar `npm run build` (ou apagar `.next`) com o dev aberto deixa o dev com 500 em tudo, `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`. Feche o dev antes de compilar.
- Build a frio às vezes morre com `Invariant: no direct app page entry found for /favicon.ico` (já apareceu com `/_not-found`). É intermitente do Next 15.5 no Windows: apagar `.next` e rodar de novo resolve.

## Layout

```
app/
  layout.jsx          metadata, lang, AOS (CSS + init), ScrollSuave, noscript
  page.jsx            ordem: Hero, Notice, Benefits, Comments, Install, Faq
  globals.css         tokens, reset, tipografia, todos os componentes
  favicon.ico         gerado por tools/gerar-marca.py
  fonts/              archivo-latin-var.woff2, jetbrains-mono-latin-var.woff2
  components/         Header, Hero, Notice, Benefits, Comments, Install, Faq, Footer,
                      AOSInit, ScrollSuave, EsquemaNavegador
  changelog/          page.jsx + versoes.js (timeline das versões)
assets/               logo-fonte.png (arte da marca), capturas/ (fotos novas, opcionais)
public/
  logo-96.png, logo-512.png, apple-touch-icon.png
  img/                <slug>-<largura>.webp (1600×900 / 800×450) + og.jpg
  video/              <slug>.mp4 (1280×720, sem áudio)
tools/                check-contraste.mjs, otimizar-imagens.py, otimizar-videos.py, gerar-marca.py
docs/plans/           plano do desenho e registro das três versões
```

## Regras

- A copy vem do `README.md` da extensão e do `AGENTS.md` dela. Recurso que o README não afirma não entra na página. A extensão divulga a instalação manual ("Carregar sem compactação"), nunca a Chrome Web Store.
- Os três comentários de `Comments.jsx` são provisórios: cada item tem `nome` e `texto`, e hoje o `nome` é o rótulo genérico "Estudante do IFC". O autor vai trocar pelos reais; o `nome` sai em itálico no `figcaption`.
- Não alterar nada em `../SIGAAutils extensão/` — inclusive as capturas, que o script de imagens lê mas não escreve.
- **Paleta (v3):** verde do cabeçalho do IFC (`#17842a`) como `--brand-fill`, verde escuro documentado (`#096318`) como `--brand-strong` e anel de foco, `#0f6d22` como `--brand` de texto/link, `#f0f7e8` como `--tint` e `#f7fbf4` como `--bg-soft`. O vermelho do brasão (`#ca2027`) existe só dentro da logo. O areia do menu fica na faixa de aviso (`--accent`/`--accent-soft`). Tokens só em `app/globals.css`; `tools/check-contraste.mjs` lê o `:root`, então renomear token exige atualizar o script na mesma edição.
- **Tema único claro.** Não reintroduzir `prefers-color-scheme: dark` sem refazer os tokens e o script de contraste.
- Gradiente existe em dois lugares e só neles: o texto do `h1` (`--grad-from`/`--grad-to`, 135°) e o halo radial do hero. As molduras do carrossel usam gradiente por tom de item — é a exceção deliberada da v3.
- **Animações sempre ligadas:** AOS com `once: true`, `disable: false`, `duration` 600. O `data-aos` fica no `div.container` de cada seção, um por seção, e não em cada item: a seção entra inteira ou não entra, então nenhum texto fica preso esperando o scroll. Não existe bloco `prefers-reduced-motion`; o `<noscript>` do layout revela todo `[data-aos]` quando o JS não roda. O hero anima por CSS (`hero-in`), nunca por AOS.
- **Carrossel:** sete itens em `Benefits.jsx`: três capturas (`larguras`) e quatro vídeos (`video` + `poster` opcional). Cada item declara `duracao` em ms: 6 s nas capturas, o tempo real da gravação nos vídeos, para a aba não trocar antes do fim — o mesmo valor alimenta `--duracao` da barra. Pausa no hover, retomada 5 s depois de um clique manual. Os vídeos tocam sozinhos, mudos e em laço, sem `controls`; o mudo é aplicado também por `ref`, porque o React não serializa o atributo no SSR e o navegador bloquearia o autoplay. A barra de progresso anima `transform: scaleX`, não `width` — largura animada custava Layout no Lighthouse.
- **Contrato de imagem:** `public/img/<slug>-<largura>.webp`, duas larguras, sempre 16:9 (1600×900 e 800×450). Trocar uma foto é rodar o script; o layout não muda. Vídeo segue o mesmo desenho: `public/video/<slug>.mp4`, 1280×720, sem áudio, gerado por `tools/otimizar-videos.py`.
- **Changelog:** rota `/changelog` (não é seção da home). O texto vem de `app/changelog/versoes.js`, reconstruído do `git log --date=short` e do README. Datas são as dos commits de versão.
- **Rodapé:** três colunas (marca, Produto, Projeto) e barra final com crédito a "um estudante do IFC". Não citar o nome do autor.
- Fontes: `Archivo` para texto e `JetBrains Mono` para URL, número de passo, título de coluna do rodapé e data do changelog. Não introduzir terceira família.
- Alinhamento: títulos e introduções centralizados; cards, passos, timeline e FAQ alinhados à esquerda de propósito (texto corrido centralizado é ruim de ler).

## Números medidos

- First Load JS: 106 KB na home, 103 KB no changelog (relatório do build); AOS responde por ~5 KB gzip.
- Build (`npm run build`, Node 26, Windows): 21–26 s a frio e 12 s com `.next` quente. Compilar leva 8–12 s a frio e 1,5 s aquecido; a fase "Collecting build traces" levava 15–19 s por build e agora leva 2 s, por causa do `outputFileTracingExcludes` em `next.config.mjs`. Sem essa linha, o build fica em 29–41 s a frio.
- O grafo do build tem ~690 módulos, 460 deles do React 19 e do runtime do App Router; `app/` contribui com ~16. Em `next dev` sem `--turbopack` o terminal mostra isso como `Compiled / in 10.4s (685 modules)`; com Turbopack a mesma compilação leva 5 s e não imprime a contagem.
- Lighthouse no build exportado (mobile, 4× CPU): acessibilidade 100, boas práticas 100, SEO 100. Performance entre 76 e 85 em cinco execuções (mediana ~80), com TBT de 550–1000 ms; a hidratação dos componentes cliente e o AOS concentram as tarefas longas. LCP ≈ 1,5 s e CLS 0. O changelog, sem carrossel, fica em 98.
- Contraste: 12 pares, todos acima do alvo. O anel de foco mede 7,47:1 contra o fundo porque o `outline-offset` de 3px o afasta do botão cheio.
- Sem overflow horizontal em 320, 375, 414, 768, 1024, 1280 e 1440 px (o trilho de abas rola por conta própria no mobile).
- Imagens: 5 capturas em 10 WebP somando 400 KB; vídeos: 4 MP4 somando 931 KB; `og.jpg` 1200×630 com 91 KB. Logo: 6,5 KB (96 px), 79 KB (512 px), favicon 8,9 KB.

## Publicação (Cloudflare Pages)

No ar em **https://sigaautils.pages.dev**.

O projeto `sigaautils` do Cloudflare Pages está ligado ao repositório `zebedelu/SIGAAutils-site`: push na `main` gera deployment de produção, as demais branches geram preview. Build `npm run build`, diretório de saída `out`, Node 20 (o `.nvmrc` do repo fixa; `NODE_VERSION=20` está nas variáveis de ambiente como reforço). `metadataBase` em `app/layout.jsx` aponta para `https://sigaautils.pages.dev` — se o domínio mudar, corrigir ali, senão o `og:image` aponta para o lugar errado.

O projeto do Pages só aceita essa ligação na criação: um projeto de upload manual não vira projeto de Git depois (`You cannot update the source object in a Direct Uploads project`). Se precisar recriar, crie pelo painel ou por API com `source.type = github`.
