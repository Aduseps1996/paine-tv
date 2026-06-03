"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

type AbaAdmin =
  | "inicio"
  | "midias"
  | "noticias"
  | "configuracao-painel"
  | "configuracao-tipografia"

type Props = {
  abaAtiva: AbaAdmin
  setAbaAtiva: (aba: AbaAdmin) => void
  children: React.ReactNode
  sair: () => void
  usuarioLogado?: string
}

const abas = [
  { id: "inicio", label: "Início" },
  { id: "midias", label: "Mídias" },
  { id: "noticias", label: "Notícias" },
  { id: "configuracao-painel", label: "Config. Painel" },
  { id: "configuracao-tipografia", label: "Tipografia" }
] as const

export default function AdminLayout({
  abaAtiva,
  setAbaAtiva,
  children,
  sair,
  usuarioLogado = "Administrador"
}: Props) {
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex">
        {/* Sidebar - Desktop Fixa / Mobile Modal */}
        <aside className={`fixed left-0 top-0 bottom-0 w-72 border-r border-zinc-800 bg-zinc-900/90 p-6 overflow-y-auto z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarAberta ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">
                Painel TV
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Administração ADUSEPS
              </p>
            </div>
            <button
              onClick={() => setSidebarAberta(false)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => {
                  setAbaAtiva(aba.id)
                  setSidebarAberta(false)
                }}
                className={`rounded-xl px-4 py-3 text-left font-bold transition ${
                  abaAtiva === aba.id
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </nav>

          <button
            onClick={sair}
            className="mt-auto rounded-xl bg-red-600 px-4 py-3 font-bold hover:bg-red-700 transition w-full"
          >
            Sair
          </button>
        </aside>

        {/* Overlay Mobile */}
        {sidebarAberta && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarAberta(false)}
          />
        )}

        {/* Header + Conteúdo */}
        <div className="md:ml-72 flex-1 flex flex-col w-full md:w-auto">
          {/* Header Fixo */}
          <header className="fixed top-0 right-0 left-0 md:left-72 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 z-20">
            <button
              onClick={() => setSidebarAberta(true)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center gap-4 ml-auto">
              <span className="text-sm text-zinc-300">
                Logado como: <span className="font-semibold text-white">{usuarioLogado}</span>
              </span>
            </div>

            <span className="md:hidden text-sm text-zinc-400 flex-1 text-center">
              Painel TV
            </span>
          </header>

          {/* Conteúdo Principal */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-24 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}