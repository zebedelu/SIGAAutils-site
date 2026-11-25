# Landing page do SIGAA utils

**Data:** 2026-11-24
**Pasta:** `SIGAAutils site/`
**Estado:** plano pronto para execução. Nada foi criado ainda.
**Fora deste trabalho:** commit, push, deploy, qualquer alteração em `SIGAAutils extensão/`.

A página vende uma coisa só: instalar a extensão no SIGAA do IFC em menos de dois minutos.
Ela não é documentação, não é changelog e não repete o README inteiro.

---

## 1. Decisões fechadas

| # | Decisão | Resposta |
|---|---|---|
| Q1 | Público | Aluno do IFC. A página assume que o SIGAA em questão é o do IFC, na primeira dobra. |
| Q2 | Tom | Estudante falando com colega: frase curta, zero superlativo. |
| Q3 | Seções | (a) hero → recursos → demonstração → tutorial → perguntas → rodapé. |
| Q4 | Stack | React + JavaScript + Next.js, compilado para HTML estático (`output: 'export'`). |
| Q5 | Hospedagem | Cloudflare Pages, publicação do diretório `out/`. |
| Q6 | Tema | Segue `prefers-color-scheme`. **Sem botão de troca.** |
| Q7 | Promessas | Declarar no FAQ: senha em texto puro no `localStorage` e troca de versão manual. |
| Q8 | Capturas | Usar as três atuais; contrato de imagem fixo para troca posterior sem mexer em layout. |
| Q9 | Nome | "SIGAA utils" (grafia do `manifest.json`). |
| — | Hero | Título e dois botões já decididos. |
| — | Idioma | pt-BR. |
| — | Copy | Só o que o `README.md` da extensão afirma. Nada de recurso inventado. |

**Uma seção foi acrescentada pelo plano, não pelo usuário:** a faixa de aviso entre o hero e os
recursos. Ela existe porque a instalação manual dispara o alerta de "extensão não verificada" do
Chrome — e quem descobre isso sozinho, depois de clicar em "Começar gratuitamente", desiste achando
que baixou algo errado. O texto está em §6 e é factual (o aviso acontece em toda extensão carregada
sem compactação). Se não quiser a faixa, apague `Notice.jsx` e a seção; o resto do plano não depende dela.

### 1.1 Pendência aberta

**Q9 conflita com o título do hero.** O nome aprovado é "SIGAA utils"; o título combinado antes era
"SIGAAutils, siga o SIGAA com a sua cara". O plano adota **"SIGAA utils, siga o SIGAA com a sua cara"**,
para o nome aparecer igual no header, no `title` e no rodapé.
Se a intenção era manter "SIGAAutils" no hero e "SIGAA utils" no resto, é uma troca de string em
`Hero.jsx` — mas a página passa a ter duas grafias na mesma dobra.

---

## 2. Fatos verificados (evidência, não suposição)

| Fato | Onde foi verificado |
|---|---|
| A extensão só age em `https://sig.ifc.edu.br/*` e `https://centraldeeventos.ifc.edu.br/participante/*` | `SIGAAutils extensão/AGENTS.md`, `manifest.json` |
| Instalação manual, "Carregar sem compactação", exatamente 5 passos | `README.md:26-34` |
| Funciona em Chrome, Edge, Brave e outros Chromium | `README.md:28` |
| O painel divide tudo em **Personalização** (4 itens) e **Ferramentas** (3 itens) | `README.md:108` |
| Existe aviso de versão nova no canto da tela, mas a atualização é manual | `README.md:60` (aviso) + `README.md:36` (dica de recarregar o cartão) |
| Login automático guarda a senha em texto puro no `localStorage` | `SIGAAutils extensão/AGENTS.md` (`core/login-auto.js`) |
| Módulos saem em silêncio quando o DOM do SIGAA muda | `AGENTS.md:38`, `AGENTS.md:66` |
| Não há `LICENSE` no repositório | raiz de `SIGAAutils extensão/` (só `.gitignore`, `.ignore`, `AGENTS.md`, `manifest.json`, `README.md`, `versao.txt`) |
| Cor do ícone da extensão | `icons/notas-128.png`, pixel `#1F4E79` |
| Cores do preset Fogo Roxo | `core/fire.js:59` e `:245` — `#0a0114`, `#9a4dff`, `#d2a8ff` |
| Capturas e dimensões | `assets/tela_inicial.png` 1900×865 · `calendario.png` 1897×872 · `mostrar_notas.png` 1479×342 (1.010KB no total) |
| Nome e versão | `manifest.json:3-4` — `"SIGAA utils"`, `1.5.1` |
| Autor | `README.md:126` — Pedro Vinicius Mazo, Turma 2G |
| Link do repositório e das issues | `README.md:30`, `:118`, `:122` |

**Consequência de não haver licença:** a página não pode dizer "open source sob licença X". Diz
"o código está no GitHub". Se o repositório ganhar um `LICENSE`, a frase muda.

---

## 3. Sistema de design

### 3.1 Conceito

**"SIGAA depois do expediente."** A página não é um site sobre software: é o SIGAA com a extensão
ligada. O fundo é o azul do ícone real da extensão escurecido. O acento é o roxo do Fogo Roxo, que
existe em `core/fire.js`. O dispositivo central do hero é a única prova honesta de como isso se
instala: um cartão fiel ao `chrome://extensions`.

