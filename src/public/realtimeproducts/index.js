const socketClient = io();

socketClient.on("connect", () => {
    console.log("User connected");
});

const createProductForm = document.getElementById("createProduct");
createProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const product = {
        title,
        description,
        price: parseFloat(price),
        thumbnail,
        code,
        stock: parseFloat(stock),
        category
    };

    socketClient.emit("createProduct", product);
    createProductForm.reset();
});

socketClient.on("productCreated", (data) => {
    location.reload();
});

socketClient.on("productError", (error) => {
    console.error("Error", error.message);
});