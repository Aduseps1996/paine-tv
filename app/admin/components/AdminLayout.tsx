"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

type AbaAdmin =
  | "inicio"
  | "midias"
  | "noticias"
  | "contatos"
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
  { id: "contatos", label: "Contatos" },
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_42%),linear-gradient(135deg,_#050816_0%,_#0f172a_50%,_#020617_100%)] text-zinc-100">
      <div className="flex">
        <aside className={`fixed left-0 top-0 bottom-0 w-72 border-r border-white/10 bg-zinc-950/85 backdrop-blur-xl p-6 overflow-y-auto z-40 flex flex-col shadow-2xl shadow-black/30 transition-transform duration-300 md:translate-x-0 ${
          sidebarAberta ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                CMS
              </div>
              <h1 className="mt-3 text-2xl font-black tracking-tight">
                Painel TV
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Administração ADUSEPS
              </p>
            </div>
            <button
              onClick={() => setSidebarAberta(false)}
              className="md:hidden rounded-lg p-2 text-zinc-300 transition hover:bg-white/10"
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
                className={`rounded-2xl px-4 py-3 text-left font-semibold transition-all ${
                  abaAtiva === aba.id
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-white">Gerenciamento central</p>
            <p className="mt-1 text-zinc-400">Organize mídias, notícias e a aparência do painel em um só lugar.</p>
          </div>

          <button
            onClick={sair}
            className="mt-auto w-full rounded-2xl bg-red-600/90 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Sair
          </button>
        </aside>

        {sidebarAberta && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarAberta(false)}
          />
        )}

        <div className="flex w-full flex-1 flex-col md:ml-72 md:w-auto">
          <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950/70 px-4 backdrop-blur-xl md:left-72 md:px-8">
            <button
              onClick={() => setSidebarAberta(true)}
              className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 md:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 md:block">
                Online
              </div>
              <span className="hidden text-sm text-zinc-300 md:block">
                Logado como <span className="font-semibold text-white">{usuarioLogado}</span>
              </span>
            </div>

            <span className="flex-1 text-center text-sm text-zinc-400 md:hidden">
              Painel TV
            </span>
          </header>

          <main className="w-full flex-1 overflow-y-auto p-2 pt-20 sm:p-4 md:p-8 md:pt-24">
            <div className="admin-shell mx-auto w-full max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.03] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-5 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
