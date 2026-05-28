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
  sair
}: Props) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">

        <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-zinc-900/90 p-6">
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
            className="mt-auto rounded-xl bg-red-600 px-4 py-3 font-bold hover:bg-red-700"
          >
            Sair
          </button>
        </aside>

        <section className="flex-1 p-5 md:p-8">
          <div className="mb-6 flex flex-wrap gap-2 md:hidden">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  abaAtiva === aba.id
                    ? "bg-blue-600"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {aba.label}
              </button>
            ))}

            <button
              onClick={sair}
              className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold"
            >
              Sair
            </button>
          </div>

          {children}
        </section>
      </div>
    </main>
  )
}