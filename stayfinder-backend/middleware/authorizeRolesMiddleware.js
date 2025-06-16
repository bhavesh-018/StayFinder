const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.role; // note: it's `role` not `roles`
    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};

module.exports = authorizeRoles;