var User = require('../models/user');
var Article = require('../models/article');

var async = require('async');
const { body,validationResult } = require('express-validator');
const { find, populate } = require('../models/article');
const user = require('../models/user');


// Display list of all Users.
exports.user_list = function(req, res, next) {
    User.find()
    .exec(function (err, list_users) {
        if (err) { return next(err)}
        // Success, render
        res.render('user_list', { title: 'User List', user_list: list_users });
    })
};

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
    
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // success so render
        res.render('user_detail', { title: 'User detail page', users: results })
    });
    }


// Display User create form on GET.
exports.user_create_get = function(req, res) {
    res.render('user_form', { title: 'Create User: '});
};

// Handle User create on POST.
exports.user_create_post = [

    [
        // Validate and santize the username field.
        body('username', 'username required').trim().isLength({ min: 1 }).escape().withMessage('username must be specefied'),
        body('password', 'password required').trim().isLength({ min: 1 }).escape().withMessage('Password must be specefied')
        .isStrongPassword().withMessage('type a strong password with letters and special characters'),
        body('email', 'email required').trim().isLength({ min: 1 }).escape().withMessage('Email must be specefied')
        .isEmail().withMessage('Email must have @.'),
        body('mobile', 'mobile required').trim().isLength({ min: 1, max: 15 }).escape().withMessage('Mobile must be specefied')
        .isMobilePhone().withMessage('Enter a valid number.'),
    
        // Process request after validation and sanitization
        (req, res, next) => {
    
            // Extract the validation errors from a request.
            const errors = validationResult(req);
    
            // Create a User object with ecaped and trimmed data.
            var user = new User(
                { 
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    mobile: req.body.mobile
                }
            );
    
            if (!errors.isEmpty()) {
                res.render('user_form', { title: 'Create Usercurrency' , user: user, errors: errors.array() }); 
                return;
            }
            else { 
                // Data from form is valid
                // Check if user with same username already exists.
                Article.findOne({ 'username' : req.body.username })
                .exec( function(err, found_user) {
                    if(err) { return next(err); }
                    
                    if (found_user) {
                        // User exist, redirect to its detail page
                        res.redirect(found_user.url);
                    }
                    else { 
    
                        user.save(function (err) {
                            if (err) { return next(err); }
                            // User saved.redirect to user detail page.
                            res.redirect(user.url);
                        });
                    } 
                } )
            }
        }
    ]
]


// Display User delete form on GET.
exports.user_delete_get = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // success so render
        res.render('user_delete', { title: 'User Delete page', users: results })
    });
    }


// Handle user delete on POST.
exports.user_delete_post = function(req, res, next) {

    async.parallel({
        user: function(callback) {
          User.findById(req.body.userid).exec(callback)
        }
    }, function(err) {
        if (err) { return next(err); }
        // Success

        // Delete and redirect
        User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
            if (err) { return next(err); }
            // Success - go to user list
            res.redirect('/users')
        })
    });
};

// Display User update form on GET.
exports.user_update_get = function(req, res, next) {

    // Get cryptos, authors and genres for form.
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        }
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.user==null) { // No results.
                var err = new Error('Users not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('user_form', { title: 'Update Users', users: results });
        });

};

// Handle User update on POST.
exports.user_update_post = [

    // Validate and santize the username field.
    body('username', 'username required').trim().isLength({ min: 1 }).escape().withMessage('username must be specefied'),
    body('password', 'password required').trim().isLength({ min: 1 }).escape().withMessage('Password must be specefied')
    .isStrongPassword().withMessage('type a strong password with letters and special characters'),
    body('email', 'email required').trim().isLength({ min: 1 }).escape().withMessage('Email must be specefied')
    .isEmail().withMessage('Email must have @.'),
    body('mobile', 'mobile required').trim().isLength({ min: 1, max: 15 }).escape().withMessage('Mobile must be specefied')
    .isMobilePhone().withMessage('Enter a valid number.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a User object with escaped/trimmed data and old id.
        var user = new User(
          { username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            mobile: req.body.mobile,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
        }
            // Get all authors and genres for form.
            async.parallel({
                user: function(callback) {
                    User.find(callback);
                },
            }, function(err) {
                if (err) { return next(err); }
                // success
                User.findByIdAndUpdate(req.params.id, user, {}, function (err,theuser) {
                    if (err) { return next(err); }
                       // Successful - redirect to book detail page.
                       res.redirect(theuser.url);
                });
            })
        }
    ];

// Display user login page on GET
exports.user_login_get = function(req, res, next) {


    res.render('user_login', { title: 'Log in to your account' })

}


// Display user login page on POST
exports.user_login_post = [ 

    // Validate and sanitize ipnuts
    body('user_name').trim().isLength({ min: 1 , max: 32 }).escape().withMessage('Type vlaid characters'),
    // body('pass').trim().isLength({ min: 1 , max: 64 }).escape().withMessage('Type vlaid password characters'),


    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //validation error
        if (!errors.isEmpty()) {

        }

        // find entered password and username
        async.parallel({
            user: function (callback) {
                User.findOne({ 'username' : req.body.user_name }).populate('_id').exec(callback)
            },
            id: function(callback) {
                User.find(callback)
            },
            pass: function(callback){
                User.find(callback)
            }
         }, 
        function(err, results) {
            if(err) { return next(err) }
            console.log(results)
        })
    }
]
