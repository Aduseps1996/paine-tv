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
    template?: "cheio" | "informativo"
}

type Noticia = {
    id?: string
    texto: string
    ativo: boolean
    ordem: number
}

const limitarValor = (
    valor: number,
    minimo: number,
    maximo: number,
    padrao: number
) => {
    if (Number.isNaN(valor)) return padrao
    if (valor < minimo) return minimo
    if (valor > maximo) return maximo
    return valor
}

export default function AdminPage() {
    const [midias, setMidias] = useState<Midia[]>([])
    const [noticias, setNoticias] = useState<Noticia[]>([])

    const [arquivo, setArquivo] = useState("")
    const [tipo, setTipo] = useState<"imagem" | "video">("imagem")
    const [template, setTemplate] = useState<"cheio" | "informativo">("cheio")
    const [novaNoticia, setNovaNoticia] = useState("")

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [logado, setLogado] = useState(false)

    const [nomePainel, setNomePainel] = useState("")
    const [subtitulo, setSubtitulo] = useState("")
    const [logo, setLogo] = useState("")
    const [slogan, setSlogan] = useState("")

    const [tamanhoFonteRodape, setTamanhoFonteRodape] = useState(28)
    const [tamanhoFonteSlogan, setTamanhoFonteSlogan] = useState(18)
    const [tamanhoFonteDataHora, setTamanhoFonteDataHora] = useState(18)
    const [tamanhoFonteHora, setTamanhoFonteHora] = useState(24)
    const [tamanhoIconeRodape, setTamanhoIconeRodape] = useState(22)
    const [alturaBarraSuperior, setAlturaBarraSuperior] = useState(64)
    const [alturaBarraNoticias, setAlturaBarraNoticias] = useState(44)
    const [tamanhoLogoRodape, setTamanhoLogoRodape] = useState(44)

    const [indicePreview, setIndicePreview] = useState(0)
    const [abaAtiva, setAbaAtiva] = useState("configuracoes")

    async function carregarMidias() {
        const consulta = query(
            collection(db, "midias"),
            orderBy("ordem", "asc")
        )

        const resultado = await getDocs(consulta)

        const lista = resultado.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        })) as Midia[]

        setMidias(lista)
    }

    async function carregarNoticias() {
        const consulta = query(
            collection(db, "noticias"),
            orderBy("ordem", "asc")
        )

        const resultado = await getDocs(consulta)

        const lista = resultado.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        })) as Noticia[]

        setNoticias(lista)
    }

    async function carregarConfiguracoes() {
        const documento = await getDoc(
            doc(db, "configuracoes", "geral")
        )

        if (documento.exists()) {
            const dados = documento.data()

            setNomePainel(dados.nomePainel || "")
            setSubtitulo(dados.subtitulo || "")
            setLogo(dados.logo || "")
            setSlogan(dados.slogan || "")

            setTamanhoFonteRodape(
                limitarValor(Number(dados.tamanhoFonteRodape || 28), 12, 80, 28)
            )

            setTamanhoFonteSlogan(
                limitarValor(Number(dados.tamanhoFonteSlogan || 18), 12, 80, 18)
            )

            setTamanhoFonteDataHora(
                limitarValor(Number(dados.tamanhoFonteDataHora || 18), 12, 80, 18)
            )

            setTamanhoFonteHora(
                limitarValor(Number(dados.tamanhoFonteHora || 24), 12, 80, 24)
            )

            setTamanhoIconeRodape(
                limitarValor(Number(dados.tamanhoIconeRodape || 22), 12, 80, 22)
            )

            setAlturaBarraSuperior(
                limitarValor(Number(dados.alturaBarraSuperior || 64), 40, 120, 64)
            )

            setAlturaBarraNoticias(
                limitarValor(Number(dados.alturaBarraNoticias || 44), 30, 100, 44)
            )

            setTamanhoLogoRodape(
                limitarValor(Number(dados.tamanhoLogoRodape || 44), 20, 100, 44)
            )
        }
    }

    async function salvarConfiguracoes() {
        const configuracoes = {
            nomePainel,
            subtitulo,
            logo,
            slogan,
            tamanhoFonteRodape: limitarValor(tamanhoFonteRodape, 12, 80, 28),
            tamanhoFonteSlogan: limitarValor(tamanhoFonteSlogan, 12, 80, 18),
            tamanhoFonteDataHora: limitarValor(tamanhoFonteDataHora, 12, 80, 18),
            tamanhoFonteHora: limitarValor(tamanhoFonteHora, 12, 80, 24),
            tamanhoIconeRodape: limitarValor(tamanhoIconeRodape, 12, 80, 22),
            alturaBarraSuperior: limitarValor(alturaBarraSuperior, 40, 120, 64),
            alturaBarraNoticias: limitarValor(alturaBarraNoticias, 30, 100, 44),
            tamanhoLogoRodape: limitarValor(tamanhoLogoRodape, 20, 100, 44)
        }

        await setDoc(
            doc(db, "configuracoes", "geral"),
            configuracoes,
            { merge: true }
        )

        setTamanhoFonteRodape(configuracoes.tamanhoFonteRodape)
        setTamanhoFonteSlogan(configuracoes.tamanhoFonteSlogan)
        setTamanhoFonteDataHora(configuracoes.tamanhoFonteDataHora)
        setTamanhoFonteHora(configuracoes.tamanhoFonteHora)
        setTamanhoIconeRodape(configuracoes.tamanhoIconeRodape)
        setAlturaBarraSuperior(configuracoes.alturaBarraSuperior)
        setAlturaBarraNoticias(configuracoes.alturaBarraNoticias)
        setTamanhoLogoRodape(configuracoes.tamanhoLogoRodape)

        alert("Configurações salvas!")
    }

    async function adicionarMidia() {
        if (arquivo.trim() === "") return

        await addDoc(collection(db, "midias"), {
            tipo,
            arquivo: arquivo.trim(),
            ativo: true,
            ordem: midias.length + 1,
            duracao: 8,
            template,
            criadoEm: serverTimestamp()
        })

        setArquivo("")
        setTipo("imagem")
        setTemplate("cheio")
        carregarMidias()
    }

    async function adicionarNoticia() {
        if (novaNoticia.trim() === "") return

        await addDoc(collection(db, "noticias"), {
            texto: novaNoticia.trim(),
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

    const midiasAtivas = midias
        .filter((midia) => midia.ativo)
        .sort((a, b) => a.ordem - b.ordem)

    const noticiasAtivas = noticias
        .filter((noticia) => noticia.ativo)
        .sort((a, b) => a.ordem - b.ordem)

    const midiaPreview = midiasAtivas[indicePreview]

    useEffect(() => {
        if (midiasAtivas.length === 0) return

        const midiaAtual = midiasAtivas[indicePreview]

        if (!midiaAtual) {
            setIndicePreview(0)
            return
        }

        if (midiaAtual.tipo !== "imagem") return

        const intervalo = setInterval(() => {
            setIndicePreview((indiceAtual) => {
                const proximoIndice = indiceAtual + 1

                if (proximoIndice >= midiasAtivas.length) {
                    return 0
                }

                return proximoIndice
            })
        }, midiaAtual.duracao * 1000)

        return () => clearInterval(intervalo)
    }, [midiasAtivas.length, indicePreview])

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

            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setAbaAtiva("configuracoes")}
                    className={`px-5 py-3 rounded-xl font-bold transition ${abaAtiva === "configuracoes"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    Configurações
                </button>

                <button
                    onClick={() => setAbaAtiva("previa")}
                    className={`px-5 py-3 rounded-xl font-bold transition ${abaAtiva === "previa"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    Prévia da TV
                </button>

                <button
                    onClick={() => setAbaAtiva("midias")}
                    className={`px-5 py-3 rounded-xl font-bold transition ${abaAtiva === "midias"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    Mídias
                </button>

                <button
                    onClick={() => setAbaAtiva("noticias")}
                    className={`px-5 py-3 rounded-xl font-bold transition ${abaAtiva === "noticias"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                >
                    Notícias
                </button>
            </div>

            {abaAtiva === "configuracoes" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Configurações do painel
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <input
                            type="text"
                            placeholder="Caminho da logo"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Slogan do rodapé"
                            value={slogan}
                            onChange={(e) => setSlogan(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none md:col-span-2"
                        />

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Fonte das notícias
                            </label>

                            <input
                                type="number"
                                min="12"
                                max="80"
                                value={tamanhoFonteRodape}
                                onChange={(e) =>
                                    setTamanhoFonteRodape(
                                        limitarValor(Number(e.target.value), 12, 80, 28)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Fonte do slogan
                            </label>

                            <input
                                type="number"
                                min="12"
                                max="80"
                                value={tamanhoFonteSlogan}
                                onChange={(e) =>
                                    setTamanhoFonteSlogan(
                                        limitarValor(Number(e.target.value), 12, 80, 18)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Fonte da data
                            </label>

                            <input
                                type="number"
                                min="12"
                                max="80"
                                value={tamanhoFonteDataHora}
                                onChange={(e) =>
                                    setTamanhoFonteDataHora(
                                        limitarValor(Number(e.target.value), 12, 80, 18)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Fonte da hora
                            </label>

                            <input
                                type="number"
                                min="12"
                                max="80"
                                value={tamanhoFonteHora}
                                onChange={(e) =>
                                    setTamanhoFonteHora(
                                        limitarValor(Number(e.target.value), 12, 80, 24)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Tamanho dos ícones
                            </label>

                            <input
                                type="number"
                                min="12"
                                max="80"
                                value={tamanhoIconeRodape}
                                onChange={(e) =>
                                    setTamanhoIconeRodape(
                                        limitarValor(Number(e.target.value), 12, 80, 22)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Altura da barra superior
                            </label>

                            <input
                                type="number"
                                min="40"
                                max="120"
                                value={alturaBarraSuperior}
                                onChange={(e) =>
                                    setAlturaBarraSuperior(
                                        limitarValor(Number(e.target.value), 40, 120, 64)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Altura da barra de notícias
                            </label>

                            <input
                                type="number"
                                min="30"
                                max="100"
                                value={alturaBarraNoticias}
                                onChange={(e) =>
                                    setAlturaBarraNoticias(
                                        limitarValor(Number(e.target.value), 30, 100, 44)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                            <label className="block text-xs font-semibold text-zinc-400 mb-2">
                                Tamanho da logo no rodapé
                            </label>

                            <input
                                type="number"
                                min="20"
                                max="100"
                                value={tamanhoLogoRodape}
                                onChange={(e) =>
                                    setTamanhoLogoRodape(
                                        limitarValor(Number(e.target.value), 20, 100, 44)
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                        <p className="text-sm text-zinc-400 mb-4">
                            Pré-visualização do rodapé
                        </p>

                        <div className="rounded-2xl overflow-hidden border border-zinc-800">
                            <div
                                className="bg-[#0f2f70] border-t-4 border-[#f15434] flex items-center px-8 gap-6"
                                style={{ height: `${alturaBarraSuperior}px` }}
                            >
                                <span
                                    className="font-semibold"
                                    style={{ fontSize: `${tamanhoFonteDataHora}px` }}
                                >
                                    26 de maio de 2026
                                </span>

                                <div className="h-8 w-px bg-white/25" />

                                <span
                                    className="font-black"
                                    style={{ fontSize: `${tamanhoFonteHora}px` }}
                                >
                                    14:30
                                </span>

                                <div className="h-8 w-px bg-white/25" />

                                <p
                                    className="font-medium text-white/90 tracking-wide flex-1"
                                    style={{ fontSize: `${tamanhoFonteSlogan}px` }}
                                >
                                    {slogan || "Slogan do rodapé"}
                                </p>

                                <div className="h-8 w-px bg-white/25" />

                                <img
                                    src={logo || "/logos/logo.png"}
                                    alt="Prévia da logo"
                                    className="w-auto object-contain drop-shadow-md"
                                    style={{ height: `${tamanhoLogoRodape}px` }}
                                />
                            </div>

                            <div
                                className="bg-[#2454a4] flex items-center overflow-hidden px-6"
                                style={{ height: `${alturaBarraNoticias}px` }}
                            >
                                <p
                                    className="font-medium whitespace-nowrap"
                                    style={{ fontSize: `${tamanhoFonteRodape}px` }}
                                >
                                    {noticiasAtivas.length > 0
                                        ? noticiasAtivas.map((noticia) => noticia.texto).join("   •   ")
                                        : "Prévia das notícias do rodapé"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={salvarConfiguracoes}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
                    >
                        Salvar configurações
                    </button>
                </div>
            )}

            {abaAtiva === "previa" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Prévia da TV
                    </h2>

                    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-700">
                        {midiaPreview && midiaPreview.tipo === "imagem" && (
                            <img
                                src={midiaPreview.arquivo}
                                alt="Prévia do banner"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        {midiaPreview && midiaPreview.tipo === "video" && (
                            <video
                                src={midiaPreview.arquivo}
                                muted
                                controls
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent" />

                        <div className="absolute top-5 left-6 flex items-center gap-4">
                            <img
                                src={logo || "/logos/logo.png"}
                                alt="Logo"
                                className="w-14 h-14 object-contain"
                            />

                            <div>
                                <h3 className="text-2xl font-black tracking-wider leading-none">
                                    {nomePainel || "ADUSEPS"}
                                </h3>

                                <p className="text-xs text-zinc-300 mt-1">
                                    {subtitulo || "Painel Institucional"}
                                </p>
                            </div>
                        </div>

                        <div
                            className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden"
                        >
                            <div
                                className="bg-[#0f2f70] border-t-4 border-[#f15434] flex items-center px-8 gap-6"
                                style={{ height: `${alturaBarraSuperior}px` }}
                            >
                                <span
                                    className="font-semibold"
                                    style={{ fontSize: `${tamanhoFonteDataHora}px` }}
                                >
                                    26 de maio de 2026
                                </span>

                                <div className="h-8 w-px bg-white/25" />

                                <span
                                    className="font-black"
                                    style={{ fontSize: `${tamanhoFonteHora}px` }}
                                >
                                    14:30
                                </span>

                                <div className="h-8 w-px bg-white/25" />

                                <p
                                    className="font-medium text-white/90 tracking-wide flex-1"
                                    style={{ fontSize: `${tamanhoFonteSlogan}px` }}
                                >
                                    {slogan || "Slogan do rodapé"}
                                </p>

                                <div className="h-8 w-px bg-white/25" />

                                <img
                                    src={logo || "/logos/logo.png"}
                                    alt="Logo ADUSEPS"
                                    className="w-auto object-contain drop-shadow-md"
                                    style={{ height: `${tamanhoLogoRodape}px` }}
                                />
                            </div>

                            <div
                                className="bg-[#2454a4] flex items-center overflow-hidden px-6"
                                style={{ height: `${alturaBarraNoticias}px` }}
                            >
                                <p
                                    className="font-medium whitespace-nowrap"
                                    style={{ fontSize: `${tamanhoFonteRodape}px` }}
                                >
                                    {noticiasAtivas.length > 0
                                        ? noticiasAtivas.map((noticia) => noticia.texto).join("   •   ")
                                        : "Prévia das notícias do rodapé"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {abaAtiva === "midias" && (
                <>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">
                            Adicionar mídia
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                            <select
                                value={template}
                                onChange={(e) =>
                                    setTemplate(e.target.value as "cheio" | "informativo")
                                }
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            >
                                <option value="cheio">Banner cheio</option>
                                <option value="informativo">Informativo</option>
                            </select>

                            <button
                                onClick={adicionarMidia}
                                className="bg-blue-600 hover:bg-blue-700 transition rounded-xl font-bold"
                            >
                                Adicionar mídia
                            </button>
                        </div>
                    </div>

                    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
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
                                            className={`w-3 h-3 rounded-full ${midia.ativo ? "bg-green-500" : "bg-red-500"
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

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
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

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
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
                                            midia.id && alternarMidia(midia.id, midia.ativo)
                                        }
                                        className={`mt-3 ml-3 px-4 py-2 rounded-lg text-sm font-bold ${midia.ativo
                                                ? "bg-yellow-600 hover:bg-yellow-700"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {midia.ativo ? "Desativar" : "Ativar"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {abaAtiva === "noticias" && (
                <>
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

                    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
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
                                            className={`w-3 h-3 rounded-full ${noticia.ativo ? "bg-green-500" : "bg-red-500"
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

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
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
                                        onClick={() => noticia.id && removerNoticia(noticia.id)}
                                        className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                                    >
                                        Excluir
                                    </button>

                                    <button
                                        onClick={() =>
                                            noticia.id && alternarNoticia(noticia.id, noticia.ativo)
                                        }
                                        className={`mt-3 ml-3 px-4 py-2 rounded-lg text-sm font-bold ${noticia.ativo
                                                ? "bg-yellow-600 hover:bg-yellow-700"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {noticia.ativo ? "Desativar" : "Ativar"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    )
}