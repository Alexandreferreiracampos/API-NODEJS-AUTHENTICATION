const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extends:false}));
app.use(express.json());

require('./controllers/authController')(app);

//iniciando servidor na porta 3333
const port = 3333;
app.listen(port, ()=>{
    console.log(`Servidor iniciado: http://localhost:${port}`);
})