export function limitarValor(
    valor: number,
    minimo: number,
    maximo: number,
    padrao: number
) {
    if (Number.isNaN(valor)) return padrao
    if (valor < minimo) return minimo
    if (valor > maximo) return maximo
    return valor
}
