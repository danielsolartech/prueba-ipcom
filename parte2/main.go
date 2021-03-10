package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
)

// User ...
type User struct {
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
}

// AddRole Añade un nuevo rol al usuario.
func (user *User) AddRole(role string) {
	if len(user.Roles) != 0 {
		for _, r := range user.Roles {
			if r == role {
				return
			}
		}
	}

	user.Roles = append(user.Roles, role)
}

// Organization ...
type Organization struct {
	Organization string  `json:"organization"`
	Users        []*User `json:"users"`
}

// GetName Obtén el nombre de la organización.
func (org *Organization) GetName() string {
	return org.Organization
}

// AddUser Añade un nuevo usuario a la organización.
func (org *Organization) AddUser(username string, role string) {
	if len(org.Users) != 0 {
		for _, user := range org.Users {
			if user.Username == username {
				user.AddRole(role)
				return
			}
		}
	}

	org.Users = append(org.Users, &User{username, []string{role}})
}

// LenError ...
type LenError struct {
	Message string
}

func (e LenError) Error() string {
	return e.Message
}

func parseCSVtoJSON(content string) (string, error) {
	csvParsed := csv.NewReader(strings.NewReader(content))

	var orgs []*Organization
	for {
		// Leer la siguiente línea del CSV.
		data, err := csvParsed.Read()

		// Si la línea es el final del archivo detener el ciclo.
		if err == io.EOF {
			break
		}

		if err != nil {
			return "", err
		}

		if len(data) != 3 {
			return "", LenError{"Cada registro debe tener 3 campos: Organización, usuario y rol."}
		}

		organizationName := strings.TrimSpace(data[0])
		username := strings.TrimSpace(data[1])
		role := strings.TrimSpace(data[2])

		needCreateOrganization := true
		if len(orgs) != 0 {
			for _, org := range orgs {
				// Comprobar si el nombre de la organización es igual al del registro del CSV.
				if org.GetName() == organizationName {
					needCreateOrganization = false

					// Añadir el usuario a la organización
					org.AddUser(username, role)
					break
				}
			}
		}

		if needCreateOrganization {
			// Añadir una nueva organización.
			orgs = append(orgs, &Organization{
				organizationName,
				[]*User{
					{
						username,
						[]string{role},
					},
				},
			})
		}
	}

	// Pasar la lista de organizaciones al formato JSON.
	jsonData, err := json.MarshalIndent(orgs, "", "  ")
	if err != nil {
		return "", err
	}

	return string(jsonData), nil
}

func main() {
	// Obtenemos el directorio desde el cual estamos llamando nuestro ejecutable.
	currentDirectory, err := os.Getwd()
	if err != nil {
		log.Print(err)
		return
	}

	// Comprobamos si el número de argumentos es 1.
	if len(os.Args) == 1 {
		fmt.Print("Debes ingresar el nombre de un archivo .csv")
		return
	}

	// Obtenemos el segundo argumento como el nombre del archivo.
	filename := os.Args[1]

	// Leemos el archivo.
	data, err := ioutil.ReadFile(path.Join(currentDirectory, filename))
	if err != nil {
		log.Print(err)
		return
	}

	// Pasamos los datos del archivo de un Buffer a String.
	csvContent := strings.TrimSpace(string(data))

	// Convertir el contenido del CSV en JSON.
	json, err := parseCSVtoJSON(csvContent)
	if err != nil {
		log.Print(err)
		return
	}

	// Mostrar el resultado.
	fmt.Print(json)
}
