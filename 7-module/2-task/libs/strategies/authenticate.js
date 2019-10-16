const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

  if (email === undefined || email === null) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    await User.create({email: email, displayName: displayName}, function (err, createdUser) {
      if (err) return done(err, false, 'Cant save user to db');
      return done(null, createdUser);
    });
  } else {
    return done(null, user);
  }
};
