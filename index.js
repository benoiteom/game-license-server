const fs = require('fs');
var express = require('express');
var app = express();


app.use(express.json());


const port = 8080;

app.get('/', function(req, res) {
    let data = fs.readFileSync('games.json');
    res.status(200).send(data).end();
});

app.get('/unverified', function(req, res) {
    let data = fs.readFileSync('unverified_games.json');
    res.status(200).send(data).end();
});

app.get('/errors', function(req, res) {
    let data = fs.readFileSync('error_games.json');
    res.status(200).send(data).end();
});

app.get('/get-game/:name', function(req, res) {
    let data = JSON.parse(fs.readFileSync('games.json'));
    let game = data.find(el => el.name == req.params.name);
    res.status(200).send(JSON.stringify(game)).end();
});

app.post('/verify-game/', async function(req, res) {
    let game_data = JSON.parse(fs.readFileSync('games.json'));
    game_data.push(req.body);
    fs.writeFileSync('games.json', JSON.stringify(game_data));
    res.status(200).end();
});

app.post('/submit-game/', async function(req, res) {
    let game_data = JSON.parse(fs.readFileSync('unverified_games.json'));
    game_data.push(req.body);
    fs.writeFileSync('unverified_games.json', JSON.stringify(game_data));
    res.status(200).end();
});

app.post('/delete-game/', async function(req, res) {
    let file = 'games.json';
    if (req.body.type == 'unverified')
        file = 'unverified_games.json';

    game_data = JSON.parse(fs.readFileSync(file));
    
    let index = game_data.findIndex(x => x.name == req.body.name && x.genre == req.body.genre);

    if (index > -1)
        game_data.splice(index, 1);

    fs.writeFileSync(file, JSON.stringify(game_data));
    res.status(200).end();
});

app.post('/edit-game/', async function(req, res) {
    game_data = JSON.parse(fs.readFileSync('games.json'));
    let index = game_data.findIndex(x => x.name == req.body.name && x.genre == req.body.genre);
    if (index > -1)
        game_data.splice(index, 1);
        game_data.push(req.body)
    fs.writeFileSync('games.json', JSON.stringify(game_data));
    res.status(200).end();
});

app.post('/submit-error/', async function(req, res) {
    let data = JSON.parse(fs.readFileSync('error_games.json'));
    data.push(req.body);
    fs.writeFileSync('error_games.json', JSON.stringify(data));
    res.status(200).end();
});

app.post('/resolve-error/', async function(req, res) {
    let data = JSON.parse(fs.readFileSync('error_games.json'));
    let index = data.findIndex(el => el.game = req.body.game && el.message == req.body.message);
    if (index > -1)
        data.splice(index, 1);
    fs.writeFileSync('error_games.json', JSON.stringify(data));
    res.status(200).end();
});

app.listen(port, function () {
    console.log(`Listening at ${port}`);
    let data = JSON.parse(fs.readFileSync('games.json'));
});
