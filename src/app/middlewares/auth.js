const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
module.exports = (req, res, next) => {
    
    //verificar Header da requisição
    const authHeader = req.headers.authorization;

    //verificar se o token foi informado
    if(!authHeader)
        return res.status(401).send({error: "Tokem não informado."})
    
    //verificar se o tokem esta no formatado corret, exemplo: 'Bearer 11111111111'
    const parts = authHeader.split(' ');
    
    //verificar se o token tem as duas partes 
    if(!parts.length === 2)
    return res.status(401).send({error: "Token mal formatado"})
    
    //desestruturar token dentro do sheme e token
    const [scheme, token] = parts;

    //verificar se o token começa com Bearer
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: "Token informado mal formatado"})
    
    //verificar se o tokem e valido para autenticação
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({error: "Tokem invalidado"})

        req.userId = decoded.id;
        return next()
    })
    

}