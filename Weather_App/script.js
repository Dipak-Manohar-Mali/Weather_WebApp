const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".wheather-container");


const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm =document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector(".user-info-container");


// initial variable need->>
const API_KEY='36651e2dc4ad3ba65e8a81633b36b2f9';
let currentTab=userTab;
currentTab.classList.add('current-tab');
grantAccessContainer.classList.add('active');

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }else{
             //main phele search wale tab par tha, ab your weather tab visible karna h

             searchForm.classList.remove('active');
             userInfoContainer.classList.remove('active');
             
             //ab main your weather tab me aagaya hu ,toh weather bhi display  karna padega,so let's check local storage first
             //for coordinates,if we haved saved them there 
             getfromSessionStorage();
        }
    }

}





userTab.addEventListener('click',function(){
    switchTab(userTab);
});

searchTab.addEventListener('click',function(){
    switchTab(searchTab);
});


//check is coordinates are already present in session storage
function getfromSessionStorage()
{
   const localCoordinate=sessionStorage.getItem("user-coordinates");

   if(!localCoordinate){
    //agar local coordinate nahi mile to
    //we don't have location grant for now

    grantAccessContainer.classList.add('active');
   }else{

    const coordinates=JSON.parse(localCoordinate);
    fetchUserWeatherInfo(coordinates);
    

   }

}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;  
    //make grantContainer invisible
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');

    //API Call

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data=await response.json(); 

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderweatherInfo(data);
    }catch{
        loadingScreen.classList.remove('active');
    }
}


function renderweatherInfo(weatherInformation){

    //firstly we have to fetch the element

    const cityName= document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc= document.querySelector('[data-weatherDesc]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temp=document.querySelector('[data-temp]');

    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');

    //fetch values from weatherInfo Object and put it UI elements

    cityName.innerText=weatherInformation?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInformation?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInformation?.weather?.[0]?.description; 
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInformation?.weather?.[0]?.icon}.png`;
    temp.innerText=`${(weatherInformation?.main?.temp-273.15).toFixed(2)} °C`;

    windspeed.innerText=weatherInformation?.wind?.speed;
    humidity.innerText=weatherInformation?.main?.humidity;
    cloudiness.innerText=weatherInformation?.clouds?.all; 




}

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("GeoLocation not Supported")
    }
}

function showPosition(position)
{
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector('[data-grantAccess]');

grantAccessButton.addEventListener('click',getLocation);

let searchInput=document.querySelector('[data-searchInput]')
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === "") return;

    fetchSearchWeatherInfo(cityName);
});


async function fetchSearchWeatherInfo(city){

    

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherInfo(data);
        console.log(data);
    } catch (error) {
        
    }
}
















// const API_KEY='36651e2dc4ad3ba65e8a81633b36b2f9';
// async function shoWheather(){
//     let city='Dhule';
 
//     const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

//     let data= await response.json();
//     console.log(`Wheather Data is:-->> `,data)

//     let newPara=document.createElement('p');
//     newPara.textContent=`${data?.main?.temp- 273.15.toFixed(2)} C`;
//     document.body.appendChild(newPara);
// }
