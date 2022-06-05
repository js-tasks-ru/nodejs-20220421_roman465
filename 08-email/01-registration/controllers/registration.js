const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const newUser = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
  });
  await newUser.setPassword(ctx.request.body.password);
  const user = await newUser.save();
  await sendMail({
    to: user.email,
    subject: 'Регистрация на портале',
    template: 'confirmation',
    locals: {token},
  });
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({verificationToken: ctx.params.token});
  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
