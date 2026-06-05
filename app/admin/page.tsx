"use client"

import { useEffect, useState } from "react"

import AdminLayout from "./components/AdminLayout"

import AbaInicio from "./components/AbaInicio"
import AbaMidias from "./components/AbaMidias"
import AbaNoticias from "./components/AbaNoticias"
import AbaConfiguracaoPainel from "./components/AbaConfiguracaoPainel"
import AbaConfiguracaoTipografia from "./components/AbaConfiguracaoTipografia"

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

// Tipos usados para modelar os dados de mídia e notícias no painel.
type Midia = {
    id?: string
    tipo: "imagem" | "video" | "youtube"
    arquivo: string
    ativo: boolean
    ordem: number
    duracao: number
    template?: "cheio" | "informativo" | "institucional" | "urgente"
    titulo?: string
    subtitulo?: string
    rodape?: string
    qrcode?: string
    categoria?: string
    cta?: string
}

type Noticia = {
    id?: string
    texto: string
    ativo: boolean
    ordem: number
}

// Função auxiliar para manter valores numéricos dentro de limites seguros.
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

// Componente principal do painel administrativo.
// Controla estado, autenticação e renderiza as abas de configuração, mídia e notícias.
export default function AdminPage() {
    // estado dos dados carregados do Firebase
    const [midias, setMidias] = useState<Midia[]>([])
    const [noticias, setNoticias] = useState<Noticia[]>([])

    // campos específicos para template institucional de mídia
    const [tituloMidia, setTituloMidia] = useState("")
    const [subtituloMidia, setSubtituloMidia] = useState("")
    const [rodapeMidia, setRodapeMidia] = useState("")
    const [qrcodeMidia, setQrcodeMidia] = useState("")
    const [categoriaMidia, setCategoriaMidia] = useState("")
    const [ctaMidia, setCtaMidia] = useState("")

    const [mostrarTarjaMidia, setMostrarTarjaMidia] = useState(false)
    const [tarjaEtiquetaMidia, setTarjaEtiquetaMidia] = useState("ADUSEPS INFORMA")
    const [tarjaTituloMidia, setTarjaTituloMidia] = useState("")
    const [tarjaSubtituloMidia, setTarjaSubtituloMidia] = useState("")
    const [tempoEntradaTarjaMidia, setTempoEntradaTarjaMidia] = useState(1)
    const [tempoVisivelTarjaMidia, setTempoVisivelTarjaMidia] = useState(8)
    const [tempoSaidaTarjaMidia, setTempoSaidaTarjaMidia] = useState(1)
    const [tempoInicialTarjaMidia, setTempoInicialTarjaMidia] = useState(1)
    const [tarjaQrcodeMidia, setTarjaQrcodeMidia] = useState("")

    // campos do formulário para adicionar nova mídia e notícia
    const [arquivo, setArquivo] = useState("")
    const [tipo, setTipo] = useState<"imagem" | "video" | "youtube">("imagem")
    const [template, setTemplate] = useState<
        "cheio" | "informativo" | "institucional" | "urgente"
    >("cheio")
    const [novaNoticia, setNovaNoticia] = useState("")
    const [modeloTarjaMidia, setModeloTarjaMidia] =
        useState<"telejornal" | "compacta" | "live" | "infobar" | "digital">("telejornal")

    // estado de autenticação do usuário
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [logado, setLogado] = useState(false)

    // configurações do painel institucional exibidas na prévia
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
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(10)

    // configurações de fallback e tarja de TV
    const [mostrarTarjaTv, setMostrarTarjaTv] = useState(true)
    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(1)
    const [tempoOcultaTarjaMidia, setTempoOcultaTarjaMidia] = useState(10)

    // controle de navegação entre abas e índice da pré-visualização
    const [indicePreview, setIndicePreview] = useState(0)
    const [abaAtiva, setAbaAtiva] = useState<
        "inicio" | "midias" | "noticias" | "configuracao-painel" | "configuracao-tipografia"
    >("inicio")

    const [programarExibicaoNovaMidia, setProgramarExibicaoNovaMidia] = useState(false)
    const [inicioExibicaoNovaMidia, setInicioExibicaoNovaMidia] = useState("")
    const [fimExibicaoNovaMidia, setFimExibicaoNovaMidia] = useState("")

    // Funções de carregamento de dados do Firebase
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

    // Carrega as notícias do Firebase e atualiza o estado local
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

    // Carrega as configurações gerais do painel e normaliza os valores numéricos
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

            setMostrarTarjaTv(dados.mostrarTarjaTv ?? true)
            setTempoEntradaTarja(Number(dados.tempoEntradaTarja || 1))
            setTempoVisivelTarja(Number(dados.tempoVisivelTarja || 8))
            setTempoSaidaTarja(Number(dados.tempoSaidaTarja || 1))
            setTempoOcultaTarja(Number(dados.tempoOcultaTarja || 10))

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

    // Salva as configurações do painel no Firebase e atualiza o estado local
    async function salvarConfiguracoes() {
        const configuracoes = {
            nomePainel,
            subtitulo,
            logo,
            slogan,

            mostrarTarjaTv,
            tempoEntradaTarja,
            tempoVisivelTarja,
            tempoSaidaTarja,
            tempoOcultaTarja,

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

    // Adiciona uma mídia nova à coleção e limpa o formulário
    async function adicionarMidia() {
        if (arquivo.trim() === "") return

        if (tipo === "youtube") {
    if (!inicioExibicaoNovaMidia || !fimExibicaoNovaMidia) {
        alert("Informe a data/hora de início e fim da transmissão.")
        return
    }

    const inicio = new Date(inicioExibicaoNovaMidia)
    const fim = new Date(fimExibicaoNovaMidia)

    if (fim <= inicio) {
        alert("O fim da transmissão deve ser maior que o início.")
        return
    }
}

if (tipo !== "youtube" && programarExibicaoNovaMidia) {
    if (!inicioExibicaoNovaMidia || !fimExibicaoNovaMidia) {
        alert("Informe a data/hora de início e fim da exibição.")
        return
    }

    const inicio = new Date(inicioExibicaoNovaMidia)
    const fim = new Date(fimExibicaoNovaMidia)

    if (fim <= inicio) {
        alert("O fim da exibição deve ser maior que o início.")
        return
    }
}

        await addDoc(collection(db, "midias"), {
            tipo,
            arquivo: arquivo.trim(),
            ativo: true,
            ordem: midias.length + 1,
            duracao: 8,
            template,

            titulo: tituloMidia.trim(),
            subtitulo: subtituloMidia.trim(),
            rodape: rodapeMidia.trim(),
            qrcode: qrcodeMidia.trim(),
            categoria: categoriaMidia.trim(),
            cta: ctaMidia.trim(),

            tarjaEtiqueta: tarjaEtiquetaMidia.trim(),
            tarjaTitulo: tarjaTituloMidia.trim(),
            tarjaSubtitulo: tarjaSubtituloMidia.trim(),
            tempoEntradaTarja: tempoEntradaTarjaMidia,
            tempoVisivelTarja: tempoVisivelTarjaMidia,
            tempoSaidaTarja: tempoSaidaTarjaMidia,
            tempoOcultaTarja: tempoOcultaTarjaMidia,
            tempoInicialTarja: tempoInicialTarjaMidia,
            modeloTarja: modeloTarjaMidia,

            exibicaoProgramada: tipo === "youtube" ? true : programarExibicaoNovaMidia,
            tipoExibicaoProgramada: tipo === "youtube" ? "youtube" : "midia",
            inicioExibicao: inicioExibicaoNovaMidia,
            fimExibicao: fimExibicaoNovaMidia,
            linkYoutubeExibicao: tipo === "youtube" ? arquivo.trim() : "",

            mostrarTarja: false,
            pesoExibicao: 1,

            criadoEm: serverTimestamp()
        })

        setArquivo("")
        setTipo("imagem")
        setTemplate("cheio")

        setTituloMidia("")
        setSubtituloMidia("")
        setRodapeMidia("")
        setQrcodeMidia("")
        setCtaMidia("")
        setCategoriaMidia("")

        setMostrarTarjaMidia(false)
        setTarjaEtiquetaMidia("ADUSEPS INFORMA")
        setTarjaTituloMidia("")
        setTarjaSubtituloMidia("")
        setTempoEntradaTarjaMidia(1)
        setTempoVisivelTarjaMidia(8)
        setTempoSaidaTarjaMidia(1)
        setTempoInicialTarjaMidia(1)
        setTempoOcultaTarjaMidia(10)
        setModeloTarjaMidia("telejornal")

        setProgramarExibicaoNovaMidia(false)
        setInicioExibicaoNovaMidia("")
        setFimExibicaoNovaMidia("")
        setMostrarTarjaMidia(false)


        carregarMidias()
    }

    // Adiciona uma notícia ao rodapé e atualiza a lista local
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

    // Funções de exclusão e alternância de status de mídia e notícia
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

    // Efeito inicial: carrega mídias, notícias e configurações ao montar o componente
    useEffect(() => {
        carregarMidias()
        carregarNoticias()
        carregarConfiguracoes()
    }, [])

    // Observa mudanças de autenticação para atualizar o estado de login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            setLogado(!!usuario)
        })

        return () => unsubscribe()
    }, [])

    // Dados derivados usados para pré-visualizar apenas itens ativos
    const midiasAtivas = midias
        .filter((midia) => midia.ativo)
        .sort((a, b) => a.ordem - b.ordem)

    const noticiasAtivas = noticias
        .filter((noticia) => noticia.ativo)
        .sort((a, b) => a.ordem - b.ordem)

    const activeIds = midiasAtivas.map((midia) => midia.id).join(",")
    const midiaPreview = midiasAtivas[indicePreview]

    useEffect(() => {
        if (midiasAtivas.length === 0) {
            setIndicePreview(0)
            return
        }

        if (indicePreview >= midiasAtivas.length) {
            setIndicePreview(0)
        }
    }, [activeIds, indicePreview, midiasAtivas.length])

    // Efeito que alterna a pré-visualização de imagens automaticamente
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
    }, [activeIds, indicePreview])

    // Se o usuário não estiver logado, mostra o formulário de login
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

    // Interface do painel administrativo após login
    return (
        <AdminLayout
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            sair={() => signOut(auth)}
        >

            {abaAtiva === "configuracao-painel" && (
                <AbaConfiguracaoPainel
                    nomePainel={nomePainel}
                    subtitulo={subtitulo}
                    logo={logo}
                    slogan={slogan}

                    mostrarTarjaTv={mostrarTarjaTv}
                    tempoEntradaTarja={tempoEntradaTarja}
                    tempoVisivelTarja={tempoVisivelTarja}
                    tempoSaidaTarja={tempoSaidaTarja}

                    setMostrarTarjaTv={setMostrarTarjaTv}
                    setTempoEntradaTarja={setTempoEntradaTarja}
                    setTempoVisivelTarja={setTempoVisivelTarja}
                    setTempoSaidaTarja={setTempoSaidaTarja}
                    tempoOcultaTarja={tempoOcultaTarja}
                    setTempoOcultaTarja={setTempoOcultaTarja}

                    setNomePainel={setNomePainel}
                    setSubtitulo={setSubtitulo}
                    setLogo={setLogo}
                    setSlogan={setSlogan}

                    salvarConfiguracoes={salvarConfiguracoes}
                />
            )}

            {abaAtiva === "configuracao-tipografia" && (
                <AbaConfiguracaoTipografia
                    tamanhoFonteRodape={tamanhoFonteRodape}
                    tamanhoFonteSlogan={tamanhoFonteSlogan}
                    tamanhoIconeRodape={tamanhoIconeRodape}
                    tamanhoFonteDataHora={tamanhoFonteDataHora}
                    tamanhoFonteHora={tamanhoFonteHora}
                    tamanhoLogoRodape={tamanhoLogoRodape}
                    alturaBarraSuperior={alturaBarraSuperior}
                    alturaBarraNoticias={alturaBarraNoticias}
                    setTamanhoIconeRodape={setTamanhoIconeRodape}

                    setTamanhoFonteSlogan={setTamanhoFonteSlogan}
                    setTamanhoFonteRodape={setTamanhoFonteRodape}
                    setTamanhoFonteDataHora={setTamanhoFonteDataHora}
                    setTamanhoFonteHora={setTamanhoFonteHora}
                    setTamanhoLogoRodape={setTamanhoLogoRodape}
                    setAlturaBarraSuperior={setAlturaBarraSuperior}
                    setAlturaBarraNoticias={setAlturaBarraNoticias}

                    salvarConfiguracoes={salvarConfiguracoes}
                />
            )}

            {abaAtiva === "inicio" && (
                <AbaInicio
                    midiaPreview={midiaPreview}
                    logo={logo}
                    nomePainel={nomePainel}
                    subtitulo={subtitulo}
                    slogan={slogan}
                    tamanhoFonteDataHora={tamanhoFonteDataHora}
                    tamanhoFonteHora={tamanhoFonteHora}
                    tamanhoFonteSlogan={tamanhoFonteSlogan}
                    tamanhoLogoRodape={tamanhoLogoRodape}
                    tamanhoFonteRodape={tamanhoFonteRodape}
                    alturaBarraSuperior={alturaBarraSuperior}
                    alturaBarraNoticias={alturaBarraNoticias}
                    noticiasAtivas={noticiasAtivas}
                />
            )}

            {abaAtiva === "midias" && (
                <AbaMidias
                    midias={midias}
                    arquivo={arquivo}
                    tipo={tipo}
                    template={template}
                    tituloMidia={tituloMidia}
                    subtituloMidia={subtituloMidia}
                    rodapeMidia={rodapeMidia}
                    qrcodeMidia={qrcodeMidia}
                    categoriaMidia={categoriaMidia}
                    ctaMidia={ctaMidia}
                    setArquivo={setArquivo}
                    setTipo={setTipo}
                    setTemplate={setTemplate}
                    setTituloMidia={setTituloMidia}
                    setSubtituloMidia={setSubtituloMidia}
                    setRodapeMidia={setRodapeMidia}
                    setQrcodeMidia={setQrcodeMidia}
                    setCategoriaMidia={setCategoriaMidia}
                    setCtaMidia={setCtaMidia}
                    adicionarMidia={adicionarMidia}
                    removerMidia={removerMidia}
                    alternarMidia={alternarMidia}
                    carregarMidias={carregarMidias}
                    db={db}

                    programarExibicaoNovaMidia={programarExibicaoNovaMidia}
                    setProgramarExibicaoNovaMidia={setProgramarExibicaoNovaMidia}
                    inicioExibicaoNovaMidia={inicioExibicaoNovaMidia}
                    setInicioExibicaoNovaMidia={setInicioExibicaoNovaMidia}
                    fimExibicaoNovaMidia={fimExibicaoNovaMidia}
                    setFimExibicaoNovaMidia={setFimExibicaoNovaMidia}


                    mostrarTarjaMidia={mostrarTarjaMidia}
                    tarjaEtiquetaMidia={tarjaEtiquetaMidia}
                    tarjaTituloMidia={tarjaTituloMidia}
                    tarjaSubtituloMidia={tarjaSubtituloMidia}
                    tempoEntradaTarjaMidia={tempoEntradaTarjaMidia}
                    tempoVisivelTarjaMidia={tempoVisivelTarjaMidia}
                    tempoSaidaTarjaMidia={tempoSaidaTarjaMidia}
                    tempoOcultaTarjaMidia={tempoOcultaTarjaMidia}
                    setTempoOcultaTarjaMidia={setTempoOcultaTarjaMidia}
                    tempoInicialTarjaMidia={tempoInicialTarjaMidia}
                    setTempoInicialTarjaMidia={setTempoInicialTarjaMidia}
                    modeloTarjaMidia={modeloTarjaMidia}
                    setModeloTarjaMidia={setModeloTarjaMidia}
                    tarjaQrcodeMidia={tarjaQrcodeMidia}
                    setTarjaQrcodeMidia={setTarjaQrcodeMidia}

                    setMostrarTarjaMidia={setMostrarTarjaMidia}
                    setTarjaEtiquetaMidia={setTarjaEtiquetaMidia}
                    setTarjaTituloMidia={setTarjaTituloMidia}
                    setTarjaSubtituloMidia={setTarjaSubtituloMidia}
                    setTempoEntradaTarjaMidia={setTempoEntradaTarjaMidia}
                    setTempoVisivelTarjaMidia={setTempoVisivelTarjaMidia}
                    setTempoSaidaTarjaMidia={setTempoSaidaTarjaMidia}
                />
            )}

            {abaAtiva === "noticias" && (
                <AbaNoticias
                    noticias={noticias}
                    novaNoticia={novaNoticia}
                    setNovaNoticia={setNovaNoticia}
                    adicionarNoticia={adicionarNoticia}
                    removerNoticia={removerNoticia}
                    alternarNoticia={alternarNoticia}
                    carregarNoticias={carregarNoticias}
                    db={db}
                />
            )}
        </AdminLayout>
    )
}