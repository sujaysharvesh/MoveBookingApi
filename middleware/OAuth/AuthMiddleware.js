

export const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    } else {
        res.status(401).json({message: "You needed to be login to access the router"})
    }
}