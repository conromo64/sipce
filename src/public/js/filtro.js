document.addEventListener("keyup", e=>{

    if (e.target.matches("#buscador")){
  
        if (e.key ==="Escape")e.target.value = ""
        
        document.querySelectorAll("#articulos").forEach(art =>{  
            art.querySelector("#articulo").textContent.toLowerCase().includes(e.target.value.toLowerCase())
              ?art.classList.remove("filtro")
              :art.classList.add("filtro")
        })
  
    }
  
  
  })