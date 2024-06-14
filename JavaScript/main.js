const apiKey = "f6a329b8f467491fbf9223012232102"
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const weatherViewRow = document.querySelector("#weatherView");
const windDirectionMap = {
    'N': 'North',
    'NNE': 'North-Northeast',
    'NE': 'Northeast',
    'ENE': 'East-Northeast',
    'E': 'East',
    'ESE': 'East-Southeast',
    'SE': 'Southeast',
    'SSE': 'South-Southeast',
    'S': 'South',
    'SSW': 'South-Southwest',
    'SW': 'Southwest',
    'WSW': 'West-Southwest',
    'W': 'West',
    'WNW': 'West-Northwest',
    'NW': 'Northwest',
    'NNW': 'North-Northwest'
};

const searchInput = document.querySelector("#searchInput")



async function start() {
    const city = await getCityFromIP();
    await getData(city);
}
start()


searchInput.addEventListener("keyup", function () {
    if (searchInput.value == "") {
        start()
    } else {
        getData(searchInput.value)
    }

})

async function getData(location) {

    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`)
    const data = await res.json();

    if (data) {
        displayData(data)
    }

}


function displayData(data) {

    let today = data.forecast.forecastday[0];
    let day2 = data.forecast.forecastday[1];
    let day3 = data.forecast.forecastday[2];

    // Getting Date Info
    const date = new Date(today.date);
    const tom = new Date(day2.date);
    const aftertom = new Date(day3.date);


    //week Day
    const weekdayToday = weekdays[date.getDay()]; // ex: Saturday
    const weekdayTomorrow = weekdays[tom.getDay()];
    const weekdayAfterTom = weekdays[aftertom.getDay()];

    //Month
    const monthName = months[date.getMonth()]; //ex: January

    //Day
    const day = date.getDate();
    //===========================================================

    const currentWindDir = data.current.wind_dir; // Wind Direction


    let weatherView = `
    <div class="col-lg-4">
                    <div class="weather-item rounded-start-3" id="today">
                        <div class="item-header p-2 d-flex justify-content-between rounded-start-3">
                            <span id="weekDay">${weekdayToday}</span>
                            <span id="todayDate">${day}${monthName}</span>
                        </div>
                        <div class="item-body px-2 py-3">
                            <div class="location">${data.location.name}</div>
                            <div class="degree d-flex flex-wrap">
                                <div class="num">${data.current.temp_c}<sup>o</sup>C</div>
                                <div class="forecast-icon">
                                    <img src="https://${data.current.condition.icon}"
                                        alt="forecast-icon" class="img-fluid">
                                </div>
                            </div>
                            <div class="cloud-stat">${data.current.condition.text}</div>
                            <div>${today.day.maxtemp_c}<sup>o</sup>/ ${today.day.mintemp_c}<sup>o</sup> </div>
                            <div class="wind-stat mt-4">
                                <span class="me-3"><img
                                        src="https://routeweather.netlify.app/images/icon-umberella@2x.png" alt=""
                                        width="21" height="21"> ${data.current.humidity}%</span>
                                <span class="me-3"><img src="https://routeweather.netlify.app/images/icon-wind@2x.png"
                                        alt="" width="23" height="21"> ${data.current.wind_kph} km/h</span>
                                <span class="me-3"><img
                                        src="https://routeweather.netlify.app/images/icon-compass@2x.png" alt=""
                                        width="21" height="21">${windDirectionMap[currentWindDir]}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="weather-item" id="tomorrow">
                        <div class="item-header p-2 d-flex justify-content-center">
                            <span>${weekdayTomorrow}</span>
                        </div>
                        <div class="item-body px-3 py-3 d-flex flex-column align-items-center">

                            <div class="forecast-icon d-flex justify-content-center mt-3">
                                <img src="https:${day2.day.condition.icon}" alt="" width="48">
                            </div>

                            <div class="degree d-flex flex-column mt-3 text-center">
                                <div class="num">${day2.day.maxtemp_c}<sup>o</sup>C</div>
                                <div class="min-deg">${day2.day.mintemp_c}<sup>o</sup></div>

                            </div>
                            <div class="cloud-stat mt-3">${day2.day.condition.text}</div>

                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="weather-item rounded-end-3">
                        <div class="item-header p-2 d-flex justify-content-center">
                            <span>${weekdayAfterTom}</span>
                        </div>
                        <div class="item-body px-3 py-3 d-flex flex-column align-items-center">

                            <div class="forecast-icon d-flex justify-content-center mt-3">
                                <img src="https:${day3.day.condition.icon}" alt="" width="48">
                            </div>

                            <div class="degree d-flex flex-column mt-3 text-center">
                                <div class="num">${day3.day.maxtemp_c}<sup>o</sup>C</div>
                                <div class="min-deg">${day3.day.mintemp_c}<sup>o</sup></div>
                            </div>
                            <div class="cloud-stat mt-3">${day3.day.condition.text}</div>

                        </div>
                    </div>
                </div>
    `

    weatherViewRow.innerHTML = weatherView;

}



async function getCityFromIP() {
    const url = `https://ipapi.co/json/`;

    const response = await fetch(url);

    const data = await response.json();

    const city = data.city;

    return city;

}

