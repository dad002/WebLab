const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const url = require('url')
const queryString = require('querystring')
const fs = require('fs')

var fetch = require('node-fetch');
const urlencodedParser = express.urlencoded({extended: false});

const app = express()
const port = process.env.PORT || 3000

const key = '752f990ab071528a352306f302bca0aa';

app.use(express.static('static'))

async function db_init(name) {
    const exists = await new Promise(res => {
        fs.exists(name, exists => res(exists))
    })
    const db = new sqlite3.Database(name)
    if (!exists) {
        console.log("Database file doesn't exist")
        db.run('CREATE TABLE "Cities" ('+
            ' "name" TEXT NOT NULL'+
            ');')
    } else {
        console.log("Database file exists")
    }
    return db
}

app.get('/', (req, res) => {
    res.sendFile(
        './static/index.html',
    )
})

app.get('/weather/city', (req, res) => {
    let parsedUrl = url.parse(req.url)
    let parsedQS = queryString.parse(parsedUrl.query)

    let lat = parsedQS.lat
    let lon = parsedQS.lon

    const myURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&lang=ru&appid=' + key;
    fetch(myURL).then(function (resp) {return resp.json() }).then(function (data) {
        res.send(JSON.stringify(data))
    })
})

app.get('/weather/city/er', (req, res) => {
    const myURL = 'https://api.openweathermap.org/data/2.5/weather?lat=59.8944&lon=30.2642&lang=ru&appid=' + key
    fetch(myURL).then(function (resp) {return resp.json() }).then(function (data) {
        res.send(JSON.stringify(data))
    })
})

app.post('/addFavourite', urlencodedParser, (req, res) => {
    let my_body = JSON.parse(Object.keys(req.body)[0])

    console.log(my_body.favorites)
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + my_body.favorites + '&units=metric&lang=ru&appid=' + my_body.key

    fetch(encodeURI(url))
        .then(function (resp) {return resp.json() }).then(data => {
            let resObj = {
                er: "",
                success: false,
                res: {}
            }

            if (data.cod === '404') { res.send(JSON.stringify(resObj)) }

            let sql_1 = 'SELECT name FROM Cities WHERE name = (?)'
            db.get(sql_1, [data.name.toLowerCase()], (er, row) => {
                if (er) {
                    console.log(er)
                    resObj.er = er.msg
                    res.send(JSON.stringify(resObj))
                } else if (!row) {
                    let sql_2 = 'INSERT INTO Cities VALUES (?)'
                    db.run(sql_2, [data.name.toLowerCase()], (er) => {
                        if (er) {
                            console.log(er)
                            resObj.er = er.msg
                        } else {
                            resObj.success = true
                            resObj.res = data
                        }
                        res.send(JSON.stringify(resObj))
                    })
                } else {
                    resObj.success = true
                    resObj.res = data
                    res.send(JSON.stringify(resObj))
                }
            })

        })
})

app.get('/getFavouriteAll', (req, res) => {

    let resObj = {
        er: "",
        success: false,
        res: {}
    }

    let sql_1 = 'SELECT name FROM Cities'
    db.all(sql_1, [], (er, rows) => {
        if (er) {
            console.log(er)
            resObj.er = er.msg
        } else {
            let resList = []
            rows.forEach(row => {
                resList.push(row.name.toLowerCase())
            })
            resObj.res = resList
        }
        res.send(JSON.stringify(resObj))
    })

})

app.delete('/delFavouriteCity', urlencodedParser, (req, res) => {
    let city = JSON.parse(Object.keys(req.body)[0])

    let resObj = {
        er: "",
        success: false,
    }

    let sql = 'DELETE FROM Cities WHERE name = (?)'
    db.run(sql, [city], (er) => {
        if (er) {
            console.log(er)
            resObj.er = er.msg
        } else {
            resObj.success = true
        }
        res.send(JSON.stringify(resObj))
    })
})

db_init('./db.sqlite')
    .then(async (_db) => {
        db = new sqlite3.Database('./db.sqlite')
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    })