Duas recusas conscientes:

- **Sem gradiente em lugar nenhum.** Nenhum `linear-gradient` na página. Se aparecer um roxo-azul de
  fundo, o conceito morreu.
- **Sem animação de entrada por seção.** Nada de `fade-up` ao rolar. A única animação permitida é a
  que responde a uma ação: abrir uma pergunta, hover de botão, foco de teclado.

### 3.2 Tokens

Fundo escuro é o padrão (produto de modo escuro, e é o que a maioria vê). O tema claro entra por
`@media (prefers-color-scheme: light)`.

| Token | Escuro (padrão) | Claro | Papel | Contraste medido |
|---|---|---|---|---|
| `--ink` | `#0D1520` | `#F5F8FB` | fundo da página | — |
| `--surface` | `#131E2B` | `#FFFFFF` | cartões, blocos | — |
| `--paper` | `#E6EDF3` | `#0D1520` | texto principal | 15,5:1 / 17,2:1 |
| `--muted` | `#93A4B5` | `#4A5B6C` | texto secundário | 7,2:1 / 6,6:1 |
| `--line` | `#243447` | `#D5DEE7` | fio decorativo | — (não carrega informação) |
| `--line-strong` | `#5B7594` | `#6B7C8F` | borda de controle | 3,9:1 / 4,0:1 |
| `--fire` | `#7C3AED` | `#6D28D9` | preenchimento do botão primário | branco sobre ele: 5,7:1 / 7,1:1 |
| `--on-fire` | `#FFFFFF` | `#FFFFFF` | texto do botão | — |
| `--ember` | `#D2A8FF` | `#5B21B6` | link e destaque em texto | 9,4:1 / 8,4:1 |
| `--focus` | `#D2A8FF` | `#6D28D9` | anel de foco | 9,4:1 / 6,7:1 |
| `color-scheme` | `dark` | `light` | barras de rolagem e controles nativos | — |

`--muted` sobre `--surface` dá 6,6:1 no escuro e 7,0:1 no claro. Todos os catorze pares foram
calculados por script antes de o plano fechar — nenhum número aqui é estimativa.

**Duas regras que os números impõem:**

1. O anel de foco usa `outline: 2px solid var(--focus); outline-offset: 2px`. Sem o `offset`, ele
   cai sobre `--fire` e mede 2,9:1 — reprova nos 3:1 de 1.4.11. Com o deslocamento, o anel assenta
   no fundo da página, onde tem 9,4:1.
2. `color-scheme` no `:root` não é opcional: sem ele, a barra de rolagem e o marcador do `<details>`
   continuam claros no meio de uma página escura.

Desvio registrado: o rascunho do designer usava `#A855F7` como preenchimento do botão. Calculado,
branco sobre `#A855F7` dá **3,96:1** e reprova em AA para texto normal. O botão passou a `#7C3AED`.
`#A855F7` continua na página só como traço decorativo: 4,63:1 contra `--ink`, acima dos 3:1 exigidos
para elemento não textual.

### 3.3 Tipografia

| Papel | Família | Uso |
|---|---|---|
| Título, corpo, botão | **Archivo** (variável, `wght` 400–700, subset latin) | tudo que é texto corrido |
| Dado técnico | **JetBrains Mono** (400/500, subset latin) | `chrome://extensions`, `manifest.json`, número do passo, URL |

Duas famílias, papéis que não se cruzam. Nada de terceira fonte, nada de serifada.

Escala (mobile → desktop):

| Nível | 375px | ≥1024px | Peso / detalhe |
|---|---|---|---|
| H1 | 34px / 1,08 | 56px / 1,05 | 600, `letter-spacing: -0.02em`, `max-width: 640px` |
| H2 | 24px / 1,2 | 34px / 1,15 | 600 |
| H3 (recurso) | 17px | 18px | 600 |
| corpo | 16px / 1,55 | 17px / 1,6 | 400 |
| legenda / mono | 13px | 13px | mono, `letter-spacing: 0.02em`, `--muted` |

Medida de linha para **parágrafo corrido**: `max-width: 62ch`. Título não usa `ch` — a unidade cresce
com o `font-size` e vira uma medida sem sentido; o H1 usa 640px fixos no desktop e 100% no mobile.

### 3.4 Layout e ritmo

- Container `1120px`, gutter 20px no mobile e 32px a partir de 768px.
- Ritmo em múltiplos de 8. Padding de seção: 56px no mobile, 96px no desktop.
- Separação entre seções por fio de 1px `--line`, não por sombra.
- Raio: 10px em cartão, 8px em botão, 2px em fio. Nada de `border-radius` único em tudo.
- Hero em duas colunas 55/45 a partir de 1024px; empilhado abaixo disso, com o mock depois dos botões.
- Alinhamento à esquerda em toda a página, inclusive no hero.
- Breakpoint do header: **abaixo de 768px** ficam só a marca e o link do GitHub; **de 768px para cima**
  entram as três âncoras. É a única faixa indefinida até agora, e fica fechada aqui.

### 3.5 Movimento

