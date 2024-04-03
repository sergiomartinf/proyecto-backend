const contenedorColores = document.querySelector("ul");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('input[type = "text"]'); 
const mensajeError = document.querySelector(".error");

function color(id,r,g,b){
    let item = document.createElement("li");
    item.innerText = [r,g,b].join(",");
    item.style.backgroundColor = `rgb(${[r,g,b].join(",")})`;

    item.addEventListener("click", () => {
        fetch("/borrar/" + id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado,error}) => {
            if(!error && resultado == "ok"){
                return item.remove();
            }
            console.log("..mostrar error al usuario");
        });
    });

    return item;
}

// Carga inicial de los datos
fetch("/colores")
.then(respuesta => respuesta.json())
.then(colores => {
    colores.forEach(({id,r,g,b}) => {
        contenedorColores.appendChild(color(id,r,g,b));
    });
});


formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    mensajeError.classList.remove("visible");

    let textoError = "no puede estar en blanco";

    if(inputTexto.value.trim() != ""){

        let numeros = inputTexto.value.split(",").map(n => Number(n));

        let valido = numeros.length == 3;

        if(valido){

            numeros.forEach( n => valido = valido && n >= 0 && n <= 255 && n - parseInt(n) == 0);

            if(valido){

                let [r,g,b] = numeros;

                return fetch("/nuevo", {
                    method : "POST",
                    body : JSON.stringify({r,g,b}),
                    headers : {
                        "Content-type" : "application/json"
                    }
                })
                .then(respuesta => respuesta.json())
                .then(({id,error}) => {
                    if(!error){
                        contenedorColores.appendChild(color(id,r,g,b));

                        return inputTexto.value = "";
                    }
                    console.log("..error al usuario");
                });
            }
        }
        textoError = "deben ser tres numero entre 0 y 255 separados por comas";

    }
    mensajeError.innerText = textoError;
    mensajeError.classList.add("visible");
    
});