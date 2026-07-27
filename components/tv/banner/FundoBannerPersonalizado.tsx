import type { PersonalizacaoVisualBanner } from "@/types/painel"

type Props = {
    personalizacao: PersonalizacaoVisualBanner
}

export default function FundoBannerPersonalizado({
    personalizacao
}: Props) {
    if (personalizacao.fundoImagem) {
        return (
            <img
                src={personalizacao.fundoImagem}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
        )
    }

    if (personalizacao.corFundo) {
        return (
            <div
                className="absolute inset-0"
                style={{ background: personalizacao.corFundo }}
            />
        )
    }

    return null
}