| Onde | O quê | Duração |
|---|---|---|
| Botão | cor de fundo e anel de foco | 150ms `ease-out` |
| Pergunta do FAQ | abertura nativa do `<details>` | sem JS |
| Nada mais | — | — |

`@media (prefers-reduced-motion: reduce)` zera transições e `scroll-behavior`.

### 3.6 Rastreabilidade

| Escolha | Origem |
|---|---|
| Fundo `#0D1520` | `#1F4E79` do `icons/notas-128.png`, escurecido — a única cor da marca que existe em arquivo |
| Acento roxo | `core/fire.js` (`#9a4dff`, `#d2a8ff`) — é o produto, não uma paleta de SaaS |
| Botão `#7C3AED` | contraste calculado; o candidato anterior reprovava |
| Archivo + JetBrains Mono | consulta `--domain google-fonts` (Archivo `wdth 62..125 / wght 100..900`, JetBrains Mono rank 18); as três duplas editoriais devolvidas por `--domain typography` foram descartadas por serem o clichê cream + serifada |
| Hero em duas colunas com cartão `chrome://extensions` | dispositivo do WA Web Plus (mock de interface em DOM dentro do hero) + crítica do designer ("a única prova honesta de instalação") |
| Faixa de aviso logo abaixo do hero | dois callouts "NOTE" do Violentmonkey, que qualificam a promessa no ponto em que ela é feita |
| Recursos em duas colunas com fios, sem grade de cards | estrutura do Bruno (um bloco com linhas separadas por `border-b`) e a divisão real do painel da extensão |
| Capturas em moldura de 1px, sem inclinação | tratamento de print do Bruno (`inset ring` 1px + raio) e do Zen (mídia sem moldura de navegador) |
| Passos numerados | Starship: numeração só porque é sequência real |
| Container 1120px e 96px entre blocos | medida do Anki (986px, 48px) ajustada como no Bruno |
| Zero animação de entrada | `frontend-design`: fade-and-slide por seção é o default genérico |
| Sem botão de tema | resposta Q6: só `prefers-color-scheme` |

### 3.7 Descartado

- **Cream + terracota**, **near-black + verde ácido**, **navy + dourado** (paleta que a consulta
  `--design-system` devolveu): os três são tells de página gerada.
- **Grade de 3 cards com ícone de linha** e **faixa de logos falsos**: não há usuários nem parceiros
  verificáveis para exibir.
- **Página inteira imitando o `chrome://extensions`** (direção C do rascunho): vira pastiche e o
  visitante sai sem saber o que a extensão faz.
- **Comparativo antes/depois**: não existe captura do SIGAA sem a extensão; produzir uma seria montar
  a "prova" no Photoshop.

---

## 4. Wireframe

### Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ SIGAA utils              Recursos   Instalar   Perguntas          GitHub   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SIGAA utils,                            ┌──────────────────────────────┐   │
│  siga o SIGAA                            │ chrome://extensions          │   │
│  com a sua cara.                         │ ┌──────────┐ Modo desenv. ●  │   │
│                                          │ │ ▤▤▤      │                 │   │
│  Modo escuro, papel de parede,           │ └──────────┘ [Carregar sem    │   │
│  calendário e login automático.          │               compactação]   │   │
│                                          │ ┌──────────────────────────┐ │   │
│  [ Começar gratuitamente ] [ Como … ]    │ │ S  SIGAA utils  Ativado  │ │   │
│  Chrome · Edge · Brave · 2 minutos       │ └──────────────────────────┘ │   │
│                                          └──────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────────────┤
│ ▎Não está na Chrome Web Store. O navegador avisa que ela não é verificada.  │
├────────────────────────────────────────────────────────────────────────────┤
│ O que muda no SIGAA                                                        │
│  Personalização                    │  Ferramentas                           │
│  Modo escuro e claro  ─────────────│  Login automático  ────────────────── │
│  Papel de parede e Fogo Roxo ──────│  Certificados em ZIP  ─────────────── │
│  Boletim colorido  ────────────────│  Notas alteradas  ─────────────────── │
│  Painel lateral  ──────────────────│  A lista completa está no README →     │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  tela-inicial            (largura total, moldura 1px, raio 10px)     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────┐  ┌───────────────────────────────────────┐  │
│  │  calendario               │  │  mostrar-notas                        │  │
│  └───────────────────────────┘  └───────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────┤
│ Instalar em menos de 2 minutos                                             │
│  01 Baixar o ZIP        02 chrome://extensions   03 Modo desenvolvedor     │
│  04 Carregar sem compactação                     05 Abrir o SIGAA          │
├────────────────────────────────────────────────────────────────────────────┤
│ Perguntas                                                                  │
│  ▸ Funciona em outra instituição?                                          │
│  ▸ O aviso de "não verificada" é normal?                                   │
│  ▸ O login automático guarda minha senha?                                  │
├────────────────────────────────────────────────────────────────────────────┤
│ SIGAA utils · GitHub · Issues · Feito por Pedro Vinicius Mazo, Turma 2G    │
│ Projeto de estudante, sem vínculo oficial com o IFC.                       │
└────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)

