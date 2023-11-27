import ProdutosServices from "../../services/ProdutosServices.js";
const produtosServices = new ProdutosServices();
import { produtosPostSchema } from "../../schemas/produtosSchema.js";
import Produto from "../../models/Produto.js";

describe('Testando listarProdutos de ProdutosServices', ()=>{
  it('Deve retornar um array de produtos pela categoria_id quando for colocado', async()=>{
    const categoria_id = 5;
    const produto = await produtosServices.listarProdutos(categoria_id);
    produto.forEach((itemproduto)=> {
     expect(itemproduto.categoria_id).toEqual(categoria_id);
    })
    expect(produto).toBeInstanceOf(Array);
  });

  it('Deve retorna um array vazio quando categoria não existir', async()=>{

    const categoria_id = 5000000000000000000;
    const produto= await produtosServices.listarProdutos(categoria_id);

    expect(produto).toEqual([]);
  });

  it('Deve retornar a lista de todos os produtos quando categoria_id não for passado', async()=>{
    
    const produtos= await produtosServices.listarProdutos();

    expect(Array.isArray(produtos)).toBe(true);
    produtos.forEach((produto)=>{
      expect(produto).toHaveProperty('id');
      expect(produto).toHaveProperty('descricao');
      expect(produto).toHaveProperty('quantidade_estoque');
      expect(produto).toHaveProperty('valor');
      expect(produto).toHaveProperty('categoria_id');
    });
  });

});

describe('Testando  listarProduto de ProdutosServices', ()=>{
  it('Deve voltar o produto correto quando ID válido fornecido', async()=>{
    const id = 1;

    const produto = await produtosServices.listarProdutoPorId(id);

    expect(produto.id).toEqual(id);
    expect(produto).toHaveProperty('id');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade_estoque');
    expect(produto).toHaveProperty('valor');
    expect(produto).toHaveProperty('categoria_id');
  })

  it('Deve retornar um array vazio se produto não encontrado', async()=>{
    const id = 10000000000000;

    const produto  = await produtosServices.listarProdutoPorId(id);

    expect(produto).toEqual([]);
  });
});

describe('testando schema yup cadastro de produtos', ()=>{
  it('Deve ter campo descricao preenchido', async ()=>{

    const mockProduto = {
      categoria_id: "1",
      valor:250,
      quantidade_estoque:"5"
    }

    await expect(produtosPostSchema.fields.body.validate(mockProduto)).rejects.toThrow('O campo descricao é obrigatório.');
  });

  it('Deve ter campo categoria_id preenchido', async ()=>{

    const mockProduto = {
      descricao: "HeadPhone show",
      valor:250,
      quantidade_estoque:"5"
    }

    await expect(produtosPostSchema.fields.body.validate(mockProduto)).rejects.toThrow('O campo categoria_id é obrigatório.');
  });

  it('Deve ter campo valor preenchido', async ()=>{

    const mockProduto = {
      descricao: "HeadPhone show",
      categoria_id: "1",
      quantidade_estoque:"5"
    }

    await expect(produtosPostSchema.fields.body.validate(mockProduto)).rejects.toThrow('O campo valor é obrigatório.');
  });

  it('Deve ter campo quantidade_estoque preenchido', async ()=>{

    const mockProduto = {
      descricao: "HeadPhone show",
      categoria_id: "1",
      valor:250,
    }

    await expect(produtosPostSchema.fields.body.validate(mockProduto)).rejects.toThrow('O campo quantidade_estoque é obrigatório.');
  });
});

describe('Testando cadastrarProduto em produtoServices', ()=>{
  it('Deve lançar um erro se categoria não existir', async()=>{
    const produtoMock = {
      descricao: "HeadPhone show",
      categoria_id: 90000000000000000000000,
      valor:250,
      quantidade_estoque:5
    }

    await expect(produtosServices.cadastrarProduto(produtoMock)).rejects.toThrow('Categoria não encontrado.');
  });

  it('Deve ter uma mensagem de sucesso, e o objeto do produto cadastrado', async()=>{
    const produtoMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }


    const {mensagem, produto} = await produtosServices.cadastrarProduto(produtoMock);

    expect(mensagem).toEqual('Produto cadastrado com sucesso.');
    expect(produto.descricao).toEqual(produtoMock.descricao);
    expect(produto).toHaveProperty('id');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade_estoque');
    expect(produto).toHaveProperty('valor');
    expect(produto).toHaveProperty('categoria_id');
    expect(produto).toMatchObject(produtoMock)
    await produtosServices.excluirProduto(produto.id);
  });
});

