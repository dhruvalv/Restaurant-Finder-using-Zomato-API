const
    zomato = require('zomato'),
    express = require('express'),
    router = express.Router()

module.exports = () => {
    router.get('/api/search', (req, res) => {
        zomato.restaurant_search(req.query.q,10)
            .then(result => {
                res.json(result)
            })
    })

    router.post('/api/details', (req, res) => {
        zomato.restaurant(req.body.id)
            .then(result => {
                res.json(result)
            })
    })
    return router
}

