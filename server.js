require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

//endpoints for genres, countries

//Users can search for Movies by genre, country or avg_vote
app.get('/movies/', function handleGetMovies(req, res){
    let response = MOVIEDEX
    //When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive.
    if(req.query.genre){
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }
    //When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive.
    if(req.query.country){
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }
    //When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number.
    //When comparing two numeric strings for greater than or less than, we can "cast" the strings to numbers like so: Number('1') === 1
    if(req.query.avg_vote){
        
    }
    res.json(response)
})

/*  The API responds with an array of full movie entries for the search results

    The endpoint only responds when given a valid Authorization header with a Bearer API token value.
*/
const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
