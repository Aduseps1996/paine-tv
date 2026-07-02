export type CidadeEncontrada = {
  nome: string
  estado: string
  pais: string
  latitude: number
  longitude: number
  timezone: string
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

  const dados = await resposta.json()

  if (!dados.results) {
    return []
  }

  return dados.results.map((cidade: any) => ({
    nome: cidade.name,
    estado: cidade.admin1 ?? "",
    pais: cidade.country ?? "",
    latitude: cidade.latitude,
    longitude: cidade.longitude,
    timezone: cidade.timezone
  }))
}