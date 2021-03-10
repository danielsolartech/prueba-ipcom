import { Router } from "express";
import { ResumenModel } from "../models/ResumenModel";
import { ResumenView } from "../views/ResumenView";

export class ResumenController {
    private model: ResumenModel;
    private view: ResumenView;
    private router: Router;

    constructor() {
        this.model = new ResumenModel();
        this.view = new ResumenView(this.model);
        this.router = Router();

        this.initialize();
    }

    /**
     * Colocamos las rutas en nuestro enrutador enlazándolas con las vistas.
     *
     * @private
     * @function
     * @returns { void }
     */
    private initialize(): void {
        this.router.get("/:date", (req, res) => this.view.fromDate(req, res));
    }

    /**
     * Obtener el enrutador.
     *
     * @returns { Router }
     */
    public getRouter(): Router {
        return this.router;
    }
}
