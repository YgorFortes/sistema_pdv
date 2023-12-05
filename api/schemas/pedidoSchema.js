import yup from 'yup';

const pedidoPostSchema = yup.object({
  body: yup.object().shape({
    cliente_id:yup.number()
      .typeError('O campo cliente_id só recebe números')
      .integer('O campo cliente_id só recebe números inteiros')
      .positive('O campo cliente_id só recebe números positivos')
      .required('O campo cliente_id é obrigatório.'
    ),
    observacao: yup.string().trim(),
    pedido_produtos: yup.array().of(
      yup.object().shape({
        produto_id: yup.number()
          .typeError('O campo produto_id só recebe números')
          .integer('O campo produto_id só recebe números inteiros')
          .positive('O campo produto_id só recebe números positivos')
          .required('O campo produto_id é obrigatório.'
        ),
        quantidade_produto: yup.number().min(0, 'O quantidade_produto deve ser igual ou maior que 0')
          .typeError('O campo quantidade_produto só recebe números')
          .integer('O campo quantidade_produto só recebe números inteiros')
          // .positive('O campo quantidade_produto só recebe números positivos')
          .required('O campo quantidade_produto é obrigatório.'
        ),
      })
    ),
  }),
  
  params: yup.object().shape({
    id: yup.number()
    .typeError('O parâmetros id de clientes na url só recebe números.')
    .positive('O parâmetros id de clientes na url só recebe números positivos.')
    .integer('O parâmetros id de clientes na url só recebe números inteiros.')
    .required('O parâmetros id de clientes na url é obigatório.')
  }),
  query: yup.object().shape({
    cliente_id: yup.number()
    .typeError('O query categoria_id na url só recebe números.')
    .positive('O query categoria_id na url só recebe números só recebe números positivos.')
    .integer('O query categoria_id na url só recebe números só recebe números inteiros.')
  })
});

const pedidoGetSchema = yup.object({
  body: yup.object().shape({
    cliente_id:yup.number()
      .typeError('O campo cliente_id só recebe números')
      .integer('O campo cliente_id só recebe números inteiros')
      .positive('O campo cliente_id só recebe números positivos')
      .required('O campo cliente_id é obrigatório.'
    ),
    observacao: yup.string().trim(),
    pedido_produtos: yup.array().of(
      yup.object().shape({
        produto_id: yup.number()
          .typeError('O campo produto_id só recebe números')
          .integer('O campo produto_id só recebe números inteiros')
          .positive('O campo produto_id só recebe números positivos')
          .required('O campo produto_id é obrigatório.'
        ),
        quantidade_produto: yup.number().min(0, 'O quantidade_produto deve ser igual ou maior que 0')
          .typeError('O campo quantidade_produto só recebe números')
          .integer('O campo quantidade_produto só recebe números inteiros')
          // .positive('O campo quantidade_produto só recebe números positivos')
          .required('O campo quantidade_produto é obrigatório.'
        ),
      })
    ),
  }),
  
  params: yup.object().shape({
    id: yup.number()
    .typeError('O parâmetros id de clientes na url só recebe números.')
    .positive('O parâmetros id de clientes na url só recebe números positivos.')
    .integer('O parâmetros id de clientes na url só recebe números inteiros.')
    .required('O parâmetros id de clientes na url é obigatório.')
  }),
  query: yup.object().shape({
    cliente_id: yup.number()
    .typeError('O query categoria_id na url só recebe números.')
    .positive('O query categoria_id na url só recebe números só recebe números positivos.')
    .integer('O query categoria_id na url só recebe números só recebe números inteiros.')
  })
})



export {pedidoPostSchema, pedidoGetSchema}


