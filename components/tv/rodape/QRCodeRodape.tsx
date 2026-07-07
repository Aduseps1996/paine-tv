"use client"

type QRCodeRodapeProps = {
    qrcode?: string
}

export default function QRCodeRodape({ qrcode }: QRCodeRodapeProps) {
    if (!qrcode || qrcode.trim() === "") {
        return null
    }

    return (
        <div className="rounded-xl bg-white p-2 shadow-xl">
            <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(qrcode)}`}
                alt="QR Code"
                className="h-32 w-32"
            />
        </div>
    )
}
