const express = require('express'); //importa o express
const server = express(); //cria uma variável chamada server que chama a função express
const cors = require('cors');

server.use(express.json(), cors()); //faz com que o express entenda JSON

const peoples = [
    'Emelyn', 'Sanjay', 'West', 'Kenneth', 'Shepherd', 'Scarlet', 'Micaiah', 'Dante', 'Stephen', 'Silas', 'Kalvin', 'Taliyah', 'Cambrie', 'Azriel',
    'Ayden', 'Violette', 'Samaria', 'Juancarlos', 'Annaleigh', 'Makenzi', 'Bishop', 'Winston', 'Adyn', 'Franco', 'Kennedi', 'Shane', 'Jovanny', 'Joe',
    'Salvador', 'Aurelio', 'Dwight', 'Aubreigh', 'Princeton', 'Lyle', 'Gus', 'Cailey', 'Seven', 'Canyon', 'Darryl', 'Kambree', 'Camden',
]; //as informações ficarão armazenadas dentro deste array

server.use((req, res, next) => { //server.use cria o middleware global
    console.time('Request'); //marca o início da requisição
    console.log(`Método: ${req.method}; URL: ${req.url}; `); //retorna qual o método e url foi chamada

    next(); //função que chama as próximas ações

    console.log('Finalizou'); //será chamado após a requisição ser concluída
    console.timeEnd('Request'); //marca o fim da requisição
});

function checkPeopleExists(req, res, next) {
    const people = peoples[req.params.index];
    if (!req.body.name) { //middleware local que irá checar se a propriedade name foi informada corretamente
        return res.status(400).json({ error: 'people does not exist' }); //caso negativo, irá retornar um erro 400 - BAD REQUEST
    }
    req.people = people;

    return next(); //se o nome for informado corretamente, a função next() chama as próximas ações
}

function checkPeopleInArray(req, res, next) {
    const people = peoples[req.params.index];
    if (!people) {
        return res.status(400).json({ error: 'people does not exist in array' });
    } //checa se o People existe no array, caso negativo informa que o index não existe
    req.people = people;

    return next();
}

server.get('/peoples', (req, res) => {
    return res.json(peoples);
}) //rota para listar todos os peoples

server.get('/peoples/:index', checkPeopleInArray, (req, res) => {
    return res.json(req.people);
})

server.post('/peoples', checkPeopleExists, (req, res) => {
    const { name } = req.body; //buscar o name informado dentro do body da requisição
    peoples.push(name);

    return res.json(peoples); //retorna a informação da variável peoples
})

server.put('/peoples/:index', checkPeopleInArray, checkPeopleExists, (req, res) => {
    const { index } = req.params; //recupera o index com os dados
    const { name } = req.body;

    peoples[index] = name; //sobrepõe o index obtido na rota de acordo com o novo valor

    return res.json(peoples);
}) //retorna novamente os peoples atualizados após o update

server.delete('/peoples/:index', checkPeopleInArray, (req, res) => {
    const { index } = req.params; //recupera o index com os dados

    peoples.splice(index, 1); //percorre o vetor até o index selecionado e deleta uma posição no array

    return res.send();
}) // retorna os dados após a exclusão

server.listen(3000); //faz com que o servidor seja executado na porta 3000 do seu localhost:3000

