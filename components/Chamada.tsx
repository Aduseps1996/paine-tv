type Props = {
  mostrar: boolean
  nome: string
  matricula: string
  guiche: string
}

export default function Chamada({
  mostrar,
  nome,
  matricula,
  guiche
}: Props) {
  if (!mostrar) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8 pointer-events-none animate-[fadeIn_300ms_ease-out]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55 backdrop-blur-[1px]" />

      <div className="absolute h-[min(80vw,850px)] w-[min(80vw,850px)] rounded-full bg-[#34bcf8]/15 blur-xl"/>

      <div className="relative w-full max-w-[min(92vw,900px)] overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-[#0f2f70]/95 via-[#123a86]/95 to-[#071b42]/95 shadow-[0_35px_100px_rgba(0,0,0,0.65)] animate-[cardEntrada_650ms_cubic-bezier(0.22,1,0.36,1)]">

        <div className="bg-gradient-to-r from-[#f15434] to-[#d94125] px-8 py-4 text-center">
          <p className="text-xl font-black uppercase tracking-[0.28em] text-white">
            Chamando atendimento
          </p>
        </div>

        <div className="px-[clamp(1.25rem,4vw,3rem)] py-[clamp(1.5rem,4vh,2.5rem)] text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
            Associado
          </p>

          <h1 className="
            mx-auto
            max-w-[900px]
            text-[clamp(2rem,5vw,4rem)]
            font-black
            leading-[1.05]
            text-white
            break-words
            line-clamp-2
          ">
            {nome}
          </h1>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-8 py-5">
              <p className="text-[clamp(1.25rem,3vw,2rem)] font-black text-white leading-tight break-words">
                {matricula}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-8 py-5">
              <p className="text-[clamp(1.25rem,3vw,2rem)] font-black text-white leading-tight break-words">
                {guiche}
              </p>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-[#34bcf8] via-white/70 to-[#34bcf8]" />
      </div>
    </div>
  )
}