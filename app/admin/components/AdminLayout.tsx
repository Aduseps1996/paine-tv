"use client"

import { useState, type ComponentType, type ReactNode } from "react"
import {
  ContactRound,
  House,
  ImageIcon,
  LogOut,
  Menu,
  Monitor,
  MonitorCog,
  MessageSquareWarning,
  Newspaper,
  ScanEye,
  Type,
  X
} from "lucide-react"

import type { AbaAdmin } from "@/types/painel"

type Props = {
  abaAtiva: AbaAdmin
  setAbaAtiva: (aba: AbaAdmin) => void
  children: ReactNode
  sair: () => void
  usuarioLogado?: string
}

type ItemMenu = {
  id: AbaAdmin
  label: string
  icone: ComponentType<{ size?: number; strokeWidth?: number }>
}

const abas: ItemMenu[] = [
  { id: "inicio", label: "Visão geral", icone: House },
  { id: "previa-tv", label: "Prévia da TV", icone: ScanEye },
  { id: "midias", label: "Mídias", icone: ImageIcon },
  { id: "noticias", label: "Notícias", icone: Newspaper },
  { id: "contatos", label: "Contatos", icone: ContactRound },
  { id: "comunicados", label: "Comunicados", icone: MessageSquareWarning },
  { id: "configuracao-painel", label: "Configurações", icone: MonitorCog },
  { id: "configuracao-tipografia", label: "Tipografia", icone: Type }
]

export default function AdminLayout({
  abaAtiva,
  setAbaAtiva,
  children,
  sair,
  usuarioLogado = "Administrador"
}: Props) {
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,#073f91_0%,#06377f_48%,#052f6e_100%)] text-white shadow-[8px_0_30px_rgba(3,32,76,0.12)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarAberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-11 shrink-0 place-items-center rounded-lg border-2 border-white/90">
              <Monitor size={25} strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-[19px] font-extrabold leading-tight tracking-[-0.02em]">
                ADUSEPS
              </strong>
              <span className="block text-[12px] font-medium text-blue-100">
                Painel TV
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarAberta(false)}
            className="rounded-lg p-2 text-blue-100 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5">
          {abas.map((aba) => {
            const Icone = aba.icone
            const ativa = abaAtiva === aba.id

            return (
              <button
                type="button"
                key={aba.id}
                onClick={() => {
                  setAbaAtiva(aba.id)
                  setSidebarAberta(false)
                }}
                className={`flex min-h-12 items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-semibold transition ${
                  ativa
                    ? "bg-[#0d6efd] text-white shadow-[0_8px_20px_rgba(0,64,170,0.28)]"
                    : "border border-transparent text-blue-50/90 hover:border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icone size={21} strokeWidth={1.9} />
                <span>{aba.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={sair}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-semibold text-blue-50/90 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={20} strokeWidth={1.9} />
            Sair
          </button>
        </div>
      </aside>

      {sidebarAberta && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      <div className="min-h-screen lg:pl-64">
        <header className="fixed left-0 right-0 top-0 z-20 flex h-[76px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl lg:left-64 lg:px-7">
          <button
            type="button"
            onClick={() => setSidebarAberta(true)}
            className="rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm font-medium text-slate-700 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />
              Sistema ativo
            </div>

            <span className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-[#07418f]">
              {usuarioLogado.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="w-full px-3 pb-8 pt-[92px] sm:px-5 lg:px-7 lg:pt-[100px]">
          <div className="admin-shell mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
