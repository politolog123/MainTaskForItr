const isAdminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isadmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = isAdminMiddleware;