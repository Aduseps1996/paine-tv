"use client"

import { useEffect, useState } from "react"
import Chamada from "@/components/Chamada"
import BannerRotativo from "../components/BannerRotativo"
import RodapeNoticias from "../components/RodapeNoticias"
import Image from "next/image"

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore"

import { db } from "../lib/firebase"

type Atendimento = {
  id?: string
  pessoa_id: string
  associado_id?: string | null
  profissional_id?: string | null
  status: string
  inicio_atendimento?: any
}

type Pessoa = {
  id?: string
  nome: string
}

type Associado = {
  id?: string
  matricula: string
}

type Profissional = {
  id?: string
  nome: string
}


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
  const [fullscreenAtivado, setFullscreenAtivado] = useState(false)

  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [associados, setAssociados] = useState<Associado[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [ultimoAtendimentoChamadoId, setUltimoAtendimentoChamadoId] = useState("")


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
      collection(db, "pessoas"),
      (resultado) => {
        const lista = resultado.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        })) as Pessoa[]

        setPessoas(lista)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "associados"),
      (resultado) => {
        const lista = resultado.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        })) as Associado[]

        setAssociados(lista)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "profissionais"),
      (resultado) => {
        const lista = resultado.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        })) as Profissional[]

        setProfissionais(lista)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const consulta = query(
      collection(db, "atendimentos"),
      orderBy("inicio_atendimento", "desc")
    )

    const unsubscribe = onSnapshot(consulta, (resultado) => {
      const atendimentos = resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      })) as Atendimento[]

      const ultimoEmAtendimento = atendimentos.find(
        (atendimento) =>
          atendimento.status === "em_atendimento" &&
          atendimento.inicio_atendimento
      )

      if (!ultimoEmAtendimento?.id) return

      if (ultimoEmAtendimento.id === ultimoAtendimentoChamadoId) return

      const pessoa = pessoas.find(
        (item) => item.id === ultimoEmAtendimento.pessoa_id
      )

      const associado = associados.find(
        (item) => item.id === ultimoEmAtendimento.associado_id
      )

      const profissional = profissionais.find(
        (item) => item.id === ultimoEmAtendimento.profissional_id
      )

      setNomeAtual(
        pessoa?.nome?.toUpperCase() || "PESSOA NÃO ENCONTRADA"
      )

      setMatriculaAtual(
        associado?.matricula
          ? `Matrícula ${associado.matricula}`
          : "Sem matrícula"
      )

      setGuicheAtual(
        profissional?.nome
          ? `Atendimento: ${profissional.nome}`
          : "Atendimento"
      )

      setUltimoAtendimentoChamadoId(ultimoEmAtendimento.id)
      setMostrarChamada(true)

      setTimeout(() => {
        setMostrarChamada(false)
      }, 6000)
    })

    return () => unsubscribe()
  }, [
    pessoas,
    associados,
    profissionais,
    ultimoAtendimentoChamadoId
  ])

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

      <RodapeNoticias logo={logo} slogan={slogan} />

    </main>
  )
}