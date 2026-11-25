"""Converte as gravações do carrossel para MP4 leve, sem áudio.

Lê os quatro vídeos da raiz do projeto pai e escreve em `public/video`, em
1280×720 (16:9), com o áudio descartado. O CRF 34 deixa cada arquivo em ~35%
do original sem diferença visível na largura em que a página exibe (700 px).

Precisa do PyAV, que já traz o FFmpeg embutido:

    pip install av
    python tools/otimizar-videos.py
"""

from pathlib import Path

import av

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ.parent
DESTINO = RAIZ / "public" / "video"

CRF = 34
LARGURA, ALTURA = 1280, 720

VIDEOS = [
    ("escuro e papel_parede.mp4", "modo-escuro"),
    ("mostrar_nota.mp4", "notas-home"),
    ("imagem_forun.mp4", "forum-imagens"),
    ("certificados.mp4", "certificados"),
]


def converter(origem: Path, saida: Path) -> None:
    entrada = av.open(origem)
    video = entrada.streams.video[0]

    saida.parent.mkdir(parents=True, exist_ok=True)
    destino = av.open(saida, "w", format="mp4", options={"movflags": "+faststart"})
    fluxo = destino.add_stream("libx264", rate=video.average_rate)
    fluxo.width = LARGURA
    fluxo.height = ALTURA
    fluxo.pix_fmt = "yuv420p"
    fluxo.bit_rate = 0
    fluxo.options = {"crf": str(CRF), "preset": "medium"}

    for quadro in entrada.decode(video=0):
        quadro = quadro.reformat(format="yuv420p", width=LARGURA, height=ALTURA)
        for pacote in fluxo.encode(quadro):
            destino.mux(pacote)
    for pacote in fluxo.encode():
        destino.mux(pacote)

    destino.close()
    entrada.close()


def main() -> None:
    total_antes = 0
    total_depois = 0

    for arquivo, slug in VIDEOS:
        origem = ORIGEM / arquivo
        if not origem.exists():
            print(f"{slug:<16} pulado (sem {arquivo} em {origem.parent.name})")
            continue

        saida = DESTINO / f"{slug}.mp4"
        converter(origem, saida)

        antes = origem.stat().st_size
        depois = saida.stat().st_size
        total_antes += antes
        total_depois += depois
        print(
            f"{saida.name:<24} {antes / 1024:6.0f} KB -> {depois / 1024:6.0f} KB"
            f"  ({depois / antes:.0%})"
        )

    if not total_depois:
        raise SystemExit("nenhum vídeo encontrado")

    print(f"\ntotal: {total_antes / 1024:.0f} KB -> {total_depois / 1024:.0f} KB")


if __name__ == "__main__":
    main()
