# Prueba IPCOM - Parte 1

## Requerimientos
-   NodeJS

## Endpoints
-   `GET` /resumen/{Fecha-en-formato-ISO}
-   `GET` /resumen/{Fecha-en-formato-ISO}?dias={número}

Ejemplo:
```
/resumen/2019-12-01
/resumen/2019-12-01?dias=5
```

Respuesta exitosa (200):
```json
{
    "total": 5717947.009999994,
    "comprasPorTDC": {
        "privada": 44,
        "visa debit": 31,
        "maestro": 33,
        "master plat": 27,
        "visa gold": 36,
        "amex": 25,
        "visa classic": 44,
        "master gold": 37,
        "amex corp": 25,
        "master classic": 34,
        "visa plat": 29
    },
    "noCompraron": 403,
    "compraMasAlta": 30342.72
}
```

Respuesta de error (400):
```json
{
    "mensaje": "Error"
}
```

## Primeros Pasos
1. Clonar este repositorio:
```sh
git clone https://github.com/danielsolartech/prueba-ipcom.git
```
o con GitHub CLI:
```sh
gh repo clone danielsolartech/prueba-ipcom
```

2. Instalar las dependencias:
```sh
npm install
```

3. (Opcional) Configurar el archivo `.env` en base al archivo `.env.example`, si no se configura se colocarán los valores por defecto.

4. Construir el proyecto (Pasarlo a código JavaScript):
```sh
npm run build
```

5. Ejecutar nuestra versión en JavaScript:
```sh
npm start
```

6. Ejecutar nuestra versión en TypeScript:
```sh
npm run start:dev
```

## Ejecutando los testeos
1. Iniciar el servidor:
```sh
npm start
```
o en desarrollo:
```sh
npm run start:dev
```

2. Ejecutar el siguiente comando:
```sh
npm run test
```
