import yup from 'yup';


const produtosSchema = yup.object({
  body: yup.object().shape({
    descricao: yup.string().trim().required('O campo descricao é obrigatório.').max(45),
    quantidade_estoque: yup.number().integer('O campo quantidade_estoque só recebe números inteiros')
      .positive('O campo quantidade_estoque só recebe números positivos')
      .required('O campo quantidade_estoque é obrigatório.'
    ),
    valor: yup.number().positive('O campo valor só recebe número positivos').required('O campo valor é obrigatório.'),
    categoria_id: yup.number()
      .typeError('O campo categoria_id só recebe números')
      .integer('O campo categoria_id só recebe números inteiros')
      .positive('O campo categoria_id só recebe números positivos')
      .required('O campo categoria_id é obrigatório.'
    )
  }),
  params: yup.object().shape({
    id: yup.number()
    .typeError('O parâmetros id de produtos na url só recebe números')
    .positive('O parâmetros id de produtos na url só recebe números positivos')
    .integer('O parâmetros id de produtos na url só recebe números inteiros')
    .required('O parâmetros id de produtos na url é obigatório')
  }),
  query: yup.object().shape({
    categoria_id: yup.number()
    .typeError('O query categoria_id na url só recebe números')
    .positive('O query categoria_id na url só recebe números só recebe números positivos')
    .integer('O query categoria_id na url só recebe números só recebe números inteiros')
  })
})




export { produtosSchema }