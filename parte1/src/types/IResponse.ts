export interface IResponse {
    total: number,
    comprasPorTDC: { [key: string]: number },
    noCompraron: number,
    compraMasAlta: number,
}
