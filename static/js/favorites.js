/*---------------------------------------------------    Избранное      ---------------------------------------------------*/

var favorites = window.localStorage;

var mainData = {}

const KEY = '752f990ab071528a352306f302bca0aa';

/*-------- Добавление --------*/
let Form = document.getElementById('form');
Form.addEventListener("submit", function (event){

    event.preventDefault();

    let name = document.getElementById('POST-name');

    let data = {
        favorites: name.value.toLowerCase(),
        key: KEY
    }

    addFavourite(data)

});

function addFavourite(data) {
    let name = document.getElementById('POST-name');
    fetch('/addFavourite', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
        .then(response => response.json())
        .then(json => {
            if (json.success) {

                let data = json.res

                if (mainData[data.name.toLowerCase()] === undefined) {
                    mainData[data.name.toLowerCase()] = data

                    loadStorage();
                } else {
                    alert(`Город ${name.value} уже выбран как избранный`);
                }

            } else {
                alert(`Города ${name.value} нет в базе данных`);
            }
            name.value = "";
        })
}

//Загрузка избранного
function loadStorage(){
    //Прорадитель избранного
    let favor = document.querySelector('.menu');

    //цикл очищения
    favor.innerHTML = ''

    //Цикл заполнения
    Object.keys(mainData).forEach( key => {
    // for (let i = 0; i < mainData.length; i++) {
        genCityEl(mainData[key], key, favor);
    })
}

function delCity(load, city, key) {
    delete mainData[key]

    fetch('/delFavouriteCity', {
        method: 'DELETE',
        body: JSON.stringify(key),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(response => response.json())
        .then(json => {
            delete mainData[key];
            load.remove();
            city.remove();
        })


}

//Функция генерации элемента
function genCityEl(data, key, favor) {
    const template = document.querySelector('#m-template')

    var card = template.content.cloneNode(true)

    let load = card.querySelector("li.load.city");
    load.style.display = 'none'

    let city = card.querySelector("li.city:nth-child(2)");

    let name = card.querySelector("h3");
    name.innerText = data.name;

    let temp = card.querySelector(".flex > p");
    temp.innerText = data.main.temp + '°C';

    let img = card.querySelector(".flex > span");
    img.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;

    let btn = card.querySelector("button.delete");

    // Функция удаления города
    btn.addEventListener("click", () => {
        delCity(load, city, key)
    }, false);


    let wind_li = card.querySelector(".weather-li:nth-child(1)");
    let tmp = wind_li.children[0]
    wind_li.innerText = "Ветер";
    wind_li.append(tmp)

    let wind_data_city = card.querySelector('.wind');
    wind_data_city.innerText = data.wind.speed + ' m/s';


    let cloud_li = card.querySelector(".weather-li:nth-child(2)");
    tmp = cloud_li.children[0]
    cloud_li.innerText = "Облачность";
    cloud_li.append(tmp)

    let cloud_data_city = card.querySelector('.cloud');
    cloud_data_city.innerText = data.clouds.all + '%';


    let pressure_li = card.querySelector(".weather-li:nth-child(3)");
    tmp = pressure_li.children[0]
    pressure_li.innerText = "Давление";
    pressure_li.append(tmp)

    let pressure_data_city = card.querySelector('.pressure');
    pressure_data_city.innerText = data.main.pressure + ' hpa';


    let humidity_li = card.querySelector(".weather-li:nth-child(4)");
    tmp = humidity_li.children[0]
    humidity_li.innerText = "Влажность";
    humidity_li.append(tmp)

    let humidity_data_city = card.querySelector('.humidity');
    humidity_data_city.innerText = data.main.humidity +'%';


    let coord_li = card.querySelector(".weather-li:nth-child(5)");
    tmp = coord_li.children[0]
    coord_li.innerText = "Координаты";
    coord_li.append(tmp)


    let coord_data_city = card.querySelector('.coords');
    coord_data_city.innerText = '['+data.coord.lat + ', ' + data.coord.lon + ']';

    favor.append(card);


}

window.addEventListener('load', () => {
    loadStorage()
    fetch('/getFavouriteAll', {method: 'GET'})
        .then(response => response.json())
        .then(json => {
            let res = []
            json.res.forEach(resSample => {
                let data = {
                    favorites: resSample,
                    key: KEY
                }
                addFavourite(data)
            })
        })
})
