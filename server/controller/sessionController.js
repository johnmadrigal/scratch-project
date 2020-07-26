const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
  return next();
};

module.exports = sessionController;
