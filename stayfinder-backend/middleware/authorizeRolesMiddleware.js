const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    let userRoles = req.user.role;

    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    
    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }

    next();
  };
};
module.exports = authorizeRoles;