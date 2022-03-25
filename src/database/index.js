const mongoose = require('mongoose');
require("dotenv").config();

//conexao com o bando de dados mongodb, url no arquivo .env
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//testando conexao
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conectado com sucesso!"));

module.exports = mongoose