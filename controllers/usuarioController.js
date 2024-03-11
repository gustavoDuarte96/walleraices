

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

const formularioOlvidePassword = (req, res) => {
    res.render('auth/password-recovery', {
        pagina: 'Recuperar Password'
    });
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}