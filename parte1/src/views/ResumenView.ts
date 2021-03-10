import { DateTime } from "luxon";
import { Request, Response } from "express";
import { ResumenModel } from "../models/ResumenModel";
import { IResponse } from "../types/IResponse";

export class ResumenView {
    constructor(private model: ResumenModel) {}

    /**
     * Esta función define lo que hará nuestra ruta `/resumen/:date` definida en
     * el controlador.
     *
     * @public
     * @function
     * @param { Request } request 
     * @param { Response } response
     * @returns { void }
     */
    public fromDate(request: Request, response: Response): void {
        const { year, month, day } = DateTime.fromISO(request.params.date);

        let data: Promise<IResponse>;

        // Comprobamos si existe el parámetro `dias` en la query de la consulta.
        if (request.query.dias) {
            const days: number = Number(request.query.dias);

            // Comprobamos que los días sean un número y mayor o igual a 1.
            if (isNaN(days) || days <= 0) {
                response.status(400).send(`Los días a obtener deben ser mayor o igual a 1. Usa \`/resumen/${year}-${month}-${day}\`.`);
                return;
            }

            data = this.model.getByDay({ year, month, day }, days);
        } else {
            data = this.model.getByDate(year, month, day);
        }

        // Evaluamos la promesa que devuelve nuestro modelo.
        data
            .then((data) => response.jsonp(data))
            .catch((e) => {
                response = response.status(400);

                if (e instanceof Error) {
                    response.send(e.message);
                    return;
                }

                response.send("Error interno.");
                console.error("`/resumen/:date` Error:", e);
            });
    }
}
