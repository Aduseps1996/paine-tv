"use client"

import { useEffect, useState } from "react"

export function useOnlineStatus() {
    const [online, setOnline] = useState(() => {
        if (typeof navigator === "undefined") return true
        return navigator.onLine
    })

    useEffect(() => {
        function ficouOnline() {
            setOnline(true)
        }

        function ficouOffline() {
            setOnline(false)
        }

        window.addEventListener("online", ficouOnline)
        window.addEventListener("offline", ficouOffline)

        return () => {
            window.removeEventListener("online", ficouOnline)
            window.removeEventListener("offline", ficouOffline)
        }
    }, [])

    return online
}
