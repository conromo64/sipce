document.addEventListener("DOMContentLoaded", function () {
    let subMenu = document.getElementById("subMenu");
    let menuIcon = document.getElementById("userIcon");

    function toggleMenu(event) {
        event.stopPropagation();
        subMenu.classList.toggle("open-menu");
    }

    menuIcon.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (event) {
        if (!subMenu.contains(event.target) && !menuIcon.contains(event.target)) {
            subMenu.classList.remove("open-menu");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let subMenu = document.getElementById("subMenu");
    let menuIcon = document.getElementById("menuIcon");

    function toggleMenu(event) {
        event.stopPropagation();
        subMenu.classList.toggle("open-menu");
    }

    menuIcon.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (event) {
        if (!subMenu.contains(event.target) && !menuIcon.contains(event.target)) {
            subMenu.classList.remove("open-menu");
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    let subMenu = document.getElementById("subMenu1");
    let menuIcon = document.getElementById("userIcon");

    function toggleMenu(event) {
        event.stopPropagation();
        subMenu.classList.toggle("open-menu");
    }

    menuIcon.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (event) {
        if (!subMenu.contains(event.target) && !menuIcon.contains(event.target)) {
            subMenu.classList.remove("open-menu");
        }
    });


    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            subMenu.classList.remove("open-menu");
        }
    });

    document.addEventListener("DOMNodeRemoved", function (event) {
        if (event.target === subMenu) {
            document.removeEventListener("click", toggleMenu);
            document.removeEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    subMenu.classList.remove("open-menu");
                }
            });
            document.removeEventListener("DOMNodeRemoved", arguments.callee);
        }
    });
});






document.getElementById('iconoBusqueda').addEventListener('click', function (event) {
    event.stopPropagation();
    var busBox = document.getElementById('busquedaInput');
    busBox.classList.toggle('active');
});


document.addEventListener('click', function (event) {
    var busBox = document.getElementById('busquedaInput');
    var iconoBusqueda = document.getElementById('iconoBusqueda');

    if (!busBox.contains(event.target) && !iconoBusqueda.contains(event.target)) {
        busBox.classList.remove('active');
    }
});


document.getElementById('busquedaInput').addEventListener('click', function (event) {
    event.stopPropagation();
});



function validarFechaPrincipal1() {
    var fechaPrincipal = document.getElementById('fechaPrincipal').value;

    var fechaUno = document.getElementById('fechaUno');
    var fechaDos = document.getElementById('fechaDos');

    

    if (fechaPrincipal) {
        fechaUno.disabled = true;
        fechaDos.disabled = true;
        
    } else {
        fechaUno.disabled = false;
        fechaDos.disabled = true;
    }
}


function validarFechasPerido1() {
    var fechaPrincipal = document.getElementById('fechaPrincipal');
    var fechauno = document.getElementById('fechaUno').value;
    var fechados = document.getElementById('fechaDos');


    if(fechauno){
        fechaPrincipal.disabled = true; 
        fechaDos.disabled = false;

    }else{
        fechaPrincipal.disabled = false;
        fechaDos.disabled = true;
    }    
}







function validarFechaPrincipal2() {
    var fechaPrincipal2 = document.getElementById('fechaPrincipal2').value;


    var fechaUno2a = document.getElementById('fechaUno2');
    var fechaDos2a = document.getElementById('fechaDos2');
   

    if (fechaPrincipal2) {
        fechaUno2a.disabled = true;
        fechaDos2a.disabled = true;
        
    } else {
        fechaUno2a.disabled = false;
        fechaDos2a.disabled = true;

    }
}


function validarFechasPerido2(){
    var fechaPrincipal2 = document.getElementById('fechaPrincipal2');

    var fechaUno2a = document.getElementById('fechaUno2').value;
    var fechaDos2aa = document.getElementById('fechaDos2');


    if(fechaUno2a){
        fechaPrincipal2.disabled = true;
        fechaDos2aa.disabled=false;
    }else{
        fechaPrincipal2.disabled = false;
        fechaDos2aa.disabled = true;
    }
}



function validarFechaPrincipal3() {
    var fechaPrincipal3 = document.getElementById('fechaPrincipal3').value;


    var fechaUno3a = document.getElementById('fechaUno3');
    var fechaDos3a = document.getElementById('fechaDos3');
   

    if (fechaPrincipal3) {
        fechaUno3a.disabled = true;
        fechaDos3a.disabled = true;
        
    } else {
        fechaUno3a.disabled = false;
        fechaDos3a.disabled = true;

    }
}


function validarFechasPerido3(){
    var fechaPrincipal3 = document.getElementById('fechaPrincipal3');

    var fechaUno3a = document.getElementById('fechaUno3').value;
    var fechaDos3aa = document.getElementById('fechaDos3');


    if(fechaUno3a){
        fechaPrincipal3.disabled = true;
        fechaDos3aa.disabled=false;
    }else{
        fechaPrincipal3.disabled = false;
        fechaDos3aa.disabled = true;
    }
}








