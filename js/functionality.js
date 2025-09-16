/*start weather api*/



async function fetchWWeather() {


    let zipCode = "85260";
    if (localStorage.getItem("zipCode")) {
        zipCode = localStorage.getItem("zipCode");
    }

    try {
        if (document.querySelector("input[name='zipCode']").value) {
            zipCode = document.querySelector("input[name='zipCode']").value;
        }
    } catch (error) {
        console.error(error);
    }
    //  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",US&appid=" + config.weatherInfo + "&units=imperial");
    const contents = await response.json();
    return contents;
}


const BuildWeather = async () => {


    let dates;
    const result = await fetchWWeather();
    const tempData = result;
    let tempDates = [];
    let singleDates = [];
    let whichDay = "";
    let minTemps = [];
    let maxTemps = [];
    let lowest = 0;
    let highest = 0;
    let dateList = [];
    let city = "Scottsdale";
    if (tempData.city.name) {
        city = tempData.city.name;
        document.getElementById("cityName").innerHTML = city;
    }

    for (let i = 0; i < tempData.list.length; i++) {
        if (whichDay !== tempData.list[i].dt_txt.substring(0, 10)) {

            tempDates.push({
                day: tempData.list[i].dt_txt.substring(0, 10),
                min: 0,
                max: 0
            });
            whichDay = tempData.list[i].dt_txt.substring(0, 10);
            minTemps = [tempData.list[i].main.temp_min];
            maxTemps = [tempData.list[i].main.temp_max];
            lowest = tempData.list[i].main.temp_min;
            highest = tempData.list[i].main.temp_max;
        } else {
            minTemps.push(tempData.list[i].main.temp_min);
            maxTemps.push(tempData.list[i].main.temp_max);
            lowest = Math.min(...minTemps);
            highest = Math.max(...maxTemps);
            for (let j = 0; j < tempDates.length; j++) {
                if (tempDates[j].day === tempData.list[i].dt_txt.substring(0, 10)) {
                    tempDates[j].min = lowest;
                    tempDates[j].max = highest;
                }
            }
        }

    }
    for (let i = 0; i < tempData.list.length; i++) {
        for (let j = 0; j < tempDates.length; j++) {
            if (tempDates[j].day === tempData.list[i].dt_txt.substring(0, 10) && tempDates[j].max !== 0 && tempDates[j].min !== 0) {
                tempData.list[i].main.temp_min = tempDates[j].min;
                tempData.list[i].main.temp_max = tempDates[j].max;
            }
        }
    }
    for (let i = 0; i < tempData.list.length; i++) {
        if (dateList.indexOf(tempData.list[i].dt_txt.substring(0, 10)) === -1) {
            dateList.push(tempData.list[i].dt_txt.substring(0, 10));
            if (singleDates.length <= 4) {
                singleDates.push(tempData.list[i]);
            }
        }
    }

    date = singleDates;
    let weatherStr = "";

    for (let i = 0; i < date.length; i++) {
        weatherStr = weatherStr + "<li><img src=' https://openweathermap.org/img/wn/" + date[i].weather[0].icon
            + "@2x.png'  class='img-fluid'/><div class='center weathertxt'>" + date[i].dt_txt.substring(5,
                10) + "<br />" + date[i].weather[0].description + "</div><div class='center'>High: " +
            date[i].main.temp_max + " - Low: " + date[i].main.temp_min + "</div></li>";
    }
    document.querySelector(".inline.weather.center").innerHTML = weatherStr;
}; BuildWeather();

/*end weather api*/

/*start links */
let right = "";
let left = "";

for (let i = 0; i < config.linkBackUp.length; i++) {

    if (i < 18) {
        left = left + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${config.linkBackUp[i].url}">${config.linkBackUp[i].name}</a>`;
    } else {
        right = right + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${config.linkBackUp[i].url}">${config.linkBackUp[i].name}</a>`;
    }
    document.querySelector("[data-links='1']").innerHTML = left;
    document.querySelector("[data-links='2']").innerHTML = right;



}


/*end links*/

/*start youtube*/


