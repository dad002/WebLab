const load = document.getElementById('load_main');
const first = document.getElementsByClassName('first')[0];
const second = document.getElementsByClassName('second')[0];

function geo(){

    load.hidden = false;
    first.hidden = true;
    second.hidden = true;

    const key = '752f990ab071528a352306f302bca0aa';


    navigator.geolocation.getCurrentPosition(function(position) {
/*---------------------------------------------------  Геопазиция доступна      ---------------------------------------------------*/
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        fetch(`/weather/city?lat=${lat}&lon=${lon}`, {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                createWeatherCard(json)
            })

    }, function (positionError){
/*---------------------------------------------------  Геопазиция НЕ доступна      ---------------------------------------------------*/
        if (GeolocationPositionError.PERMISSION_DENIED){

            fetch(`/weather/city/er`, {method: 'GET', credentials: 'include'})
                .then(response => response.json())
                .then(json => {
                    createWeatherCard(json)
                })
                .catch(function () {
                    //Обрабатываем ошибки
                    alert("Ошибка запроса");

                });
        }
    })

}

function createWeatherCard(data) {
    document.querySelector(".first h2").textContent = data.name;
    document.querySelector('.weather__icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`;
    document.querySelector(".first p").textContent = data.main.temp + '°C';

    document.querySelector(".wind").textContent = data.wind.speed + ' m/s';
    document.querySelector(".cloud").textContent = data.clouds.all + '%';
    document.querySelector(".pressure").textContent = data.main.pressure + ' hpa';
    document.querySelector(".humidity").textContent = data.main.humidity +'%';
    document.querySelector(".coord").textContent = '['+data.coord.lat + ', ' + data.coord.lon + ']';

    load.hidden = true;
    first.hidden = false;
    second.hidden = false;
}

update_desktop = document.getElementById('button-desktop');
update_mobile= document.getElementById('button-mobile');
update_desktop.addEventListener("click", geo);
update_mobile.addEventListener("click", geo);

window.addEventListener('load', () => {
    geo()
})
