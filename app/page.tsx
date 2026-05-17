"use client"

import { useEffect, useState } from "react"
import Chamada from "@/components/Chamada"
import Relogio from "../components/Relogio"
import BannerRotativo from "../components/BannerRotativo"
import RodapeNoticias from "../components/RodapeNoticias"
import Image from "next/image"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"



export default function Home() {

  const [mostrarChamada, setMostrarChamada] = useState(false)
  const [nomeAtual, setNomeAtual] = useState("Maria Silva")
  const [matriculaAtual, setMatriculaAtual] = useState("Matrícula 1548")
  const [guicheAtual, setGuicheAtual] = useState("Guichê 2")
  const [chamadaAtiva, setChamadaAtiva] = useState(false)
  const [nomePainel, setNomePainel] = useState("ADUSEPS")
  const [subtitulo, setSubtitulo] = useState("Painel Institucional")
  const [logo, setLogo] = useState("/logos/logo.png")
  const [fallback, setFallback] = useState("/fallbacks/offline.jpg")
  const [fullscreenAtivado, setFullscreenAtivado] = useState(false)

  function chamarAtendimento() {

    if (chamadaAtiva) return

    setChamadaAtiva(true)

    const nomes = [
      "Maria Silva",
      "João Santos",
      "Ana Oliveira",
      "Carlos Pereira"
    ]

    const indiceNome = Math.floor(Math.random() * nomes.length)
    const matricula = Math.floor(Math.random() * 9000) + 1000
    const guiche = Math.floor(Math.random() * 5) + 1

    setNomeAtual(nomes[indiceNome])
    setMatriculaAtual(`Matrícula ${matricula}`)
    setGuicheAtual(`Guichê ${guiche}`)

    setMostrarChamada(true)

    setTimeout(() => {
      setMostrarChamada(false)
      setChamadaAtiva(false)
    }, 5000)

  }

  useEffect(() => {

  const unsubscribe = onSnapshot(
    doc(db, "configuracoes", "geral"),
    (documento) => {

      if (documento.exists()) {

        const dados = documento.data()

        setNomePainel(dados.nomePainel || "ADUSEPS")
        setSubtitulo(dados.subtitulo || "Painel Institucional")
        setLogo(dados.logo || "/logos/logo.png")

        setFallback(
          dados.fallback || "/fallbacks/offline.jpg"
        )

      }

    }
  )

  return () => unsubscribe()

}, [])

  return (
    <main className="w-screen h-screen text-white relative overflow-hidden">

      <BannerRotativo fallback={fallback} />

      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-black/80 to-transparent z-10" />
      
      <div className="absolute top-6 left-8 z-10 flex items-center gap-5">

        <Image
          src={logo}
          alt="Logo ADUSEPS"
          width={70}
          height={70}
          priority
          className="object-contain"
        />

        <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-wider leading-none">
            {nomePainel}
          </h1>

          <span className="text-sm text-zinc-300 mt-1 tracking-wide">
            {subtitulo}
          </span>
        </div>

      </div>

      <Relogio />

      <Chamada
        mostrar={mostrarChamada}
        nome={nomeAtual}
        matricula={matriculaAtual}
        guiche={guicheAtual}
      />

      {
  !fullscreenAtivado && (

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

      <RodapeNoticias />

    </main>
  )
}