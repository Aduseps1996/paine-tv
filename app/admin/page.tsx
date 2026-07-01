"use client"

import { useEffect, useState } from "react"

import AdminLayout from "./components/AdminLayout"

import AbaInicio from "./components/AbaInicio"
import AbaMidias from "./components/AbaMidias"
import AbaNoticias from "./components/AbaNoticias"
import AbaConfiguracaoPainel from "./components/AbaConfiguracaoPainel"
import AbaConfiguracaoTipografia from "./components/AbaConfiguracaoTipografia"

import type { AbaAdmin } from "@/types/painel"
import { useAdminAuth } from "@/hooks/admin/useAdminAuth"
import { useAdminCollections } from "@/hooks/admin/useAdminCollections"
import { useAdminPreview } from "@/hooks/admin/useAdminPreview"
import { useAdminConfiguracoesPainel } from "@/hooks/admin/useAdminConfiguracoesPainel"
import { useNovaMidiaForm } from "@/hooks/admin/useNovaMidiaForm"
import { useNovaNoticiaForm } from "@/hooks/admin/useNovaNoticiaForm"

export default function AdminPage() {
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
        carregarMidias,
        carregarNoticias,
        removerMidia,
        removerNoticia,
        alternarMidia,
        alternarNoticia
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
        setNomePainel,
        setSubtitulo,
        setLogo,
        setModoLogo,
        setTamanhoLogoPainel,
        setSlogan,
        setTamanhoFonteRodape,
        setTamanhoFonteSlogan,
        setTamanhoFonteHora,
        setAlturaBarraNoticias,
        setTempoOcultaTarja,
        setMostrarLogoFaixaPainel,
        setMostrarRodapeNoticias,
        setTempoEntradaTarja,
        setTempoVisivelTarja,
        setTempoSaidaTarja,
        setDuracaoAnimacaoNoticias,
        setMostrarTemperaturaPainel,
        setMostrarDescricaoClimaPainel,
        setMostrarCidadePainel,
        setMostrarDataPainel,
        setMostrarHoraPainel,
        setCidadeClimaPainel,
        carregarConfiguracoes,
        salvarConfiguracoes
    } = useAdminConfiguracoesPainel()

    const {
        arquivo,
        tipo,
        template,
        modoExibicao,
        tituloMidia,
        subtituloMidia,
        rodapeMidia,
        qrcodeMidia,
        categoriaMidia,
        ctaMidia,
        mostrarTarjaMidia,
        tarjaEtiquetaMidia,
        tarjaTituloMidia,
        tarjaSubtituloMidia,
        tempoEntradaTarjaMidia,
        tempoVisivelTarjaMidia,
        tempoSaidaTarjaMidia,
        tempoOcultaTarjaMidia,
        tempoInicialTarjaMidia,
        modeloTarjaMidia,
        tarjaQrcodeMidia,
        programarExibicaoNovaMidia,
        inicioExibicaoNovaMidia,
        fimExibicaoNovaMidia,
        setArquivo,
        setTipo,
        setTemplate,
        setModoExibicao,
        setTituloMidia,
        setSubtituloMidia,
        setRodapeMidia,
        setQrcodeMidia,
        setCategoriaMidia,
        setCtaMidia,
        setMostrarTarjaMidia,
        setTarjaEtiquetaMidia,
        setTarjaTituloMidia,
        setTarjaSubtituloMidia,
        setTempoEntradaTarjaMidia,
        setTempoVisivelTarjaMidia,
        setTempoSaidaTarjaMidia,
        setTempoOcultaTarjaMidia,
        setTempoInicialTarjaMidia,
        setModeloTarjaMidia,
        setTarjaQrcodeMidia,
        setProgramarExibicaoNovaMidia,
        setInicioExibicaoNovaMidia,
        setFimExibicaoNovaMidia,
        adicionarMidia
    } = useNovaMidiaForm({
        totalMidias: midias.length,
        carregarMidias
    })

    const {
        novaNoticia,
        setNovaNoticia,
        adicionarNoticia,
        noticiaProgramada,
        setNoticiaProgramada,
        inicioNoticia,
        setInicioNoticia,
        fimNoticia,
        setFimNoticia,
        categoriaNoticia,
        setCategoriaNoticia
    } = useNovaNoticiaForm({
        totalNoticias: noticias.length,
        carregarNoticias
    })

    const [abaAtiva, setAbaAtiva] = useState<AbaAdmin>("inicio")

    useEffect(() => {
        void Promise.resolve().then(carregarConfiguracoes)
    }, [carregarConfiguracoes])

    const {
        noticiasAtivas,
        midiaPreview
    } = useAdminPreview(midias, noticias)

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
                <AbaConfiguracaoPainel
                    nomePainel={nomePainel}
                    subtitulo={subtitulo}
                    logo={logo}
                    slogan={slogan}

                    modoLogo={modoLogo}
                    tamanhoLogoPainel={tamanhoLogoPainel}

                    tempoEntradaTarja={tempoEntradaTarja}
                    tempoVisivelTarja={tempoVisivelTarja}
                    tempoSaidaTarja={tempoSaidaTarja}
                    tempoOcultaTarja={tempoOcultaTarja}

                    mostrarLogoFaixaPainel={mostrarLogoFaixaPainel}
                    mostrarRodapeNoticias={mostrarRodapeNoticias}
                    setMostrarLogoFaixaPainel={setMostrarLogoFaixaPainel}
                    setMostrarRodapeNoticias={setMostrarRodapeNoticias}

                    setNomePainel={setNomePainel}
                    setSubtitulo={setSubtitulo}
                    setLogo={setLogo}
                    setSlogan={setSlogan}

                    setModoLogo={setModoLogo}
                    setTamanhoLogoPainel={setTamanhoLogoPainel}

                    setTempoEntradaTarja={setTempoEntradaTarja}
                    setTempoVisivelTarja={setTempoVisivelTarja}
                    setTempoSaidaTarja={setTempoSaidaTarja}
                    setTempoOcultaTarja={setTempoOcultaTarja}

                    mostrarTemperaturaPainel={mostrarTemperaturaPainel}
                    setMostrarTemperaturaPainel={setMostrarTemperaturaPainel}
                    mostrarDescricaoClimaPainel={mostrarDescricaoClimaPainel}
                    setMostrarDescricaoClimaPainel={setMostrarDescricaoClimaPainel}
                    mostrarCidadePainel={mostrarCidadePainel}
                    setMostrarCidadePainel={setMostrarCidadePainel}
                    mostrarDataPainel={mostrarDataPainel}
                    setMostrarDataPainel={setMostrarDataPainel}
                    mostrarHoraPainel={mostrarHoraPainel}
                    setMostrarHoraPainel={setMostrarHoraPainel}
                    cidadeClimaPainel={cidadeClimaPainel}
                    setCidadeClimaPainel={setCidadeClimaPainel}

                    salvarConfiguracoes={salvarConfiguracoes}
                />
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
                <AbaInicio
                    midiaPreview={midiaPreview}
                    logo={logo}
                    nomePainel={nomePainel}
                    subtitulo={subtitulo}
                    tamanhoFonteRodape={tamanhoFonteRodape}
                    alturaBarraNoticias={alturaBarraNoticias}
                    noticiasAtivas={noticiasAtivas}
                />
            )}

            {abaAtiva === "midias" && (
                <AbaMidias
                    midias={midias}
                    arquivo={arquivo}
                    tipo={tipo}
                    template={template}
                    tituloMidia={tituloMidia}
                    subtituloMidia={subtituloMidia}
                    rodapeMidia={rodapeMidia}
                    qrcodeMidia={qrcodeMidia}
                    categoriaMidia={categoriaMidia}
                    ctaMidia={ctaMidia}
                    setArquivo={setArquivo}
                    modoExibicao={modoExibicao}
                    setModoExibicao={setModoExibicao}
                    setTipo={setTipo}
                    setTemplate={setTemplate}
                    setTituloMidia={setTituloMidia}
                    setSubtituloMidia={setSubtituloMidia}
                    setRodapeMidia={setRodapeMidia}
                    setQrcodeMidia={setQrcodeMidia}
                    setCategoriaMidia={setCategoriaMidia}
                    setCtaMidia={setCtaMidia}
                    adicionarMidia={adicionarMidia}
                    removerMidia={removerMidia}
                    alternarMidia={alternarMidia}
                    carregarMidias={carregarMidias}

                    programarExibicaoNovaMidia={programarExibicaoNovaMidia}
                    setProgramarExibicaoNovaMidia={setProgramarExibicaoNovaMidia}
                    inicioExibicaoNovaMidia={inicioExibicaoNovaMidia}
                    setInicioExibicaoNovaMidia={setInicioExibicaoNovaMidia}
                    fimExibicaoNovaMidia={fimExibicaoNovaMidia}
                    setFimExibicaoNovaMidia={setFimExibicaoNovaMidia}


                    mostrarTarjaMidia={mostrarTarjaMidia}
                    tarjaEtiquetaMidia={tarjaEtiquetaMidia}
                    tarjaTituloMidia={tarjaTituloMidia}
                    tarjaSubtituloMidia={tarjaSubtituloMidia}
                    tempoEntradaTarjaMidia={tempoEntradaTarjaMidia}
                    tempoVisivelTarjaMidia={tempoVisivelTarjaMidia}
                    tempoSaidaTarjaMidia={tempoSaidaTarjaMidia}
                    tempoOcultaTarjaMidia={tempoOcultaTarjaMidia}
                    setTempoOcultaTarjaMidia={setTempoOcultaTarjaMidia}
                    tempoInicialTarjaMidia={tempoInicialTarjaMidia}
                    setTempoInicialTarjaMidia={setTempoInicialTarjaMidia}
                    modeloTarjaMidia={modeloTarjaMidia}
                    setModeloTarjaMidia={setModeloTarjaMidia}
                    tarjaQrcodeMidia={tarjaQrcodeMidia}
                    setTarjaQrcodeMidia={setTarjaQrcodeMidia}

                    setMostrarTarjaMidia={setMostrarTarjaMidia}
                    setTarjaEtiquetaMidia={setTarjaEtiquetaMidia}
                    setTarjaTituloMidia={setTarjaTituloMidia}
                    setTarjaSubtituloMidia={setTarjaSubtituloMidia}
                    setTempoEntradaTarjaMidia={setTempoEntradaTarjaMidia}
                    setTempoVisivelTarjaMidia={setTempoVisivelTarjaMidia}
                    setTempoSaidaTarjaMidia={setTempoSaidaTarjaMidia}
                />
            )}

            {abaAtiva === "noticias" && (
                <AbaNoticias
                    noticias={noticias}
                    novaNoticia={novaNoticia}
                    setNovaNoticia={setNovaNoticia}
                    adicionarNoticia={adicionarNoticia}
                    removerNoticia={removerNoticia}
                    alternarNoticia={alternarNoticia}
                    carregarNoticias={carregarNoticias}

                    noticiaProgramada={noticiaProgramada}
                    setNoticiaProgramada={setNoticiaProgramada}
                    inicioNoticia={inicioNoticia}
                    setInicioNoticia={setInicioNoticia}
                    fimNoticia={fimNoticia}
                    setFimNoticia={setFimNoticia}
                    categoriaNoticia={categoriaNoticia}
                    setCategoriaNoticia={setCategoriaNoticia}
                />
            )}
        </AdminLayout>
    )
}
