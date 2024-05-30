const isProfileOwner = (req, res, next) => {
    const userId = req.userData.userId;
    const requestedUserId = req.params.userId;
  
    if (userId === parseInt(requestedUserId)) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden', message: 'Доступ запрещен' });
    }
  };
  
  module.exports = isProfileOwner;