describe('Testando atualizarProduto em produtoService', ()=>{

  it('Deve lançar um erro se produto não existir', async ()=>{
    const idProduto = 900000000000000000000000 ;
    const produtoMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    await expect(produtosServices.atualizarProduto(idProduto, produtoMock )).rejects.toThrow('Produto não encontrado.');
  });

  it('Deve lançar um erro se produto não existir', async ()=>{

    const produtoCadastroMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    const {produto} = await produtosServices.cadastrarProduto(produtoCadastroMock);

    const produtoAtualizacaoMock = {
      descricao: "HeadPhone show",
      categoria_id: 90000000000000000000000,
      valor:250,
      quantidade_estoque:55
    }

    await expect(produtosServices.atualizarProduto(produto.id, produtoAtualizacaoMock )).rejects.toThrow('Categoria não encontrado.');

    await produtosServices.excluirProduto(produto.id);
  });

  it('Deve retornar uma mensagem de sucesso e o objeto atualizado', async()=>{
    const produtoCadastroMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    const {produto} = await produtosServices.cadastrarProduto(produtoCadastroMock);

    const produtoAtualizacaoMock = {
      descricao: "HeadPhone atualizado",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:55
    }

    const resultado = await produtosServices.atualizarProduto(produto.id, produtoAtualizacaoMock);

    expect(resultado.mensagem).toEqual('Produto atualizado com sucesso.');
    expect(resultado.produto.descricao).toEqual(produtoAtualizacaoMock.descricao);
    expect(resultado.produto).toMatchObject(produtoAtualizacaoMock);
    await produtosServices.excluirProduto(produto.id);
  });
});

describe('Testando desativarProduto de produtoServices', ()=>{
  it('Deve lançar um erro se produto não existe', async()=>{
    const idProduto = 90000000000000000000;

    await expect(produtosServices.desativarProduto(idProduto)).rejects.toThrow('Produto não encontrado.');
  });

  it('Deve lançar uma mensagem de sucesso, e o objeto desativado deve estar com propriedade diferente de null ', async()=>{

    const produtoCadastroMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    const {produto} = await produtosServices.cadastrarProduto(produtoCadastroMock);
 
    const resultado = await produtosServices.desativarProduto(produto.id);
 
    const [produtoDesativado] = await Produto.pegarDesativado({id: produto.id});
    expect(produtoDesativado.deletedAt).not.toBeNull();
    expect(resultado.mensagem).toEqual('Produto desativado com sucesso.');

    await produtosServices.ativarProduto(produto.id);

    await produtosServices.excluirProduto(produto.id);

  });

  it('Deve lançar uma mensagem de sucesso, e o objeto reativado deve estar com a propriedade igual null', async()=>{
    const produtoCadastroMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    const {produto} = await produtosServices.cadastrarProduto(produtoCadastroMock);
 
    await produtosServices.desativarProduto(produto.id);
 
    const resultado = await produtosServices.ativarProduto(produto.id);

    const resultadoProdutoAtivoBuscado = await produtosServices.listarProdutoPorId(produto.id);

    expect(resultadoProdutoAtivoBuscado.deletedAt).toBeNull();
    expect(resultado.mensagem).toEqual('Produto ativado com sucesso.');

    await produtosServices.excluirProduto(produto.id);
  });
});


describe('testando excluirProduto de produtoServices ', ()=>{
  it('Deve lançar um erro se produto não existir', async()=>{
    const idProduto = 90000000000000000000;

    await expect(produtosServices.excluirProduto(idProduto)).rejects.toThrow('Produto não encontrado.');
  });

  it('Deve lançar uma mensagem de sucesso, e o objeto não deve mais existir', async()=>{

    const produtoCadastroMock = {
      descricao: "HeadPhone show",
      categoria_id: 1,
      valor:250,
      quantidade_estoque:5
    }

    const {produto} = await produtosServices.cadastrarProduto(produtoCadastroMock);
 
    const resultado = await produtosServices.excluirProduto(produto.id);
 
    const produtoEncontrado = await produtosServices.listarProdutoPorId(produto.id);
    expect(resultado.mensagem).toEqual('Produto excluido com sucesso.');
    expect(produtoEncontrado).toEqual([]);

  });

})

