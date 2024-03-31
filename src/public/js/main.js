console.log("connected");

const socket = io();

socket.on("products", (data) => {
  const listaProductos = document.getElementById("listaProductos");
  listaProductos.innerHTML = "";
  data.forEach((products) => {
    listaProductos.innerHTML += `
    <div class='product-card'>
    <h3>Titulo : ${products.title}</h3>
    <p>Descripción : ${products.description}</p>
    <p>$${products.price}</p>
    <button class='deleteButton'>Eliminar</button>
    </div>
    `;
  });

  const deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      deleteProduct(data[index].id);
    });
  });

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    addProduct();
  });
});

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

const addProduct = () => {

  const title = document.getElementById("form-title").value;
  const state = document.getElementById("form-select").value === "true"; 
  const category = document.getElementById("form-category").value;
  const description = document.getElementById("form-description").value;
  const price = parseFloat(document.getElementById("form-price").value);
  const thumbnail = document.getElementById("form-thumbnail").value;
  const code = document.getElementById("form-code").value;
  const stock = parseInt(document.getElementById("form-stock").value);
  
  if (
    title &&
    state !== undefined &&
    category &&
    description &&
    price &&
    thumbnail &&
    code &&
    stock !== undefined
  ) {
   
    const product = {
      title,
      state,
      category,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    socket.emit("addProduct", product);
  } else {
    console.error("Algunos campos del formulario no están definidos.");
  }
};

let user; 

const chatBox = document.getElementById("chatBox"); 

Swal.fire({
    title: "You name",
    input: "text",
    text: "Choose an ID to be identified",
    inputValidator: (value) => {
        return !value && "You need to choose a name to continue"
    }, 
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    console.log(user);
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0 ){
            
            socket.emit("message", {user:user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

socket.on("message", (data) => {
    let log = document.getElementById("messagesLogs");
    let mensajes = "";
    data.forEach(mensaje => {
        mensajes = mensajes + `${mensaje.user} dice: ${mensaje.message} <br>`;
    })
    log.innerHTML = mensajes;
})