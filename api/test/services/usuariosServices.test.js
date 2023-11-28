import UsuariosServices from "../../services/usuariosServices.js";
const usuariosServices = new UsuariosServices();
import {usuarioCadastrarSchema, loginSchema, usuarioEditaroSchema} from '../../schemas/usuariosSchemas.js';
import bcrypt from 'bcrypt';
import {describe , expect, it, jest} from '@jest/globals';


describe('Testando schema yup de cadastro', ()=>{
  
  //arrange 
  it('O usuário deve possuir senha ao cadastrar', async()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      email: 'emaila@email.com',
    }

   await expect(usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo senha é obrigatório.');

  })

  it('O usuário deve possuir email ao cadastrar', async ()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      senha: 'Ygor_45431820',
    }

   await expect(usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo email é obrigatório.');
  })

  it('O usuário deve possuir nome ao cadastrar', async ()=>{
    const usuarioMockSchema = {
      email: 'emaila@email.com',
      senha: 'Ygor_45431820',
    }

   await expect(usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo nome é obrigatório.');
  })

  it('O usuário deve colocar senha no formato correto', async()=>{
    const usuarioMockSchema = {
      email: 'emaila@email.com',
      senha: '1'
    }

    await expect(usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('A senha precisa ter pelo menos uma letra maiúsculas , minúsculas, um número e um carácter especial.');
  })

  it('Deve validar os campos digitados corretamente', async()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      email: 'emaila@email.com',
      senha: 'Ygor_45431820',
    }
    
    const resultado = await usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema);
    expect(resultado).toMatchObject(usuarioMockSchema);
  })

})

describe('Testando cadastro de UsuariosSerivces' ,()=>{
  //arrange
  it('Não se pode cadastrar se email for duplicado ', async()=>{

    const usuarioMockSchema = {
      nome: 'Email',
      email: 'ygorsilva532@gmail.com',
      senha: 'Ygor_45431820',
    }
 

    await expect(usuariosServices.criarUsuario(usuarioMockSchema)).rejects.toThrow('Email já cadastrado');
  })

  it('Deve cadastrar o usuário com sucesso', async()=>{
    
    const usuarioMockSchema = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
 
    const {mensagem, usuario} = await usuariosServices.criarUsuario(usuarioMockSchema);
    const id = usuario.id;

    expect(mensagem).toEqual('Usuário cadastrado com sucesso.');
    expect(usuarioMockSchema.email).toEqual(usuario.email);

    await usuariosServices.excluirUsuario(id);
  })

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async()=>{
    const usuarioMockSchema = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
 
    const {usuario} = await usuariosServices.criarUsuario(usuarioMockSchema);
    const {id} = usuario;
    const usuarioBuscado = await usuariosServices.detalharUsuarioComSenha(id);

    const senhasIguais = await bcrypt.compare(usuarioMockSchema.senha, usuarioBuscado.senha);
 

    expect(senhasIguais).toStrictEqual(true);
    await usuariosServices.excluirUsuario(id);
  })

  it('Ao cadastrar um usuário, validar o retorno das informações do usuário', async()=>{
    const usuarioMockSchema = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }

    const {usuario} = await usuariosServices.criarUsuario(usuarioMockSchema);
    
    usuarioMockSchema.id = usuario.id;
    const id = usuario.id;

    expect(usuarioMockSchema.email).toEqual(usuario.email);

    await usuariosServices.excluirUsuario(id);
  })
})

describe('Testando schema yup de login', ()=>{
  it('O usuário deve possuir senha ao fazer login', async()=>{

    const usuarioMockSchema = {
      email: 'emaila@email.com',
    }

   await expect(loginSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo senha é obrigatório.');

  });

  it('O usuário deve possuir email ao cadastrar', async ()=>{
    const usuarioMockSchema = {
      senha: 'Ygor_45431820',
    }

   await expect(usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo email é obrigatório.');
  })
});

describe('Testando login de usuarioServices', ()=>{
  it('O login deve validar se o usuário estar cadastrado', async()=>{
    const usuarioMock = {
      email: 'qualquerEmail@email.com',
      senha: 'Ygor_45431820'
    }

    await expect(usuariosServices.autenticarUsuario(usuarioMock)).rejects.toThrow('Usuário não encontrado');
  })

  it('O login deve validar se a senha é válida', async()=>{
    const usuarioMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
 
    const {usuario} = await usuariosServices.criarUsuario(usuarioMock);
    const {id} = usuario;

    const usuarioLoginMock = {
      email: usuarioMock.email,
      senha: 'usuarioMock.senha'
    }

    await expect(usuariosServices.autenticarUsuario(usuarioLoginMock)).rejects.toThrow('Senha inválida');

    await usuariosServices.excluirUsuario(id);

  })

  it('O login deve mandar uma mensagem de sucesso e um token', async()=>{

    const usuarioMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
 
    const {usuario} = await usuariosServices.criarUsuario(usuarioMock);
    const {id} = usuario;


    const usuarioLogin = {
      email: usuarioMock.email,
      senha: usuarioMock.senha
    }
   

    const resultado = await usuariosServices.autenticarUsuario(usuarioLogin);
    expect(resultado.mensagem).toEqual('Usuário logado com sucesso');
    expect(resultado).toHaveProperty('token');

    await usuariosServices.excluirUsuario(id);
  })
});

describe('Testando schema yup de atualizar usuario', ()=>{
  it('O usuário deve preencher nome ao atualizar', async()=>{
    const usuarioMockSchema = {
      email: 'Ygor@gmail.com',
      senha: 'Ygor_45431820',
    }

   await expect(usuarioEditaroSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo nome é obrigatório.');
  })

  it('O usuário deve preencher email ao atualizar', async()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      senha: 'Ygor_45431820',
    }

   await expect(usuarioEditaroSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo email é obrigatório.');
  })

  it('O usuário deve preencher senha ao atualizar', async()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      email: 'Ygor@gmail.com',
    }

   await expect(usuarioEditaroSchema.fields.body.validate(usuarioMockSchema)).rejects.toThrow('O campo senha é obrigatório.');
  })

  it('Deve validar os campos digitados corretamente', async()=>{
    const usuarioMockSchema = {
      nome: 'Ygor',
      email: 'emaila@email.com',
      senha: 'Ygor_45431820',
    }
    
    const resultado = await usuarioCadastrarSchema.fields.body.validate(usuarioMockSchema);
    expect(resultado).toMatchObject(usuarioMockSchema);
  })
})

