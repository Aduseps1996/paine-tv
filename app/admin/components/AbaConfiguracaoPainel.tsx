"use client"

import {
    CalendarDays,
    CloudSun,
    ImageIcon,
    LayoutPanelTop,
    Megaphone,
    Scale,
    Settings2
} from "lucide-react"

import { usePainelDraftContext } from "../context/PainelDraftContext"
import CidadeAutocomplete from "./clima/CidadeAutocomplete"
import type { ConfiguracoesPainel } from "@/types/painel"

type ModoLogo = "transparente" | "fundo" | "card"
type TamanhoLogo = "pequeno" | "medio" | "grande"
type ChavePainelInformativo = keyof Pick<
    ConfiguracoesPainel,
    | "mostrarTemperaturaPainel"
    | "mostrarDescricaoClimaPainel"
    | "mostrarCidadePainel"
    | "mostrarDataPainel"
    | "mostrarHoraPainel"
>

const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"

function SectionTitle({
    icon: Icon,
    title,
    description
}: {
    icon: typeof Settings2
    title: string
    description: string
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0d6efd]">
                <Icon size={20} />
            </span>
            <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-950">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

function Toggle({
    title,
    description,
    checked,
    onChange
}: {
    title: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition hover:border-blue-200">
            <span>
                <span className="block text-sm font-bold text-slate-800">{title}</span>
                {description && (
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                        {description}
                    </span>
                )}
            </span>
            <span className="relative shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="block h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#0d6efd]" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
        </label>
    )
}

export default function AbaConfiguracaoPainel() {
    const { draft, atualizarConfiguracoesDraft } = usePainelDraftContext()
    const config = draft.configuracoes

    const modoLogo = (config.modoLogo || "fundo") as ModoLogo
    const tamanhoLogo = (config.tamanhoLogoPainel || "medio") as TamanhoLogo
    const logoConfigurada = Boolean((config.logo || "").trim())
    const cidade = config.cidadeClimaPainel || "Recife"

    const alturaLogo =
        tamanhoLogo === "pequeno"
            ? "h-9"
            : tamanhoLogo === "grande"
                ? "h-16"
                : "h-12"

    function optionClass(active: boolean) {
        return active
            ? "border-blue-500 bg-blue-50 text-[#0755b5] ring-2 ring-blue-500/10"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d6efd]">
                        <Settings2 size={15} />
                        Aparência e funcionamento
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                        Configurações do painel
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-slate-500">
                        Organize a identidade da TV, clima, rodapé, escala jurídica e tempos das tarjas.
                    </p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <strong className="block">Alterações no rascunho</strong>
                    <span className="text-xs text-amber-700">
                        Revise e publique pela aba Prévia da TV.
                    </span>
                </div>
            </header>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Logo", value: logoConfigurada ? "Configurada" : "Não definida", detail: tamanhoLogo },
                    { label: "Rodapé", value: config.mostrarRodapeNoticias ?? true ? "Ativo" : "Inativo", detail: "notícias" },
                    { label: "Clima", value: cidade, detail: config.mostrarTemperaturaPainel ?? true ? "visível" : "oculto" },
                    { label: "Escala jurídica", value: config.mostrarEscalaJuridicaTv ? "Ativa" : "Inativa", detail: `${config.duracaoEscalaJuridicaTv || 15}s na tela` }
                ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                        <p className="mt-2 truncate text-xl font-extrabold text-slate-950">{item.value}</p>
                        <p className="mt-1 text-xs capitalize text-slate-500">{item.detail}</p>
                    </div>
                ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                <div className="space-y-6">
                    <section id="identidade" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={LayoutPanelTop}
                            title="Identidade do painel"
                            description="Nome, subtítulo e logo exibidos no cabeçalho da TV."
                        />

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-bold text-slate-700">
                                Nome do painel
                                <input
                                    className={inputClass}
                                    value={config.nomePainel || ""}
                                    onChange={(event) => atualizarConfiguracoesDraft({ nomePainel: event.target.value })}
                                    placeholder="Ex: ADUSEPS"
                                />
                            </label>
                            <label className="text-sm font-bold text-slate-700">
                                Subtítulo
                                <input
                                    className={inputClass}
                                    value={config.subtitulo || ""}
                                    onChange={(event) => atualizarConfiguracoesDraft({ subtitulo: event.target.value })}
                                    placeholder="Ex: Painel Institucional"
                                />
                            </label>
                        </div>

                        <label className="mt-4 block text-sm font-bold text-slate-700">
                            URL ou caminho da logo
                            <input
                                className={inputClass}
                                value={config.logo || ""}
                                onChange={(event) => atualizarConfiguracoesDraft({ logo: event.target.value })}
                                placeholder="https://... ou /logos/logo.png"
                            />
                        </label>

                        <div className="mt-5 grid gap-5 lg:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm font-bold text-slate-700">Fundo da logo</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        ["transparente", "Sem fundo"],
                                        ["fundo", "Branco"],
                                        ["card", "Discreto"]
                                    ].map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => atualizarConfiguracoesDraft({ modoLogo: value as ModoLogo })}
                                            className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${optionClass(modoLogo === value)}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-bold text-slate-700">Tamanho da logo</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        ["pequeno", "Pequena"],
                                        ["medio", "Média"],
                                        ["grande", "Grande"]
                                    ].map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => atualizarConfiguracoesDraft({ tamanhoLogoPainel: value as TamanhoLogo })}
                                            className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${optionClass(tamanhoLogo === value)}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="rodape" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={Megaphone}
                            title="Rodapé e notícias"
                            description="Controle a faixa inferior e o texto institucional."
                        />
                        <div className="mt-6 grid gap-3 lg:grid-cols-2">
                            <Toggle
                                title="Mostrar rodapé de notícias"
                                description="Exibe a faixa de notícias rolando."
                                checked={config.mostrarRodapeNoticias ?? true}
                                onChange={(checked) => atualizarConfiguracoesDraft({ mostrarRodapeNoticias: checked })}
                            />
                            <Toggle
                                title="Mostrar logo na faixa inferior"
                                description="Usa a mesma logo configurada acima."
                                checked={config.mostrarLogoFaixaPainel ?? false}
                                onChange={(checked) => atualizarConfiguracoesDraft({ mostrarLogoFaixaPainel: checked })}
                            />
                        </div>
                        <label className="mt-4 block text-sm font-bold text-slate-700">
                            Slogan do rodapé
                            <input
                                className={inputClass}
                                value={config.slogan || ""}
                                onChange={(event) => atualizarConfiguracoesDraft({ slogan: event.target.value })}
                                placeholder="Ex: Informação, acolhimento e defesa do associado"
                            />
                        </label>
                    </section>

                    <section id="clima" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={CloudSun}
                            title="Clima, data e hora"
                            description="Escolha quais informações aparecem no template Painel."
                        />
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {[
                                ["Mostrar temperatura", "mostrarTemperaturaPainel"],
                                ["Mostrar descrição do clima", "mostrarDescricaoClimaPainel"],
                                ["Mostrar cidade", "mostrarCidadePainel"],
                                ["Mostrar data", "mostrarDataPainel"],
                                ["Mostrar hora", "mostrarHoraPainel"]
                            ].map(([label, key]) => (
                                <Toggle
                                    key={key}
                                    title={label}
                                    checked={config[key as ChavePainelInformativo] ?? true}
                                    onChange={(checked) => atualizarConfiguracoesDraft({ [key]: checked })}
                                />
                            ))}
                        </div>
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Cidade exibida</label>
                            <CidadeAutocomplete
                                value={config.cidadeClimaPainel || ""}
                                onSelecionar={(cidadeSelecionada) => atualizarConfiguracoesDraft({
                                    cidadeClimaPainel: cidadeSelecionada.nome,
                                    latitudeClimaPainel: cidadeSelecionada.latitude,
                                    longitudeClimaPainel: cidadeSelecionada.longitude,
                                    timezoneClimaPainel: cidadeSelecionada.timezone
                                })}
                            />
                        </div>
                    </section>

                    <section id="escala" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={Scale}
                            title="Escala jurídica"
                            description="Inclua automaticamente o atendimento presencial na rotação."
                        />
                        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_180px]">
                            <Toggle
                                title="Mostrar escala jurídica na TV"
                                description="A escala entra na rotação dos banners."
                                checked={config.mostrarEscalaJuridicaTv ?? false}
                                onChange={(checked) => atualizarConfiguracoesDraft({ mostrarEscalaJuridicaTv: checked })}
                            />
                            <label className="text-sm font-bold text-slate-700">
                                Tempo na tela
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={5}
                                        className={`${inputClass} pr-10`}
                                        value={config.duracaoEscalaJuridicaTv || 15}
                                        onChange={(event) => atualizarConfiguracoesDraft({ duracaoEscalaJuridicaTv: Number(event.target.value) })}
                                    />
                                    <span className="absolute bottom-3 right-3 text-xs font-bold text-slate-400">seg</span>
                                </div>
                            </label>
                        </div>
                    </section>

                    <section id="tarjas" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={CalendarDays}
                            title="Tempos das tarjas"
                            description="Padrão global usado pelas mídias que possuem tarja ativa."
                        />
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                ["Entrada", "tempoEntradaTarja", 0, 1],
                                ["Visível", "tempoVisivelTarja", 1, 8],
                                ["Saída", "tempoSaidaTarja", 0, 1],
                                ["Oculta", "tempoOcultaTarja", 0, 10]
                            ].map(([label, key, min, fallback]) => (
                                <label key={String(key)} className="text-sm font-bold text-slate-700">
                                    {label}
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={Number(min)}
                                            className={`${inputClass} pr-10`}
                                            value={Number(config[key as keyof ConfiguracoesPainel] ?? fallback)}
                                            onChange={(event) => atualizarConfiguracoesDraft({ [key]: Number(event.target.value) })}
                                        />
                                        <span className="absolute bottom-3 right-3 text-xs font-bold text-slate-400">seg</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="xl:sticky xl:top-[100px] xl:self-start">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <p className="text-sm font-extrabold text-slate-900">Prévia da TV</p>
                                <p className="text-xs text-slate-500">Atualização instantânea</p>
                            </div>
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Prévia
                            </span>
                        </div>

                        <div className="aspect-video bg-[linear-gradient(145deg,#073f91_0%,#061c3f_100%)] p-4 text-white">
                            <div className="flex items-center gap-3">
                                {logoConfigurada ? (
                                    <div className={`shrink-0 ${modoLogo === "transparente" ? "" : modoLogo === "card" ? "rounded-lg border border-white/15 bg-white/10 p-2" : "rounded-lg bg-white p-2"}`}>
                                        <img
                                            src={config.logo || ""}
                                            alt="Prévia da logo"
                                            className={`${alturaLogo} max-w-24 object-contain`}
                                        />
                                    </div>
                                ) : (
                                    <span className="grid h-12 w-12 place-items-center rounded-lg border border-dashed border-white/30">
                                        <ImageIcon size={20} className="text-white/50" />
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-extrabold">{config.nomePainel || "ADUSEPS"}</p>
                                    <p className="truncate text-xs text-blue-100">{config.subtitulo || "Painel Institucional"}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-[80px_1fr] gap-2">
                                <div className="rounded-lg bg-sky-400/20 p-2 text-center">
                                    <CloudSun className="mx-auto" size={20} />
                                    <p className="mt-1 text-base font-extrabold">
                                        {config.mostrarTemperaturaPainel ?? true ? "28°" : "--"}
                                    </p>
                                    <p className="truncate text-[9px] text-blue-100">{cidade}</p>
                                </div>
                                <div className="grid place-items-center rounded-lg bg-white/10 text-xs font-bold text-white/55">
                                    Área da mídia
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a57b7] px-4 py-3 text-xs font-bold text-white">
                            {config.slogan || "Informação, acolhimento e defesa do associado"}
                        </div>

                        <nav className="grid grid-cols-2 gap-2 p-4 text-xs font-bold">
                            {[
                                ["Identidade", "#identidade"],
                                ["Rodapé", "#rodape"],
                                ["Clima", "#clima"],
                                ["Escala", "#escala"],
                                ["Tarjas", "#tarjas"]
                            ].map(([label, href]) => (
                                <a key={href} href={href} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
            </div>
        </div>
    )
}
