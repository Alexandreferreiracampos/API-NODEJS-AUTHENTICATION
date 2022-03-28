const express = require('express');
const User = require('../model/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

const router = express.Router();

//criar token para autenticação
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res)=>{
    const {email} = req.body;
    try{
        
        //verificar se o email já existe
        if(await User.findOne({ email }))
            return res.status(400).send({Erro: "Usuário já existe."});
        
         //usuario cadastrado
        const user = await User.create(req.body);

        //ocutar senha
        user.password = undefined;
        
        //usuario cadastrado
        return res.status(200).send({user, token: generateToken({id: user.id})});

    }catch(err){
        return res.status(400).send({error:'Falha ao registrar nova Usuario.'});

    }
})

router.post('/authenticate', async (req, res)=>{

    //email e password
    const {email, password} = req.body;
    
    //capturar senha apartir do e-mail
    const user = await User.findOne({email}).select('+password');
    
    //validar usuario
    if(!user){
        return res.status(400).send({erro: 'Usuário não cadastrado.'})
    }
    
    //validar senha
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: 'Senha incorreta.'})
    }
    
    //remover campo de senha 
    user.password = undefined
    

    //Mostrar informações junto com o token do usuario solicitado
    res.send({user, token: generateToken({id: user.id})});
})

module.exports = app => app.use('/auth', router);