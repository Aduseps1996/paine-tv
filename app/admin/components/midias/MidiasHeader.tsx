import { Eye, Plus } from "lucide-react"

import { AdminButton, AdminPageHeader } from "../AdminUI"

type Props = {
    onNovaMidia: () => void
    onRevisar: () => void
}

export default function MidiasHeader({
    onNovaMidia,
    onRevisar
}: Props) {
    return (
        <AdminPageHeader
            titulo="Mídias"
            descricao="Gerencie tudo o que aparece na programação da TV."
            acoes={(
                <>
                    <AdminButton onClick={onNovaMidia}>
                        <span className="inline-flex items-center gap-2">
                            <Plus size={18} />
                            Nova mídia
                        </span>
                    </AdminButton>

                    <AdminButton
                        variante="secundario"
                        onClick={onRevisar}
                    >
                        <span className="inline-flex items-center gap-2 text-[#0d6efd]">
                            <Eye size={18} />
                            Revisar na Prévia
                        </span>
                    </AdminButton>
                </>
            )}
        />
    )
}
