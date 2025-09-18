


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

/*start links 
function buildLinks() {
    let links = config.linkBackUp;
    if (localStorage.getItem("homePageLinks")){

    }

    document.querySelector("[data-links='1']").innerHTML = "";
    document.querySelector("[data-links='2']").innerHTML = "";
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

}


buildLinks()
*/

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
            config.ytInfo + config.ytInfoTwo);
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




let feed = "";
let value = "AZ Central";
let selected = 0;

function viewPosts(direction) {
    console.log("viePosts: drection: " + direction);

    if (config[activeRestaurant].blogAddress.length === 0) {
        document.getElementById("blogSection").classList.add("hide");
        return false;
    }
    /*   [].forEach.call(document.querySelectorAll(".post[data-num]"), function (e) {
         e.classList.add("hide");
       });
       if (document.querySelector(".fadeIn")) {
         [].forEach.call(document.querySelectorAll(".fadein"), function (e) {
           e.classList.remove("fadeIn");
         });
       }
   */
    const blogLength = blog.length;

    //let visibleCards = activePost / blogLength;
    if ((typeof direction) === "number") {
        activePost = direction;
    } else {

        if (direction === "Next") {
            activePost = activePost + 1;
            if (activePost >= blogLength) {
                activePost = 0;
            }

        } else {
            activePost = activePost - 1;
            if (activePost < 0) {
                activePost = blogLength - 1;
            }
        }
    }

    document.querySelector("[data-activepost]").innerHTML = (Number(activePost) + 1);
    document.querySelector("[data-blogmax").innerHTML = blogLength;

    document.getElementById("activeBlogTitle").innerHTML = blog[activePost].title;
    document.getElementById("activeBlogPubDate").innerHTML = blog[activePost].pubDate;
    document.getElementById("activeBlogDescription").innerHTML = blog[activePost].description;
    if (document.querySelector(".post[data-num='" + activePost + "']")) {
        document
            .querySelector(".post[data-num='" + activePost + "']")
            .classList.remove("hide");
        document
            .querySelector(".post[data-num='" + activePost + "']")
            .classList.add("fadeIn");
    }
}


async function getBlog(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.log("Error: " + error);
        throw error;
    }
}


async function getRssFeed(whatFeed) {



    let phpRelayAddress = "https://mechanized-aesthetics.net/php-relays/any-restaurant-blog-address.php?q=";


    try {

        blog = await getBlog(phpRelayAddress + whatFeed);

        console.log("We changed restaurants(typeof blog): " + (typeof blog));

        viewPosts(0);


    } catch (error) {
        console.log("Error: " + error)
    }


    /* console.log("whatfeed: " + whatFeed);
     try {
         const response = await fetch(config.RSSget + whatFeed);
         result = await response.text();
 
         document.getElementById("newsResponse").innerHTML = result;
         document.getElementById("newsResponseMobile").innerHTML = result;
 
 
 
 
     } catch (error) {
         console.log("Error: " + error);
         // buildList(JSON.parse(localStorage.getItem("result")), localStorage.getItem("stateSelected"));
         return false;
     }*/

}


function changeFeed(onLoad, device) {

    let feedChoice = config.rssBackUp[0].link;
    if (device === "desktop") {
        feedChoice = document.querySelector("[name='rssOptions']").value;
    } else {
        feedChoice = document.querySelector("[name='rssOptionsMobile']").value;
    }




    if (onLoad) {
        if (localStorage.getItem("rssLink")) {
            feedChoice = localStorage.getItem("rssLink");

            document.querySelector("select[name='rssOptions'] option[value='" + feedChoice + "']").selected = true;
            document.querySelector("select[name='rssOptionsMobile'] option[value='" + feedChoice + "']").selected = true;


        }
    }

    getRssFeed(feedChoice);

    let feedOptions = config.rssBackUp;
    if (localStorage.getItem("rsseLinks")) {
        feedOptions = JSON.parse(localStorage.getItem("rsseLinks"));
    }
    for (let i = 0; i < feedOptions.length; i++) {
        if (feedChoice === feedOptions[i].link) {
            localStorage.setItem("rssName", feedOptions[i].name);
            localStorage.setItem("rssLink", feedOptions[i].link);
        }
    }
    /*
    document.getElementById("newsResponse").scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    });*/
}
/**/




