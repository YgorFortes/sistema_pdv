import PedidosServices from "../../services/PedidosServices.js";
const pedidoServices = new PedidosServices();

import ProdutosServices from "../../services/ProdutosServices.js";
const produtosServices = new ProdutosServices();

import ClientesServices from "../../services/ClientesServices.js";
const clienteServices = new ClientesServices();
import { enviarEmail } from "../../helpers/enviarEmail.js";

import { pedidoPostSchema, pedidoGetSchema } from "../../schemas/pedidoSchema.js";

import {
  describe, expect, it, jest,
} from '@jest/globals';



describe('Testando schema yup de get pedido', ()=>{
  it('Deve cliente_id só receber numero inteiros', async ()=>{
    
    const pedidoMock = {
      cliente_id: 'a',
    }

    const pedidoMock2 = {
      cliente_id: -4,
    }

    const pedidoMock3 = {
      cliente_id: 4.56,
    }


    await expect(pedidoPostSchema.fields.query.validate(pedidoMock)).rejects.toThrow('O query categoria_id na url só recebe números.');
    await expect(pedidoPostSchema.fields.query.validate(pedidoMock2)).rejects.toThrow('O query categoria_id na url só recebe números só recebe números positivos.');
    await expect(pedidoPostSchema.fields.query.validate(pedidoMock3)).rejects.toThrow('O query categoria_id na url só recebe números só recebe números inteiros.');
  })
})

describe('testando metodo listarPedidos',()=>{

  it('Deve retornar uma lista pedidos de cliente quando o cliente_id é fornecido', async ()=>{
    const cliente_id = 1;
    
    const resultados = await pedidoServices.listarPedidos({cliente_id});


    for(const resultado of resultados){
      expect(resultado.pedido.cliente_id).toEqual(cliente_id);
    }
   
  });

  it('Deve um erro de nenhum pedido associado ao cliente', async ()=>{
    const cliente_id = 100000000000000000000000000000000000;
    
    await expect(pedidoServices.listarPedidos({cliente_id})).rejects.toThrow(`Não existe compras associadas a este cliente.`);

  });
});

describe('Testando listarPedidoPorId', ()=>{
  it('Deve retornar um pedido, quando pedido existir', async()=>{
    const id = 1;
    const pedido = await pedidoServices.listarPedidoPorId(id);

    expect(pedido.id).toEqual(id);
  });

  it('Deve retornar um array vazio, quando pedido não existir', async()=>{
    const id = 100000000000000000000000;
    const pedido = await pedidoServices.listarPedidoPorId(id);
    expect(pedido).toEqual([]);
  })
})

describe('Testando schema yup de post pedido', ()=>{
  it('Deve ter o cliente_id preenchido', async()=>{
    const mockSchemPost = {
      pedido_produtos: [
          {
            produto_id: 1,
            quantidade_produto: 1
          },
          {
            produto_id: 2,
            quantidade_produto: 1
          }
      ]
    }
    const mockSchemPost2 = {
      cliente_id: 'a',
      pedido_produtos: [
          {
            produto_id: 1,
            quantidade_produto: 1
          },
          {
            produto_id: 2,
            quantidade_produto: 1
          }
      ]
    }

    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost)).rejects.toThrow('O campo cliente_id é obrigatório.');
    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost2)).rejects.toThrow('O campo cliente_id só recebe números');
  });

  it('Deve ter o produto_id preenchido', async()=>{
    const mockSchemPost = {
      cliente_id: 1,
      pedido_produtos: [
          {
            quantidade_produto: 1
          },
          {
            produto_id: 2,
            quantidade_produto: 1
          }
      ]
    }
    const mockSchemPost2 = {
      cliente_id: 1,
      pedido_produtos: [
          {
            produto_id: 'a',
            quantidade_produto: 1
          },
          {
            produto_id: 2,
            quantidade_produto: 1
          }
      ]
    }

    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost)).rejects.toThrow('O campo produto_id é obrigatório.');
    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost2)).rejects.toThrow('O campo produto_id só recebe números');

  });

  it('Deve ter o quantidade_produto preenchido', async()=>{
    const mockSchemPost = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: 1,
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    }
    const mockSchemPost2 = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: 1,
          quantidade_produto: 'd'
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    }

    const mockSchemPost3 = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: 1,
          quantidade_produto: 0
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    }

    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost)).rejects.toThrow('O campo quantidade_produto é obrigatório.');
    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost2)).rejects.toThrow('O campo quantidade_produto só recebe números');
    await expect(pedidoPostSchema.fields.body.validate(mockSchemPost3)).rejects.toThrow('O quantidade_produto deve ser maior que 0.');


  });
});

