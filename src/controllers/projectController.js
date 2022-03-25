const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

//verificar se passou pelo Middleware
router.use(authMiddleware);


router.get('/', (req, res)=>{
    res.send({ok: true, userId: req.userId});
})

module.exports = app => app.use('/projects', router);