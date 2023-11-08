import  express  from "express";
import routers from './api/routers/index.js'
import 'dotenv/config';
import { manipulacaoErrosValidacao, manipulacaoErro404, manipulacaoErro500 } from "./api/middlewares/manipulacaoErros.js";
const port = process.env.PORT || 3000;

const app = express();
routers(app)

app.use(manipulacaoErrosValidacao, manipulacaoErro404, manipulacaoErro500)

app.listen(port, ()=>{
  console.log(`Servidor funcionando na porta http://localhost:${port}/`)
})

export default app;

