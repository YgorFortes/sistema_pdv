import db from "../db/conecaodb.js";
import { Services } from "./services.js";

class ProdutosServices extends Services{
  constructor(){
    super('produtos');
  }
}

export default ProdutosServices;