```
┌───────────────────────────┐
│ SIGAA utils        GitHub │
├───────────────────────────┤
│ SIGAA utils,              │
│ siga o SIGAA              │
│ com a sua cara.           │
│                           │
│ sub, 2–3 linhas           │
│                           │
│ [ Começar gratuitamente ] │
│ [ Como instalar ]         │
│ Chrome · Edge · Brave     │
│ ┌───────────────────────┐ │
│ │ chrome://extensions   │ │
│ │ [Carregar sem compact.]│ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ ▎aviso da loja            │
├───────────────────────────┤
│ Personalização            │
│  linha ───────────────    │
│  linha ───────────────    │
│ Ferramentas               │
│  linha ───────────────    │
├───────────────────────────┤
│ [ captura 1 ]             │
│ [ captura 2 ]             │
│ [ captura 3 ]             │
├───────────────────────────┤
│ 01 … 05 (empilhados)      │
├───────────────────────────┤
│ ▸ pergunta                │
│ ▸ pergunta                │
├───────────────────────────┤
│ rodapé                    │
└───────────────────────────┘
```

---

## 5. Arquitetura de arquivos

```
SIGAAutils site/
├─ app/
│  ├─ layout.jsx          metadata, lang="pt-BR", next/font/local
│  ├─ page.jsx            monta as seções na ordem
│  ├─ globals.css         tokens, reset, layout, tipografia, movimento
│  └─ components/
│     ├─ Header.jsx
│     ├─ Hero.jsx
│     ├─ ExtensionCard.jsx   mock do chrome://extensions (DOM puro)
│     ├─ Notice.jsx
│     ├─ Features.jsx
│     ├─ Demo.jsx
│     ├─ Install.jsx
│     ├─ Faq.jsx
│     └─ Footer.jsx
├─ public/
│  ├─ img/tela-inicial-1600.webp · tela-inicial-800.webp
│  ├─ img/calendario-1600.webp  · calendario-800.webp
│  ├─ img/mostrar-notas-1400.webp · mostrar-notas-700.webp
│  ├─ img/og.png            1900×865, para compartilhamento
│  ├─ fonts/archivo-latin-var.woff2 · jetbrains-mono-latin-var.woff2
│  └─ favicon.svg           "S" branco sobre #1F4E79
├─ tools/
│  ├─ otimizar-imagens.py   PNG da extensão → dois WebP por captura
│  └─ check-contraste.mjs   lê os tokens de globals.css e mede os pares
├─ docs/plans/2026-11-24-landing-page.md
├─ next.config.mjs
├─ package.json
├─ .nvmrc                  20
└─ AGENTS.md               atualizar no mesmo trabalho (regra do próprio arquivo)
```

`.gitignore` fica de fora: a pasta ainda não é repositório. Ele entra quando o repo existir.

**Sobre "zero JavaScript":** a página não tem componente cliente — tema é CSS, FAQ é `<details>`,
navegação é âncora. Mas o App Router emite o runtime do Next e o payload RSC mesmo assim; o build
**vai** carregar JS, algo na casa das dezenas de KB comprimidos. O que o plano garante, e o que se
mede em T11, é outra coisa: **o conteúdo é HTML servido no primeiro byte e a página continua legível
com JavaScript desabilitado**. Se o peso do runtime incomodar mais tarde, o mesmo layout roda em HTML
puro — a stack foi escolha do usuário, não imposição do desenho.

`next.config.mjs`:

```js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
}
export default nextConfig
```

`package.json`:

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "python -m http.server -d out 8080"
  }
}
```

Cloudflare Pages: comando `npm run build`, diretório de saída `out`, Node 20 pelo `.nvmrc`.

---

## 6. Conteúdo (copy final, com origem)

Cada string existe porque o README ou o `AGENTS.md` afirma. Onde há reescrita, ela encurta a mesma
informação — nada de recurso novo.

### Header
- Marca: `SIGAA utils` (manifest)
- Links: `Recursos` · `Instalar` · `Perguntas` · `GitHub` (externo)

### Hero
- **H1:** `SIGAA utils, siga o SIGAA com a sua cara.`
- **Sub:** `Modo escuro, papel de parede, calendário de avaliações e login automático no SIGAA do IFC — tudo com alguns cliques, sem complicação.` (README:42)
- **Botão 1:** `Começar gratuitamente` → `https://github.com/zebedelu/SIGAAutils`
- **Botão 2:** `Como instalar` → `#instalar`
- **Linha de apoio:** `Chrome · Edge · Brave · instalação manual · menos de 2 minutos` (README:28)

**Mock do `chrome://extensions`** — texto interno:
`chrome://extensions` · `Modo desenvolvedor` (interruptor ligado) · botão `Carregar sem compactação` ·
cartão `SIGAA utils` com `Ativado`.
`aria-label` do bloco: `Ilustração: o cartão da extensão na página chrome://extensions, com o modo desenvolvedor ligado e o botão Carregar sem compactação.`

### Aviso
`A extensão não está na Chrome Web Store. Como ela é carregada sem compactação, o navegador avisa que não é verificada — é o comportamento esperado.`

### Recursos — "O que muda no SIGAA"
A seção reproduz a divisão real do painel, que o README descreve em §Como usar: Personalização com
quatro itens, Ferramentas com três.

Intro: `Sete recursos ficam na engrenagem, no canto superior esquerdo. O resto aparece sozinho na página.`

