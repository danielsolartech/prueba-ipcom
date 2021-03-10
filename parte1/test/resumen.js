const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = require("chai").expect;

chai.use(chaiHTTP);

// Verificamos que nuestra API no se esté ejecutando en modo producción.
if (process.env.NODE_ENV !== "production") {
    // Importamos la librería `dotenv` para leer el archivo `.env`.
    const dotenv = require('dotenv');
    dotenv.config();
}

// Obtenemos el host para el API desde las variables de entorno o el valor por defecto.
const host = process.env.API_HOST || "localhost";

// Obtenemos el port para el API desde las variables de entorno o el valor por defecto.
const port = Number(process.env.API_PORT) || 5000;

const url = `http://${host}:${port}`;

describe("Get the abstracts", () => {
    function testError(message, error, response, done) {
        if (error) {
            console.error(error);
            done();
            return;
        }

        expect(response).to.have.status(400);
        expect(response.body).to.have.property("mensaje").to.be.equal(message);
        done();
    }

    function testSuccess(data, error, response, done) {
        if (error) {
            console.error(error);
            done();
            return;
        }

        expect(response).to.have.status(200);

        expect(response.body).to.have.property("total").to.be.equal(data.total);
        expect(response.body).to.have.property("noCompraron").to.be.equal(data.noCompraron);
        expect(response.body).to.have.property("compraMasAlta").to.be.equal(data.compraMasAlta);

        for (const [key, value] of Object.entries(data.comprasPorTDC)) {
            expect(response.body).to.have.property("comprasPorTDC").to.have.property(key).to.be.equal(value);
        }

        done();
    }

    it("Get the abstract of 2019-", (done) => {
        chai.request(url)
            .get("/resumen/2019-")
            .end((error, response) => testError("La fecha no tiene un formato válido.", error, response, done));
    });

    it("Get the abstract of 2019-12-01", (done) => {
        chai.request(url)
            .get("/resumen/2019-12-01")
            .end(
                (error, response) =>
                    testSuccess(
                        {
                            total: 5717947.009999994,
                            noCompraron: 403,
                            compraMasAlta: 30342.72,
                            comprasPorTDC: {
                                privada: 44,
                                "visa debit": 31,
                                maestro: 33,
                                "master plat": 27,
                                "visa gold": 36,
                                amex: 25,
                                "visa classic": 44,
                                "master gold": 37,
                                "amex corp": 25,
                                "master classic": 34,
                                "visa plat": 29
                            },
                        },
                        error,
                        response,
                        done,
                    )
            );
    });

    it("Get the abstract of 2019-12-01?dias=a", (done) => {
        chai.request(url)
            .get("/resumen/2019-12-01?dias=0")
            .end(
                (error, response) =>
                    testError(
                        "Los días a obtener deben ser mayor o igual a 1. Usa `/resumen/2019-12-1`.",
                        error,
                        response,
                        done
                    )
            );
    });

    it("Get the abstract of 2019-12-01?dias=0", (done) => {
        chai.request(url)
            .get("/resumen/2019-12-01?dias=0")
            .end(
                (error, response) =>
                    testError(
                        "Los días a obtener deben ser mayor o igual a 1. Usa `/resumen/2019-12-1`.",
                        error,
                        response,
                        done
                    )
            );
    });

    it("Get the abstract of 2019-12-01?dias=1", (done) => {
        chai.request(url)
            .get("/resumen/2019-12-01?dias=1")
            .end(
                (error, response) =>
                    testSuccess(
                        {
                            total: 12194805.7,
                            noCompraron: 770,
                            compraMasAlta: 30470.45,
                            comprasPorTDC: {
                                privada: 79,
                                "visa debit": 67,
                                maestro: 70,
                                "master plat": 63,
                                "visa gold": 72,
                                amex: 58,
                                "visa classic": 78,
                                "master gold": 71,
                                "amex corp": 81,
                                "master classic": 69,
                                "visa plat": 62
                            },
                        },
                        error,
                        response,
                        done,
                    )
            );
    });
});
