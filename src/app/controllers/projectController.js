const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const User = require('../model/Usuarios');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

//verificar se passou pelo Middleware
router.use(authMiddleware);


//criar token para autenticação
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}



router.get('/', (req, res)=>{
    res.send({ok: true, userId: req.token});
});

//Salvar batida de ponto
router.post('/dot_beat', async (req, res)=>{
    //capturar os dados para reset de senha
    const {email} = req.body;
    
    try {
        //salva os dados referente ao email na variavel user
        const user = await User.findOne({email})

        const now = Date()


        if(user.beat == null){
            data = [{
                id: '0',
                beat: now
            }]
        }else{
            data = user.beat

            data.push({
                id: '0',
                beat: now
            })
        }

        //salvar os dados capturados
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                beat: data,
            }
        });

        return res.status(200).send({
            user
        });

    } catch (err) {
        res.status(400).send({
            error: "Erro ao salvar os dados"
        });
    }
})

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
    
    //salvar os dados capturados
    user.save();

    return res.status(200).send({ok:"Password successfully changed"});


    }catch (err){
        res.status(400).send({error: "Cannot reset password, try again"});
    }
})

module.exports = app => app.use('/projects', router);