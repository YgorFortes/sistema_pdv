import yup from 'yup';


const registroProdutosSchema = yup.object({
  body: yup.object({
    descricao: yup.string().trim().required('O campo descricao é obrigatório.').max(45),
    quantidade_estoque: yup.number().integer('O campo quantidade_estoque só recebe número inteiros')
      .positive('O campo quantidade_estoque só recebe número positivos')
      .required('O campo quantidade_estoque é obrigatório.'
    ),
    valor: yup.number().positive('O campo valor só recebe número positivos').required('O campo valor é obrigatório.'),
    categoria_id: yup.number()
      .typeError('O campo categoria_id só recebe números')
      .integer('O campo categoria_id só recebe número inteiros')
      .positive('O campo categoria_id só recebe número positivos')
      .required('O campo categoria_id é obrigatório.'
    )
  }),
})

export {registroProdutosSchema}