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
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-6 animate-[fadeIn_300ms_ease-out]">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px]" />
      <div className="absolute h-[620px] w-[620px] rounded-full bg-[#34bcf8]/20 blur-3xl" />

      <div className="relative w-full max-w-[860px] overflow-hidden rounded-[34px] border border-white/15 bg-[#051630]/96 shadow-[0_40px_120px_rgba(0,0,0,0.78)] animate-[cardEntrada_650ms_cubic-bezier(0.22,1,0.36,1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />

        <header className="relative border-b border-white/10 bg-white/8 px-8 py-5 text-center backdrop-blur-md">
          <h2 className="text-4xl font-black uppercase tracking-wide text-white">
            Chamando agora
          </h2>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.35em] text-[#34bcf8]">
            Atendimento ADUSEPS
          </p>
        </header>

        <main className="relative px-8 py-8 text-center">
          <section className="rounded-[30px] border border-[#34bcf8]/35 bg-[#0b7fc4]/18 px-6 py-5 shadow-[0_20px_60px_rgba(52,188,248,0.2)]">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.32em] text-[#9be7ff]">
              Matrícula
            </p>

            <h1 className="animate-[pulse_2s_ease-in-out_infinite] text-[clamp(5rem,11vw,9rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
              {matricula}
            </h1>
          </section>

          <section className="mt-8">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-white/45">
              Associado
            </p>

            <h3 className="mx-auto max-w-[760px] break-words text-[clamp(1.8rem,4vw,3.4rem)] font-black leading-tight text-white line-clamp-2">
              {nome}
            </h3>
          </section>

          <div className="mx-auto mt-7 h-[2px] w-[min(70%,520px)] bg-gradient-to-r from-transparent via-[#34bcf8] to-transparent" />

          <section className="mt-7 rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-white/45">
              Dirija-se ao
            </p>

            <p className="break-words text-[clamp(1.7rem,3.8vw,2.8rem)] font-black uppercase leading-tight text-[#dff8ff]">
              {guiche}
            </p>
          </section>
        </main>

        <footer className="relative h-2 bg-gradient-to-r from-[#34bcf8] via-white/80 to-[#34bcf8]" />
      </div>
    </div>
  )
}