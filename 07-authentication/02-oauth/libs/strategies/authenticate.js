const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) return done(null, false, 'Не указан email');
    const user = await User.findOne({email});
    if (!user) {
      const user = await User.create({email, displayName});
      return done(null, user);
    }
    return done(null, user);
  } catch (e) {
    return done(e);
  }
};
