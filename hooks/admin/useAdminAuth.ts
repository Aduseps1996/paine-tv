"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"

import { auth } from "@/lib/firebase"

export function useAdminAuth() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [logado, setLogado] = useState(false)
    const [authVerificada, setAuthVerificada] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            setLogado(!!usuario)
            setAuthVerificada(true)
        })

        return () => unsubscribe()
    }, [])

    async function entrar() {
        await signInWithEmailAndPassword(
            auth,
            email.trim(),
            senha.trim()
        )
    }

    async function sair() {
        await signOut(auth)
    }

    return {
        email,
        senha,
        logado,
        authVerificada,
        setEmail,
        setSenha,
        entrar,
        sair
    }
}
