"use client"

type LogoRodapeProps = {
    logo: string
    tamanhoLogoRodape: number
}

export default function LogoRodape({ logo, tamanhoLogoRodape }: LogoRodapeProps) {
    if (logo.trim() === "") {
        return null
    }

    return (
        <div className="rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black/10">
            <img
                src={logo}
                alt="Logo ADUSEPS"
                className="w-auto object-contain"
                style={{ height: `${tamanhoLogoRodape}px` }}
            />
        </div>
    )
}
