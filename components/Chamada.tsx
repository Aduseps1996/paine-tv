type Props = {
  mostrar: boolean
  nome: string
  matricula: string
  guiche: string
}

export default function Chamada({
  mostrar,
  nome,
  matricula,
  guiche
}: Props) {

  if (!mostrar) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">

      <div className="bg-blue-800/95 border-4 border-white px-24 py-16 rounded-3xl shadow-2xl text-center animate-pulse">

        <p className="text-4xl mb-6 uppercase tracking-widest">
          Chamando atendimento
        </p>

        <h1 className="text-8xl font-bold">
          {nome}
        </h1>

        <p className="text-4xl mt-4">
          {matricula}
        </p>

        <p className="text-4xl mt-4">
          {guiche}
        </p>

      </div>

    </div>
  )
}