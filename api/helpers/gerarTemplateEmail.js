function gerarTemplateEmail(cliente, pedidos, produtos){

  let produtosHtml = '';

  pedidos.pedido_produtos.forEach((pedido_produto, index)=>{
    produtosHtml +=  `
    <div class="pedido-section">
      <h2>Pedidos Comprados:</h2>
      <!-- Detalhes dos pedidos -->
      <ul class="details-list">
        <li><strong>Item:</strong> ${produtos[index].descricao}</li>
        <li><strong>Quantidade:</strong> ${pedido_produto.quantidade_produto}</li>
        <li><strong>Valor Produto:</strong> R$ ${pedido_produto.valor_produto}</li>
      </ul>
    </div>`
  });
      


  const htmlEmail = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalhes do Pagamento</title>
      <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4; /* Cor de fundo mais clara */
        color: #333333; /* Cor do texto principal */
    }

    .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff; /* Cor de fundo para o contêiner */
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    header {
        background-color: #3498db; /* Azul claro */
        color: #ffffff;
        text-align: center;
        padding: 20px;
        border-radius: 8px 8px 0 0;
    }

    h1 {
        color: #3498db; /* Azul claro */
        margin: 0;
    }

    p {
        color: #555555; /* Cor do texto um pouco mais escura para contraste */
        margin-bottom: 10px;
    }

    .pedido-section,
    .payment-details {
        margin-top: 20px;
        padding: 15px;
        background-color: #ecf0f1; /* Cinza azulado mais claro */
        border-radius: 8px;
    }

    .pedido-section h2,
    .payment-details h2 {
        color: #3498db; /* Azul claro */
        margin-top: 0;
    }

    .details-list {
        list-style: none;
        padding: 0;
    }

    .details-list li {
        margin-bottom: 10px;
        color: #555555; /* Cor do texto um pouco mais escura para contraste */
    }

    .button-container {
        text-align: center;
        margin-top: 20px;
    }

    .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        text-align: center;
        text-decoration: none;
        background-color: #3498db; /* Azul claro */
        color: #ffffff;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .button:hover {
        background-color: #2980b9; /* Azul um pouco mais escuro ao passar o mouse */
    }

    footer {
        margin-top: 20px;
        padding: 15px;
        background-color: #ecf0f1; /* Cinza azulado mais claro para o rodapé */
        text-align: center;
        border-radius: 0 0 8px 8px;
    }
      </style>
  </head>
  
  <body>
  
      <div class="container">
          <header>
              <h1>Detalhes do Pagamento</h1>
          </header>
  
          <p>Olá ${cliente.nome},</p>
          <p>Seu pedido foi concluído com sucesso!</p>
  
          ${produtosHtml}
  
          <!-- Detalhes do pagamento -->
          <div class="payment-details">
              <h2>Detalhes do Pagamento:</h2>
              <ul class="details-list">
                  <li><strong>Número do pedido:</strong> ${pedidos.pedido.id}</li>
                  <li><strong>Criado:</strong> ${pedidos.pedido.created_at}</li>
                  <li><strong>Valor Total:</strong> R$ ${pedidos.pedido.valor_total}</li>
              </ul>
          </div>
  
          <footer>
              <p>Obrigado pela sua preferência!</p>
          </footer>
      </div>
  
  </body>
  
  </html>
  
  `
  return htmlEmail;
}
export {gerarTemplateEmail}

