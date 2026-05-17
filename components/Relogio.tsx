"use client"

import { useEffect, useState } from "react"

export default function Relogio() {

  const [hora, setHora] = useState("")

  useEffect(() => {

    const atualizarHora = () => {

      const agora = new Date()

      const horaFormatada = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      })

      setHora(horaFormatada)
    }

    atualizarHora()

    const intervalo = setInterval(atualizarHora, 1000)

    return () => clearInterval(intervalo)

  }, [])

  return (
    <div className="absolute top-6 right-8 z-10">

      <div className="bg-black/40 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10 text-5xl font-bold">

        {hora}

      </div>

    </div>
  )
}

