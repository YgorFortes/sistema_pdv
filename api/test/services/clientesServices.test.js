import ClientesServices from "../../services/ClientesServices.js";
const clienteServices = new ClientesServices();
import { clientePostSchema, clientePutSchema, clienteGetSchema, clienteDeleteSchema } from "../../schemas/clientesSchema.js";
import { verificarEmailCpfUnicos } from "../../services/ClientesServices.js";
import Cliente from "../../models/Cliente.js";
import {describe , expect, it, jest} from '@jest/globals';

describe('Testando listarClientes no ClienteServices', ()=>{
  it('Deve trazer um array de clientes com propriedades de id, nome, e cpf ', async ()=>{
    const clientes = await clienteServices.listarClientes();

    clientes.forEach((cliente)=>{
      expect(cliente).toHaveProperty('id');
      expect(cliente.id).not.toBeNull();
      expect(cliente).toHaveProperty('nome');
      expect(cliente.nome).not.toBeNull();
      expect(cliente).toHaveProperty('cpf');
      expect(cliente.cpf).not.toBeNull();
    })

    expect(Array.isArray(clientes)).toBe(true);
  })
});

describe('Testando listarClientePorId no ClienteServices', ()=>{
  it('Deve retornar um array vazio se o cliente não existir', async ()=>{
    const idCliente = 900000000000000000000000000000;

    const cliente = await clienteServices.listarClientePorId(idCliente);
    expect(Array.isArray(cliente)).toBe(true);
    expect(cliente).toEqual([]);
  })

  it('Deve retornar um objeto conforme o id dele', async ()=>{
    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const {cliente} = await clienteServices.criarCliente(clienteMock);

    const clienteBuscado = await clienteServices.listarClientePorId(cliente.id);
    expect(clienteBuscado).toMatchObject(clienteMock);
    await clienteServices.excluirCliente(cliente.id);
  });

});

