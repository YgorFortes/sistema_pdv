import nodemailer from 'nodemailer';

function enviarEmail(email, pedido){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      type: 'OAuth2',
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
    
  })

  try {
    const informacoes =  transporter.sendMail({
      from: `Ygor Fortes <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Parabéns! Sua compra foi concluida com sucesso.',
      text: `Sua sua compra numero ${pedido.id}, foi concluida no dia ${pedido.created_at}. `,
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Compra Concluída</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333;
              background-color: #f5f5f5;
            }
            p {
              margin: 0 0 1em;
            }
          </style>
        </head>
        <body>
          <p>Sua sua compra numero ${pedido.id}, foi concluida no dia ${pedido.created_at}.</p>
        </body>
      </html>
      `
    });
    return informacoes;
  } catch (erro) {
    throw erro;
  }
}


function gerarHtmlEmail(pedido){

}

export {enviarEmail}