async function searchYouTube() {

    videoIdList = [];
    document.querySelector(".videoindexParent").innerHTML = "";
    let search = "";
    if (document.querySelector("[name='YouTubeQuery']").value !== "") {
        search = document.querySelector("[name='YouTubeQuery']").value;
    }


    try {
        const response = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=" +
            search +
            "&type=video&key=" +
            config.ytInfo);
        result = await response.json();


        console.log("JSON.stringify(result): " + JSON.stringify(result))
        let videoIndexStr = "";

        for (let i = 0; i < result.items.length; i++) {
            videoIdList.push(result.items[i].id.videoId);
            let selected = "";
            if (i === 0) {
                selected = "active";
            }
            videoIndexStr = videoIndexStr + `<li data-num="${i}" class="sliderIndex ${selected}" onClick="setActiveVideo('${result.items[i].id.videoId}')"></li>`;
        }


        document.querySelector(".videoindexParent").innerHTML = videoIndexStr;

        function setActiveVideo(whichVideo) {

            console.log("(typeof whichVideo): " + (typeof whichVideo) + " - " + whichVideo);

            let activeVideo = videoIdList.indexOf(whichVideo);

            if (document.querySelector(".active[data-num]")) {
                document.querySelector(".active[data-num]").classList.remove("active");
            }

            document.querySelector("[data-num='" + activeVideo + "']").classList.add("active");


            document.querySelector(".youTubeIframe").setAttribute("src", "https://www.youtube.com/embed/" + whichVideo)


        }

        setActiveVideo(result.items[0].id.videoId);
    } catch (error) {
        console.log("Error: " + error);
        // buildList(JSON.parse(localStorage.getItem("result")), localStorage.getItem("stateSelected"));
        return false;
    }

    /*  fetch(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=" +
          search +
          "&type=video&key=" +
          config.ytInfo
      )
  
  
          .then((data) => {
  
              console.log("JSON.stringify(data): " + JSON.stringify(data))
              let videoIndexStr = "";
              let videoIdList = [];
              for (let i = 0; i < data.items.length; i++) {
                  videoIdList.push(data.items[i].id.videoId);
                  let selected = "";
                  if (i === 0) {
                      selected = "active";
                  }
                  videoIndexStr = videoIndexStr + `<li data-num="${i}" class="sliderIndex ${selected}" onClick="setActiveVideo('${data.items[i].id.videoId}')"></li>`;
              }
  
              document.querySelector(".videoindexParent").innerHTML = videoIndexStr;
  
              function setActiveVideo(whichVideo) {
  
                  console.log("(typeof whichVideo): " + (typeof whichVideo) + " - " + whichVideo);
  
                  let activeVideo = videoIdList.indexOf(whichVideo);
  
                  if (document.querySelector(".active[data-num]")) {
                      document.querySelector(".active[data-num]").classList.remove("active");
                  }
  
                  document.querySelector("[data-num='" + activeVideo + "']").classList.add("active");
  
  
                  document.querySelector(".youTubeIframe").setAttribute("src", "https://www.youtube.com/embed/" + whichVideo)
  
  
              }
  
              setActiveVideo(data.items[0].id.videoId);
          });*/
}


/*start RSS module*/

let rssListHTML = [];

for (let i = 0; i < config.rssBackUp.length; i++) {
    rssListHTML = rssListHTML + `<option value="${config.rssBackUp[i].link}">${config.rssBackUp[i].name}</option>`;
}


document.querySelector("#rssOptions").innerHTML = rssListHTML;



/*
class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: "",
      value: "AZ Central",
      selected: 0,
    };
    this.getRssFeed = this.getRssFeed.bind(this);
    this.changeFeed = this.changeFeed.bind(this);
  }*/
let feed = "";
let value = "AZ Central";
let selected = 0;

async function getRssFeed(whatFeed) {
    /* fetch(
       RSSget + whatFeed
     )
       .then((res) => res.text())
       .then(
         (result) => {
           this.setState({
             isLoaded: true,
             feed: result,
           });
         },
         // Note: it's important to handle errors here
         // instead of a catch() block so that we don't swallow
         // exceptions from actual bugs in components.
         (error) => {
           this.setState({
             isLoaded: true,
             error,
           });
         }
       );*/

    try {
        const response = await fetch(config.RSSget + whatFeed);
        result = await response.text();

        document.getElementById("newsResponse").innerHTML = result;




    } catch (error) {
        console.log("Error: " + error);
        // buildList(JSON.parse(localStorage.getItem("result")), localStorage.getItem("stateSelected"));
        return false;
    }

}


function changeFeed() {

    const feedChoice = document.getElementById("rssOptions").value;
    getRssFeed(feedChoice);

    const feedOptions = config.rssBackUp;
    for (let i = 0; i < feedOptions.length; i++) {
        if (feedChoice === feedOptions[i].link) {
            localStorage.setItem("rssName", feedOptions[i].name);
            localStorage.setItem("rssLink", feedOptions[i].link);
        }
    }


    document.getElementById("newsResponse").scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}
/*
changeFeed();
*/


/*start links*/

let links = config.linkBackUp;
if (localStorage.getItem("homePageLinks")) {
    links = JSON.parse(localStorage.getItem("homePageLinks"));

} else {
    localStorage.setItem("homePageLinks", JSON.stringify(links));
}
let linksColOne = "";
let linksColTwo = "";
let howManyLinks = ((links.length) / 2);

for (let i = 0; i < links.length; i++) {
    if (i > howManyLinks) {
        linksColOne = linksColOne + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${links[i].url}">${links[i].name}</a>`;
    } else {
        linksColTwo = linksColTwo + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${links[i].url}">${links[i].name}</a>`;
    }
}



document.querySelector("[data-links='1']").innerHTML = linksColOne;
document.querySelector("[data-links='2']").innerHTML = linksColTwo;

function filterLinks() {


    let stringQuery = document.querySelector("[name='filterLinks']").value.toLowerCase();

    for (let i = 0; i < links.length; i++) {
        if (links[i].name.toLowerCase().indexOf(stringQuery) === -1) {
            if (document.querySelector("[data-iteration='" + i + "']")) {
                document.querySelector("[data-iteration='" + i + "']").classList.add("hide");
                console.log("hide: " + links[i].name)
            }

        } else {
            if (document.querySelector(".hide[data-iteration='" + i + "']")) {
                document.querySelector("[data-iteration='" + i + "']").classList.remove("hide");

            }

        }
    }
}