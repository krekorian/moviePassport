var express = require('express');
var router = express.Router();
const request = require('request');
const passport = require('passport')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
// const apiKey = '12345678';
const apiBaseUrl = 'http://api.themoviedb.org/3';
// const apiBaseUrl = 'http://localhost:3030';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
// const nowPlayingUrl = `${apiBaseUrl}/most_popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';
/* GET home page. */
router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
})

router.get('/', function (req, res, next) {
  console.log("req.user")
  console.log((req.user))
  request.get(nowPlayingUrl, (error, response, movieData) => {
    // console.log('==========The error=========');
    // console.log(error);
    // console.log('==========The response========');
    // console.log(response);
    const parsedData = JSON.parse(movieData);
    // console.log(parsedData);
    // res.json(parsedData)
    res.render('index', { parsedData: parsedData.results });
  })
  // res.render('index', { title: 'Express' });
});

router.get('/favorites', (req, res) => {
  res.json(req.user._raw)
})

router.get('/login', passport.authenticate('github'))

router.get('/auth', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: 'loginFailed'
}))

router.get('/movie/:id', (req, res, next) => {
  // res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
  // res.send(thisMovieUrl)
  // console.log("Under router.get('/movie/:id' before making the request thisMovieUrl")
  // console.log(thisMovieUrl)
  request.get(thisMovieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData)
    console.log("under router.get('/movie/:id' parsedData");
    console.log(parsedData)
    res.render('single-movie', {
      parsedData: parsedData
    })
  })
})

router.post('/search', (req, res, next) => {
  // res.send('sanity check')
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`
  console.log(movieUrl)
  // res.send(movieUrl)
  request.get(movieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    console.log('parsedData')
    console.log(parsedData)
    if (cat == "person") {
      // parsedData.results = parsedData.results[0].known_for
      parsedData.results = parsedData[0].known_for
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  })
})

module.exports = router;
