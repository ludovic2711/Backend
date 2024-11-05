const express =  require('express')
const morgan  =  require('morgan')
const cors =  require('cors')



//Initialization
const app = express();

//Setting
app.set("port", process.env.PORT || 4000);
app.set('json spaces', 2)

//Middlewares
//*CORS
app.use(cors())

app.use(morgan("dev")); //* Informacion de las peticiones que se están haciendo
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Routes
app.use(require('./routes/index'))

//Public files

//Run server
app.listen(app.get("port"), () =>
  console.log("Server inicializado en el puerto ", app.get("port"))
);
