var Movie = require('../models/movie');
var Genre = require('../models/genre');

const { body,validationResult } = require('express-validator');

var async = require('async');

exports.genre_create_get = function(req, res, next){
    res.render("genre_form",{title: "Create a Genre"});
};

// Handle Genre create on POST.
exports.genre_create_post =  [

    // Validate and sanitize fields.
    body('title', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description required').trim().isLength({ min: 1 }),
  
    // Process request after validation and sanitization.
    (req, res, next) => {

      // Create a genre object with escaped and trimmed data.
      var genre = new Genre(
          { title: req.body.title,
            description: req.body.description
          }
      );

      if(req.body.password==="37058"){
  
          // Extract the validation errors from a request.
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
          }
          else {
            // Data from form is valid.
            // Check if Genre with same title already exists.
            Genre.findOne({ 'title': req.body.title })
              .exec( function(err, found_genre) {
                if (err) { return next(err); }
      
                if (found_genre) {
                  // Genre exists, redirect to its detail page.
                  res.redirect(found_genre.url);
                }
                else {
      
                  genre.save(function (err) {
                    if (err) { return next(err); }
                    // Genre saved. Redirect to genre detail page.
                    res.redirect(genre.url);
                  });
      
                }
      
              });
          }
      }

      else{
        var err = new Error('Wrong password ... Contact Shivansh for correct one');
        err.status = 403;
        res.render('genre_form', { title: 'Create Genre', genre: genre, err:err});
      }
    }
];

// Display list of all Genre.
exports.genre_list = function(req, res, next) {

  Genre.find()
    .sort([['title', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('genre_list', { title: 'Genres List', genre_list: list_genres });
    });

};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

  async.parallel({
      genre: function(callback) {
          Genre.findById(req.params.id)
            .exec(callback);
      },

      genre_movies: function(callback) {
          Movie.find({ 'genres': req.params.id })
            .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.genre==null) { // No results.
          var err = new Error('Genre not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render
      res.render('genre_detail', { title: 'Genre detail', genre: results.genre, genre_movies: results.genre_movies } );
  });

};

// Display Genre update form on GET.

exports.genre_update_get = function(req, res, next) {

  Genre.findById(req.params.id)
  .exec(function (err, genre) {
    if (err) { return next(err); }
    if (genre==null) { // No results.
          res.redirect('/genres');
      }
    // Successful, so render.
    res.render('genre_form', { title: 'Update Genre', genre: genre} );
  })

};

// Handle Genre create on POST.
exports.genre_update_post =  [

  // Validate and sanitize fields.
  body('title', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
      { title: req.body.title,
        description: req.body.description,
        _id: req.params.id
      }
    );

    if(req.body.password==="37058"){

        if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update genre.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                  if (err) { return next(err); }
                    // Successful - redirect to book detail page.
                    res.redirect(thegenre.url);
            });
        }
    }

    else{
      var err = new Error('Wrong password ... Contact Shivansh for correct one');
      err.status = 403;
      res.render('genre_form', { title: 'Create Genre', genre: genre, err:err});
    }
  }
];

// Display Genre delete form on GET.

exports.genre_delete_get = function(req, res, next) {
  var error = new Error("Null");
  error.status = 404;
  res.render('error', {message:"Not implemented yet ...", error:error} );
};