const isLoggedIn = (req, res, next)=> {
        if (req.isAuthenticated()) {
            const usu = req.user.rol;
            console.log(usu);
            return next();
        }
        return res.redirect('/login');
    }

const auth = (Permissions) => { //
    
    return (req, res, next) => {
        const usu = req.user.rol;
        console.log(usu);
        if (Permissions.includes(usu)){
            next();
        }
        else {
            res.redirect('/profile')
            }
    }
}
module.exports = { isLoggedIn, auth }
