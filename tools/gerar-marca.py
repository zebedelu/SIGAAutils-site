"""Gera favicon, logos e ícone do iOS a partir da arte da marca.

Lê `assets/logo-fonte.png` (arte quadrada com fundo preto) e escreve em
`app/favicon.ico` e `public/`. O fundo preto vira transparência e o raio dos
cantos é aumentado para 30% do lado.

    python tools/gerar-marca.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets" / "logo-fonte.png"
PUBLICO = RAIZ / "public"
APP = RAIZ / "app"

RAIO = 0.30  # fração do lado; a arte original tem ~24%
SUPER = 4  # supersampling da máscara

VERDE = (1, 112, 7)


def quadrado(imagem: Image.Image) -> Image.Image:
    """Corta o conteúdo não-preto e devolve um quadrado com alpha."""
    largura, altura = imagem.size
    px = imagem.load()

    minx, miny, maxx, maxy = largura, altura, 0, 0
    for y in range(altura):
        for x in range(largura):
            if max(px[x, y][:3]) > 30:
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)

    if maxx <= minx:
        raise SystemExit("a arte parece vazia: nenhum pixel claro encontrado")

    lado = max(maxx - minx + 1, maxy - miny + 1)
    centro_x = (minx + maxx) // 2
    centro_y = (miny + maxy) // 2
    caixa = (
        centro_x - lado // 2,
        centro_y - lado // 2,
        centro_x - lado // 2 + lado,
        centro_y - lado // 2 + lado,
    )
    return imagem.crop(caixa).resize((1024, 1024), Image.LANCZOS)


def mascara(lado: int) -> Image.Image:
    """Máscara de retângulo arredondado, desenhada grande e reduzida."""
    grande = lado * SUPER
    m = Image.new("L", (grande, grande), 0)
    ImageDraw.Draw(m).rounded_rectangle(
        (0, 0, grande - 1, grande - 1), radius=round(grande * RAIO), fill=255
    )
    return m.resize((lado, lado), Image.LANCZOS)


def main() -> None:
    if not ORIGEM.exists():
        raise SystemExit(f"faltando: {ORIGEM}")

    PUBLICO.mkdir(parents=True, exist_ok=True)

    arte = quadrado(Image.open(ORIGEM).convert("RGBA"))
    arte.putalpha(mascara(1024))

    # header e usos em HTML (96px cobre 32px em tela 3x)
    arte.resize((96, 96), Image.LANCZOS).save(PUBLICO / "logo-96.png", optimize=True)
    arte.resize((512, 512), Image.LANCZOS).save(PUBLICO / "logo-512.png", optimize=True)

    # favicon com transparência
    arte.resize((256, 256), Image.LANCZOS).save(
        APP / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    # iOS recorta por conta própria: fundo cheio, sem transparência
    ios = Image.new("RGBA", (180, 180), VERDE + (255,))
    ios.alpha_composite(arte.resize((180, 180), Image.LANCZOS))
    ios.convert("RGB").save(PUBLICO / "apple-touch-icon.png", optimize=True)

    for nome in ("logo-96.png", "logo-512.png", "apple-touch-icon.png"):
        caminho = PUBLICO / nome
        print(f"{nome:<24} {caminho.stat().st_size / 1024:6.1f} KB")
    print(f"{'app/favicon.ico':<24} {(APP / 'favicon.ico').stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