describe ('testando metodo criarPedidos', ()=>{
  it('Deve lançar um erro de cliente não encontrado', async ()=>{

    const pedidoMock = {
      cliente_id: 90000000000000000000000000000000,
      pedido_produtos: [
        {
          produto_id: 1,
          quantidade_produto: 1
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    };

    await expect(pedidoServices.criarPedido(pedidoMock)).rejects.toThrow('Cliente não encontrado.');
  })

  it('Deve lançar um erro se produto não existir', async ()=>{


    const pedidoMock = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: 100000000000000000000000000,
          quantidade_produto: 1
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    };

    await expect(pedidoServices.criarPedido(pedidoMock)).rejects.toThrow(`Produto não encontrado.`);
    
  });

  it('Deve lançar um erro se o produto estiver com falta de estoque', async ()=>{

    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const {cliente} = await clienteServices.criarCliente(clienteMock);

    expect(cliente).toMatchObject(clienteMock);
   


    const produtoMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque: 0
    }


    const {produto} = await produtosServices.cadastrarProduto(produtoMock);

  
    expect(produto).toMatchObject(produtoMock);

    const pedidoMock = {
      cliente_id:cliente.id,
      pedido_produtos: [
        {
          produto_id: produto.id,
          quantidade_produto: 1
        },
        {
          produto_id: 2,
          quantidade_produto: 1
        }
      ]
    };

    await expect(pedidoServices.criarPedido(pedidoMock)).rejects.toThrow(`Estoque do produto '${produto.descricao}' em falta.`);
    
    await produtosServices.excluirProduto(produto.id);
    await clienteServices.excluirCliente(cliente.id);
  });

  it('O valor unitário do produto, dever do  mesmo valor do produto, e se o valor total é a soma deles', async()=>{

    const produtoMock1 = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque: 1
    }

    const produtoMock2 = {
      descricao: "A guerra da papoula",
      categoria_id: 5,
      valor:50,
      quantidade_estoque: 1
    }

    const resultadoProdutos = [];

    const resultadoProduto1 = await produtosServices.cadastrarProduto(produtoMock1);
    const resultadoProduto2 = await produtosServices.cadastrarProduto(produtoMock2);

    resultadoProdutos.push(resultadoProduto1, resultadoProduto2);
      
    

    const pedidoMock = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: resultadoProduto1.produto.id,
          quantidade_produto: 1
        },
        {
          produto_id: resultadoProduto2.produto.id,
          quantidade_produto: 1
        },
      ]
    };

    const {mensagem, pedido} = await pedidoServices.criarPedido(pedidoMock);
    expect(mensagem).toEqual('Pedido Criado! Verifique o email');

    for(let index = 0; index < pedido.pedido_produtos.length; index++){
      expect(pedido.pedido_produtos[index].valor_produto).toEqual(resultadoProdutos[index].produto.valor);
    }

    expect(pedido.valor_total).toEqual((resultadoProduto1.produto.valor + resultadoProduto2.produto.valor))
  });


  it('Deve verificar se quando o pedido criado, a quantidade de produto for retirado de acordo com o pedido', async()=>{

    const produtoMock1 = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque: 10
    }


    const resultadoProduto1 = await produtosServices.cadastrarProduto(produtoMock1);

    const produtoAntesDoPedido = await produtosServices.listarProdutoPorId(resultadoProduto1.produto.id);

    

    const pedidoMock = {
      cliente_id: 1,
      pedido_produtos: [
        {
          produto_id: resultadoProduto1.produto.id,
          quantidade_produto: 1
        },
      ]
    };

    const {pedido} = await pedidoServices.criarPedido(pedidoMock);
    
    const produtoDepoisDoPedido = await produtosServices.listarProdutoPorId(resultadoProduto1.produto.id);

    for(let index = 0; index < pedido.pedido_produtos.length; index++){
      expect(pedido.pedido_produtos[index].quantidade_produto).toEqual((produtoAntesDoPedido.quantidade_estoque - produtoDepoisDoPedido.quantidade_estoque));
      expect(produtoDepoisDoPedido.quantidade_estoque).toEqual((produtoAntesDoPedido.quantidade_estoque - pedido.pedido_produtos[index].quantidade_produto) );
    }

  });

  it('Testando o envio de email', async()=>{


    const produtos = [];
    const produtoMock = {
      id: 135,
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque: 10
    }

    const produtoMock2 = {
      id: 134,
      descricao: "Camisa",
      categoria_id: 1,
      valor:250,
      quantidade_estoque: 10
    }


    produtos.push(produtoMock, produtoMock2);

    const cliente = {
      id: 46,
      nome: "Cristeane",
      email: "Cristeane@gmail.com",
      cpf: "45696325452",
    };

    const pedido = {
      id: 134,
      cliente_id: cliente.id,
      observacao: null,
      valor_total: 91,
      deletedAt: null,
      created_at: "2023-12-08T22:07:03.000Z",
      updated_at: "2023-12-08T22:07:03.000Z",
      pedido_produtos: [
        {
          id: 248,
          pedido_id: 134,
          produto_id: produtoMock.id,
          quantidade_produto: 1,
          valor_produto: 45.5,
          created_at: "2023-12-08T22:07:02.000Z",
          updated_at: "2023-12-08T22:07:02.000Z",
          deletedAt: null
        },
        {
          id: 249,
          pedido_id: 134,
          produto_id: produtoMock2.id,
          quantidade_produto: 1,
          valor_produto: 45.5,
          created_at: "2023-12-08T22:07:02.000Z",
          updated_at: "2023-12-08T22:07:02.000Z",
          deletedAt: null
        }
      ]
    };

    

    const respostaEnvio = await enviarEmail(cliente, pedido, produtos);
    expect(respostaEnvio.accepted).toEqual(expect.arrayContaining([expect.anything()]));
  });

 


})