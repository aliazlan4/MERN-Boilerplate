import passport from "passport";
import LocalStrategy from "passport-local";

import User from "./services/users/user.model";

passport.serializeUser(function(user, done) {
	user.password = undefined;
	done(null, user);
});
  
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new LocalStrategy(
	{
		usernameField: "email",
	},
	async function(email, password, done) {
		try {
			const user = await User.findOne({ email }).select("+password");

			if (!user)
				return done(null, false, { status: false, error: "user doesnt exist" });

			user.checkPassword(password, (err, isCorrect) => {
				if (err) return done(err);
				if (!isCorrect) return done(null, false, { status: false, error: "incorrect password" });
				done(null, user);
			});
		} catch (error) {
			done(error);
		}
	}
));

passport.is_authenticated = function (req, res, next) {
	if (req.user) return next();
	return res.status(401).send({ status: false, error: "user is not logged in" });
};

export default passport;