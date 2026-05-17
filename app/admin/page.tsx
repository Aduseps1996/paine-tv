"use client"

import { useEffect, useState } from "react"

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    serverTimestamp,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
} from "firebase/firestore"

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth"

import { db, auth } from "../../lib/firebase"

type Midia = {
    id?: string
    tipo: "imagem" | "video"
    arquivo: string
    ativo: boolean
    ordem: number
    duracao: number
}

type Noticia = {
    id?: string
    texto: string
    ativo: boolean
    ordem: number
}

export default function AdminPage() {
    const [midias, setMidias] = useState<Midia[]>([])
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const [arquivo, setArquivo] = useState("")
    const [tipo, setTipo] = useState<"imagem" | "video">("imagem")
    const [novaNoticia, setNovaNoticia] = useState("")

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [logado, setLogado] = useState(false)

    const [nomePainel, setNomePainel] = useState("")
    const [subtitulo, setSubtitulo] = useState("")

    async function carregarMidias() {
        const consulta = query(collection(db, "midias"), orderBy("ordem", "asc"))
        const resultado = await getDocs(consulta)

        const lista = resultado.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        })) as Midia[]

        setMidias(lista)
    }

    async function carregarNoticias() {
        const consulta = query(collection(db, "noticias"), orderBy("ordem", "asc"))
        const resultado = await getDocs(consulta)

        const lista = resultado.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        })) as Noticia[]

        setNoticias(lista)
    }

    async function carregarConfiguracoes() {
        const documento = await getDoc(doc(db, "configuracoes", "geral"))

        if (documento.exists()) {
            const dados = documento.data()

            setNomePainel(dados.nomePainel || "")
            setSubtitulo(dados.subtitulo || "")
        }
    }

    async function salvarConfiguracoes() {
        await setDoc(
            doc(db, "configuracoes", "geral"),
            {
                nomePainel,
                subtitulo
            },
            { merge: true }
        )

        alert("Configurações salvas!")
    }

    async function adicionarMidia() {
        if (arquivo.trim() === "") return

        await addDoc(collection(db, "midias"), {
            tipo,
            arquivo,
            ativo: true,
            ordem: midias.length + 1,
            duracao: 8,
            criadoEm: serverTimestamp()
        })

        setArquivo("")
        setTipo("imagem")
        carregarMidias()
    }

    async function adicionarNoticia() {
        if (novaNoticia.trim() === "") return

        await addDoc(collection(db, "noticias"), {
            texto: novaNoticia,
            ativo: true,
            ordem: noticias.length + 1,
            criadoEm: serverTimestamp()
        })

        setNovaNoticia("")
        carregarNoticias()
    }

    async function removerMidia(id: string) {
        await deleteDoc(doc(db, "midias", id))
        carregarMidias()
    }

    async function removerNoticia(id: string) {
        await deleteDoc(doc(db, "noticias", id))
        carregarNoticias()
    }

    async function alternarMidia(id: string, ativoAtual: boolean) {
        await updateDoc(doc(db, "midias", id), {
            ativo: !ativoAtual
        })

        carregarMidias()
    }

    async function alternarNoticia(id: string, ativoAtual: boolean) {
        await updateDoc(doc(db, "noticias", id), {
            ativo: !ativoAtual
        })

        carregarNoticias()
    }

    useEffect(() => {
        carregarMidias()
        carregarNoticias()
        carregarConfiguracoes()
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            setLogado(!!usuario)
        })

        return () => unsubscribe()
    }, [])

    if (!logado) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-2">
                        Acesso administrativo
                    </h1>

                    <p className="text-zinc-400 mb-6">
                        Digite suas credenciais para acessar o CMS.
                    </p>

                    <input
                        type="email"
                        placeholder="E-mail"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none mb-4"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <button
                        onClick={async () => {
                            try {
                                await signInWithEmailAndPassword(
                                    auth,
                                    email.trim(),
                                    senha.trim()
                                )
                            } catch {
                                alert("E-mail ou senha inválidos.")
                            }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl font-bold py-3"
                    >
                        Entrar
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold">
                    Painel Administrativo
                </h1>

                <button
                    onClick={() => signOut(auth)}
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl font-bold"
                >
                    Sair
                </button>
            </div>

            <p className="text-zinc-400 mb-8">
                Gerenciamento do painel institucional da ADUSEPS
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Configurações do painel
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome do painel"
                        value={nomePainel}
                        onChange={(e) => setNomePainel(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Subtítulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />
                </div>

                <button
                    onClick={salvarConfiguracoes}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
                >
                    Salvar configurações
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Adicionar mídia
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="URL da imagem ou vídeo"
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        value={arquivo}
                        onChange={(e) => setArquivo(e.target.value)}
                    />

                    <select
                        value={tipo}
                        onChange={(e) =>
                            setTipo(e.target.value as "imagem" | "video")
                        }
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    >
                        <option value="imagem">imagem</option>
                        <option value="video">video</option>
                    </select>

                    <button
                        onClick={adicionarMidia}
                        className="bg-blue-600 hover:bg-blue-700 transition rounded-xl font-bold"
                    >
                        Adicionar mídia
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Adicionar notícia
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Mídias cadastradas
                    </h2>

                    <div className="space-y-3">
                        {midias.map((midia) => (
                            <div
                                key={midia.id}
                                className="bg-zinc-800 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            midia.ativo
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    />

                                    <span className="text-sm text-zinc-400">
                                        {midia.ativo ? "Ativo" : "Inativo"}
                                    </span>
                                </div>

                                <p className="font-bold">
                                    {midia.tipo.toUpperCase()}
                                </p>

                                <p className="text-zinc-400 text-sm break-all">
                                    {midia.arquivo}
                                </p>

                                {midia.tipo === "imagem" ? (
                                    <img
                                        src={midia.arquivo}
                                        alt="Prévia da mídia"
                                        className="mt-3 w-full max-h-48 object-cover rounded-xl border border-zinc-700"
                                    />
                                ) : (
                                    <video
                                        src={midia.arquivo}
                                        controls
                                        muted
                                        className="mt-3 w-full max-h-48 rounded-xl border border-zinc-700"
                                    />
                                )}

                                <p className="text-zinc-500 text-xs mt-2">
                                    Ordem: {midia.ordem} | Duração: {midia.duracao}s
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm text-zinc-400">
                                        Duração:
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={midia.duracao}
                                        onChange={(e) => {
                                            if (!midia.id) return

                                            updateDoc(doc(db, "midias", midia.id), {
                                                duracao: Number(e.target.value)
                                            })

                                            carregarMidias()
                                        }}
                                        className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                    />

                                    <span className="text-sm text-zinc-400">
                                        segundos
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm text-zinc-400">
                                        Ordem:
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={midia.ordem}
                                        onChange={(e) => {
                                            if (!midia.id) return

                                            updateDoc(doc(db, "midias", midia.id), {
                                                ordem: Number(e.target.value)
                                            })

                                            carregarMidias()
                                        }}
                                        className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={() => midia.id && removerMidia(midia.id)}
                                    className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                                >
                                    Excluir
                                </button>

                                <button
                                    onClick={() =>
                                        midia.id &&
                                        alternarMidia(midia.id, midia.ativo)
                                    }
                                    className={`mt-3 ml-3 px-4 py-2 rounded-lg text-sm font-bold ${
                                        midia.ativo
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {midia.ativo ? "Desativar" : "Ativar"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Notícias do rodapé
                    </h2>

                    <div className="space-y-3">
                        {noticias.map((noticia) => (
                            <div
                                key={noticia.id}
                                className="bg-zinc-800 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            noticia.ativo
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    />

                                    <span className="text-sm text-zinc-400">
                                        {noticia.ativo ? "Ativa" : "Inativa"}
                                    </span>
                                </div>

                                <textarea
                                    value={noticia.texto}
                                    onChange={(e) => {
                                        if (!noticia.id) return

                                        updateDoc(doc(db, "noticias", noticia.id), {
                                            texto: e.target.value
                                        })

                                        carregarNoticias()
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none resize-none min-h-[100px]"
                                />

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm text-zinc-400">
                                        Ordem:
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={noticia.ordem}
                                        onChange={(e) => {
                                            if (!noticia.id) return

                                            updateDoc(doc(db, "noticias", noticia.id), {
                                                ordem: Number(e.target.value)
                                            })

                                            carregarNoticias()
                                        }}
                                        className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={() =>
                                        noticia.id && removerNoticia(noticia.id)
                                    }
                                    className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                                >
                                    Excluir
                                </button>

                                <button
                                    onClick={() =>
                                        noticia.id &&
                                        alternarNoticia(noticia.id, noticia.ativo)
                                    }
                                    className={`mt-3 ml-3 px-4 py-2 rounded-lg text-sm font-bold ${
                                        noticia.ativo
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {noticia.ativo ? "Desativar" : "Ativar"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}