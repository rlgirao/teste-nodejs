import nodemailer from 'nodemailer';

export default async (para, assunto, mensagem) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'curso.teste.nodejs@gmail.com',
      pass: '123!@#456!@#',
    },
  });

  const mailOptions = {
    from: 'curso.teste.nodejs@gmail.com',
    to: para,
    subject: assunto,
    text: mensagem,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar o e-mail:', error);
    } else {
      console.log('E-mail enviado com sucesso:', info.response);
    }
  });
};
