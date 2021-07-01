#! /usr/bin/env node

console.log('This script populates some test cryptos, users, articles and cryptoinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Crypto = require('./models/crypto')
var User = require('./models/user')
var Article = require('./models/article')
// var BookInstance = require('./models/cryptoinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var articles = []
var cryptos = []
// var cryptoinstances = []

function userCreate(username, email, password, mobile, cb) {
  userdetail = {username:username , email: email, password: password, mobile: mobile }
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function articleCreate(title, author, text, cb) {
  var articledetail = { title: title, author: author, text: text  }
  var article = new Article(articledetail);
       
  article.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Article: ' + article);
    articles.push(article)
    cb(null, article);
  }   );
}

function cryptoCreate(name, price, copacity, cb) {
  cryptodetail = { 
    name: name,
    price: price,
    copacity: copacity
  }
    
  var crypto = new Crypto(cryptodetail);    
  crypto.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Crypto: ' + crypto);
    cryptos.push(crypto)
    cb(null, crypto)
  }  );
}


function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('Patrick', 'sghua@gmail.com', 'aseggq', false, callback);
        },
        function(callback) {
          userCreate('Ben', 'Bova@gmail.com', 'ewqbewa', false, callback);
        },
        function(callback) {
          userCreate('Isaac', 'Asimov@gmail.com', 'mgmmymy', 09165589493, callback);
        },
        function(callback) {
          userCreate('Bob', 'Billings@gmail.com', 'dsggwhwh', 09165586493, callback);
        },
        function(callback) {
          userCreate('Jim', 'Jones@gmail.com', 'agdsga-12-16', 09165659493, callback);
        }
        ],
        // optional callback
        cb);
}


function createArticles(cb) {
    async.parallel([
        function(callback) {
          articleCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'Monkey' , 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', callback);
        },
        function(callback) {
          articleCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Patrick' , 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', callback);
        },
        function(callback) {
          articleCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Reza' ,  'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', callback);
        },
        function(callback) {
          articleCreate("Apes and Angels", 'Rahim' , "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", callback);
        },
        function(callback) {
          articleCreate("Death Wave", 'Mahmood' , "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", callback);
        },
        function(callback) {
          articleCreate('Test Book 1', 'Mohandes' , 'Summary of test crypto 1', callback);
        },
        function(callback) {
          articleCreate('Test Book 2', 'Arab' , 'Summary of test crypto 2', callback)
        }
        ],
        // optional callback
        cb);
}


function createCryptos(cb) {
    async.parallel([
        function(callback) {
          cryptoCreate('Bitcoin', 35454, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Etherum', 9887, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Dogecoin', 654, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Bitcoincash', 31514, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Tether', 3235, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Link', 65, 500000, callback)
        },
        function(callback) {
          cryptoCreate('Litecoin', 758, 500000, callback)
        },
        function(callback) {
          cryptoCreate('Badcoin', 996, 1000000, callback)
        },
        function(callback) {
          cryptoCreate('Goodcoin', 325, 654546, callback)
        },
        function(callback) {
          cryptoCreate('Fuckcoin', 654, 654444, callback)
        },
        function(callback) {
          cryptoCreate('Fuckinggirlsonlycoin', 979, 1000000 , callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createUsers
  ,
    createArticles,
    createCryptos
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Done: '+ cryptos + articles + users);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
