const logger = require('./logger');

exports.handle = (error, res) => {
  logger.error(error);
  res.status(500).json({ error: 'An unexpected error occurred' });
};