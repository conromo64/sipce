// Funcionque verifica que los datos ingresados sean correctos //
function validar(){

    var apellido, nombre, tel, email, password, password1 ,expresion, expresion1;
    apellido = document.getElementById("apellido").value;
    nombre = document.getElementById("nombre").value;
    tel = document.getElementById("tel").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    password1 = document.getElementById("password1").value;

    expresion = /\w+@+gmail+.com/;
    expresion1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#%])[A-Za-z\d$@$!%*?&#%]{8,15}/;

    if(apellido===""){
        alert("El campo Apellido Paterno esta vacio");
        return false;
    }else if(nombre===""){
      alert("El nombre esta vacio");
      return false;
    }else if(tel===""){
      alert("El teléfono esta vacio")
      return false;
    }else if(email===""){
      alert("El email esta incompleto");
      return false;
    }else if(password===""){
      alert("El Pasword esta incompleto");
      return false;


    }else if(apellido.length<4){
      alert("El Apellido Paterno es muy corto");
      return false;

    }else if(nombre.length<2){
      alert("El Nombre esta mal es muy corto");
      return false;

    }else if(tel.length>10){
      alert("El teléfono esta mal");
      return false;


    }else if(isNaN(tel)){
      alert("El teléfono ingresado no es un numero telefonico");
      return false;
      
    }else if(email.length>100){
      alert("El correo es muy largo");
      return false;
    }else if(!expresion.test(email)){
      alert("El correo esta mal, tiene que tener una terminacion @gmail.com");
      return false;

    }else if(password.length>30){
      alert("La contraseña es muy larga");
      return false;
    }else if(!expresion1.test(password)){
      alert("La contraseña esta mal minimo 8 caracteres, una mayuscula, un numero, un caracter especial $@$!%*?&#%");
      return false;

    }else if(password1===""){
      alert("El Pasword esta incompleto");
      return false;
      
    }else if(!expresion1.test(password1)){
      alert("La contraseña esta mal minimo 8 caracteres, una mayuscula, un numero, un caracter especial $@$!%*?&#%");
      return false;

    }

  
}

function validars(){

  var apellido, nombre, tel, email, expresion;
  apellido = document.getElementById("apellido").value;
  nombre = document.getElementById("nombre").value;
  tel = document.getElementById("tel").value;
  email = document.getElementById("email").value;

  expresion1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#%])[A-Za-z\d$@$!%*?&#%]{8,15}/;

  if(apellido===""){
      alert("El campo Apellido Paterno esta vacio");
      return false;
  }else if(nombre===""){
    alert("El nombre esta vacio");
    return false;
  }else if(tel===""){
    alert("El teléfono esta vacio")
    return false;
  }else if(email===""){
    alert("El email esta incompleto");
    return false;
  }else if(apellido.length<4){
    alert("El Apellido Paterno es muy corto");
    return false;



  }else if(nombre.length<2){
    alert("El Nombre esta mal es muy corto");
    return false;

  }else if(tel.length>10){
    alert("El teléfono esta mal");
    return false;


  }else if(isNaN(tel)){
    alert("El teléfono ingresado no es un numero telefonico");
    return false;
    
  }else if(email.length>100){
    alert("El correo es muy largo");
    return false;
  }else if(!expresion.test(email)){
    alert("El correo esta mal, tiene que tener una terminacion @gmail.com");
    return false;

  }
    
  
}