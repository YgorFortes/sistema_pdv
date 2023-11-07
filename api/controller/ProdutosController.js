import Services from '../services/index.js';
const {ProdutosServices} = Services;
const produtosServices = new ProdutosServices;

class ProdutosControlller {
  static async listarProdutos(req, res){
    console.log('entrou na rota')
  }
}

export default ProdutosControlller;