**Personalização**
| Recurso | Linha |
|---|---|
| Modo escuro e claro | `A página inteira troca de visual com um clique.` |
| Papel de parede e Fogo Roxo | `Qualquer imagem de fundo, ou o fogo roxo animado que já vem no pacote.` |
| Boletim colorido | `Notas, faltas e situação em destaque; a opção "Exibir melhor boletim" liga e desliga.` |
| Painel lateral | `Os botões e o menu do portal numa barra fixa à esquerda, com largura ajustável.` |

**Ferramentas**
| Recurso | Linha |
|---|---|
| Login automático | `Preenche usuário e senha e entra sozinho.` |
| Certificados em ZIP | `Todos os certificados dos eventos inscritos num download só.` |
| Notas alteradas | `Guarda as notas de todas as matérias e mostra o que mudou desde a última verificação.` |

Rodapé da seção: `Calendário de avaliações, horários da turma e notas na página inicial aparecem
sozinhos — estão logo abaixo.` depois `A lista completa está no README.` → GitHub `#funcionalidades`.

Calendário e notas na home não entram como linha aqui: não têm interruptor próprio e já ganham
captura na seção seguinte.

### Demonstração
Legendas do README §Demonstração, mais o `alt` de cada captura:

| Arquivo | Legenda | `alt` |
|---|---|---|
| `tela-inicial` | `Página inicial completa — modo escuro, papel de parede, horários da turma e progresso do ano letivo.` | `Captura da página inicial do SIGAA com a extensão ligada: tema escuro, papel de parede ao fundo, horários da turma, barra do ano letivo e o botão de notas em cada matéria.` |
| `calendario` | `Calendário de avaliações — as próximas avaliações viram um calendário visual.` | `Captura do calendário de avaliações: as próximas avaliações do SIGAA dispostas num calendário visual de 30 dias.` |
| `mostrar-notas` | `Notas na página inicial — as notas de cada matéria aparecem direto na home.` | `Captura das notas na página inicial: com o chevron de uma matéria aberto, aparecem o andamento das aulas, o banner de aprovação e a tabela de notas por trimestre.` |

### Instalar — "Instalar em menos de 2 minutos"
1. `Baixe o projeto` — `Code → Download ZIP no GitHub e extraia o arquivo.`
2. `Abra o gerenciador de extensões` — `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`)
3. `Ative o Modo desenvolvedor` — `o interruptor no canto superior direito.`
4. `Carregue a extensão` — `Carregar sem compactação, e escolha a pasta que contém o manifest.json.`
5. `Abra o SIGAA` — `entre em sig.ifc.edu.br.` O botão `⚙` aparece no canto superior esquerdo.

Nota final: `Saiu versão nova? O aviso aparece no canto da tela. Volte em chrome://extensions e clique no 🔄 do cartão do SIGAA utils.`

### Perguntas
1. `Funciona no SIGAA de outra instituição?` → `Não. A extensão age no SIGAA do IFC e na Central de Eventos do IFC.`
2. `Preciso criar alguma conta?` → `Não. Só a sua conta do SIGAA.`
3. `O Chrome avisou que a extensão não é verificada. É normal?` → `Sim. O aviso aparece em toda extensão carregada sem compactação, fora da loja.`
4. `O login automático guarda minha senha?` → `Guarda, no armazenamento local do navegador e em texto puro. É uma decisão consciente do projeto — use só no seu computador.`
5. `Como atualizo?` → `A extensão avisa no canto da tela quando sai versão nova, mas não se atualiza sozinha: baixe o ZIP, substitua a pasta e clique no 🔄 do cartão em chrome://extensions.`
6. `E se o SIGAA mudar e algum recurso parar?` → `Pode acontecer: os módulos saem em silêncio quando a página muda. Abra uma issue no GitHub.`
7. `É um projeto oficial do IFC?` → `Não. Foi feito por um estudante do IFC para os colegas.`

### Metadados
- `title`: `SIGAA utils — o SIGAA com a sua cara` (39 caracteres)
- `description`: `Modo escuro, papel de parede, calendário de avaliações e login automático no SIGAA do IFC. Extensão gratuita, instalação manual em menos de 2 minutos.`
- `og:title`, `og:description`: iguais aos dois acima.
- `og:image`: `/img/og.png` (1900×865).
- `metadataBase`: `https://sigaa-utils.pages.dev` — **provisório**; trocar pelo domínio real no deploy.
- `theme-color`: `#0D1520` no escuro, `#F5F8FB` no claro.

### Rodapé
`SIGAA utils` · `GitHub` · `Issues` · `Feito por Pedro Vinicius Mazo, Turma 2G` · `Projeto de estudante, sem vínculo oficial com o IFC.`

---

## 7. Tarefas

Cada tarefa termina com verificação executável. "Aceite" é o critério objetivo; se não bater, a tarefa
não está pronta. Tudo que mexe em HTML final é verificado no build exportado servido por HTTP —
`file://` não serve, porque o Next emite caminhos absolutos (`/_next/...`).

