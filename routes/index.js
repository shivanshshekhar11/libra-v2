var express = require('express');
var router = express.Router();

// Require controller modules.
var movie_controller = require('../controllers/movieController');
var genre_controller = require('../controllers/genreController');

/* GET home page. */
router.get('/', movie_controller.index);

/* GET entering a new movie */
router.get('/movies/new', movie_controller.movie_create_get);

/* POST entering a new movie */
router.post('/movies/new', movie_controller.movie_create_post);

/* GET entering a new genre */
router.get('/genres/new', genre_controller.genre_create_get);

/* POST entering a new genre */
router.post('/genres/new', genre_controller.genre_create_post);

/* GET movies list*/
router.get('/movies', movie_controller.movie_list);

/* GET movies list*/
router.get('/genres', genre_controller.genre_list);

// GET request for one movie.
router.get('/movies/:id', movie_controller.movie_detail);

// GET request for one genre.
router.get('/genres/:id', genre_controller.genre_detail);

// GET request for updating a movie.
router.get('/movies/:id/update', movie_controller.movie_update_get);

// POST request for updating a movie.
router.post('/movies/:id/update', movie_controller.movie_update_post);

// GET request for updating a genre.
router.get('/genres/:id/update', genre_controller.genre_update_get);

// POST request for updating a genre.
router.post('/genres/:id/update', genre_controller.genre_update_post);

// GET request for deleting a movie.
router.get('/movies/:id/delete', movie_controller.movie_delete_get);

// POST request for deleting a movie.
router.post('/movies/:id/delete', movie_controller.movie_delete_post);

// GET request for deleting a genre.
router.get('/genres/:id/delete', genre_controller.genre_delete_get);

module.exports = router;
