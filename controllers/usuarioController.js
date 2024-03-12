import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
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

    await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    });

    res.render('template/mensaje', {
        pagina: 'Cuenta Creada Exitosamente',
        mensaje: 'Hemos enviado un correo para confirmar tu cuenta. Revisa tu bandeja de entrada o la carpeta de spam.'
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
    registrar
}