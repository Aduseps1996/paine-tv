"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import AdminLayout from "./components/AdminLayout"

import AbaInicio from "./components/AbaInicio"
import AbaMidias from "./components/AbaMidias"
import AbaNoticias from "./components/AbaNoticias"
import AbaConfiguracaoPainel from "./components/AbaConfiguracaoPainel"
import AbaConfiguracaoTipografia from "./components/AbaConfiguracaoTipografia"
import {
    PainelDraftProvider,
    usePainelDraftContext
} from "./context/PainelDraftContext"

import type { AbaAdmin, ConfiguracoesPainel } from "@/types/painel"
import { useAdminAuth } from "@/hooks/admin/useAdminAuth"
import { useAdminCollections } from "@/hooks/admin/useAdminCollections"
import { useAdminConfiguracoesPainel } from "@/hooks/admin/useAdminConfiguracoesPainel"

export default function AdminPage() {
    return (
        <PainelDraftProvider>
            <AdminPageContent />
        </PainelDraftProvider>
    )
}

function AdminPageContent() {
    const {
        email,
        senha,
        logado,
        setEmail,
        setSenha,
        entrar,
        sair
    } = useAdminAuth()

    const {
        midias,
        noticias,
    } = useAdminCollections()

    const {
        nomePainel,
        subtitulo,
        logo,
        modoLogo,
        tamanhoLogoPainel,
        slogan,
        tamanhoFonteRodape,
        tamanhoFonteSlogan,
        tamanhoFonteHora,
        alturaBarraNoticias,
        tempoOcultaTarja,
        mostrarLogoFaixaPainel,
        mostrarRodapeNoticias,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        duracaoAnimacaoNoticias,
        mostrarTemperaturaPainel,
        mostrarDescricaoClimaPainel,
        mostrarCidadePainel,
        mostrarDataPainel,
        mostrarHoraPainel,
        cidadeClimaPainel,

        latitudeClimaPainel,
        longitudeClimaPainel,
        timezoneClimaPainel,
        setTamanhoFonteRodape,
        setTamanhoFonteSlogan,
        setTamanhoFonteHora,
        setAlturaBarraNoticias,
        setDuracaoAnimacaoNoticias,
        carregarConfiguracoes,
        salvarConfiguracoes
    } = useAdminConfiguracoesPainel()

    const {
        draft,
        carregarPublicadoNoDraft,
    } = usePainelDraftContext()

    const [abaAtiva, setAbaAtiva] = useState<AbaAdmin>("inicio")

    useEffect(() => {
        void Promise.resolve().then(carregarConfiguracoes)
    }, [carregarConfiguracoes])

    const configuracoes = useMemo<ConfiguracoesPainel>(() => ({
        nomePainel,
        subtitulo,
        logo,
        slogan,
        modoLogo,
        tamanhoLogoPainel,
        mostrarLogoFaixaPainel,
        mostrarRodapeNoticias,
        mostrarTemperaturaPainel,
        mostrarDescricaoClimaPainel,
        mostrarCidadePainel,
        mostrarDataPainel,
        mostrarHoraPainel,
        cidadeClimaPainel,
        latitudeClimaPainel,
        longitudeClimaPainel,
        timezoneClimaPainel,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        tempoOcultaTarja,
        tamanhoFonteRodape,
        tamanhoFonteSlogan,
        tamanhoFonteHora,
        alturaBarraNoticias,
        duracaoAnimacaoNoticias
    }), [
        nomePainel,
        subtitulo,
        logo,
        slogan,
        modoLogo,
        tamanhoLogoPainel,
        mostrarLogoFaixaPainel,
        mostrarRodapeNoticias,
        mostrarTemperaturaPainel,
        mostrarDescricaoClimaPainel,
        mostrarCidadePainel,
        mostrarDataPainel,
        mostrarHoraPainel,
        cidadeClimaPainel,
        latitudeClimaPainel,
        longitudeClimaPainel,
        timezoneClimaPainel,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        tempoOcultaTarja,
        tamanhoFonteRodape,
        tamanhoFonteSlogan,
        tamanhoFonteHora,
        alturaBarraNoticias,
        duracaoAnimacaoNoticias
    ])

    const carregouDraftRef = useRef(false)

    useEffect(() => {
        if (carregouDraftRef.current) return

        const midiasCarregadas = midias.length > 0
        const noticiasCarregadas = noticias.length > 0

        if (!midiasCarregadas && !noticiasCarregadas) return

        carregarPublicadoNoDraft({
            configuracoes,
            midias,
            noticias
        })

        carregouDraftRef.current = true
    }, [configuracoes, midias, noticias, carregarPublicadoNoDraft])

    if (!logado) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_40%),linear-gradient(135deg,_#050816_0%,_#0f172a_50%,_#020617_100%)] p-4 text-white sm:p-8">
                <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950/80 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:p-8">
                    <div className="mb-6">
                        <div className="mb-4 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                            Área restrita
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Acesso administrativo
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Digite suas credenciais para acessar o CMS do painel.
                        </p>
                    </div>

                    <input
                        type="email"
                        placeholder="E-mail"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="mb-4 w-full rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="mb-5 w-full rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <button
                        onClick={async () => {
                            try {
                                await entrar()
                            } catch {
                                alert("E-mail ou senha inválidos.")
                            }
                        }}
                        className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
                    >
                        Entrar
                    </button>
                </div>
            </main>
        )
    }

    return (
        <AdminLayout
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            sair={sair}
        >

            {abaAtiva === "configuracao-painel" && (
                <AbaConfiguracaoPainel />
            )}

            {abaAtiva === "configuracao-tipografia" && (
                <AbaConfiguracaoTipografia
                    tamanhoFonteRodape={tamanhoFonteRodape}
                    tamanhoFonteSlogan={tamanhoFonteSlogan}
                    tamanhoFonteHora={tamanhoFonteHora}
                    alturaBarraNoticias={alturaBarraNoticias}
                    duracaoAnimacaoNoticias={duracaoAnimacaoNoticias}


                    setTamanhoFonteSlogan={setTamanhoFonteSlogan}
                    setTamanhoFonteRodape={setTamanhoFonteRodape}
                    setTamanhoFonteHora={setTamanhoFonteHora}
                    setAlturaBarraNoticias={setAlturaBarraNoticias}
                    setDuracaoAnimacaoNoticias={setDuracaoAnimacaoNoticias}

                    salvarConfiguracoes={salvarConfiguracoes}
                />
            )}

            {abaAtiva === "inicio" && (
                <AbaInicio />
            )}

            {abaAtiva === "midias" && (
                <AbaMidias />
            )}

            {abaAtiva === "noticias" && (
                <AbaNoticias />
            )}
        </AdminLayout>
    )
}
