package main

import "testing"

func TestReadFile(t *testing.T) {
	fileContent, err := ReadFile("./examples/data.csv")
	if err != nil {
		t.Error(err)
		return
	}

	expected := `org1,jperez,admin
org1,jperez,superadmin
org1,asosa,writer
org2,jperez,admin
org2,rrodriguez,writer
org2,rrodriguez,editor`

	if fileContent != expected {
		t.Errorf("ReadFile(\"./examples/data.csv\") = %q, want %q", fileContent, expected)
	}
}

func TestParseCSVToJSON(t *testing.T) {
	csvContent := `org1,daniel,admin
org1,daniel,super`

	csvToJson, err := ParseCSVtoJSON(csvContent, "\t")
	if err != nil {
		t.Error(err)
		return
	}

	expected := `[
	{
		"organization": "org1",
		"users": [
			{
				"username": "daniel",
				"roles": [
					"admin",
					"super"
				]
			}
		]
	}
]`

	if csvToJson != expected {
		t.Errorf("ParseCSVtoJSON(%q) = %q, want %q", csvContent, csvToJson, expected)
	}
}

func TestParseCSVToJSON2(t *testing.T) {
	csvContent := `org1,daniel,admin
org1,daniel,super
org1,daniel1,admin`

	csvToJson, err := ParseCSVtoJSON(csvContent, "\t")
	if err != nil {
		t.Error(err)
		return
	}

	expected := `[
	{
		"organization": "org1",
		"users": [
			{
				"username": "daniel",
				"roles": [
					"admin",
					"super"
				]
			},
			{
				"username": "daniel1",
				"roles": [
					"admin"
				]
			}
		]
	}
]`

	if csvToJson != expected {
		t.Errorf("ParseCSVtoJSON(%q) = %q, want %q", csvContent, csvToJson, expected)
	}
}

func TestParseCSVToJSON3(t *testing.T) {
	csvContent := `org1,daniel,admin
org1,daniel,super
org2,daniel,admin
org2,daniel,admin`

	csvToJson, err := ParseCSVtoJSON(csvContent, "\t")
	if err != nil {
		t.Error(err)
		return
	}

	expected := `[
	{
		"organization": "org1",
		"users": [
			{
				"username": "daniel",
				"roles": [
					"admin",
					"super"
				]
			}
		]
	},
	{
		"organization": "org2",
		"users": [
			{
				"username": "daniel",
				"roles": [
					"admin"
				]
			}
		]
	}
]`

	if csvToJson != expected {
		t.Errorf("ParseCSVtoJSON(%q) = %q, want %q", csvContent, csvToJson, expected)
	}
}

func TestParseCSVToJSON4(t *testing.T) {
	csvContent := `org1,daniel`

	csvToJson, err := ParseCSVtoJSON(csvContent, "\t")
	if err == nil {
		t.Errorf(
			"ParseCSVtoJSON(%q) = %q, nil, want \"\", CustomError{\"Cada registro debe tener 3 campos: Organización, usuario y rol.\"}",
			csvContent,
			csvToJson,
		)

		return
	}

	expected := CustomError{"Cada registro debe tener 3 campos: Organización, usuario y rol."}
	if err != expected {
		t.Errorf(
			"ParseCSVtoJSON(%q) = \"\", %q, want \"\", %q",
			csvContent,
			err,
			expected,
		)
	}
}
