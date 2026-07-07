"use client"

import { useEffect, useRef, useState } from "react"
import {
  buscarCidades,
  type CidadeEncontrada
} from "@/lib/clima/geocoding"

type Props = {
  value: string

  onSelecionar: (cidade: CidadeEncontrada) => void
}

export default function CidadeAutocomplete({
  value,
  onSelecionar
}: Props) {
  const [texto, setTexto] = useState(value)
  const [resultado, setResultado] = useState<CidadeEncontrada[]>([])
  const [carregando, setCarregando] = useState(false)
  const [aberto, setAberto] = useState(false)

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setTexto(value)
    }, 0)

    return () => clearTimeout(id)
  }, [value])

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    if (texto.trim().length < 2) {
      return
    }

    timeout.current = setTimeout(async () => {
      try {
        setCarregando(true)

        const cidades = await buscarCidades(texto)

        setResultado(cidades)
      } finally {
        setCarregando(false)
      }
    }, 350)

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [texto])

  return (
    <div className="relative z-[9999]">

      <input
        value={texto}
        onFocus={() => setAberto(true)}
        onChange={(e) => {
          const novoTexto = e.target.value

          setAberto(true)
          setTexto(novoTexto)

          if (novoTexto.trim().length < 2) {
            setResultado([])
          }
        }}
        placeholder="Digite uma cidade..."
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
      />

      {aberto && carregando && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 shadow-2xl">
          Procurando cidades...
        </div>
      )}

      {aberto && resultado.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">

          {resultado.map((cidade) => (
            <button
              key={`${cidade.nome}-${cidade.latitude}`}
              type="button"
              onClick={() => {
                setTexto(
                  `${cidade.nome} - ${cidade.estado}`
                )

                setResultado([])
                setAberto(false)

                onSelecionar(cidade)
              }}
              className="flex w-full items-center gap-3 border-b border-zinc-800 px-4 py-3 text-left transition hover:bg-zinc-800"
            >
              <span className="text-lg">
                📍
              </span>

              <div>
                <div className="font-semibold">
                  {cidade.nome}
                </div>

                <div className="text-sm text-zinc-400">
                  {cidade.estado} • {cidade.pais}
                </div>
              </div>
            </button>
          ))}

        </div>
      )}

    </div>
  )
}
