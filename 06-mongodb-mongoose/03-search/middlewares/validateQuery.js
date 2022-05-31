module.exports = validateQuery = (ctx, next) => {
  if (!ctx.query.query) {
    ctx.status = 400;
    ctx.body = 'invalid query';
    return;
  }
  return next();
};
