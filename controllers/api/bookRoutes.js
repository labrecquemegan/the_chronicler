const router = require('express').Router();
const { Book } = require('../../models');
const withAuth = require('../../utils/auth');
const { randomNumber } = require('../../utils/helpers');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// * /api/book

// LIBRARY

// Get all saved books
// ! DON'T DO THIS YET
router.get('/', async (req, res) => {
	try {
		const bookData = await Book.findAll();

		const books = bookData.map((book) => book.get({ plain: true }));

		res.status(200).json(books);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get book by title
router.get('/title/:title', async (req, res) => {
	// Expects title to be split with underscores:
	// To_Kill_a_Mockingbird
	try {
		let spacedTitle = req.params.title.split('_').join(' ');
		const bookData = await Book.findOne({
			where: {
				title: spacedTitle,
			},
		});

		if (!bookData) {
			res.status(404).json({
				message: 'No book found with this title',
				item: spacedTitle,
			});
			return;
		}

		res.status(200).json(bookData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get all books by Author
router.get('/author/:name', async (req, res) => {
	// Expects name to be split with underscores:
	// J.R.R._Tolkien
	try {
		const authorName = req.params.name.split('_').join(' ');
		const authorData = await Book.findAll({
			where: {
				author: authorName,
			},
		});

		if (!authorData) {
			res.status(404).json({
				message: 'No author found by that name!',
				name: authorName,
			});
			return;
		}

		res.status(200).json(authorData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get random book
router.get('/random', async (req, res) => {
	try {
		let randomId = randomNumber(10000);

		const bookData = await Book.findByPk(randomId);

		if (!bookData) {
			res.status(404).json({
				message: 'No book found with this random id!',
				id: randomId,
			});
			return;
		}

		res.status(200).json(bookData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get book by Genre
router.get('/genre/:genre', async (req, res) => {
	// Expects genre to be Young_Adult
	try {
		const genreData = await Book.findAll({
			where: {
				// example string: "Fantasy/2,053|Young Adult/1,103|Fiction/784|Childrens/439"
				genre: {
					[Op.like]: `%${req.params.genre}%`,
				},
			},
		});

		if (!genreData) {
			res.status(404).json({ message: 'No genre found by that name!' });
			return;
		}

		res.status(200).json(genreData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get book by id
router.get('/:id', async (req, res) => {
	try {
		const bookData = await Book.findByPk(req.params.id);

		if (!bookData) {
			res.status(404).json({ message: 'No book found with this id!' });
			return;
		}

		res.status(200).json(bookData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// COLLECTION

// Add book to collection
// router.post('/', withAuth, async (req, res) => {
// 	try {
// 		const newBook = await Book.create({
// 			...req.body,
// 			user_id: req.session.user_id,
// 		});

// 		res.status(200).json(newBook);
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

// Update book in collection
// router.put('/:id', withAuth, async (req, res) => {
// 	try {
// 		let updatedBook = await Book.update(req.body, {
// 			where: {
// 				id: req.params.id,
// 			},
// 		});

// 		if (!updatedBook) {
// 			res.status(404).json({
// 				message: 'Sorry! No book found with that ID',
// 			});
// 			return;
// 		}

// 		res.status(200).json(updatedBook);
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

// Remove book from collection by id
// router.delete('/:id', withAuth, async (req, res) => {
// 	try {
// 		const bookData = await Book.destroy({
// 			where: {
// 				id: req.params.id,
// 				user_id: req.session.user_id,
// 			},
// 		});

// 		if (!bookData) {
// 			res.status(404).json({ message: 'No book found with this id!' });
// 			return;
// 		}

// 		res.status(200).json(bookData);
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

module.exports = router;
