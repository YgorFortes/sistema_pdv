import express from 'express';
import categorias from './categoriasRoutes.js';
import usuarios from './usuariosRouters.js';
import produtos from './produtosRoutes.js'
export default  app =>{
  app.get('/', (req, res)=>{
    res.status(200).send({mensagem: 'Funcionando'})
  })


  app.use(
    express.json(),
    categorias,
    usuarios,
    produtos
  )
}