describe('Testando atualizarUsuario de usuarioServices', ()=>{
  it('Ao atualizar, o usuário deve colocar um email não cadastrado no banco de dados ', async()=>{

   //Criando cadastro para usuario 1
    const usuarioCadastroMock1 = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
    
    const {usuario} = await usuariosServices.criarUsuario(usuarioCadastroMock1);
    const idUsuario1 = usuario.id;


    //Criando cadastro para usuario 2
    const usuarioCadastroMock2 = {
      nome: 'Camila',
      email: 'camila@gmail.com',
      senha: 'Ygor_45431820',
    }
 
    const resultado = await usuariosServices.criarUsuario(usuarioCadastroMock2);
    const idUsuario2 = resultado.usuario.id;
 

    //Tentando atualizar usuario 1 com  o email de usuario 2
    const usuarioAtualizarMock = {
      nome: 'Cristiane',
      email: usuarioCadastroMock2.email,
      senha: 'Ygor_45431820'
      
    }

    await expect(usuariosServices.atualizarUsuario(usuarioAtualizarMock, idUsuario1)).rejects.toThrow('Email já cadastrado em outra conta.');

    await usuariosServices.excluirUsuario(idUsuario1);
    await usuariosServices.excluirUsuario(idUsuario2);
  })

  it('Ao usuário atualizar, deve mandar uma mensagem de sucesso', async()=>{
    //Criando o usuario
    const usuarioCadastroMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
    
    const {usuario} = await usuariosServices.criarUsuario(usuarioCadastroMock);
    const idUsuario = usuario.id;


    const usuarioAtualizarMock = {
      nome: 'Cristiane',
      email: 'meunovoemail@gmail.com',
      senha: 'Ygor_45431820'
    }

    const resultado = await usuariosServices.atualizarUsuario(usuarioAtualizarMock, idUsuario);

    expect(resultado.mensagem).toEqual('Usuário atualizado com sucesso.');

    expect(usuarioCadastroMock.email).toEqual(usuario.email);

    await usuariosServices.excluirUsuario(idUsuario);
  })

  it('Deve criptografar a senha quando atualizar usuario', async()=>{

    //Criando um usuário
    const usuarioCadastroMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
    
    const {usuario} = await usuariosServices.criarUsuario(usuarioCadastroMock);
    const idUsuario = usuario.id;

    //Atualizando o usuario
    const usuarioAtualizarMock = {
      nome: 'Cristiane',
      email: 'meunovoemail@gmail.com',
      senha: 'Ygor_45431820'
    }

    const resultado = await usuariosServices.atualizarUsuario(usuarioAtualizarMock, idUsuario);
    
    //resgatando o usuário com um metodo que mostra a senha
    const usuarioSenha = await usuariosServices.detalharUsuarioComSenha(resultado.usuario.id);
  
    //Comparando as senhas
    const senhasIguais = await bcrypt.compare(usuarioAtualizarMock.senha, usuarioSenha.senha);

    expect(senhasIguais).toStrictEqual(true);

    await usuariosServices.excluirUsuario(idUsuario);
  })
})

describe('Testando detalharLogin usuarioServices', ()=>{

  it('Usuário deve existir ', async()=>{
    const id = 9000000000000000000000000000;

    await expect(usuariosServices.detalharUsuario(id)).rejects.toThrow('Usuário não encontrado.');
  })
  it('Detalha usuário com sucesso', async()=>{
    //Criando um usuário
    const usuarioCadastroMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
    
    const {usuario} = await usuariosServices.criarUsuario(usuarioCadastroMock);
    const idUsuario = usuario.id;

    const resultado = await usuariosServices.detalharUsuario(idUsuario);

    expect(resultado).toEqual({
      id: idUsuario,
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
    });

    expect(resultado).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        nome: expect.any(String),
        email: expect.any(String),
      })
    )

    await usuariosServices.excluirUsuario(idUsuario);
  })

})

describe('Testando excluirLogin de usuarioServices', ()=>{
  it('Deve excluir usuario com sucesso', async()=>{
    //Criando um usuário
    const usuarioCadastroMock = {
      nome: 'Email',
      email: 'ygorlapachola@gmail.com',
      senha: 'Ygor_45431820',
    }
    
    const {usuario} = await usuariosServices.criarUsuario(usuarioCadastroMock);
    const idUsuario = usuario.id;

    const resultado = await usuariosServices.excluirUsuario(idUsuario);

    await expect(usuariosServices.detalharUsuario(idUsuario)).rejects.toThrow('Usuário não encontrado.');
    expect(resultado.mensagem).toEqual('Usuário excluido com sucesso.');
  })

  it('Usuário deve existir', async()=>{
    const id =90000000000000000;
    await expect(usuariosServices.detalharUsuario(id)).rejects.toThrow('Usuário não encontrado.');
  })
})



