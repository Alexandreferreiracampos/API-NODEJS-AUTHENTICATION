const express = require('express');
const User = require('../model/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const cors = require('cors')


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
            return res.status(400).send({Error: "Usuário já existe."});
        
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
        return res.status(400).send({error: 'Usuário não cadastrado.'})
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

//Enviar e-mail para reset de senha
router.post('/forgot_password', async (req, res)=>{
    //captura o email
    const {email} = req.body;

    try{
        //salva os dados referente ao email na variavel user
        const user = await User.findOne({ email })

        const name = user.name
        
        //verificar se o email existe
        if(!user){
            return res.status(400).send({error:'User not found'})
        }
       
        //criar um novo tokem para redefinir senha
       const token = crypto.randomBytes(20).toString('hex');
       
       //salva a data para expiração do token
       const now = new Date();
       //add 1 hora na expiração da senha apartir da data criada
       now.setHours(now.getHours() + 1);

       //salva o token e a data 
       await User.findByIdAndUpdate(user.id, {
           '$set':{
            passwordResetToken: token,
            passwordResetExpires: now,
           }
       });

       //função para enviar o e-mail
       mailer.sendMail({
           to: email,
           from: 'alexandre@gmail.com',
           template: 'auth/forgotPassword',
           subject: 'Redefinir Senha',
           context: {token,name}

       },(err)=>{

           if(err)
            return res.status(400).send({error: 'Cannot send forgot password email'}); 

       return res.status(200).send({Ok:'Password recovery email sent successfully.'});
    })
     
    }catch(err){
        res.status(400).send({error: 'Erro on forgot password, try again'});
    }
});

//reset de senha
router.post('/reset_password', async (req, res)=>{
    //capturar os dados para reset de senha
    const {email, token, password} = req.body;
    
    try{
        //salva os dados referente ao email na variavel user
        const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');
        
    //validar token
    if(token !== user.passwordResetToken)
        return res.status(400).send({error: 'Token invalid'});
    
    //salvar a data na variavel now
    const now = Date();
    
    
    //verificar se a data expirou
    if(now > user.passwordResetExpires)
        return res.status(400).send({error: 'Token experid'});
        
    
    //pegar a senha da variavel password
    user.password = password;
    //user.beat = '12121';
    
    //salvar os dados capturados
    user.save();

    return res.status(200).send({ok:"Password successfully changed"});


    }catch (err){
        res.status(400).send({error: "Cannot reset password, try again"});
    }
})


module.exports = app => app.use('/auth', router);