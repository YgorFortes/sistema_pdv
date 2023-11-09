import db from "../db/conecaodb.js";
import { Services } from "./services.js";

class ClientesServices extends Services{
  constructor(){
    super('clientes');
  }
}

export default ClientesServices;