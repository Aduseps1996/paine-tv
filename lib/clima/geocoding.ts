export type CidadeEncontrada = {
  nome: string
  estado: string
  pais: string
  latitude: number
  longitude: number
  timezone: string
}

type ResultadoGeocoding = {
  name: string
  admin1?: string
  country?: string
  latitude: number
  longitude: number
  timezone: string
}

type RespostaGeocoding = {
  results?: ResultadoGeocoding[]
}

export async function buscarCidades(nome: string): Promise<CidadeEncontrada[]> {
  if (!nome.trim()) return []

  const resposta = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      nome
    )}&count=8&language=pt&format=json`
  )

  if (!resposta.ok) {
    throw new Error("Erro ao buscar cidade.")
  }

  const dados = (await resposta.json()) as RespostaGeocoding

  if (!dados.results) {
    return []
  }

  return dados.results.map((cidade) => ({
    nome: cidade.name,
    estado: cidade.admin1 ?? "",
    pais: cidade.country ?? "",
    latitude: cidade.latitude,
    longitude: cidade.longitude,
    timezone: cidade.timezone
  }))
}
