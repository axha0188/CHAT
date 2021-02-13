const botones = document.querySelector("#botones")
const nombreUsuario = document.querySelector("#nombreusuario")
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputchat')
firebase.auth().onAuthStateChanged((user) => {
    //user = true
    if (user) {
      console.log(user)
      nombreUsuario.innerHTML = user.displayName
      botones.innerHTML = `
      <button type="button" class="btn btn-danger fs-5" id="btncerrar">Cerrar sesion</button>
      `
      contenidoProtegido.innerHTML = `
      <p class="text-center lead mt-5 fs-4"> Bienvenido ${user.displayName}</p>
      `
      formulario.classList = 'input-group py-3 fixed-bottom container'
      contenidoChat(user)
      cerrar()
    } else {
      console.log("no existe user")
      nombreUsuario.innerHTML = "chat"
      botones.innerHTML = `
      <button type="button" class="btn btn-primary fs-5" id="btnacceder">Acceder</button>
      `
      contenidoProtegido.innerHTML = `
      <p class="text-center lead mt-5 fs-4"> Inicia sesion </p>
      `
      formulario.classList = 'input-group py-3 fixed-bottom container d-none'
      acceder()
    }

  });

// contenido del chat
const contenidoChat = (user) => {
  formulario.addEventListener('submit', e => {
    e.preventDefault()
    console.log(inputChat.value)
    if(!inputChat.value.trim()) {
      console.log('input vacio')
    }
    firebase.firestore().collection('chat').add({
      texto: inputChat.value,
      uid: user.uid,
      fecha: Date.now()
    }).then(res => {
      console.log('texto agregado')
    })
    inputChat.Value = ''
    //
    firebase.firestore().collection('chat').orderBy('fecha')
      .onSnapshot(query =>{
      //console.log(query)
      contenidoProtegido.innerHTML = ''
      query.forEach(doc=>{
        console.log(doc.data())
        if(doc.data().uid === user.uid)
        {
          contenidoProtegido.innerHTML += `
          <div class="d-flex justify-content-end mb-2">
            <span class="badge bg-info fs-5" >${doc.data().texto}</span>
          </div>
          `
        }
        else{
          contenidoProtegido.innerHTML += `
          <div class="d-flex justify-content-start mb-2">
            <span class="badge bg-secondary fs-5" >${doc.data().texto}</span>
          </div>     
          `
        }
        contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
      })
    })



  })
}
// incio sesion
const acceder = () =>{
    const  btnacceder = document.querySelector("#btnacceder")
    btnacceder.addEventListener('click',async() =>{
        console.log("acceder")
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log("Ohh Nooo algo paso: ",error)
        }
    })
}
// cerrar sesion
const cerrar = () =>{
  const btncerrar = document.querySelector("#btncerrar")
  btncerrar.addEventListener("click",() =>{
    firebase.auth().signOut()
  })
}
