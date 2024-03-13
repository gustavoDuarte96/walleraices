import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    const { email, nombre, token } = datos;

    await transporter.sendMail({
        from: 'bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta',
        text: 'Confirma tu cuenta en bienesraices.com',
        html: `
            <h1>Confirma tu cuenta</h1>
            <p>Hola ${nombre}, haz click en el siguiente enlace para confirmar tu cuenta</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>
            <p>Si no has sido tu, ignora este mensaje</p>
        `
    })
}

export {
    emailRegistro
}