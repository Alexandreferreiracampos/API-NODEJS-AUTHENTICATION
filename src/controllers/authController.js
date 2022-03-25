const express = require('express');
const User = require('../model/Usuarios');

const router = express.Router();

router.post('/register', async (req, res)=>{
    const {email} = req.body;
    try{

        if(await User.findOne({ email }))
            return res.status(400).send({Erro: "Usuário já existe."});
        
        const user = await User.create(req.body);
        user.password = undefined;
        
        return res.status(200).send({user});

    }catch(err){
        return res.status(400).send({error:'Falha ao registrar nova Usuario.'});

    }
})

module.exports = app => app.use('/auth', router);