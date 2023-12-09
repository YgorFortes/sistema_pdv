import nodemailer from 'nodemailer';
import { gerarTemplateEmail } from './gerarTemplateEmail.js';

function enviarEmail(cliente, pedido, produtos){
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
    const htmlEmail = gerarTemplateEmail(cliente, pedido, produtos);
    const informacoes =  transporter.sendMail({
      from: `Ygor Fortes <${process.env.EMAIL_USER}>`,
      to: cliente.email,
      subject: 'Parabéns! Sua compra foi concluida com sucesso.',
      text: `Sua sua compra numero ${pedido.id}, foi concluida no dia ${pedido.created_at}. `,
      html: htmlEmail
    });
    
    return informacoes;
  } catch (erro) {
    throw erro;
  }
}



export {enviarEmail}