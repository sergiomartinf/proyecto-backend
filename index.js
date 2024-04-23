const { writeFile } = require("fs");
const express = require("express");
const { json } = require("body-parser"); 
let colores = require("./Datos/Colores.json");//hace automaticamente el PARSE
let proximoId = colores.length > 0 ? colores[colores.length - 1].id + 1 : 1;

function guardarColores(){
	return new Promise((ok,ko) => {
		writeFile("./Datos/Colores.json",JSON.stringify(colores), error => {
			!error ? ok() : ko();
		});
	});
}

const servidor = express();

servidor.use(json());

servidor.use(express.static("./Lista_colores"));

servidor.get("/Colores", (peticion,respuesta) => {
	respuesta.json(colores); 
});

servidor.post("/Nuevo", (peticion,respuesta) => {
	//previa validación
	peticion.body.id = proximoId;
	proximoId++;
	colores.push(peticion.body);
	
	guardarColores()
	.then(() => {
		respuesta.json({ id : peticion.body.id });
	})
	.catch(() => {
		proximoId--;
		colores.pop();
		respuesta.status(500);
		respuesta.json({ error : "error en el servidor" });
	});
});


servidor.delete("/borrar/:id",(peticion,respuesta) => {
    colores = colores.filter(color => color.id != peticion.params.id);

    guardarColores()
    .then(() => respuesta.json({ resultado : "ok" }))
    .catch(() => respuesta.json({ resultado : "ko" }));
});


servidor.use((error,peticion,respuesta,siguiente) => {
	//en caso de que algún middleware anterior genere una EXCEPCIÓN (error)
	respuesta.status(400);
	respuesta.send("<h1>400 bad request</h1>");
});


servidor.use((peticion,respuesta) => {
	respuesta.status(404);
	respuesta.send("<h1>404 not found</h1>");
});

servidor.listen(process.env.PORT || 4000);

/*
IaaS
PaaS ----> Port

variables de entorno ---> process.env

enviroment variables

PORT
*/










