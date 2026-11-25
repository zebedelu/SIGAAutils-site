"""Converte as capturas da extensão em WebP 16:9, em dois tamanhos, para a landing page.

Lê as capturas antigas de `../SIGAAutils extensão/assets` (somente leitura) e as
novas de `assets/capturas` (opcionais). Escreve em `public/img`.

Toda saída é 16:9 (1600×900 e 800×450). Captura fora de 16:9 entra inteira sobre
uma cópia desfocada dela mesma, que preenche a moldura sem cortar a interface.

    python tools/otimizar-imagens.py
"""

from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ANTIGAS = RAIZ.parent / "SIGAAutils extensão" / "assets"
NOVAS = RAIZ / "assets" / "capturas"
DESTINO = RAIZ / "public" / "img"

ALVO = (1600, 900)

CAPTURAS = [
    ("tela_inicial.png", "tela-inicial", "antiga"),
    ("calendario.png", "calendario", "antiga"),
    ("mostrar_notas.png", "mostrar-notas", "antiga"),
    ("painel.png", "painel", "nova"),
    ("horarios.png", "horarios", "nova"),
]

QUALIDADE = 82


def cor_da_borda(imagem: Image.Image) -> tuple[int, int, int]:
    """Média das bordas: a moldura herda o tom da própria captura, sem duplicar conteúdo."""
    pequena = imagem.resize((64, 64), Image.LANCZOS)
    px = pequena.load()
    amostras = []
    for i in range(64):
        amostras.extend([px[i, 0], px[i, 63], px[0, i], px[63, i]])
    total = [sum(canal) / len(amostras) for canal in zip(*amostras)]
    return tuple(round(c * 0.82) for c in total)


def enquadrar(imagem: Image.Image) -> Image.Image:
    """Devolve a captura em 16:9, inteira, centrada sobre o tom médio das bordas."""
    proporcao = imagem.width / imagem.height
    if abs(proporcao - 16 / 9) < 0.02:
        return ImageOps.fit(imagem, ALVO, Image.LANCZOS)

    fundo = Image.new("RGB", ALVO, cor_da_borda(imagem))

    escala = min(ALVO[0] / imagem.width, ALVO[1] / imagem.height)
    tamanho = (round(imagem.width * escala), round(imagem.height * escala))
    frente = imagem.resize(tamanho, Image.LANCZOS)
    fundo.paste(frente, ((ALVO[0] - tamanho[0]) // 2, (ALVO[1] - tamanho[1]) // 2))
    return fundo


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    total = 0
    geradas = 0

    for arquivo, slug, origem in CAPTURAS:
        caminho = (ANTIGAS if origem == "antiga" else NOVAS) / arquivo

        if not caminho.exists():
            print(f"{slug:<16} pulado (sem {caminho.name} em {caminho.parent.name})")
            continue

        imagem = Image.open(caminho).convert("RGB")
        pronto = enquadrar(imagem)

        for largura in (1600, 800):
            altura = round(largura * 9 / 16)
            reduzida = pronto.resize((largura, altura), Image.LANCZOS)
            saida = DESTINO / f"{slug}-{largura}.webp"
            reduzida.save(saida, "WEBP", quality=QUALIDADE, method=6)
            tamanho = saida.stat().st_size
            total += tamanho
            geradas += 1
            print(f"{saida.name:<28} {largura}x{altura}  {tamanho / 1024:.0f} KB")

    if not geradas:
        raise SystemExit("nenhuma captura encontrada")

    og = Image.open(ANTIGAS / "tela_inicial.png").convert("RGB")
    alvo = (1200, 630)
    corte = round(og.height * alvo[0] / alvo[1])
    if corte <= og.width:
        esquerda = (og.width - corte) // 2
        og = og.crop((esquerda, 0, esquerda + corte, og.height))
    og = og.resize(alvo, Image.LANCZOS)
    og.save(DESTINO / "og.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{'og.jpg':<28} {og.width}x{og.height}  {(DESTINO / 'og.jpg').stat().st_size / 1024:.0f} KB")

    print(f"\ntotal das capturas: {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
