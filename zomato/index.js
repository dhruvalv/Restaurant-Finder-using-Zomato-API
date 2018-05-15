const
     config = require('./config'),
     superagent = require('superagent')


const _fetch = (command) => {
    return superagent.get(`${config.url}/${command}`)
		.set('user-key',`${config.key}`)
        .then(response => response.body)
        .catch(error => error.response.body)
}

exports.restaurant = (restro_id) => {
    return _fetch(`restaurant?res_id=${restro_id}`)
}

exports.restaurant_search = (restaurant_name,num) => {
    return _fetch(`search?q=${restaurant_name}&count=${num}`)
}
