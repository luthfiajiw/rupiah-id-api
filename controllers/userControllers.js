const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = function (app) {
	// get the users data
	app.get('/api/v1/users', (req, res) => {
		User.findAll()
			.then(users => {
				res.status(200).json(users);
			});
	});

	// Sign in
	app.post('/api/v1/auth/signin', (req, res, next) => {
		const { email, password } = req.body;

		User.findAll({ where: { email } })
			.then(user => {
				if (user.length < 1) {
					return res.status(404).json({
						error: {
							statusCode: 404,
							message: 'Email is not registered'
						}
					});
				}

				// Match password
				bcrypt.compare(password, user[0].password, (err, isMatch) => {
					if (err) {
						return res.status(401).json({
							error: {
								statusCode: 401,
								message: 'Authentication failed.'
							},
						});
					};

					if (isMatch) {
						const token = jwt.sign({
							email: user[0].email,
							userUuid: user[0].uuid,
						}, 'secret',
						{
							expiresIn: '7d'
						});

						return res.status(200).json({
							statusCode: 200,
							message: 'Authentication successful.',
							token
						});
					} else {
						return res.status(401).json({
							error: {
								statusCode: 401,
								message: 'Authentication failed, please check your email or password.'
							},
						});
					};

				});
			})
			.catch(() => {
				res.status(500).json({
					error: {
						statusCode: 500,
						message: 'Internal server error'
					}
				});
			});
	});

	// Sign up
	app.post('/api/v1/auth/signup', (req, res, next) => {
		const { name, email, password, password2 } = req.body;

		// Check the length of password
		if (password.length < 6) {
			return res.status(409).json({
				error: {
					statusCode: 409,
					message: 'Password should be at least 6 characters',
				}
			});
		}

		// Check password matching
		if (password !== password2) {
			return res.status(409).json({
				error: {
					statusCode: 409,
					message: 'Password don\'t match',
				},
			});
		}

		User.findAll({where: { email: email } })
			.then(user => {
				if (user.length > 0) {
					res.status(409).json({
						error: {
							statusCode: 409,
							message: 'Email is already registered'
						},
					});
				} else {
					const newUser = User.build({
						name: name,
						email: email,
						password: password,
					});

					bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) {
							return res.status(500).json({
								error: err
							});
						};
						newUser.password = hash;
						newUser.save()
							.then(user => {
								res.status(200).json({
									statusCode: 200,
									message: 'user has been created',
									userCreated: user,
								});
							})
							.catch(err => {
								res.status(500).json({
									error: err.errors
								});
							});
					}));
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
	});
};
