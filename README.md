# Prueba IPCOM

## [Parte 1 (Usando NodeJS)](./parte1/)
Un cliente de IPCOM realiza ventas en sus call center y desea un API para analizarlas. Las ventas pueden ser consultadas mediante un API REST. 
 
Existe un API que nos devuelve un arreglo con el siguiente JSON

```json
[
  {
    "clientId":1000223,
    "phone":"992003040",
    "nombre":"Juan Mata",
    "compro":true,
    "tdc":"gold",
    "monto":123.20,
    "date":"2020-02-20T14:53:00Z"
  }
]
```

Para consultar este API es mediante un  GET a https://apirecruit-gjvkhl2c6a-uc.a.run.app/compras/2019-12-01  para obtener todas las compras de un día. 

Debe realizar un servicio web que consulte el api descrito arriba y  que responda unas estadísticas en el siguiente Endpoint

GET /resumen/2019-12-01?dias=5 

La respuesta debe ser un JSON que devuelva lo siguiente:

```json
{
  "total": 12001.00, 
  "comprasPorTDC":{
    "oro":1000,
    "amex":9401
  },
  "nocompraron":100,
  "compraMasAlta":500
}
```

La fecha 2019-12-01 es la primera fecha. Y el parámetro días indica cuantos días debe consultar. En este ejemplo serian 5 dias incluido 2019-12-01 es decir del 2019-12-01 al 2019-12-05
 
El JSON debe contener los siguientes campos: 

Total: la suma del monto de todas las ventas de todos los días indicados
comprasPorTDC: un map que tenga como llave el tipo de tdc y como valor la suma del monto correspondiente a esa tipo de tarjeta de esos días. 
noCompraron: numero de registros donde no hubo compra
compraMasAlta: la compra mas alta en el periodo. 

## [Parte 2 (Usando Go)](./parte2/)
Dado un csv con los siguientes datos:

```csv
organizacion, usuario, rol 
org1,jperez,admin 
org1,jperez,superadmin
org1,asosa,writer
org2,jperez,admin 
org2,rrodriguez,writer
org2,rrodriguez,editor
```

generar un json con la siguiente estructura:

```json
[
  {
    "organization": "org1",
    "users": [
      {
        "username": "jperez",
        "roles": ["admin", "superadmin"]
      },
      {
        "username": "asosa",
        "roles": ["writer"]
      }
    ]
  }, 
  {
    "organization": "org2",
    "users": [],
  }
]
```

El csv siempre vendrá ordenado primero por organización luego por usuario y por último rol.  
