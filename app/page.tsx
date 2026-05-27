"use client"

import { useEffect, useState } from "react"
import Chamada from "@/components/Chamada"
import BannerRotativo from "../components/BannerRotativo"
import RodapeNoticias from "../components/RodapeNoticias"
import Image from "next/image"

import {
  doc,
  onSnapshot
} from "firebase/firestore"

import { db } from "../lib/firebase"


export default function Home() {

  const [mostrarChamada, setMostrarChamada] = useState(false)
  const [nomeAtual, setNomeAtual] = useState("Maria Silva")
  const [matriculaAtual, setMatriculaAtual] = useState("Matrícula 1548")
  const [guicheAtual, setGuicheAtual] = useState("Guichê 2")
  const [chamadaAtiva, setChamadaAtiva] = useState(false)
  const [nomePainel, setNomePainel] = useState("ADUSEPS")
  const [subtitulo, setSubtitulo] = useState("Painel Institucional")
  const [logo, setLogo] = useState("")

  const [fallback, setFallback] = useState("/fallbacks/offline.jpg")
  const [slogan, setSlogan] = useState("Informação, acolhimento e compromisso com o associado.")
  
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

        if (!dados) return

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

        setTimeout(() => {
          setMostrarChamada(false)
        }, 6000)

      }
    )

    return () => unsubscribe()

  }, [])

  return (
    <main className="w-screen h-screen text-white relative overflow-hidden">

      <BannerRotativo fallback={fallback} />

      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-black/80 to-transparent z-10" />

      <div className="absolute top-6 left-8 z-10 flex items-center gap-5">

        {logo.trim() !== "" && (
          <Image
            src={logo}
            alt="Logo ADUSEPS"
            width={150}
            height={150}
            priority
            className="object-contain"
          />
        )}

        <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-wider leading-none">
            {nomePainel}
          </h1>

          <span className="text-sm text-zinc-300 mt-1 tracking-wide">
            {subtitulo}
          </span>
        </div>

      </div>

      <Chamada
        mostrar={mostrarChamada}
        nome={nomeAtual}
        matricula={matriculaAtual}
        guiche={guicheAtual}
      />

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

      <RodapeNoticias logo={logo} slogan={slogan} />

    </main>
  )
}