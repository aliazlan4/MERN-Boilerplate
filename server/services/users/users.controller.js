import Validator from "validatorjs";
import User from "./user.model";


export async function loginSuccessful(req, res) {
	return res.send({ status: true, user: req.user });
}

export async function getUser(req, res) {
	return res.send({ status: true, user: req.user });
}

export async function register(req, res) {
	const validation = registerValidator(req.body);
	if (validation.fails())
		return res.status(422).send({ status: false, errors: validation.errors.all() });

	const { email, password, firstName, lastName } = req.body;

	const user_exist = await User.findOne({ email: email });
	if (user_exist) return res.send({ status: false, error: "email already exists"});

	const user = await new User({ email, password, firstName, lastName, role: "client" });
	await user.save();

	// req.login is a passportjs function to login user
	req.login(user, err => {
		if (err) {
			return res.send({ status: false, error: "error in user registration"});
		}
		return res.send({ status: true, user: req.user});
	});
}

export async function logout(req, res) {
	req.logout();
	return res.send({ status: true, message: "user logged out successfuly" });
}

function registerValidator(data) {
	return new Validator(data, {
		firstName: "required|alpha|min:2|max:255",
		lastName: "required|alpha|min:2|max:255",
		email: "required|email|max:255",
		password: "required|string|min:6|max:255",
	});
}
