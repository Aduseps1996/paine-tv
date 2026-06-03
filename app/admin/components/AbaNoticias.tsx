type Props = {
    noticias: any[]
    novaNoticia: string

    setNovaNoticia: (valor: string) => void

    adicionarNoticia: () => void
    removerNoticia: (id: string) => void
    alternarNoticia: (id: string, ativo: boolean) => void

    carregarNoticias: () => void

    db: any
}

import { doc, updateDoc } from "firebase/firestore"

export default function AbaNoticias({
    noticias,
    novaNoticia,
    setNovaNoticia,
    adicionarNoticia,
    removerNoticia,
    alternarNoticia,
    carregarNoticias,
    db
}: Props) {

    return (

        <div className="space-y-3 sm:space-y-6">

            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
                    Notícias do rodapé
                </h1>

                <p className="mt-2 text-zinc-400">
                    Cadastre e organize as mensagens exibidas no letreiro da TV.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    Nova notícia
                </h2>

                <p className="text-zinc-400 mb-6">
                    Adicione uma nova mensagem para aparecer no rodapé do painel.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-2 sm:gap-4">
                    <input
                        type="text"
                        placeholder="Texto da notícia do rodapé"
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        value={novaNoticia}
                        onChange={(e) => setNovaNoticia(e.target.value)}
                    />

                    <button
                        onClick={adicionarNoticia}
                        className="bg-green-600 hover:bg-green-700 transition rounded-xl font-bold"
                    >
                        Adicionar notícia
                    </button>
                </div>
            </div>

            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        Notícias cadastradas
                    </h2>

                    <p className="text-zinc-400 mt-1">
                        Controle a ordem, status e conteúdo das notícias.
                    </p>
                </div>

                <div className="space-y-4">

                    {noticias.map((noticia) => (

                        <div
                            key={noticia.id}
                            className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-lg"
                        >

                            <div className="mb-4 flex items-center justify-between gap-4">

                                <div className="flex items-center gap-2">

                                    <div
                                        className={`h-3 w-3 rounded-full ${
                                            noticia.ativo
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    />

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            noticia.ativo
                                                ? "bg-green-500/15 text-green-400"
                                                : "bg-red-500/15 text-red-400"
                                        }`}
                                    >
                                        {noticia.ativo ? "Ativa" : "Inativa"}
                                    </span>

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Ordem: {noticia.ordem}
                                </span>

                            </div>

                            <textarea
                                value={noticia.texto}
                                onChange={(e) => {

                                    if (!noticia.id) return

                                    updateDoc(
                                        doc(db, "noticias", noticia.id),
                                        {
                                            texto: e.target.value
                                        }
                                    )

                                    carregarNoticias()

                                }}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none resize-none min-h-[100px]"
                            />

                            <div className="mt-4 flex flex-wrap items-center gap-3">

                                <span className="text-sm text-zinc-400">
                                    Ordem:
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    value={noticia.ordem}
                                    onChange={(e) => {

                                        if (!noticia.id) return

                                        updateDoc(
                                            doc(db, "noticias", noticia.id),
                                            {
                                                ordem: Number(e.target.value)
                                            }
                                        )

                                        carregarNoticias()

                                    }}
                                    className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                />

                                <button
                                    onClick={() =>
                                        noticia.id &&
                                        alternarNoticia(
                                            noticia.id,
                                            noticia.ativo
                                        )
                                    }
                                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                                        noticia.ativo
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {noticia.ativo
                                        ? "Desativar"
                                        : "Ativar"}
                                </button>

                                <button
                                    onClick={() =>
                                        noticia.id &&
                                        removerNoticia(noticia.id)
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold transition hover:bg-red-700"
                                >
                                    Excluir
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>

    )

}