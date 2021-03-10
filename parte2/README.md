# Prueba IPCOM - Parte 2

## Requerimientos
-   Golang

## Primeros pasos
1. Crear un archivo `.csv` con el siguiente formato para los registros:
```csv
organización,usuario,rol
```
Ejemplo:
```csv
org1,daniel,admin
```
> NOTA: Puedes usar el archivo de ejemplo `./examples/data.csv`.

2. Construir el archivo binario:
```sh
go build main.go
```

3. Ejecutar el siguiente comando:
```sh
main [ruta-del-archivo]
```
Ejemplo:
```sh
main ./examples/data.csv
```
