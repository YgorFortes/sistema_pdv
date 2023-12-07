function gerarTemplateEmail(cliente, pedidos, produtos){
  const {pedido} = pedidos;
  let produtosHtml = '';

  pedidos.pedido_produtos.forEach((pedido_produto, index)=>{
    produtosHtml +=  `
    <table>
      <tr style="background-color: #f1f1f1;">
          <th style="text-align: left; min-width: 100px; padding: 10px 0 10px 10px; vertical-align: top;">Descrição:</th>
          <th style="text-align: left; min-width: 80px; padding: 10px 0 10px 10px; vertical-align: top;">Quantidade:</th>
          <th style="text-align: right; padding: 10px 10px 10px 0; vertical-align: top;">Valor:</th>
      </tr>
      <tr>
          <td style="padding-top: 15px; padding-left: 10px; word-break: break-all;">${produtos[index].descricao}</td>
          <td style="padding-top: 15px; padding-left: 10px; word-break: break-all;">${pedido_produto.quantidade_produto}s</td>
          <td style="text-align: right; padding-top: 15px; padding-right: 10px; word-break: break-all;">R$${pedido_produto.valor_produto}</td>
      </tr>
    </table>`
  });
      


  const htmlEmail = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalhes do Pagamento</title>
      <style>
          body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #858585;
          }
  
          .container {
              margin: 0 auto;
              max-width: 600px;
          }
  
          header {
              padding-top: 50px;
              text-align: center;
          }
  
          header img {
              max-width: 70px;
              height: auto;
              display: block;
              margin: 0 auto;
          }
  
          header div {
              font-weight: bold;
              font-size: 50px;
              line-height: 120px;
          }
  
          .content {
              background-color: #ffffff;
              padding: 30px;
          }
  
          .content div {
              text-align: center;
              line-height: 24px;
          }
  
          .content span {
              font-size: 18px;
              font-weight: bold;
          }
  
          table {
              width: 100%;
              font-size: 16px;
              line-height: 24px;
              border-spacing: 0;
              margin-bottom: 20px;
              border-top: 1px solid #e2e3e4;
          }
  
          th, td {
              padding: 15px;
          }
  
          .footer {
              padding: 20px 0;
          }
  
          .footer div {
              font-weight: bold;
              text-align: center;
              line-height: 26px;
          }
  
          .footer div p {
              font-size: 12px;
              color: #858585;
          }
      </style>
  </head>
  
  <body>
  
      <div class="container">
          <header>

          </header>
  
          <div class="content">
              <div>
                  <span>${cliente.nome},</span><br>
                  Seu pedido foi concluído.<br><br>
              </div>
  
              <table>
                  <tr>
                      <td style="padding-top: 15px;"><strong>ID do pedido:</strong></td>
                      <td style="padding-top: 15px;"><strong>Enviado para:</strong></td>
                  </tr>
                  <tr>
                      <td>${pedido.id}</td>
                      <td><a href="mailto:${cliente.email}" target="_blank">${cliente.email}</a></td>
                  </tr>
              </table>
  
              <div class="invoice-info">
                  <strong>AQUI ESTÁ O SEU PEDIDO:</strong>
              </div>
  
              ${produtosHtml}
              <!-- ... (outras seções e tabelas) ... -->
  
              <!-- Tabela para o valor total do pedido -->
              <table>
                  <tr>
                      <td style="text-align: right;"><strong>Total do Pedido:</strong></td>
                      <td style="text-align: right;">R$ ${pedido.valor_total}</td>
                  </tr>
              </table>
  
              <table>
                <tr>
                    <th></th>
                </tr>
                <tr>
                    <td style="padding-top: 15px;">
                        <div style="text-align: center;">
                            <strong>Agradecemos pela compra!</strong><br>
                        </div>
                    </td>
                </tr>
            </table>
          </div>
      </div>
  
  </body>
  
  </html>
  
  
  `
  return htmlEmail;
}
export {gerarTemplateEmail}

