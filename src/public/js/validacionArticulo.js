// Funcionque verifica que los datos ingresados sean correctos //
function validacion(){

    var nombre, descripcion_tip, costo, precio, unidad, existencia;

    nombre = document.getElementById("nombre").value;
    descripcion_tip = document.getElementById("descripcion_tip").value;
    costo = document.getElementById("costo").value;
    precio = document.getElementById("precio").value;
    unidad = document.getElementById("unidad").value;
    existencia = document.getElementById("existencia").value;

    if(nombre===""){
        alert("El campo de nombre esta vacio");
        return false;
    }else if(descripcion_tip===""){
        alert("El campo de descripcion esta vacio");
        return false;
    }else if(costo===""){
        alert("El campo de costo esta vacio");
        return false;
    }else if(precio===""){
        alert("El campo de precio esta vacio");
        return false;
    }else if(unidad===""){
        alert("El campo de unidad esta vacio");
        return false;
    }else if(existencia===""){
        alert("El campo de existencia esta vacio");
        return false;

    }else if(nombre.length<3){
        alert("El nombre es muy corto");
        return false

    }else if(descripcion_tip.length<4){
        alert("La descripcion es muy corta");
        return false

    }

}