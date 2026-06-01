"use client"

import { useEffect, useState } from "react"
import Chamada from "@/components/Chamada"
import BannerRotativo from "../components/BannerRotativo"
import RodapeNoticias from "../components/RodapeNoticias"
import Image from "next/image"

import {
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"

import { db } from "../lib/firebase"


export default function Home() {

  const [mostrarChamada, setMostrarChamada] = useState(false)
  const [nomeAtual, setNomeAtual] = useState("Maria Silva")
  const [matriculaAtual, setMatriculaAtual] = useState("Matrícula 1548")
  const [guicheAtual, setGuicheAtual] = useState("Guichê 2")
  const [chamadaAtiva, setChamadaAtiva] = useState(false)
  const [ultimaChamadaId, setUltimaChamadaId] = useState("")
  const [painelIniciadoEm] = useState(() => Date.now())
  const [nomePainel, setNomePainel] = useState("ADUSEPS")
  const [subtitulo, setSubtitulo] = useState("Painel Institucional")
  const [logo, setLogo] = useState("")

  const [slogan, setSlogan] = useState("Informação, acolhimento e compromisso com o associado.")
  const [fallback, setFallback] = useState("/fallbacks/offline.jpg")
  const [online, setOnline] = useState(true)

  const [midiaAtualTv, setMidiaAtualTv] = useState<any>(null)

  const tocarSomChamada = () => {
    try {
      const audio = new Audio("/sons/chamada.mp3")

      audio.volume = 0.7

      audio.play().catch(() => { })
    } catch { }
  }


  /*  
    STATE PARA TESTAR O FULLSCREEN APENAS EM DESENVOLVIMENTO, APAGAR QUANDO FOR PARA PRODUÇÃO
    const [fullscreenAtivado, setFullscreenAtivado] = useState(false)
  */
  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(db, "configuracoes", "geral"),
      (documento) => {

        if (documento.exists()) {

          const dados = documento.data()

          setNomePainel(dados.nomePainel)
          setSubtitulo(dados.subtitulo)
          setLogo(dados.logo || "")

          setFallback(
            dados.fallback || "/fallbacks/offline.jpg"
          )

          setSlogan(dados.slogan || "")

        }

      }
    )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(db, "painel_chamadas", "atual"),
      (documento) => {

        if (!documento.exists()) return

        const dados = documento.data()

if (!dados || dados.ativo !== true) return

const criadoEmMs = dados.criado_em?.toMillis?.() || 0

if (criadoEmMs < painelIniciadoEm) {
  updateDoc(doc(db, "painel_chamadas", "atual"), {
    ativo: false
  })

  return
}

if (dados.atendimento_id === ultimaChamadaId) return

setUltimaChamadaId(dados.atendimento_id)

        setNomeAtual(
          (dados.nome || "SEM NOME").toUpperCase()
        )

        setMatriculaAtual(
          dados.matricula
            ? `Matrícula ${dados.matricula}`
            : "Sem matrícula"
        )

        setGuicheAtual(
          dados.profissional
            ? `Atendimento: ${dados.profissional}`
            : "Atendimento"
        )

        setMostrarChamada(true)
        tocarSomChamada()

        setTimeout(async () => {

          setMostrarChamada(false)

          await updateDoc(
            doc(db, "painel_chamadas", "atual"),
            {
              ativo: false
            }
          )

        }, 6000)

      }
    )

    return () => unsubscribe()

  }, [ultimaChamadaId, painelIniciadoEm])

  /* Aviso offline */
  useEffect(() => {
    setOnline(navigator.onLine)

    function ficouOnline() {
      setOnline(true)
    }

    function ficouOffline() {
      setOnline(false)
    }

    window.addEventListener("online", ficouOnline)
    window.addEventListener("offline", ficouOffline)

    return () => {
      window.removeEventListener("online", ficouOnline)
      window.removeEventListener("offline", ficouOffline)
    }
  }, [])

  return (
    <main className="w-screen h-screen text-white relative overflow-hidden">

      <BannerRotativo
        fallback={fallback}
        onMidiaAtualChange={setMidiaAtualTv}
      />

      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent z-10" />

      {/* Overlay para melhorar a legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-black/5 z-[1]" />

      <div className="absolute inset-0 z-[1]" />

      {(
        logo.trim() !== "" ||
        nomePainel.trim() !== "" ||
        subtitulo.trim() !== ""
      ) && (

          <div className="absolute top-[clamp(0.75rem,2vh,1.5rem)] left-[clamp(0.75rem,2vw,2rem)] z-10 flex items-center gap-[clamp(0.5rem,1.5vw,1rem)] rounded-2xl border border-white/10 bg-black/15 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)] backdrop-blur-sm shadow-[0_14px_35px_rgba(0,0,0,0.30)]">

            {logo.trim() !== "" && (
              <div className="flex h-[clamp(2.5rem,5vw,3.5rem)] w-[clamp(2.5rem,5vw,3.5rem)] items-center justify-center rounded-xl bg-white/95 p-2 shadow-md">
                <Image
                  src={logo}
                  alt="Logo ADUSEPS"
                  width={120}
                  height={120}
                  priority
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {(nomePainel.trim() !== "" || subtitulo.trim() !== "") && (
              <div className="flex flex-col">

                {nomePainel.trim() !== "" && (
                  <h1 className="text-[clamp(1.2rem,2.5vw,2rem)] font-black tracking-[0.06em] leading-none text-white drop-shadow-sm">
                    {nomePainel}
                  </h1>
                )}

                {subtitulo.trim() !== "" && (
                  <span className="mt-2 text-[clamp(0.65rem,1vw,0.9rem)] font-medium text-white/75 tracking-[0.18em] uppercase">
                    {subtitulo}
                  </span>
                )}

              </div>
            )}

          </div>

        )}

      <Chamada
        mostrar={mostrarChamada}
        nome={nomeAtual}
        matricula={matriculaAtual}
        guiche={guicheAtual}
      />

      {/* ADICIOANR BOTÃO PARA TESTE DE CHAMADA */}

      {/* 

        BOTÃO FULLSCREEN (APENAS PARA DESENVOLVIMENTO)
        APAGAR QUANDO FOR PARA PRODUÇÃO
        {
          !fullscreenAtivado && process.env.NODE_ENV === "development" && (

            <button
              onClick={() => {

                document.documentElement.requestFullscreen()

                setFullscreenAtivado(true)

              }}
              className="absolute top-6 right-8 z-50 bg-white text-black px-5 py-3 rounded-xl font-bold"
            >
              Tela cheia
            </button>

          )
        }
      */}

      {!online && (
        <div className="absolute top-6 right-8 z-50 rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white/90 shadow-2xl backdrop-blur-sm">
          Sem conexão
        </div>
      )}

      <RodapeNoticias
        logo={logo}
        slogan={slogan}
        midiaAtual={midiaAtualTv}
      />

    </main>
  )
} 