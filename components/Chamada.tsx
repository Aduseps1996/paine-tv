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
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px]" />

      <div className="absolute w-[700px] h-[700px] rounded-full bg-[#34bcf8]/20 blur-3xl" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/20 bg-[#0f2f70]/95 shadow-[0_35px_100px_rgba(0,0,0,0.65)] animate-[cardEntrada_420ms_ease-out]">
        <div className="bg-[#f15434] px-8 py-4 text-center">
          <p className="text-xl font-black uppercase tracking-[0.28em] text-white">
            Chamando atendimento
          </p>
        </div>

        <div className="px-12 py-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
            Associado
          </p>

          <h1 className="text-6xl font-black leading-tight text-white">
            {nome}
          </h1>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-8 py-5">
              <p className="text-3xl font-black text-white">
                {matricula}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-8 py-5">
              <p className="text-3xl font-black text-white">
                {guiche}
              </p>
            </div>
          </div>
        </div>

        <div className="h-2 bg-[#34bcf8]" />
      </div>
    </div>
  )
}