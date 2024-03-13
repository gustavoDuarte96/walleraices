import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    // Verificar si hay errores
    await check('nombre').not().isEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Email no válido').run(req);
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('repetir_password').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }
    ).run(req);

    console.log(req.body);
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    //Extraer datos
    const {nombre, email, password} = req.body;

    //Verificar si el email ya está registrado
    const existeUsuario = await Usuario.findOne({where: {email: email}});

    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [
                {
                    msg: 'El email ya está registrado'
                }
            ],
            usuario: {
                nombre: nombre,
                email: email
            }
        });
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    });

    //Envia mail de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    res.render('template/mensaje', {
        pagina: 'Cuenta Creada Exitosamente',
        mensaje: 'Hemos enviado un correo para confirmar tu cuenta. Revisa tu bandeja de entrada o la carpeta de spam.'
    });
}

//Funcion que comprueba una cuenta

const confirmar = async (req, res) => {
    const usuario = await Usuario.findOne({where: {token: req.params.token}});

    if(!usuario){
        return res.render('auth/confirmar_cuenta', {
            pagina: 'Cuenta no confirmada',
            mensaje: 'La cuenta ya ha sido confirmada o el token es incorrecto',
            error: true
        });
    }

    usuario.confirmado = 1;
    usuario.token = null;
    await usuario.save();

    return res.render('auth/confirmar_cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta ha sido confirmada exitosamente',
        console: false
    });
}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/password-recovery', {
        pagina: 'Recuperar Password'
    });
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar
}