/*start links*/
function buildLinks() {
    let links = config.linkBackUp;
    if (localStorage.getItem("homePageLinks")) {
        links = JSON.parse(localStorage.getItem("homePageLinks"));
    } else {
        localStorage.setItem("homePageLinks", JSON.stringify(links));
    }
    let linksColOne = "";
    let linksColTwo = "";
    let howManyLinks = ((links.length) / 2);
    let linkNamesStr = "";

    for (let i = 0; i < links.length; i++) {
        if (i > howManyLinks) {
            linksColOne = linksColOne + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${links[i].url}">${links[i].name}</a>`;
        } else {
            linksColTwo = linksColTwo + `<a class="list-group-item" data-iteration="${i}" target="_self" href="${links[i].url}">${links[i].name}</a>`;
        }
        linkNamesStr = linkNamesStr + "<option value='" + i + "'>" + links[i].name + "</option>";
    }
    document.querySelector("[name='linkListTarget']").innerHTML = linkNamesStr;


    document.querySelector("[data-links='1']").innerHTML = linksColOne;
    document.querySelector("[data-links='2']").innerHTML = linksColTwo;
}
buildLinks()

function filterLinks() {

    let links = config.linkBackUp;
    if (localStorage.getItem("homePageLinks")) {
        links = JSON.parse(localStorage.getItem("homePageLinks"));

    } else {
        localStorage.setItem("homePageLinks", JSON.stringify(links));
    }


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


/*start custom search module*/
let customSearchArr = [{ siteName: "RottenTomatoes", queryStr: "https://www.rottentomatoes.com/search?search=" }, { siteName: "wikiPedia", queryStr: "https://en.wikipedia.org/wiki/" }];


function customSearch(num) {
    let searchQuery = document.querySelector("[name='" + customSearchArr[num].siteName + "']").value;

    window.location = customSearchArr[num].queryStr + searchQuery;
    document.querySelector("[name='" + customSearchArr[num].siteName + "']").value = "";
}


/*start link CMS */


function updateLink() {
    document.querySelector("[name='linkName']").classList.remove("error");
    document.querySelector("[name='linkUrl']").classList.remove("error");

    let links = config.linkBackUp;
    if (localStorage.getItem("homePageLinks")) {
        links = JSON.parse(localStorage.getItem("homePageLinks"));

    } else {
        localStorage.setItem("homePageLinks", JSON.stringify(links));
    }
    let crudFunct = document.querySelector("[name='linkEdit']").value;
    let selectedLink = document.querySelector("[name='linkListTarget']").value;
    let linkName = document.querySelector("[name='linkName']").value;
    let linkUrl = document.querySelector("[name='linkUrl']").value;

    if (linkName === "" && crudFunct !== "deleteLink") {
        document.querySelector("[name='linkName']").classList.add("error");
        globalAlert("alert-danger", "What's the name of the link?");
        return false;

    }

    if (linkUrl === "" && crudFunct !== "deleteLink") {

        document.querySelector("[name='linkUrl']").classList.add("error");
        globalAlert("alert-danger", "What's the url?");
        return false;
    }

    console.log("what fubnction:" + crudFunct);

    switch (crudFunct) {
        case "editLink":
            links[selectedLink].name = linkName;
            links[selectedLink].url = linkUrl;
            globalAlert("alert-success", "Links Edited Successfully");

            break;
        case "addLink":
            links.push({ name: linkName, url: linkUrl });
            globalAlert("alert-success", "Links Added Successfully");

            break;
        case "deleteLink":
            let tempLinks = [];
            for (let i = 0; i < links.length; i++) {
                if (i !== Number(selectedLink)) {
                    tempLinks.push(links[i])
                }
            }
            links = tempLinks;
            globalAlert("alert-success", "Links Deleted Successfully");

            break;
    }

    localStorage.setItem("homePageLinks", JSON.stringify(links));
    document.querySelector("[name='linkName']").value = "";
    document.querySelector("[name='linkUrl']").value = "";
    buildLinks();

}

function updateCrudFunc() {
    let crudFunct = document.querySelector("[name='linkEdit']").value;


    switch (crudFunct) {
        case "editLink":
            document.getElementById("btFunc").innerHTML = "Update Link Name and URL";
            document.querySelector("[name='linkName']").setAttribute("placeholder", " Edit Name");
            document.querySelector("[name='linkUrl']").setAttribute("placeholder", " Edit Url");

            if (document.querySelector(".hide[name='linkName']")) {
                document.querySelector(".hide[name='linkName']").classList.remove("hide");
            }
            if (document.querySelector(".hide[name='linkUrl']")) {
                document.querySelector(".hide[name='linkUrl']").classList.remove("hide");
            }
            if (document.querySelector(".hide[name='linkListTarget']")) {
                document.querySelector("[name='linkListTarget']").classList.remove("hide");
            }
            break;
        case "addLink":
            document.getElementById("btFunc").innerHTML = "Add a Name and URL";
            document.querySelector("[name='linkName']").setAttribute("placeholder", " Add Name");
            document.querySelector("[name='linkUrl']").setAttribute("placeholder", "Add Url");
            document.querySelector("[name='linkListTarget']").classList.add("hide");
            if (document.querySelector(".hide[name='linkName']")) {
                document.querySelector(".hide[name='linkName']").classList.remove("hide");
            }
            if (document.querySelector(".hide[name='linkUrl']")) {
                document.querySelector(".hide[name='linkUrl']").classList.remove("hide");
            }
            break;
        case "deleteLink":
            document.getElementById("btFunc").innerHTML = "Delete Link";
            document.querySelector("[name='linkName']").classList.add("hide");
            document.querySelector("[name='linkUrl']").classList.add("hide");
            if (document.querySelector(".hide[name='linkListTarget']")) {
                document.querySelector("[name='linkListTarget']").classList.remove("hide");
            }

            break;
    }

}


/*start rss cms*/

function updateRssFunc() {
    let whichFunc = document.querySelector("[name='rssEdit']").value;

    switch (whichFunc) {
        case "addRss":
            if (document.querySelector(".hide[name='addRssName']")) {
                document.querySelector("[name='addRssName']").classList.remove("hide");
            }
            if (document.querySelector(".hide[name='addRssUrl']")) {
                document.querySelector("[name='addRssUrl']").classList.remove("hide");
            }
            document.querySelector("[name='rssListTarget']").classList.add("hide");
            document.getElementById("rssUpdateBt").innerHTML = "Add Feed";
            break;

        case "deleteRss":
            document.querySelector("[name='rssListTarget']").classList.remove("hide");
            document.getElementById("rssUpdateBt").innerHTML = "Delete Feed";
            document.querySelector("[name='addRssName']").classList.add("hide");
            document.querySelector("[name='addRssUrl']").classList.add("hide");
            break;

    }
}


function buildRssList() {
    console.log("BUILDING RSS LIST  !")
    let rssLinks = config.rssBackUp;
    if (localStorage.getItem("rssLinks")) {
        rssLinks = JSON.parse(localStorage.getItem("rssLinks"));
    } else {
        localStorage.setItem("rsseLinks", JSON.stringify(rssLinks));
    }
    let rssLinkStr = "";
    let rssListHTML = "";
    for (let i = 0; i < rssLinks.length; i++) {
        rssLinkStr = rssLinkStr + "<option value='" + i + "' >" + rssLinks[i].name + "</option>";
        rssListHTML = rssListHTML + `<option value="${rssLinks[i].link}">${rssLinks[i].name}</option>`;
    }
    document.querySelector("[name='rssListTarget']").innerHTML = rssLinkStr;

    document.querySelector("[name='rssOptions']").innerHTML = rssListHTML;
    document.querySelector("[name='rssOptionsMobile']").innerHTML = rssListHTML;



}
buildRssList();
function updateRssList() {
    document.querySelector("[name='addRssName']").classList.remove("error");
    document.querySelector("[name='addRssUrl']").classList.remove("error");
    let rssLinks = config.rssBackUp;
    let rssName = document.querySelector("[name='addRssName']").value;
    let rssUrl = document.querySelector("[name='addRssUrl']").value;

    if (localStorage.getItem("rssLinks")) {
        rssLinks = JSON.parse(localStorage.getItem("rssLinks"));
    } else {
        localStorage.setItem("rssLinks", JSON.stringify(rssLinks));
    }

    let whichFunc = document.querySelector("[name='rssEdit']").value;

    if (whichFunc !== "deleteRss") {
        if (rssName === "") {
            globalAlert("alert-danger", "What's the name of the RSSS feed?");
            document.querySelector("[name='addRssName']").classList.add("error");
            return false;
        }

        if (rssUrl === "") {
            globalAlert("alert-danger", "What's the url of the feed?");
            document.querySelector("[name='addRssName']").classList.add("error");
            return false;
        }
    }
    console.log("whichFunc: " + whichFunc);

    switch (whichFunc) {
        case "addRss":

            rssLinks.push({
                name: rssName,
                link: rssUrl,
            });
            globalAlert("alert-success", "RSS Feed Added");
            break;

        case "deleteRss":

            let rssStrTemp = [];

            for (let i = 0; i < rssLinks.length; i++) {
                if (i !== Number(document.querySelector("[name='rssListTarget']").value)) {
                    rssStrTemp.push(rssLinks[i]);
                }
            }
            rssLinks = rssStrTemp;
            globalAlert("alert-success", "RSS Feed Deleted");
            break;

    }
    localStorage.setItem("rssLinks", JSON.stringify(rssLinks));
    buildRssList();
    document.querySelector("[name='addRssName']").value = "";
    document.querySelector("[name='addRssUrl']").value = "";

}

changeFeed(true);