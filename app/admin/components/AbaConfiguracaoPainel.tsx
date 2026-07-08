import CidadeAutocomplete from "./clima/CidadeAutocomplete"
import { usePainelDraftContext } from "../context/PainelDraftContext"
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

export default function AbaConfiguracaoPainel() {
    const { draft, atualizarConfiguracoesDraft } = usePainelDraftContext()
    const config = draft.configuracoes

    const modoLogo = (config.modoLogo || "fundo") as ModoLogo
    const tamanhoLogoPainel = (config.tamanhoLogoPainel || "medio") as TamanhoLogo

    const logoConfigurada = (config.logo || "").trim() !== ""
    const rodapeAtivo = config.mostrarRodapeNoticias ?? true
    const cidade = config.cidadeClimaPainel || "Recife"

    const alturaLogoPreview =
        tamanhoLogoPainel === "pequeno"
            ? "h-10"
            : tamanhoLogoPainel === "grande"
                ? "h-20"
                : "h-14"

    const classeLogoPreview =
        modoLogo === "transparente"
            ? "bg-transparent p-0"
            : modoLogo === "card"
                ? "bg-white/10 border border-white/15 p-3 rounded-2xl"
                : "bg-white p-3 rounded-2xl"

    function cardOpcao(ativo: boolean) {
        return ativo
            ? "border-sky-400/40 bg-sky-500/15 text-white shadow-[0_14px_35px_rgba(14,165,233,0.16)]"
            : "border-white/10 bg-zinc-950/60 text-zinc-300"
    }

    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div>
                    <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                        Identidade visual
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        Configuração do painel
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                        Ajuste topo, logo, rodapé, clima e tarjas. Tudo fica no rascunho até ser publicado na página Início.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Logo
                    </p>
                    <p className="mt-4 text-3xl font-black">
                        {logoConfigurada ? "Ativa" : "Vazia"}
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">
                        {logoConfigurada ? "Logo configurada." : "Nenhuma logo definida."}
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Rodapé
                    </p>
                    <p className="mt-4 text-3xl font-black">
                        {rodapeAtivo ? "Ativo" : "Inativo"}
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">
                        Faixa de notícias inferior.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Cidade
                    </p>
                    <p className="mt-4 text-3xl font-black">
                        {cidade}
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">
                        Usada no clima do painel.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Tarjas
                    </p>
                    <p className="mt-4 text-3xl font-black">
                        Padrão
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">
                        Tempos globais configurados.
                    </p>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Topo da TV
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Informações principais exibidas na parte superior do painel.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Nome do painel
                        </label>

                        <input
                            type="text"
                            value={config.nomePainel || ""}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({ nomePainel: e.target.value })
                            }
                            placeholder="Ex: ADUSEPS"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Subtítulo
                        </label>

                        <input
                            type="text"
                            value={config.subtitulo || ""}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({ subtitulo: e.target.value })
                            }
                            placeholder="Ex: Painel Institucional"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Logo
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Controle a imagem, o fundo e o tamanho da logo no topo da TV.
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            URL ou caminho da logo
                        </label>

                        <input
                            type="text"
                            value={config.logo || ""}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({ logo: e.target.value })
                            }
                            placeholder="https://... ou /logos/logo.png"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-bold text-zinc-300">
                            Modo da logo
                        </label>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ modoLogo: "transparente" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(modoLogo === "transparente")}`}
                            >
                                Sem fundo
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ modoLogo: "fundo" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(modoLogo === "fundo")}`}
                            >
                                Fundo branco
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ modoLogo: "card" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(modoLogo === "card")}`}
                            >
                                Card discreto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-bold text-zinc-300">
                            Tamanho da logo
                        </label>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ tamanhoLogoPainel: "pequeno" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(tamanhoLogoPainel === "pequeno")}`}
                            >
                                Pequena
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ tamanhoLogoPainel: "medio" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(tamanhoLogoPainel === "medio")}`}
                            >
                                Média
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    atualizarConfiguracoesDraft({ tamanhoLogoPainel: "grande" })
                                }
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${cardOpcao(tamanhoLogoPainel === "grande")}`}
                            >
                                Grande
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#071633] p-5">
                        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                            Prévia rápida da logo
                        </p>

                        <div className="flex items-center gap-4">
                            {logoConfigurada && (
                                <div className={classeLogoPreview}>
                                    <img
                                        src={config.logo || ""}
                                        alt="Prévia da logo"
                                        className={`${alturaLogoPreview} w-auto object-contain`}
                                    />
                                </div>
                            )}

                            <div className="min-w-0">
                                <h3 className="truncate text-2xl font-black text-white">
                                    {config.nomePainel || "Nome do painel"}
                                </h3>

                                <p className="truncate text-sm font-semibold text-white/65">
                                    {config.subtitulo || "Subtítulo do painel"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Rodapé
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Controle a faixa inferior, a logo no rodapé e o slogan institucional.
                </p>

                <div className="mt-6 space-y-4">
                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                        <div>
                            <p className="font-bold text-white">
                                Mostrar logo na faixa inferior
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                Usa a mesma logo cadastrada, sem alterar a logo do topo.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.mostrarLogoFaixaPainel ?? false}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    mostrarLogoFaixaPainel: e.target.checked
                                })
                            }
                        />
                    </label>

                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                        <div>
                            <p className="font-bold text-white">
                                Mostrar rodapé de notícias
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                Liga ou desliga a faixa de notícias rolando.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.mostrarRodapeNoticias ?? true}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    mostrarRodapeNoticias: e.target.checked
                                })
                            }
                        />
                    </label>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Slogan do rodapé
                        </label>

                        <input
                            type="text"
                            value={config.slogan || ""}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({ slogan: e.target.value })
                            }
                            placeholder="Ex: Informação e compromisso com o associado"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Painel Informativo
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Controle os elementos exibidos no template com clima, mídia principal e faixa inferior.
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {[
                        ["Mostrar temperatura", "mostrarTemperaturaPainel"],
                        ["Mostrar descrição do clima", "mostrarDescricaoClimaPainel"],
                        ["Mostrar cidade", "mostrarCidadePainel"],
                        ["Mostrar data", "mostrarDataPainel"],
                        ["Mostrar hora", "mostrarHoraPainel"]
                    ].map(([label, key]) => (
                        <label
                            key={key}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4"
                        >
                            <span className="font-bold text-white">
                                {label}
                            </span>

                            <input
                                type="checkbox"
                                checked={config[key as ChavePainelInformativo] ?? true}
                                onChange={(e) =>
                                    atualizarConfiguracoesDraft({
                                        [key]: e.target.checked
                                    })
                                }
                            />
                        </label>
                    ))}

                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Cidade exibida
                        </label>

                        <CidadeAutocomplete
                            value={config.cidadeClimaPainel || ""}
                            onSelecionar={(cidade) => {
                                atualizarConfiguracoesDraft({
                                    cidadeClimaPainel: cidade.nome,
                                    latitudeClimaPainel: cidade.latitude,
                                    longitudeClimaPainel: cidade.longitude,
                                    timezoneClimaPainel: cidade.timezone
                                })
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Escala jurídica na TV
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Exibe automaticamente os advogados do atendimento presencial usando a escala semanal já cadastrada.
                </p>

                <div className="mt-6 space-y-4">
                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                        <div>
                            <p className="font-bold text-white">
                                Mostrar escala jurídica na TV
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                A escala entra automaticamente na rotação dos banners.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={config.mostrarEscalaJuridicaTv ?? false}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    mostrarEscalaJuridicaTv: e.target.checked
                                })
                            }
                        />
                    </label>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tempo da escala na tela
                        </label>

                        <input
                            type="number"
                            min={5}
                            value={config.duracaoEscalaJuridicaTv || 15}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    duracaoEscalaJuridicaTv: Number(e.target.value)
                                })
                            }
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Padrão das tarjas
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Tempos globais usados pelas mídias com tarja ativa.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Entrada
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={config.tempoEntradaTarja || 1}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    tempoEntradaTarja: Number(e.target.value)
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Visível
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={config.tempoVisivelTarja || 8}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    tempoVisivelTarja: Number(e.target.value)
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Saída
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={config.tempoSaidaTarja || 1}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    tempoSaidaTarja: Number(e.target.value)
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Oculta
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={config.tempoOcultaTarja || 10}
                            onChange={(e) =>
                                atualizarConfiguracoesDraft({
                                    tempoOcultaTarja: Number(e.target.value)
                                })
                            }
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Prévia do painel
                </h2>

                <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10 bg-[#071633] p-5">
                    <div className="flex items-center gap-4">
                        {logoConfigurada && (
                            <div className={classeLogoPreview}>
                                <img
                                    src={config.logo || ""}
                                    alt="Prévia da logo"
                                    className={`${alturaLogoPreview} w-auto object-contain`}
                                />
                            </div>
                        )}

                        <div className="min-w-0">
                            <h3 className="truncate text-2xl font-black text-white">
                                {config.nomePainel || "Nome do painel"}
                            </h3>

                            <p className="truncate text-sm font-semibold text-white/65">
                                {config.subtitulo || "Subtítulo do painel"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-[#183b78] px-4 py-3">
                        <p className="truncate font-bold text-white">
                            {config.slogan || "Slogan do rodapé"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-[26px] border border-amber-400/20 bg-amber-500/10 p-5">
                <p className="font-black text-amber-200">
                    Alterações salvas no rascunho
                </p>

                <p className="mt-2 text-sm text-amber-100/80">
                    Para enviar essas configurações para a TV, volte para a página Início e clique em Publicar na TV.
                </p>
            </section>
        </div>
    )
}
