var Movie = require('../models/movie');
var Genre = require('../models/genre');

const { body,validationResult } = require('express-validator');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        movie_count: function(callback) {
            Movie.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },

        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Libra v2 Home', error: err, data: results });
    });
};

// Display movie create form on GET.
exports.movie_create_get = function(req, res, next) {

    // Get all genres, which we can use for adding to our movie.
    async.parallel({
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('movie_form', { title: 'Enter movie', genres: results.genres });
    });
};

// Handle movie create on POST.
exports.movie_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('year').trim().escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }),
    body('image', 'Image must not be empty').trim().isLength({ min: 1 }),
    body('starring').trim().isLength({ min: 1 }),
    body('genre.*').escape(),
    body('available').trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a movie object with escaped and trimmed data.
        var movie = new Movie(
          { title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            description: req.body.description,
            starring: req.body.starring,
            image: req.body.image,
            genres: req.body.genre,
            available: req.body.available,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all genres for form.
            async.parallel({
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (movie.genres.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('movie_form', { title: 'Enter movie', genres:results.genres, movie: movie, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save movie.
            movie.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new movie record.

                   res.redirect(movie.url);

                });
        }
    }
];

// Display list of all movies.
exports.movie_list = function(req, res, next) {

    Movie.find({})
      .sort({title : 1})
      .populate("genres")
      .exec(function (err, list_movies) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('movie_list', { title: 'Movies list', movie_list: list_movies });
      });
  
  };

// Display detail page for a specific movie.
exports.movie_detail = function(req, res, next) {

    async.parallel({
        movie: function(callback) {

            Movie.findById(req.params.id)
              .populate('genres')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.movie==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('movie_detail', { title: results.movie.title, movie: results.movie} );
    });

};

// Display movie update form on GET.
exports.movie_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).populate('genres').exec(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.movie==null) { // No results.
                var err = new Error('Movie not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var movie_g_iter = 0; movie_g_iter < results.movie.genres.length; movie_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()===results.movie.genres[movie_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            res.render('movie_form', { title: 'Update movie details', genres: results.genres, movie: results.movie, ud:1 });
        });

};

exports.movie_update_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('year').trim().escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }),
    body('image', 'Image must not be empty').trim().isLength({ min: 1 }),
    body('starring').trim().isLength({ min: 1 }),
    body('genre.*').escape(),
    body('available').trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a movie object with escaped and trimmed data.
        var movie = new Movie(
          { title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            description: req.body.description,
            starring: req.body.starring,
            image: req.body.image,
            genres: req.body.genre,
            available: req.body.available,
            _id:req.params.id //This is required, or a new ID will be assigned!
        });

        if(req.body.password==="37058"){

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/error messages.

                // Get all genres for form.
                async.parallel({
                    genres: function(callback) {
                        Genre.find(callback);
                    },
                }, function(err, results) {
                    if (err) { return next(err); }

                    // Mark our selected genres as checked.
                    for (let i = 0; i < results.genres.length; i++) {
                        if (movie.genres.indexOf(results.genres[i]._id) > -1) {
                            results.genres[i].checked='true';
                        }
                    }
                    res.render('movie_form', { title: 'Enter movie', genres:results.genres, movie: movie, errors: errors.array(), ud:1 });
                });
                return;
            }
            else {
                // Data from form is valid. Update movie.
                Movie.findByIdAndUpdate(req.params.id, movie, {}, function (err,themovie) {
                    if (err) { return next(err); }
                    // Successful - redirect to book detail page.
                    res.redirect(themovie.url);
                });
            }
        }

        else{
            var error = new Error('Wrong password ... Contact Shivansh for correct one');
            error.status = 403;

            // Get all genres, which we can use for adding to our movie.
            async.parallel({
                genres: function(callback) {
                Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('movie_form', { title: 'Enter movie', genres: results.genres, movie:movie, err:error, ud:1 });
            });
        }
    }
];

exports.movie_delete_get = function(req, res, next) {

    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.movie==null) { // No results.
            res.redirect('/movies');
        }
        // Successful, so render.
        res.render('movie_delete', { title: 'Delete movie', movie: results.movie } );
    });

};

exports.movie_delete_post = function(req,res,next){

    if(req.body.password==="37058") {
        Movie.findByIdAndRemove(req.body.movieid, function deleteMovie(err) {
            if (err) { return next(err); }
            // Success - go to movies list
            res.redirect('/movies');
        })
    }

    else{
        var error = new Error('Wrong password ... Contact Shivansh for correct one');
        error.status = 403;
        
        async.parallel({
            movie: function(callback) {
                Movie.findById(req.params.id).exec(callback)
            }
        }, function(err, results) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('movie_delete', { title: 'Delete movie', movie: results.movie, err:error } );
        });
    }
}