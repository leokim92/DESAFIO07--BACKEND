import express from "express";
import exphbs from "express-handlebars"
const app = express();
const PORT = 8080;
import productsRouter from "./routes/products.router";
const cartRouter = require("./routes/cart.router");
const socketIO = require("socket.io")
const viewsRouter = require("./routes/views.router")
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionsRouter from  "./routes/sessions.router.js";

require("./database.js");

const ProductManager = require("./controllers/ProductManager");
const productManager = new ProductManager("./products.json");

const fileStore = FileStore(session);

app.use(express.static("./src/public"));

const httpServer = app.listen(PORT, () => {
    console.log(`Running in port ${PORT}`);
  });

const MessageModel = require("./models/message.model.js");
const io = new socketIO.Server(httpServer)

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views")

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
    console.log("A cliente has connected");

    const products = await productManager.getProduct();
 
    socket.emit("products", products);
    
    socket.on("deleteProduct", async (id) => {

      await productManager.deleteProduct(id);

      const products = await productManager.getProduct();

      io.sockets.emit("products", products);
    });
  
    socket.on("addProduct", async (product) => {
      try {

        await productManager.addProduct(product);

        const products = await productManager.getProduct();

        io.sockets.emit("products", products);
      } catch (error) {
        console.log("Error to load product");
      }
    });
  });

io.on("connection", (socket) => {
    console.log("A client is connected");

    socket.on("message", async (data) => {
        await MessageModel.create(data);

        const messages = await MessageModel.find();
        io.sockets.emit("message", messages)
    })
} )

const myPass = "TinkiWinki";

app.use(cookieParser(myPass))

app.use(session({
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://leonardokim92:coderhouse@cluster0.2ca8jnw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl:100
})
}))