### T1 — Esqueleto Next.js com export estático
**Arquivos:** `package.json`, `next.config.mjs`, `.nvmrc`, `app/layout.jsx`, `app/page.jsx` (vazio).
**Passos:** projeto montado à mão (sem `create-next-app`, para não herdar boilerplate); `layout.jsx`
com `<html lang="pt-BR">` e metadata provisória.
**Verificação:**
- `npm run dev` → `curl -s http://localhost:3000 | Select-String 'lang="pt-BR"'` retorna a linha.
- `npm run build` gera `out/index.html`; `npm run preview` serve em `http://localhost:8080` e a página
  aparece **com estilo**.
- `Get-ChildItem out -Recurse -Filter *.js | Measure-Object Length -Sum` → registrar o total em KB no
  `AGENTS.md` (é o runtime do Next; número real, não promessa).
**Aceite:** os comandos passam e a página carrega em `http://localhost:8080`, não em `file://`.

### T2 — Tokens, temas e script de contraste
**Arquivos:** `app/globals.css`, `tools/check-contraste.mjs`.
**Passos:** reset curto, variáveis de §3.2 (incluindo `color-scheme`), `@media (prefers-color-scheme: light)`
com os tokens claros, `outline` com `offset` no `:focus-visible`.
**Verificação:**
- `node tools/check-contraste.mjs` imprime os 14 pares de §3.2 com alvo e valor, e sai com código 0.
  Forçar `--muted: #6b7280` → sai com código 1.
- O script também mede `--focus` sobre `--fire` e **reprova de propósito**, exigindo que exista
  `outline-offset` ≥ 2px no CSS (o teste é sobre a regra, não sobre o par).
- DevTools → Rendering → emular `prefers-color-scheme: light` e `dark`: o fundo passa de `#F5F8FB`
  para `#0D1520` sem recarregar.
- `getComputedStyle(document.documentElement).colorScheme` contém `dark` e `light`.
- `Select-String -Path app/globals.css -Pattern 'gradient'` não retorna nada.
**Aceite:** nenhum token divergente da tabela e nenhum gradiente no CSS.

### T3 — Fontes locais e escala
**Arquivos:** `public/fonts/*.woff2`, `app/layout.jsx` (`next/font/local`).
**Verificação:**
- Network com *Disable cache*: duas requisições de fonte, 200; `Select-String -Path out/index.html -Pattern 'googleapis'` vazio.
- Computed do `h1`: `font-size` 34px em 375px e 56px em 1440px.
- Bloquear as fontes no DevTools e recarregar: o texto continua legível no fallback, com deslocamento
  de no máximo uma linha.
**Aceite:** fontes somam < 120KB.

### T4 — Header, hero e mock
**Arquivos:** `Header.jsx`, `Hero.jsx`, `ExtensionCard.jsx`.
**Verificação:**
- 320/375/414/768/1024/1440px: `document.documentElement.scrollWidth === window.innerWidth` em todas.
- 375px: o mock aparece **depois** dos dois botões.
- 1440px: `getComputedStyle(hero).gridTemplateColumns` devolve dois valores; o `h1` mede no máximo 640px.
- 768px: as três âncoras do header aparecem e cabem numa linha (`scrollWidth` do `nav` ≤ sua largura).
- Ordem de `Tab` em 1440px: `Recursos → Instalar → Perguntas → GitHub → Começar gratuitamente → Como instalar`.
  Em 375px: `GitHub → Começar gratuitamente → Como instalar`. O mock não recebe foco.
**Aceite:** sem overflow horizontal nas seis larguras e ordem de foco igual nas três variantes de header.

### T5 — Aviso
**Arquivos:** `Notice.jsx`.
**Verificação:** em 375px, `document.querySelector('.notice p').getClientRects().length ≤ 4`; a cor do
texto é `--paper`, não `--muted`.
**Aceite:** o par está coberto pelo script de T2 (texto sobre `--ink` ≥ 4,5:1).

### T6 — Recursos
**Arquivos:** `Features.jsx`.
**Verificação:**
- 1024px: cada linha da coluna esquerda alinha com a linha correspondente da direita
  (`getBoundingClientRect().top` com diferença ≤ 1px).
- 375px: uma coluna, os dois `<h3>` visíveis, nenhuma célula estourando o container.
- Conferência manual: as 7 linhas de §6 aparecem na página, sem adjetivo e sem afirmação fora do README.
**Aceite:** 7 recursos, agrupados igual ao painel da extensão.

### T7 — Demonstração e imagens
**Arquivos:** `Demo.jsx`, `public/img/*.webp`, `tools/otimizar-imagens.py`.
**Passos:** o script lê de `../SIGAAutils extensão/assets` (somente leitura) e escreve dois WebP por
captura (1600 e 800; a `mostrar-notas`, 1400 e 700), q=82. `<img>` com `srcset`, `sizes="(max-width: 767px) 100vw, 1120px"`,
`width`/`height`, `loading="lazy"` (exceto a primeira), `decoding="async"` e o `alt` de §6.
**Verificação:**
- `python tools/otimizar-imagens.py` → 6 arquivos; soma < 450KB (os PNG hoje somam 1.010KB).
- Nenhum arquivo novo aparece em `SIGAAutils extensão/assets` (comparar a listagem antes e depois).
- Em 375px o navegador baixa a versão de 800px (Network mostra o arquivo, não o de 1600).
- CLS 0 no Lighthouse; nenhuma imagem gera barra horizontal em 375px.
**Aceite:** 3 legendas e 3 `alt` idênticos a §6; contrato de troca em comentário no componente
(`public/img/<slug>-<largura>.webp`, proporção registrada).

