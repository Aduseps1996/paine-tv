"use client"

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
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex">
        {/* Sidebar Fixa */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 border-r border-zinc-800 bg-zinc-900/90 p-6 overflow-y-auto z-30 flex flex-col">
          <h1 className="text-2xl font-black">
            Painel TV
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Administração ADUSEPS
          </p>

          <nav className="mt-8 flex flex-col gap-2">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
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

        {/* Header + Conteúdo */}
        <div className="ml-72 flex-1 flex flex-col">
          {/* Header Fixo */}
          <header className="fixed top-0 right-0 left-72 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-end px-8 z-20">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-300">
                Logado como: <span className="font-semibold text-white">{usuarioLogado}</span>
              </span>
            </div>
          </header>

          {/* Conteúdo Principal */}
          <main className="flex-1 overflow-y-auto p-8 pt-24">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}