var express = require('express');
var router = express.Router();

// Require controller modules.
var crypto_controller = require('../controllers/cryptoController');
var user_controller = require('../controllers/userController');
var article_controller = require('../controllers/articleController');
// var crypto_instance_controller = require('../controllers/cryptoinstanceController');

/// crypto ROUTES ///

// GET catalog home page.
router.get('/', crypto_controller.index);

// GET request for creating a crypto. NOTE This must come before routes that display crypto (uses id).
router.get('/cryptos/create', crypto_controller.crypto_create_get);

// POST request for creating crypto.
router.post('/cryptos/create', crypto_controller.crypto_create_post);

// GET request to delete crypto.
router.get('/cryptos/:id/delete', crypto_controller.crypto_delete_get);

// POST request to delete crypto.
router.post('/cryptos/:id/delete', crypto_controller.crypto_delete_post);

// GET request to update crypto.
router.get('/cryptos/:id/update', crypto_controller.crypto_update_get);

// POST request to update crypto.
router.post('/cryptos/:id/update', crypto_controller.crypto_update_post);

// GET request for one crypto.
router.get('/cryptos/:id', crypto_controller.crypto_detail);

// GET request for list of all crypto items.
router.get('/cryptos', crypto_controller.crypto_list);

/// article ROUTES ///

// GET request for creating a article. NOTE This must come before route that displays article (uses id).
router.get('/articles/create', article_controller.article_create_get);

//POST request for creating article.
router.post('/articles/create', article_controller.article_create_post);

// GET request to delete article.
router.get('/articles/:id/delete', article_controller.article_delete_get);

// POST request to delete article.
router.post('/articles/:id/delete', article_controller.article_delete_post);

// GET request to update article.
router.get('/articles/:id/update', article_controller.article_update_get);

// POST request to update article.
router.post('/articles/:id/update', article_controller.article_update_post);

// GET request for one article.
router.get('/articles/:id', article_controller.article_detail);

// GET request for list of all article.
router.get('/articles', article_controller.article_list);

module.exports = router;
