import yup from 'yup';

const clienteSchema = yup.object({
  body: yup.object().shape({
    nome: yup.string().trim().required('O campo nome é obrigatório.').max(45, 'Máximo 45 caracteres'),
    email: yup.string().email('O campo precisa ser um email válido.').trim().required('O campo email é obrigatório.'),
    cpf: yup.string().trim().required('O campo cpf é obrigatório.')
    .matches(
      /^\d{3}[\.-]?\d{3}[\.-]?\d{3}-?\d{2}$/,
      'O campo cpf precisa ser válido.'
    )
    .transform((cpf)=> {
      const cpfFormatado  = cpf.replace(/[.\-\/\s]/g, '');
      return cpfFormatado
    }),
    cep: yup.string().trim()
    .matches(/^\d{5}-?\d{3}$/    , 'O campo cep precisa ser válido.')
    .transform((cep)=> {
      const cepFormatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
      return cepFormatado;
    }),
    rua: yup.string().trim().max(45, 'Máximo 45 caracteres'),
    numero: yup.number(),
    bairro: yup.string().trim().max(45, 'Máximo 45 caracteres'),
    cidade: yup.string().trim().max(45, 'Máximo 45 caracteres'),
    estado: yup.string().trim().max(45, 'Máximo 45 caracteres'),
  }),
  
  params: yup.object().shape({
    id: yup.number()
    .typeError('O parâmetros id de produtos na url só recebe números')
    .positive('O parâmetros id de produtos na url só recebe números positivos')
    .integer('O parâmetros id de produtos na url só recebe números inteiros')
    .required('O parâmetros id de produtos na url é obigatório')
  }),
  query: yup.object().shape({
    aleatorio: yup.number()
    .typeError('O query categoria_id na url só recebe números')
    .positive('O query categoria_id na url só recebe números só recebe números positivos')
    .integer('O query categoria_id na url só recebe números só recebe números inteiros')
  })
})

export {clienteSchema}


