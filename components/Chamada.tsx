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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />

      <div className="absolute h-[min(70vw,760px)] w-[min(70vw,760px)] rounded-full bg-[#34bcf8]/20 blur-3xl" />

      <div className="relative w-full max-w-[min(92vw,920px)] overflow-hidden rounded-[36px] border border-white/15 bg-[#071b42]/95 shadow-[0_40px_120px_rgba(0,0,0,0.75)] animate-[cardEntrada_650ms_cubic-bezier(0.22,1,0.36,1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

        <div className="relative border-b border-white/10 bg-white/8 px-8 py-5 text-center backdrop-blur-md">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#34bcf8]">
            Atendimento ADUSEPS
          </p>

          <h2 className="mt-2 text-[clamp(1.4rem,3vw,2.4rem)] font-black uppercase tracking-wide text-white">
            Chamando agora
          </h2>
        </div>

        <div className="relative px-[clamp(1.25rem,4vw,3.25rem)] py-[clamp(1.75rem,5vh,3.5rem)] text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-white/45">
            Associado
          </p>

          <h1 className="mx-auto max-w-[900px] text-[clamp(2.2rem,5.5vw,4.6rem)] font-black leading-[1.02] text-white break-words line-clamp-2 drop-shadow-[0_8px_25px_rgba(0,0,0,0.45)]">
            {nome}
          </h1>

          <div className="mx-auto mt-8 h-[2px] w-[min(70%,520px)] bg-gradient-to-r from-transparent via-[#34bcf8] to-transparent" />

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 px-8 py-6 backdrop-blur-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                Identificação
              </p>

              <p className="text-[clamp(2.2rem,6vw,5rem)] font-black text-white leading-none">
                {matricula}
              </p>
            </div>

            <div className="rounded-3xl border border-[#34bcf8]/25 bg-[#34bcf8]/12 px-8 py-6 backdrop-blur-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#34bcf8]">
                Destino
              </p>

              <p className="text-[clamp(1.15rem,2.8vw,2rem)] font-black text-white leading-tight break-words">
                {guiche}
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-2 bg-gradient-to-r from-[#34bcf8] via-white/80 to-[#34bcf8]" />
      </div>
    </div>
  )
}