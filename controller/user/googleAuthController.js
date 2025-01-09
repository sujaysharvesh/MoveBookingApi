

export const loginSuccess = (req, res) => {
    if (req.user) {
      res.status(200).json({
        message: "Logged in successfully",
        user: req.user,
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  };
  
export const logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return res.status(500).json({message: "Logout Failed", error: err})
        }
        res.status(200).json({message: "Logged out Successfully"})
    })
}