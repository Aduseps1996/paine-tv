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

  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTexto(value)
  }, [value])

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    if (texto.trim().length < 2) {
      setResultado([])
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
    <div className="relative">

      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite uma cidade..."
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
      />

      {carregando && (
        <div className="mt-2 text-sm text-zinc-400">
          Procurando cidades...
        </div>
      )}

      {resultado.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">

          {resultado.map((cidade) => (
            <button
              key={`${cidade.nome}-${cidade.latitude}`}
              type="button"
              onClick={() => {
                setTexto(
                  `${cidade.nome} - ${cidade.estado}`
                )

                setResultado([])

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