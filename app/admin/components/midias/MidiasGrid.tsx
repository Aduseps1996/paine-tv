import { useState } from "react"

import type { DadosPlantao, Midia } from "@/types/painel"

import MidiaCard from "./MidiaCard"
import PainelExibicao from "./PainelExibicao"
import PainelTarja from "./PainelTarja"
import PainelPlantao from "./PainelPlantao"
import { excluirMidiaStorage } from "@/utils/excluirMidiaStorage"


type Props = {
    midias: Midia[]
    todasMidias: Midia[]
    atualizarMidiasDraft: (midias: Midia[]) => void
}

export default function MidiasGrid({
    midias,
    todasMidias,
    atualizarMidiasDraft
}: Props) {
    const [cardExibicaoAberto, setCardExibicaoAberto] = useState<string | null>(null)
    const [cardTarjaAberto, setCardTarjaAberto] = useState<string | null>(null)
    const [cardPlantaoAberto, setCardPlantaoAberto] = useState<string | null>(null)

    const [midiaExibicaoEditando, setMidiaExibicaoEditando] = useState<string | null>(null)
    const [exibicaoProgramada, setExibicaoProgramada] = useState(false)
    const [inicioExibicao, setInicioExibicao] = useState("")
    const [fimExibicao, setFimExibicao] = useState("")
    const [linkYoutubeExibicao, setLinkYoutubeExibicao] = useState("")
    const [modoProgramacao, setModoProgramacao] =
        useState<NonNullable<Midia["modoProgramacao"]>>("periodo")
    const [intervaloExibicaoMinutos, setIntervaloExibicaoMinutos] = useState(20)
    const [prioridadeProgramacao, setPrioridadeProgramacao] = useState(3)

    const [midiaTarjaEditando, setMidiaTarjaEditando] = useState<string | null>(null)
    const [mostrarTarjaMidia, setMostrarTarjaMidia] = useState(false)
    const [modeloTarjaMidia, setModeloTarjaMidia] = useState<Midia["modeloTarja"]>("telejornal")
    const [tarjaEtiquetaMidia, setTarjaEtiquetaMidia] = useState("")
    const [tarjaTituloMidia, setTarjaTituloMidia] = useState("")
    const [tarjaSubtituloMidia, setTarjaSubtituloMidia] = useState("")
    const [tarjaQrcodeMidia, setTarjaQrcodeMidia] = useState("")
    const [tempoEntradaTarjaMidia, setTempoEntradaTarjaMidia] = useState(1)
    const [tempoVisivelTarjaMidia, setTempoVisivelTarjaMidia] = useState(8)
    const [tempoSaidaTarjaMidia, setTempoSaidaTarjaMidia] = useState(1)
    const [tempoOcultaTarjaMidia, setTempoOcultaTarjaMidia] = useState(10)
    const [tempoInicialTarjaMidia, setTempoInicialTarjaMidia] = useState(0)

    function atualizarMidiaRascunho(id: string, dados: Partial<Midia>) {
        atualizarMidiasDraft(
            todasMidias.map((midia) =>
                midia.id === id
                    ? { ...midia, ...dados }
                    : midia
            )
        )
    }

    function alterarOrdemMidia(id: string, novaOrdem: number) {
        const ordemSegura = Math.max(1, Math.min(novaOrdem, todasMidias.length))

        const midiaMovida = todasMidias.find((midia) => midia.id === id)
        if (!midiaMovida) return

        const outrasMidias = todasMidias
            .filter((midia) => midia.id !== id)
            .sort((a, b) => a.ordem - b.ordem)

        outrasMidias.splice(ordemSegura - 1, 0, {
            ...midiaMovida,
            ordem: ordemSegura
        })

        atualizarMidiasDraft(
            outrasMidias.map((midia, index) => ({
                ...midia,
                ordem: index + 1
            }))
        )
    }

    function alternarMidia(midia: Midia) {
        atualizarMidiaRascunho(midia.id, {
            ativo: !midia.ativo
        })
    }

    async function excluirMidia(midia: Midia) {
        const confirmar = confirm(
            "Deseja remover esta mídia do rascunho?"
        )

        if (!confirmar) return

        await excluirMidiaStorage(midia.storagePath)

        atualizarMidiasDraft(
            todasMidias.filter((item) => item.id !== midia.id)
        )
    }

    function abrirExibicao(midia: Midia) {
        const jaAberto = cardExibicaoAberto === midia.id

        if (jaAberto) {
            setCardExibicaoAberto(null)
            setMidiaExibicaoEditando(null)
            return
        }

        setCardTarjaAberto(null)
        setMidiaTarjaEditando(null)
        setCardPlantaoAberto(null)

        setMidiaExibicaoEditando(midia.id)
        setExibicaoProgramada(midia.exibicaoProgramada ?? false)
        setInicioExibicao(midia.inicioExibicao || "")
        setFimExibicao(midia.fimExibicao || "")
        setLinkYoutubeExibicao(midia.linkYoutubeExibicao || midia.arquivo || "")
        setModoProgramacao(midia.modoProgramacao || "periodo")
        setIntervaloExibicaoMinutos(Number(midia.intervaloExibicaoMinutos || 20))
        setPrioridadeProgramacao(Number(midia.prioridadeProgramacao || 3))
        setCardExibicaoAberto(midia.id)
    }

    function salvarExibicao(midia: Midia) {
        const ehYoutube = midia.tipo === "youtube"

        if (ehYoutube && !linkYoutubeExibicao.trim()) {
            alert("Informe o link do YouTube.")
            return
        }

        if ((ehYoutube || exibicaoProgramada) && (!inicioExibicao || !fimExibicao)) {
            alert("Informe o início e o fim da exibição.")
            return
        }

        if (inicioExibicao && fimExibicao) {
            const inicio = new Date(inicioExibicao)
            const fim = new Date(fimExibicao)

            if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
                alert("Data/hora inválida.")
                return
            }

            if (fim <= inicio) {
                alert("O fim da exibição precisa ser maior que o início.")
                return
            }
        }

        atualizarMidiaRascunho(midia.id, {
            exibicaoProgramada: ehYoutube ? true : exibicaoProgramada,
            tipoExibicaoProgramada: ehYoutube ? "youtube" : "midia",
            inicioExibicao,
            fimExibicao,
            linkYoutubeExibicao: ehYoutube ? linkYoutubeExibicao : "",
            modoProgramacao,
            intervaloExibicaoMinutos,
            prioridadeProgramacao
        })

        setCardExibicaoAberto(null)
        setMidiaExibicaoEditando(null)
    }

    function abrirTarja(midia: Midia) {
        const jaAberto = cardTarjaAberto === midia.id

        if (jaAberto) {
            setCardTarjaAberto(null)
            setMidiaTarjaEditando(null)
            return
        }

        setCardExibicaoAberto(null)
        setMidiaExibicaoEditando(null)
        setCardPlantaoAberto(null)

        setMidiaTarjaEditando(midia.id)
        setMostrarTarjaMidia(midia.mostrarTarja ?? false)
        setModeloTarjaMidia(midia.modeloTarja || "telejornal")
        setTarjaEtiquetaMidia(midia.tarjaEtiqueta || "")
        setTarjaTituloMidia(midia.tarjaTitulo || "")
        setTarjaSubtituloMidia(midia.tarjaSubtitulo || "")
        setTarjaQrcodeMidia(midia.qrcode || "")
        setTempoEntradaTarjaMidia(Number(midia.tempoEntradaTarja || 1))
        setTempoVisivelTarjaMidia(Number(midia.tempoVisivelTarja || 8))
        setTempoSaidaTarjaMidia(Number(midia.tempoSaidaTarja || 1))
        setTempoOcultaTarjaMidia(Number(midia.tempoOcultaTarja || 10))
        setTempoInicialTarjaMidia(Number(midia.tempoInicialTarja || 0))
        setCardTarjaAberto(midia.id)
    }

    function salvarTarja(midia: Midia) {
        atualizarMidiaRascunho(midia.id, {
            mostrarTarja: mostrarTarjaMidia,
            modeloTarja: modeloTarjaMidia,
            tarjaEtiqueta: tarjaEtiquetaMidia.trim(),
            tarjaTitulo: tarjaTituloMidia.trim(),
            tarjaSubtitulo: tarjaSubtituloMidia.trim(),
            qrcode: tarjaQrcodeMidia.trim(),
            tempoEntradaTarja: tempoEntradaTarjaMidia,
            tempoVisivelTarja: tempoVisivelTarjaMidia,
            tempoSaidaTarja: tempoSaidaTarjaMidia,
            tempoOcultaTarja: tempoOcultaTarjaMidia,
            tempoInicialTarja: tempoInicialTarjaMidia
        })

        setCardTarjaAberto(null)
        setMidiaTarjaEditando(null)
    }

    function abrirPlantao(midia: Midia) {
        const jaAberto = cardPlantaoAberto === midia.id

        setCardExibicaoAberto(null)
        setMidiaExibicaoEditando(null)
        setCardTarjaAberto(null)
        setMidiaTarjaEditando(null)
        setCardPlantaoAberto(jaAberto ? null : midia.id)
    }

    function salvarPlantao(midia: Midia, plantao: DadosPlantao) {
        atualizarMidiaRascunho(midia.id, {
            titulo: plantao.titulo,
            plantao
        })
        setCardPlantaoAberto(null)
    }

    if (midias.length === 0) {
        return (
            <section className="rounded-[28px] border border-white/10 bg-zinc-900/85 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
                <h3 className="text-2xl font-black">
                    Nenhuma mídia encontrada
                </h3>

                <p className="mt-3 text-zinc-400">
                    Ajuste os filtros ou cadastre uma nova mídia para começar.
                </p>
            </section>
        )
    }

    return (
        <section className="grid gap-6 xl:grid-cols-2">
            {midias.map((midia) => (
                <MidiaCard
                    key={midia.id}
                    midia={midia}
                    onAlternar={alternarMidia}
                    onExcluir={excluirMidia}
                    onAlterarOrdem={alterarOrdemMidia}
                    onAtualizar={atualizarMidiaRascunho}
                    exibirExibicao={cardExibicaoAberto === midia.id}
                    exibirTarja={cardTarjaAberto === midia.id}
                    exibirPlantao={cardPlantaoAberto === midia.id}
                    onToggleExibicao={abrirExibicao}
                    onToggleTarja={abrirTarja}
                    onTogglePlantao={abrirPlantao}
                >
                    {cardExibicaoAberto === midia.id && midiaExibicaoEditando === midia.id && (
                        <PainelExibicao
                            midia={midia}
                            exibicaoProgramada={exibicaoProgramada}
                            setExibicaoProgramada={setExibicaoProgramada}
                            inicioExibicao={inicioExibicao}
                            setInicioExibicao={setInicioExibicao}
                            fimExibicao={fimExibicao}
                            setFimExibicao={setFimExibicao}
                            linkYoutubeExibicao={linkYoutubeExibicao}
                            setLinkYoutubeExibicao={setLinkYoutubeExibicao}
                            modoProgramacao={modoProgramacao}
                            setModoProgramacao={setModoProgramacao}
                            intervaloExibicaoMinutos={intervaloExibicaoMinutos}
                            setIntervaloExibicaoMinutos={setIntervaloExibicaoMinutos}
                            prioridadeProgramacao={prioridadeProgramacao}
                            setPrioridadeProgramacao={setPrioridadeProgramacao}
                            onSalvar={() => salvarExibicao(midia)}
                            onCancelar={() => {
                                setCardExibicaoAberto(null)
                                setMidiaExibicaoEditando(null)
                            }}
                        />
                    )}

                    {cardTarjaAberto === midia.id && midiaTarjaEditando === midia.id && (
                        <PainelTarja
                            mostrarTarjaMidia={mostrarTarjaMidia}
                            setMostrarTarjaMidia={setMostrarTarjaMidia}
                            modeloTarjaMidia={modeloTarjaMidia || "telejornal"}
                            setModeloTarjaMidia={setModeloTarjaMidia}
                            tarjaEtiquetaMidia={tarjaEtiquetaMidia}
                            setTarjaEtiquetaMidia={setTarjaEtiquetaMidia}
                            tarjaTituloMidia={tarjaTituloMidia}
                            setTarjaTituloMidia={setTarjaTituloMidia}
                            tarjaSubtituloMidia={tarjaSubtituloMidia}
                            setTarjaSubtituloMidia={setTarjaSubtituloMidia}
                            tarjaQrcodeMidia={tarjaQrcodeMidia}
                            setTarjaQrcodeMidia={setTarjaQrcodeMidia}
                            tempoEntradaTarjaMidia={tempoEntradaTarjaMidia}
                            setTempoEntradaTarjaMidia={setTempoEntradaTarjaMidia}
                            tempoVisivelTarjaMidia={tempoVisivelTarjaMidia}
                            setTempoVisivelTarjaMidia={setTempoVisivelTarjaMidia}
                            tempoSaidaTarjaMidia={tempoSaidaTarjaMidia}
                            setTempoSaidaTarjaMidia={setTempoSaidaTarjaMidia}
                            tempoOcultaTarjaMidia={tempoOcultaTarjaMidia}
                            setTempoOcultaTarjaMidia={setTempoOcultaTarjaMidia}
                            tempoInicialTarjaMidia={tempoInicialTarjaMidia}
                            setTempoInicialTarjaMidia={setTempoInicialTarjaMidia}
                            onSalvar={() => salvarTarja(midia)}
                            onCancelar={() => {
                                setCardTarjaAberto(null)
                                setMidiaTarjaEditando(null)
                            }}
                        />
                    )}

                    {cardPlantaoAberto === midia.id && (
                        <PainelPlantao
                            key={`plantao-${midia.id}`}
                            midia={midia}
                            onSalvar={(plantao) => salvarPlantao(midia, plantao)}
                            onCancelar={() => setCardPlantaoAberto(null)}
                        />
                    )}
                </MidiaCard>
            ))}
        </section>
    )
}
