(function () {
    const SELETORES = [".skill-item img", ".social-icon img", ".avatar-img"];
    const LIMIAR_BRANCO = 235;

    function removerFundoBranco(img) {
        if (img.dataset.fundoRemovido === "true") return;

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let dadosImagem;
        try {
            dadosImagem = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (erro) {
            console.warn("Não foi possível processar:", img.src, erro);
            return;
        }

        const pixels = dadosImagem.data;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            if (r >= LIMIAR_BRANCO && g >= LIMIAR_BRANCO && b >= LIMIAR_BRANCO) {
                pixels[i + 3] = 0;
            }
        }

        ctx.putImageData(dadosImagem, 0, 0);

        img.src = canvas.toDataURL("image/png");
        img.dataset.fundoRemovido = "true";
    }

    function processarTodasAsImagens() {
        const imagens = document.querySelectorAll(SELETORES.join(", "));

        imagens.forEach((img) => {
            if (img.complete && img.naturalWidth > 0) {
                removerFundoBranco(img);
            } else {
                img.addEventListener("load", () => removerFundoBranco(img));
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", processarTodasAsImagens);
    } else {
        processarTodasAsImagens();
    }
})();