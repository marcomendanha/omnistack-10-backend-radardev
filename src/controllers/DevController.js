const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
// Controller pode ter 5 funções sendo elas index(listagem), show(mostra 1 reg), store(criar),
// update(alterar), destroy(deletar)
module.exports = {
    async index(request, response) {
        const devs = await Dev.find();//pode passar parametros caso tenha
        return response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });
        
        if(!dev) {
            console.log(github_username)
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            console.log(apiResponse);
            const {name = login, avatar_url, bio} = apiResponse.data;
            
            const techsArray = parseStringAsArray(techs);
            
            const location ={
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        return response.json(dev);
    
    }
};