### T8 — Tutorial de 5 passos
**Arquivos:** `Install.jsx`.
**Verificação:**
- Os 5 passos conferem com §6; `<ol>` com 5 `<li>`.
- 375px: `chrome://extensions` não quebra no meio e o `<li>` não estoura a largura.
- "Como instalar" rola até `#instalar` e o heading não fica sob o header sticky (`scroll-margin-top: 72px`).
**Aceite:** dá para instalar sem abrir outra aba além do GitHub.

### T9 — Perguntas
**Arquivos:** `Faq.jsx`.
**Verificação:**
- `<details>` × 7; `Tab` alcança cada `summary`; `Enter` e `Space` abrem e fecham; anel de foco visível.
- 375px: com a resposta 4 aberta (a mais longa), nada é cortado e `scrollWidth` continua igual à janela.
- Narrador do Windows lê a pergunta ao focar o `summary`.
**Aceite:** nenhuma resposta fora de §6.

### T10 — Rodapé e metadados
**Arquivos:** `Footer.jsx`, `app/layout.jsx`, `public/img/og.png`, `public/favicon.svg`.
**Verificação:**
- `curl -s http://localhost:8080 | Select-String 'og:image|og:title|og:description|lang="pt-BR"'` retorna as quatro.
- O `og:image` sai como URL absoluta (`metadataBase` aplicado), não relativa.
- `<title>` com menos de 60 caracteres; favicon visível na aba.
**Aceite:** links externos com `target="_blank"` e `rel="noreferrer"`.

### T11 — Acessibilidade e performance no build
**Verificação (`npm run preview`):**
- Lighthouse: Accessibility ≥ 95, Performance ≥ 95, Best Practices sem erro.
- Contagem real de focáveis com `document.querySelectorAll('a[href],button,summary,details,input').length`
  — registrar o número no `AGENTS.md`. Critério: **todos** com anel visível e ordem igual à de leitura.
- Página com JavaScript desabilitado (DevTools → Settings → Debugger → Disable JavaScript): todo o
  conteúdo, inclusive as respostas do FAQ, continua acessível.
- `prefers-reduced-motion: reduce` emulado: `transition-duration` computado = `0s`.
- `document.querySelectorAll('h1,h2,h3')` → um `h1`, sem pular nível.
- Zoom 200% em 1440px: nenhum texto cortado.
- Transferência total < 700KB (fontes + imagens + HTML + JS).
**Aceite:** tudo acima no build exportado, não no `dev`.

### T12 — Atualizar `SIGAAutils site/AGENTS.md`
**Passos:** stack (Next 15 + JS, export estático), comandos (`dev`, `build`, `preview`), layout de
arquivos, contrato de imagem, peso medido do JS e número de focáveis medido, o que é fonte de verdade
(o README da extensão), e a regra de não alterar `SIGAAutils extensão/`.
**Aceite:** quem chegar depois roda `npm run build` e publica lendo só esse arquivo.

### T13 — Cloudflare Pages (documentar, não executar)
Registrar no `AGENTS.md`: build `npm run build`, saída `out`, Node 20 via `.nvmrc`, `metadataBase`
definitivo. Publicar pressupõe criar o repositório git — que hoje não existe e está fora deste trabalho.

---

## 8. Matriz de verificação final

| Largura | O que olhar | Falha se |
|---|---|---|
| 320px | header, hero, mock, tutorial | `scrollWidth > 320` |
| 375px | hero empilhado, recursos em 1 coluna, capturas, FAQ | qualquer corte ou 2 colunas |
| 768px | header com as três âncoras numa linha | âncora escondida ou `nav` estourando |
| 1024px | hero 55/45, recursos em 2 colunas alinhadas | coluna desbalanceada |
| 1440px | container 1120px, H1 ≤ 640px, parágrafos ≤ 62ch | texto esticado |
| Tema claro | os 14 pares de §3.2 | qualquer par < alvo |
| Tema escuro | idem, e `color-scheme` aplicado | par < alvo ou controle nativo claro |
| Teclado | Tab/Enter/Space em tudo | elemento focável sem anel |
| Reduced motion | transições zeradas | transição restante |
| Sem JS | conteúdo e FAQ legíveis | resposta invisível |

---

## 9. Riscos

| Risco | Mitigação |
|---|---|
| `next/font/google` exigir rede no build | `next/font/local` com os WOFF2 versionados |
| Runtime do Next pesar numa página estática | número medido e registrado em T1/T11; conteúdo servido em HTML no primeiro byte |
| Build quebrado no Cloudflare por versão de Node | `.nvmrc` com 20 |
| `og:image` relativa quebrar o preview social | `metadataBase` explícito em T10 |
| Troca futura das capturas | contrato de imagem em T7 + `alt` já escrito em §6 |
| Grafia "SIGAA utils" vs "SIGAAutils" no hero | pendência §1.1, uma string |
| Afirmação inventada na copy | conferência item a item em T6 e T9 contra §6 |

---

## 10. Fora de escopo