describe('Testando o schema de yup ao cadastrar cliente', ()=>{
  it('Deve ter o campo nome preenchido ao cadastrar cliente', async ()=>{
    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
    
    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('O campo nome é obrigatório.');
  })

  it('Deve ter o campo cpf preenchido ao cadastrar cliente', async ()=>{
    const clienteMock = {
      email:"Junior@gmail.com",
      nome: "Junior"
    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('O campo cpf é obrigatório.');
  })

  it('Deve ter o campo cpf além de preenchido deve ser do formato correto', async ()=>{
    const clienteMock = {
      cpf:"ia",
      email:"Junior@gmail.com",
      nome: "Junior"
    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('O campo cpf precisa ser válido.');
  })

  it('Deve ter o campo email preenchido ao cadastrar cliente', async ()=>{
    const clienteMock = {
      nome: "Junior",
      cpf:"52489636978",
    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('O campo email é obrigatório.');
  })

  it('Ser o campo cep for preenchido, deve ser do formato correto', async ()=>{
    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
      cep: '4a5'
    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('O campo cep precisa ser válido.');
  })

  it('Ser o campo numero for preenchido, deve ser do somente numeros', async ()=>{
    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
      numero: "aaaaa"

    }

    await expect(clientePostSchema.fields.body.validate(clienteMock)).rejects.toThrow('Só é válido números.');
  })
});

describe('Testando o cadastrarCliente no ClienteServices', ()=>{

  it('Deve lançar erro de cliente já ter cpf cadastrado', async()=>{

    //Cliente que estar cadastrado antes 
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

    //Cliente tentando cadastrar
    const clienteMock2 = {
      cpf:"52489636978",
      email:"Camila@gmail.com",
      nome: "Camila",
    }



    await expect(clienteServices.criarCliente(clienteMock2)).rejects.toThrow('Cpf já cadastrado.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    
  });

  it('Deve lançar erro de cliente já ter email cadastrado', async()=>{

    //Cliente que estar cadastrado antes 
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

    //Cliente tentando cadastrar
    const clienteMock2 = {
      cpf:"45263989654",
      email:"Junior@gmail.com",
      nome: "Camila",
    }



    await expect(clienteServices.criarCliente(clienteMock2)).rejects.toThrow('Email já cadastrado.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    
  });

  it('Deve lançar erro de cliente já ter email e cpf já cadastrado', async()=>{

    //Cliente que estar cadastrado antes 
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

    //Cliente tentando cadastrar
    const clienteMock2 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Camila",
    }

    await expect(clienteServices.criarCliente(clienteMock2)).rejects.toThrow('Cpf e email já cadastrados.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    
  });

  it('Dever criar um novo cliente com sucesso', async ()=>{
    //Cliente que estar cadastrado antes 
    const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const {mensagem, cliente} = await clienteServices.criarCliente(clienteMock);

    expect(cliente).toMatchObject(clienteMock);
    expect(mensagem).toEqual('Cliente cadastrado.');
    await clienteServices.excluirCliente(cliente.id);
  });
});

describe('Testando atualizarCliente de ClienteServices', ()=>{
  it('Deve lançar erro de cliente já ter cpf cadastrado', async()=>{

    //Cliente que estar cadastrado 1
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

     //Cliente que estar cadastrado 2
    const clienteMock2 = {
      cpf:"56396358745",
      email:"Camila@gmail.com",
      nome: "Camila",
    }


    const resultado2 = await clienteServices.criarCliente(clienteMock2);

    const clienteAtualizacaoMock = {
      cpf:"52489636978",
      email:"Camila@gmail.com",
      nome: "Camila",
    }


    await expect(clienteServices.atualizarCliente(resultado2.cliente.id, clienteAtualizacaoMock)).rejects.toThrow('Cpf já cadastrado.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    await clienteServices.excluirCliente(resultado2.cliente.id);
  });

  it('Deve lançar erro de cliente já ter email cadastrado', async()=>{

    //Cliente que estar cadastrado 1
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

     //Cliente que estar cadastrado 2
    const clienteMock2 = {
      cpf:"56396358745",
      email:"Camila@gmail.com",
      nome: "Camila",
    }


    const resultado2 = await clienteServices.criarCliente(clienteMock2);

    const clienteAtualizacaoMock = {
      cpf:"12556324585",
      email:"Junior@gmail.com",
      nome: "Camila",
    }


    await expect(clienteServices.atualizarCliente(resultado2.cliente.id, clienteAtualizacaoMock)).rejects.toThrow('Email já cadastrado.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    await clienteServices.excluirCliente(resultado2.cliente.id);
    
  });

  it('Deve lançar erro de cliente já ter email e cpf já cadastrado', async()=>{

    //Cliente que estar cadastrado 1
    const clienteMock1 = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const resultado1 = await clienteServices.criarCliente(clienteMock1);

    //Cliente que estar cadastrado 2
    const clienteMock2 = {
      cpf:"56396358745",
      email:"Camila@gmail.com",
      nome: "Camila",
    }


    const resultado2 = await clienteServices.criarCliente(clienteMock2);

    const clienteAtualizacaoMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Camila",
    }


    await expect(clienteServices.atualizarCliente(resultado2.cliente.id, clienteAtualizacaoMock)).rejects.toThrow('Cpf e email já cadastrados.');

    await clienteServices.excluirCliente(resultado1.cliente.id);
    await clienteServices.excluirCliente(resultado2.cliente.id);
  });

  it('Deve atualizar cliente com sucesso', async ()=>{
    //Cliente que estar cadastrado 1
    const clienteMock2 = {
      cpf:"56396358745",
      email:"Camila@gmail.com",
      nome: "Camila",
    }


    const resultado2 = await clienteServices.criarCliente(clienteMock2);

    const clienteAtualizacaoMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Camila",
    }


    const resultado = await clienteServices.atualizarCliente(resultado2.cliente.id, clienteAtualizacaoMock);

    expect(resultado.mensagem).toEqual('Cliente atualizado com sucesso.');
    expect(resultado.cliente.cpf).toEqual(clienteAtualizacaoMock.cpf);
    expect(resultado.cliente).toMatchObject(clienteAtualizacaoMock);

    await clienteServices.excluirCliente(resultado.cliente.id);
  })
});

describe('Testando excluirCLiente de ClienteServices', ()=>{
  it('Deve lançar um erro se cliente não existe', async ()=>{
    const idCliente = 9000000000000000000000000000000000;

    await expect(clienteServices.excluirCliente(idCliente)).rejects.toThrow('Cliente não encontrado.');
  });

  it('Deve excluir cliente com sucesso', async()=>{
     //Cliente que estar cadastrado 1
     const clienteMock = {
      cpf:"52489636978",
      email:"Junior@gmail.com",
      nome: "Junior",
    }

    const {cliente} = await clienteServices.criarCliente(clienteMock);

    const resultado = await clienteServices.excluirCliente(cliente.id);

    expect(resultado.mensagem).toEqual('Cliente excluido com sucesso.');

    const clienteBuscado = await clienteServices.listarClientePorId(cliente.id);
    expect(clienteBuscado).toEqual([]);
  })
})