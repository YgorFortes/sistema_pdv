import db from "../db/conecaodb.js";
import { Services } from "./services.js";

class CategoriasServices extends Services{
  constructor(){
    super('categorias');
  }
}

export default CategoriasServices