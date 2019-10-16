const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {session: false, usernameField: 'email', passwordField: 'password'},
  async function(email, password, done) {

    const user = await User.findOne({email});

    if (!user) {
      return done(null, false, 'Нет такого пользователя');
    }

    const isPasswordValid = await user.checkPassword(password);

    if (isPasswordValid === false) {
      return done(null, false, 'Невереный пароль');
    }

    return done(null, user);

  },
);


