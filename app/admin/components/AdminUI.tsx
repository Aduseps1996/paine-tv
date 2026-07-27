import type { ComponentType, ReactNode } from "react"

type Icone = ComponentType<{ size?: number; strokeWidth?: number }>

type PageHeaderProps = {
  titulo: string
  descricao: string
  acoes?: ReactNode
}

export function AdminPageHeader({
  titulo,
  descricao,
  acoes
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[36px]">
          {titulo}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          {descricao}
        </p>
      </div>

      {acoes && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {acoes}
        </div>
      )}
    </header>
  )
}

type PanelProps = {
  children: ReactNode
  className?: string
}

export function AdminPanel({
  children,
  className = ""
}: PanelProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </section>
  )
}

type MetricCardProps = {
  rotulo: string
  valor: ReactNode
  detalhe: string
  icone: Icone
  destaque?: "azul" | "verde" | "ambar"
}

const metricas = {
  azul: {
    icone: "bg-blue-50 text-[#0d6efd]",
    detalhe: "text-slate-500"
  },
  verde: {
    icone: "bg-emerald-50 text-emerald-600",
    detalhe: "text-emerald-700"
  },
  ambar: {
    icone: "bg-amber-50 text-amber-600",
    detalhe: "text-amber-700"
  }
}

export function AdminMetricCard({
  rotulo,
  valor,
  detalhe,
  icone: Icone,
  destaque = "azul"
}: MetricCardProps) {
  const cores = metricas[destaque]

  return (
    <AdminPanel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            {rotulo}
          </p>
          <div className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
            {valor}
          </div>
          <p className={`mt-2 text-sm font-medium ${cores.detalhe}`}>
            {detalhe}
          </p>
        </div>

        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cores.icone}`}>
          <Icone size={22} strokeWidth={2} />
        </span>
      </div>
    </AdminPanel>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variante?: "primario" | "secundario"
  type?: "button" | "submit"
}

export function AdminButton({
  children,
  onClick,
  disabled,
  variante = "primario",
  type = "button"
}: ButtonProps) {
  const classe = variante === "primario"
    ? "border-[#0d6efd] bg-[#0d6efd] text-white shadow-[0_8px_18px_rgba(13,110,253,0.2)] hover:bg-[#0b5ed7]"
    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 rounded-lg border px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${classe}`}
    >
      {children}
    </button>
  )
}
