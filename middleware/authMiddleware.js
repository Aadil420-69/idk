const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// For ENV Variables
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Some ENV variables
const SECRET = process.env.SECRET;


const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	// Check if jwt exists and is verfied
	if (token) {
		jwt.verify(token, SECRET, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/login');
			} else {
				console.log(decodedToken);
				next();
			}
		})

	} else {
		res.redirect('/login')
	}
}

// Check current User
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, SECRET, async (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.locals.user = null;
				console.log('No Such User Found');
				next();
			} else {
				console.log(decodedToken);
				let user = await User.findById(decodedToken.id);
				res.locals.user = user;
				console.log(user);
				next();
			}
		})
	} else {
		res.locals.user = null;
		console.log('Error with user');
		next();
	}
}


module.exports = { requireAuth, checkUser }
