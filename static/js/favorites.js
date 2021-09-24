/*---------------------------------------------------    Избранное      ---------------------------------------------------*/

var favorites = window.localStorage;
const KEY = '752f990ab071528a352306f302bca0aa';

/*-------- Добавление --------*/
let Form = document.getElementById('form');
Form.addEventListener("submit", function (event){

    event.preventDefault();
    let name = document.getElementById('POST-name');
    favorites.setItem(name.value.toLowerCase(), name.value);
    name.value = "";
    loadStorage();

});


//Загрузка избранного
function loadStorage(){
    //Прорадитель избранного
    let favor = document.querySelector('.menu');

    //цикл очищения
    while (favor.firstChild){
        favor.removeChild(favor.lastChild)
    }

    //Цикл заполнения
    for (let i = 0; i < favorites.length; i++) {
        let key = favorites.key(i);
        fill(key, favor);
    }
}

//Функция генерации элемента
function genCityEl(data, key, favor) {
    let city = document.createElement("li");
    city.hidden = true;

    let load = document.createElement('li');
    load.classList.add('load', 'city');

    let text = document.createElement('p');
    load.append(text);
    text.innerText = "Подождите данные загружаются...";
    favor.append(load);

    city.classList.add('city');

    let head = document.createElement("div");
    head.classList.add('flex');
    city.appendChild(head);

    let name = document.createElement("h3");
    name.textContent = data.name;
    let temp = document.createElement("p");
    temp.textContent = data.main.temp + '°C';
    let img = document.createElement("span");
    img.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;
    let btn = document.createElement("button");
    btn.classList.add('delete');

    // Функция удаления города
    btn.addEventListener("click", () => {
        delCity(load, city, key)
    }, false);


    btn.innerHTML =  `<img src="img/del.jpeg">`;

    head.appendChild(name);
    head.appendChild(temp);
    head.appendChild(img);
    head.appendChild(btn);


    let data_city = document.createElement("ul");
    data_city.classList.add('weather');
    city.appendChild(data_city);

    let wind_li = document.createElement("li");
    wind_li.textContent = "Ветер";
    data_city.appendChild(wind_li);
    let wind_data_city = document.createElement('span');
    wind_data_city.classList.add('wind');
    wind_li.appendChild(wind_data_city);
    wind_data_city.textContent = data.wind.speed + ' m/s';

    let cloud_li = document.createElement("li");
    cloud_li.textContent = "Облачность";
    data_city.appendChild(cloud_li);
    let cloud_data_city = document.createElement('span');
    cloud_data_city.classList.add('cloud');
    cloud_li.appendChild(cloud_data_city);
    cloud_data_city.textContent = data.clouds.all + '%';

    let pressure_li = document.createElement("li");
    pressure_li.textContent = "Давление";
    data_city.appendChild(pressure_li);
    let pressure_data_city = document.createElement('span');
    pressure_data_city.classList.add('pressure');
    pressure_li.appendChild(pressure_data_city);
    pressure_data_city.textContent = data.main.pressure + ' hpa';

    let humidity_li = document.createElement("li");
    humidity_li.textContent = "Влажность";
    data_city.appendChild(humidity_li);
    let humidity_data_city = document.createElement('span');
    humidity_data_city.classList.add('humidity');
    humidity_li.appendChild(humidity_data_city);
    humidity_data_city.textContent = data.main.humidity +'%';

    let coord_li = document.createElement("li");
    coord_li.textContent = "Координаты";
    data_city.appendChild(coord_li);
    let coord_data_city = document.createElement('span');
    coord_data_city.classList.add('coord');
    coord_li.appendChild(coord_data_city);
    coord_data_city.textContent = '['+data.coord.lat + ', ' + data.coord.lon + ']';
    favor.appendChild(city);

    load.hidden = true;
    city.hidden = false;
}

function delCity(load, city, key) {
    fetch('/delFavouriteCity', {
        method: 'DELETE',
        body: JSON.stringify(key),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(response => response.json())
        .then(json => {
            favorites.removeItem(key);
            load.remove();
            city.remove();
        })


}

function fill(key, favor){
    let data = {
        favorites: favorites.getItem(key).toLowerCase(),
        key: KEY
    }

    fetch('/addFavourite', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json.success)
        if (json.success) {
            let data = json.res

            genCityEl(data, key, favor)
        } else {
            alert(`Города ${localStorage.getItem(key)} нет в базе данных`);
            load.remove();
            favorites.removeItem(key);
        }
    })
    // .catch(function () {
    //     //Обрабатываем ошибки
    // });

}

window.addEventListener('load', () => {
    fetch('/getFavouriteAll', {method: 'GET'})
        .then(response => response.json())
        .then(json => {
            let res = json.res
            res.forEach(key => {
                favorites.setItem(key.toLowerCase(), key);
            })
            loadStorage();
        })
})
