
var Article = require('../models/article');
var Crypto = require('../models/crypto');
var User = require('../models/user');

var async = require('async');
const { body,validationResult } = require('express-validator');

// display list of all cryptos
exports.index = function(req, res, next) {
    
    async.parallel({
        crypto_count: function(callback) {
            Crypto.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        article_count: function(callback) {
            Article.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        user_count: function(callback) {
            User.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        }
    }, function(err, results) {
        res.render('index', { title: 'Crypto Home', error: err, data: results });
    });
};

// Display list of all cryptos.
exports.crypto_list = function(req, res, next) {
    Crypto.find({}, 'price name')
    .exec(function (err, list_cryptos) {
        if (err) { return next(err)}
        // Success, render
        res.render('crypto_list', { title: 'Crypto List', crypto_list: list_cryptos });
    })
};

// Display detail page for a specific crypto.
exports.crypto_detail = function(req, res , next) {
    
    async.parallel({ 
        crypto: function(callback) {
            Crypto.findById(req.params.id)
            .exec(callback)
        }
    }, function(err, results) {
        if (err) { next(err); }
        // success
        res.render('crypto_detail', { title: 'Crypto Detail Page', cryptos : results })
    });
};

// Display crypto create form on GET.
exports.crypto_create_get = function(req, res) {
    res.render('crypto_form', { title: 'Create a Cryptocurrency' })
};

// Handle crypto create on POST.
exports.crypto_create_post = [
    // Validate and santize the name field.
    body('name', 'name required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied'),
    body('price', 'price required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied')
    .isNumeric().withMessage('Price must be numeric.'),
    body('copacity', 'copacity required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied')
    .isNumeric().withMessage('Copacity must be numeric.'),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Crypto object with ecaped and trimmed data.
        var crypto = new Crypto(
            { 
                name: req.body.name,
                price: req.body.price,
                copacity: req.body.copacity
            }
        );

        if (!errors.isEmpty()) {
            res.render('crypto_form', { title: 'Create Cryptocurrency' , crypto: crypto, errors: errors.array() }); 
            return;
        }
        else { 
            // Data from form is valid
            // Check if crypto with same name already exists.
            Crypto.findOne({ 'name' : req.body.name })
            .exec( function(err, found_crypto) {
                if(err) { return next(err); }
                
                if (found_crypto) {
                    // Crypto exist, redirect to its detail page
                    res.redirect(found_crypto.url);
                }
                else { 

                    crypto.save(function (err) {
                        if (err) { return next(err); }
                        // Crypto saved.redirect to crypto detail page.
                        res.redirect(crypto.url);
                    });
                } 
            } )
        }
    }
]

// Display crypto delete form on GET.
exports.crypto_delete_get = function(req, res, next) {

    async.parallel({
        crypto: function(callback) {
            Crypto.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // success so render
        res.render('crypto_delete', { title: 'Crypto Delete page', cryptos: results })
    });
    }


// Handle crypto delete on POST.
exports.crypto_delete_post = function(req, res, next) {

    async.parallel({
        crypto: function(callback) {
          Crypto.findById(req.body.cryptoid).exec(callback)
        }
    }, function(err) {
        if (err) { return next(err); }
        // Success

        // Delete and redirect
        Crypto.findByIdAndRemove(req.body.cryptoid, function deleteCrypto(err) {
            if (err) { return next(err); }
            // Success - go to crypto list
            res.redirect('/menu/cryptos')
        })
    });
};


// Display crypto update form on GET.
exports.crypto_update_get = function(req, res, next) {

    // Get cryptos, authors and genres for form.
    async.parallel({
        crypto: function(callback) {
            Crypto.findById(req.params.id).exec(callback);
        }
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.crypto==null) { // No results.
                var err = new Error('Crypto not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('crypto_form', { title: 'Update Crypto', cryptos: results });
        });

};

// Handle crypto update on POST.
exports.crypto_update_post = [

    // Validate and santize the name field.
    body('name', 'name required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied'),
    body('price', 'price required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied')
    .isNumeric().withMessage('Price must be numeric.'),
    body('copacity', 'copacity required').trim().isLength({ min: 1 }).escape().withMessage('Name must be specefied')
    .isNumeric().withMessage('Copacity must be numeric.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Crypto object with escaped/trimmed data and old id.
        var crypto = new Crypto(
          { name: req.body.name,
            price: req.body.price,
            copacity: req.body.copacity,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
        }
            // Get all authors and genres for form.
            async.parallel({
                crypto: function(callback) {
                    Crypto.find(callback);
                },
            }, function(err) {
                if (err) { return next(err); }
                // success, render
                Crypto.findByIdAndUpdate(req.params.id, crypto, {}, function (err,thecrypto) {
                    if (err) { return next(err); }
                       // Successful - redirect to book detail page.
                       res.redirect(thecrypto.url);
                });
            })
        }
    ];
