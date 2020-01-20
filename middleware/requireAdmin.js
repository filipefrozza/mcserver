var requireAdmin = (req, res) => {
    if(req.user.admin || !res){
        return req.user.admin;
    }else{
        res.status(401).json({
            'msg': 'Você não está logado como administrador'
        });
    }
};

module.exports = requireAdmin;