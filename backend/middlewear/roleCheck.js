const roleCheck = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
      
      const userRole = req.user.role;
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({ msg: 'Access denied' });
      }
      
      next();
    };
  };
  
  module.exports = roleCheck;