- Commit, push, criação de repositório.
- Deploy no Cloudflare Pages (só documentado em T13).
- Alterar qualquer arquivo em `SIGAAutils extensão/` — inclusive as imagens, que são só lidas.
- Botão de troca de tema, analytics, formulário de e-mail, blog, i18n.
- Novas capturas de tela (o autor vai refazer; o contrato de imagem cobre isso).

---

## 11. Registro de execução (2026-11-24)

O plano foi executado no mesmo dia. O que divergiu foi decidido durante a execução, com o motivo:

| Item | Plano | Executado | Motivo |
|---|---|---|---|
| Fontes | `public/fonts/*.woff2` | `app/fonts/*.woff2` | `next/font/local` emite a própria cópia; em `public/` o arquivo seria servido duas vezes |
| Favicon | `public/favicon.svg` desenhado | `public/icon-128.png` (ícone real da extensão) | o projeto não tem logo; inventar um seria pior que usar o que existe |
| Recursos | 7 linhas alinhadas entre as colunas | 7 linhas sem alinhamento entre colunas | o `min-height` que alinhava numa largura cortava descrições de duas linhas nas outras |
| Tutorial | 5 passos numa linha | 2 colunas a partir de 1024px, 3 a partir de 1200px | com 5 colunas o texto quebrava em quatro linhas e `chrome://extensions` partia no meio |
| Demonstração | grade de 2 colunas | três capturas em largura total | `mostrar-notas` tem proporção 4,3:1 e ficaria ilegível em meia largura |
| Imagens | lazy exceto a primeira | todas lazy | nenhuma está no primeiro viewport; a primeira começa abaixo de 1.800px |
| Metadados | `og.png` 1900×865 | `og.jpg` 1200×630, 91 KB | o PNG saía com 408 KB |
| `.gitignore` | só quando houvesse repo | criado na execução | `node_modules/`, `.next/` e `out/` não podem ser commitados |

Lighthouse no build exportado: acessibilidade 100, boas práticas 100, performance 100 (LCP 0,9 s, CLS 0,
TBT 50 ms). Nenhuma verificação de §8 falhou nas onze larguras testadas (320 a 1600px).

---

## 12. Revisão v2 (mesmo dia, a pedido do autor)

Depois de ver o site, o autor pediu para seguir mais de perto a referência e trocar a paleta. Mudou:

- **Layout do hero:** de duas colunas com mock do `chrome://extensions` para coluna única centralizada, com selo acima do título, dois botões em pílula e sem subtítulo nem linha de compatibilidade. O mock foi removido.
- **Paleta:** saiu o roxo, entrou o azul do próprio SIGAA (`#1F4E79`, o mesmo do ícone da extensão), o azul-claro das tabelas como `--tint` e o areia do menu como faixa de aviso.
- **Seção de benefícios:** abas à esquerda, captura à direita com transição, como em `wawplus.com/pt-BR#benefits`. Três abas, porque só existem três capturas reais; os outros quatro recursos viraram cartões de texto em "E também".
- **Comentários:** seção nova com três depoimentos, sem nome, provisórios.
- **Gradiente:** liberado em dois pontos (texto do `h1` e halo do hero), contra a proibição da §3.1.

`app/components/Features.jsx`, `Demo.jsx` e `ExtensionCard.jsx` deixaram de existir.
O `AGENTS.md` da pasta descreve a v2; este plano fica como registro do que foi decidido antes.

---

## 13. Revisão v3 (mesmo dia, a pedido do autor)

Terceira direção visual, agora partindo da referência do Wa Web Plus com a paleta do IFC.

- **Cor:** tema único claro. Verde do cabeçalho do IFC (`#17842a`) nos botões, verde escuro
  documentado (`#096318`) nos títulos e hovers, `#f0f7e8` nas seções alternadas e nos tints.
  Vermelho do brasão (`#ca2027`) ficou reservado à logo.
- **Logo:** a arte quadrada do autor virou favicon (`app/favicon.ico`), ícone do header e
  `apple-touch-icon` pelo `tools/gerar-marca.py`, que remove o fundo preto e arredonda os cantos
  a 30% do lado.
- **Hero:** subtítulo provisório, título em 700 com gradiente `#349a46 → #096318` a 135°, ícone
  do GitHub dentro do botão principal e entrada por keyframes CSS (fora do AOS, para não adiar o LCP).
- **Recursos:** virou carrossel de 6 itens com moldura em gradiente por tom, autoplay de 6 s,
  pausa no hover e retomada 5 s depois de um clique manual. Três itens ainda sem captura usam uma
  moldura desenhada.
- **Instalar:** lista vertical numerada com linha conectora e coluna de vídeo (`sticky`) com
  placeholder "em breve".
- **Aviso:** ganhou botão de fechar sem persistência (volta no reload).
- **Animações:** AOS 2.3.4, `once: true`, `disable: false`, sem exceção para `prefers-reduced-motion`
  (decisão do autor) e `<noscript>` que revela tudo sem JS.
- **Changelog:** rota própria em `/changelog` (timeline por ano, quatro versões reconstruídas do git).
- **Rodapé:** três colunas (marca, Produto, Projeto) e crédito sem o nome do autor.
- **Rodagem:** `trailingSlash: true` já estava no `next.config.mjs`, então `/changelog` funciona no
  `npm run preview` e no Pages.
