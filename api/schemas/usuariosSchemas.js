import yup from 'yup';

const usuarioCadastrarSchema = yup.object({
  body: yup.object({
    nome: yup.string().required('O campo nome é obrigatório.').max(45).trim(),
    email: yup.string().email('O campo precisa ser um email válido.').required('O campo email é obrigatório.').trim().lowercase(),
    senha: yup.string().required('O campo senha é obrigatório.').trim()
    .matches(
      /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[A-Za-z\d@#$%&*_-]/ , 
      'A senha precisa ter pelo menos uma letra maiúsculas , minúsculas, um número e um carácter especial.'
    )
  }),
})

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email('O campo precisa ser um email válido.').required('O campo email é obrigatório.').trim().lowercase(),
    senha: yup.string().required('O campo senha é obrigatório.')
  }),
});

const usuarioEditaroSchema = yup.object({
  body: yup.object({
    nome: yup.string().required('O campo nome é obrigatório.').trim(),
    email: yup.string().email('O campo precisa ser um email válido.').required('O campo email é obrigatório.').trim().lowercase(),
    senha: yup.string().required('O campo senha é obrigatório.')
    .matches(
      /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[A-Za-z\d@#$%&*_-]/ , 
      'A senha precisa ter pelo menos uma letra maiúscula , e uma minúsculas, um número e um carácter especial.'
    )
  }),
});



export  {usuarioCadastrarSchema, loginSchema, usuarioEditaroSchema};