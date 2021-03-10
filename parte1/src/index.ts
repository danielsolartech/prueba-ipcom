import * as Express from "express";
import { ResumenController } from "./controllers/ResumenController";

// Esta función nos ayudará a ejecutar nuestro programa de forma asíncrona
// para aprovechar la asincronía de NodeJS.
async function Main() {
    // Verificamos que nuestra API no se esté ejecutando en modo producción.
    if (process.env.NODE_ENV !== "production") {
        // Importamos la librería `dotenv` para leer el archivo `.env`.
        const dotenv = await import('dotenv');
        dotenv.config();
    }

    // Obtenemos el host para el API desde las variables de entorno o el valor por defecto.
    let host: string = process.env.API_HOST || "localhost";

    // Obtenemos el port para el API desde las variables de entorno o el valor por defecto.
    let port: number = Number(process.env.API_PORT) || 5000;

    // Iniciamos nuestra aplicación de ExpressJS.
    let app: Express.Express = Express();

    // Iniciamos nuestro controlador del resumen.
    let resumen: ResumenController = new ResumenController();
    app.use("/resumen", resumen.getRouter());

    // Ponemos a escuchar nuestro servidor y mandamos un mensaje si ha comenzado correctamente.
    app.listen(port, host, () => {
        console.log(`Server initialized on ${host}:${port}!`);
    });
}

// Ejecutamos la variable Main usando try y catch para obtener los errores que salten al usar
// código asíncrono.
try {
    Main();
} catch (e) {
    console.error('Server Error:', e);
}
