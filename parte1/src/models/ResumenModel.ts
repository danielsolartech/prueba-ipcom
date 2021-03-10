import Axios from "axios";
import { DateTime } from "luxon";
import { IClientBuy } from "../types/IClientBuy";
import { IResponse } from "../types/IResponse";

export class ResumenModel {
    // Esta variable nos servirá como caché temporal.
    private data: { [key: string]: IResponse };

    constructor() {
        this.data = {};
    }

    /**
     * Con esta función aplicaremos al formato obtenido por una respuesta del API de `apirecruit`
     * uno nuevo en forma de resumen de todos los datos, ya que esta respuesta es un arreglo de compradores
     * o potenciales compradores y esto nos ayudará a saber cuántas personas no compraron, cuánto dinero gastaron y
     * cuáles son los medios de pago más usados por los compradores; igualmente, sabremos el valor de la compra
     * más alta registrada en la tienda.
     *
     * @private
     * @function
     * @param { IClientBuy[] } data Datos de la respuesta del API de `apirecruit`
     * @returns { IResponse }
     */
    private formatData(data: IClientBuy[]): IResponse {
        let total: number = 0;
        let comprasPorTDC: { [key: string]: number } = {};
        let noCompraron: number = 0;
        let compraMasAlta: number = 0;

        // Recorremos la información de los compradores.
        for (const client of data) {
            // Si el cliente no compró nada entonces lo añadimos al conteo de clientes que no compraron algo.
            if (!client.compro) {
                noCompraron++;
            } else {
                // Sumamos el monto de la compra al total actual.
                total += client.monto;

                // Comprobamos si al compra más alta es menor al monto de la compra actual, si lo es lo asigamos como
                // la nueva compra más alta del día.
                if (compraMasAlta < client.monto) {
                    compraMasAlta = client.monto;
                }

                // Si no existe una compra por tdc del producto en nuestro diccionario, creamos uno con un valor de 0.
                if (!comprasPorTDC[client.tdc]) {
                    comprasPorTDC[client.tdc] = 1;
                }
                // Le añadimos uno a la compra por tdc del producto si el producto ya estaba clasificado.
                else {
                    comprasPorTDC[client.tdc]++;
                }
            }
        }

        // Devolvemos la respuesta.
        return {
            total,
            comprasPorTDC,
            noCompraron,
            compraMasAlta,
        };
    }

    /**
     * Con esta función obtendrás un resumen de las compras hechas en una fecha específica.
     *
     * # Ejemplo:
     * ```ts
     * const consulta: IResponse = await model.getByDate(2019, 12, 1);
     * ```
     * Con esta línea estaremos solicitando un resumen del 1 de Diciembre de 2019.
     *
     * @public
     * @function
     * @param { number } year Año a consultar
     * @param { number } month Mes a consultar
     * @param { number } day Día a consultar
     * @returns { Promise<IResponse> }
     */
    public async getByDate(year: number, month: number, day: number): Promise<IResponse> {
        // Le damos el formato adecuado a la fecha.
        const date: string = DateTime.fromObject({ year, month, day }).toISODate();

        // Obtenemos la información desde la variable del caché temporal.
        const cache = this.data[date];

        // Si existe información en el caché con esa fecha entonces devolvemos la información.
        if (cache) return cache;

        // Si no hay información en el caché la obtenemos desde el API.
        const data: IClientBuy[] = (await Axios.get<IClientBuy[]>(`https://apirecruit-gjvkhl2c6a-uc.a.run.app/compras/${date}`)).data;

        // Le damos el formato de respuesta a la información obtenida desde el API.
        const response: IResponse = this.formatData(data);

        // Agregamos la respuesta a la variable de caché temporal.
        this.data[date] = response;

        // Devolvemos la respuesta.
        return response;
    }

    /**
     * Con esta función obtendrás un resumen de las compras hechas en una fecha específica y contando `x`
     * cantidad de días siguientes.
     * 
     * # Ejemplo:
     * ```ts
     * const consulta: IResponse = await model.getByDay({ year: 2019, month: 12, day: 1 }, 5);
     * ```
     * Con esta línea estaremos solicitando un resumen del 1 de Diciembre de 2019 hasta el 5 de Diciembre de 2019.
     *
     * @public
     * @function
     * @param { { year: number, month: number, day: number } } param0 
     * @param { number } days 
     * @returns { Promise<IResponse> }
     */
    public getByDay({ year, month, day }: { year: number, month: number, day: number}, days: number): Promise<IResponse> {
        // Si la cantidad de días a tomar es menor a cero devolvemos un error.
        if (days <= 0) {
            return new Promise((_, reject) => reject(new Error(`Cannot get ${days} days.`)));
        }

        let responses: Promise<IResponse>[] = [];
        for (let i = 0; i < days; i++) {
            // Obtenemos la fecha usando Luxo.
            let date: DateTime = DateTime.fromObject({ year, month, day });

            // Si el valor actual de i no es igual a 0 entonces añadimos los días correspondientes a la fecha inicial.
            if (i != 0) {
                date = date.plus({ days: i })
            }

            // Obtenemos el resumen del día y añadimos la promesa a nuestra lista de promesas.
            responses.push(this.getByDate(date.year, date.month, date.day));
        }

        return new Promise((resolve, reject) => {
            // Ejecutamos todas nuestras promesas de la lista, si alguna falla no podrá continuar con el resto.
            Promise.all(responses)
                .then((responses) => {
                    let total: number = 0;
                    let comprasPorTDC: { [key: string]: number } = {};
                    let noCompraron: number = 0;
                    let compraMasAlta: number = 0;

                    // Recorremos las respuestas para combinar los datos en una sola respuesta.
                    for (const response of responses) {
                        total += response.total;
                        noCompraron += response.noCompraron;

                        // Hacemos un array de [[clave, valor]] con las compras por TDC de la respuesta actual
                        // y lo recorremos para sumar los valores con los de las demás respuestas.
                        for (const [key, value] of Object.entries(response.comprasPorTDC)) {
                            if (!comprasPorTDC[key]) {
                                comprasPorTDC[key] = value;
                            } else {
                                comprasPorTDC[key] += value;
                            }
                        }

                        // Comprobamos si al compra más alta es menor a la compra más alta de la respuesta actual,
                        // si lo es lo asigamos como la nueva compra más alta del día.
                        if (compraMasAlta < response.compraMasAlta) {
                            compraMasAlta = response.compraMasAlta;
                        }
                    }

                    // Devolvemos la respuesta total a través de la promesa.
                    return resolve({
                        total,
                        comprasPorTDC,
                        noCompraron,
                        compraMasAlta,
                    });
                })
                .catch(reject);
        });
    }
}
