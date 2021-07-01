var Article = require('../models/article');

var async  = require('async');
const { body,validationResult } = require('express-validator');


// Display list of all articles.
exports.article_list = function(req, res, next) {
    Article.find({}, 'title author')
    .exec(function (err, list_articles) {
        if (err) { return next(err)}
        // Success, render
        res.render('article_list', { title: 'Article List', article_list: list_articles });
    })
};

// Display detail page for a specific article.
exports.article_detail = function(req, res , next) {
    
    async.parallel({
        article: function(callback) {
            Article.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // success so render
        res.render('article_detail', { title: 'Article detail page', articles: results })
    });
    }

// Display article create form on GET.
exports.article_create_get = function(req, res, next) {
    res.render('article_form', { title: 'Create Article'});
};

// Handle article create on POST.
exports.article_create_post = [

    //Form validation and sanitization 
    body('title', 'Title is required').trim().isLength({ min: 1, max: 75 }).escape().withMessage('Title must be specified.'),
    body('author', 'Author is required').trim().isLength({ min: 1, max: 75 }).escape().withMessage('Title must be specified.')
    .isAlphanumeric().withMessage('Title must only have letters'),
    body('text', 'text is required').trim().isLength({ min: 1, max: 2024 }).escape().withMessage('text must be specified.'),


    // Process request after validation and sanitization
    (req, res, next) => { 

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Article object with ecaped and trimmed data.
        var article = new Article(
            { 
                title: req.body.title,
                author: req.body.author,
                text: req.body.text
            }
        );

        if(!errors.isEmpty) {
            res.render('author_form', { title: 'Create Article', article : article , errors: errors.array() });
            return
        }

        else {

            // Data from form is valid
            // Check if article with same name already exists.
            Article.findOne({ 'title' : req.body.title })
            .exec( function(err, found_article) {
                if(err) { return next(err); }
                
                if (found_article) {
                    // Article exist, redirect to its detail page
                    res.redirect(found_article.url);
                }
                else { 

                    article.save(function (err) {
                        if (err) { return next(err); }
                        // Crypto saved.redirect to crypto detail page.
                        res.redirect(article.url);
                    });
                } 

        });
    }
    }
    
]

// Display article delete form on GET.
exports.article_delete_get = function(req, res, next) {

    async.parallel({
        article: function(callback) {
            Article.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // success so render
        res.render('article_delete', { title: 'Article Delete page', articles: results })
    });
    }

// Handle article delete on POST.
exports.article_delete_post = function(req, res, next) {

    async.parallel({
        article: function(callback) {
          Article.findById(req.body.articleid).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        // Success

        // Delete and redirect
        Article.findByIdAndRemove(req.body.articleid, function deleteArticle(err) {
            if (err) { return next(err); }
            // Success - go to article list
            res.redirect('/menu/articles')
        })
    });
};

// Display article update form on GET.
exports.article_update_get = function(req, res, next) {

    // Get articles, authors and genres for form.
    async.parallel({
        article: function(callback) {
            Article.findById(req.params.id).exec(callback);
        }
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.article==null) { // No results.
                var err = new Error('Article not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('article_form', { title: 'Update Article', articles: results.article });
        });

};

// Handle article update on POST.
exports.article_update_post = [

    // Validate and sanitise fields.
    //Form validation and sanitization 
    body('title', 'Title is required').trim().isLength({ min: 1, max: 75 }).escape().withMessage('Title must be specified.'),
    body('author', 'Author is required').trim().isLength({ min: 1, max: 75 }).escape().withMessage('Title must be specified.')
    .isAlphanumeric().withMessage('Title must only have letters'),
    body('text', 'text is required').trim().isLength({ min: 1, max: 2024 }).escape().withMessage('text must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Article object with escaped/trimmed data and old id.
        var article = new Article(
          { title: req.body.title,
            author: req.body.author,
            text: req.body.text,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
        }
            // Get all authors and genres for form.
            async.parallel({
                article: function(callback) {
                    Article.find(callback);
                },
            }, function(err) {
                if (err) { return next(err); }
                // success, render
                Article.findByIdAndUpdate(req.params.id, article, {}, function (err,thearticle) {
                    if (err) { return next(err); }
                       // Successful - redirect to book detail page.
                       res.redirect(thearticle.url);
                });
            })
        }
    ];