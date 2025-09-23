

let videoIdList = ["bk-oTa4p4Fc", "CUpOMSJ1MdU", "jomAUAP976Y", "LDTXoJ5Xzrc", "64ftDUeUrQY", "gAIwWeFURPk", "QEJpZjg8GuA", "muOBrsm5DPc", "TTYnHr_-wcY", "iSQlLQqMP6I", "88bMVbx1dzM", "Kqx9blbYDB0", "a1UsUocKkgY", "ViTCO0mFkUo", "OqqKQP2sb4Q", "9thv_D5yoQw", "yACZtGCFvzU", "Ni82f1-cAXg", "ZdFFL9wNsaY", "gzLPa6NbcrE", "eOL2t7yyods", "Opxhh9Oh3rg", "S7TUe5w6RHo", "gJrSWXFXvlE", "awzOq_XKA_o", "dKcOTr7N4lE", "WdGQsBDSEpk", "qYJFkJXL2YY", "9hfqVrVIsyU", "J6yABdjYzLk", "5N_kWAxLPkM", "SAaVgY3twJs", "_TedFmvfCYo", "vtkwWe61uYw", "AdtLxlttrHg", "md75n8cyenA", "gh8HX4itF_w", "vmziIVL3jro", "P1ww1IXRfTA", "8Are9dDbW24", "1mFf5B5qEX4", "zEZ0DttCS9s", "zvrRCBlTmDE", "cLUD_NGE370", "WAzxy5yy6gs", "X73Eiad0JmM", "upJ43DEOg9c", "XDBWjfUgaR8"];
let theInterval = null;
let activeVideo = 0;
let runningCarousel = true;

function setActiveVideo(whichVideo, autoManual) {




    console.log("autoManual: " + autoManual + " (typeof whichVideo): " + (typeof whichVideo) + " - " + whichVideo);

    activeVideo = videoIdList.indexOf(whichVideo);

    if (document.querySelector(".active[data-num]")) {
        document.querySelector(".active[data-num]").classList.remove("active");
    }

    if (document.querySelector("[data-num='" + activeVideo + "']")) {
        document.querySelector("[data-num='" + activeVideo + "']").classList.add("active");
    }



    document.querySelector(".youTubeIframe").setAttribute("src", "https://www.youtube.com/embed/" + whichVideo)


    if (autoManual === "manual") {
        console.log("You said it was manual!")
        toggleTimer("manual")
    } else {
        if (runningCarousel) {
            toggleTimer("auto")
            runningCarousel = false;
        }


    }
    return false;
}

async function loadYouTubePlaylist() {

    try {

        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${config.ytPlaylistId}&mine=true&maxResults=50&key=${config.ytInfo + config.ytInfoTwo}`);
        result = await response.json();

        let videoIndexStr = "";
        videoIdList = [];

        for (let i = 0; i < result.items.length; i++) {
            videoIdList.push(result.items[i].snippet.resourceId.videoId);

            let selected = "";
            if (i === 0) {
                selected = "active";
            }
            videoIndexStr = videoIndexStr + `<li data-num="${i}" class="sliderIndex ${selected}" onClick="setActiveVideo('${result.items[i].snippet.resourceId.videoId}', 'manual')"></li>`;
        }

        document.querySelector(".videoindexParent").innerHTML = videoIndexStr;

        setActiveVideo(videoIdList[Math.floor(Math.random() * videoIdList.length)], "auto");
    } catch (error) {
        console.log("Error: " + error);

        return false;
    }


    /* fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${config.ytPlaylistId}&mine=true&key=${config.ytInfo}`)
         .then((data) => {
 
             console.log("JSON.stringify(info): " + JSON.stringify(data));
 
 
             if (!data.length) {
                 console.log("no data");
                 return false;
             }
 
             let videoIndexStr = "";
 
 
             for (let i = 0; i < data.items.length; i++) {
                 videoIdList.push(data.items[i].snippet.resourceId.videoId);
                 let selected = "";
                 if (i === 0) {
                     selected = "active";
                 }
                 videoIndexStr = videoIndexStr + `<li data-num="${i}" class="sliderIndex ${selected}" onClick="setActiveVideo('${data.items[i].snippet.resourceId.videoId}', 'manual')"></li>`;
             }
 
             document.querySelector(".videoindexParent").innerHTML = videoIndexStr;
         });*/


}



if (window.location.toString().indexOf("3000") !== -1) {
    //result = backUpYtIds;
    console.log("we are not calling youtube")
    let videoIndexStr = "";
    for (let i = 0; i < videoIdList.length; i++) {
        // videoIdList.push(result.items[i].snippet.resourceId.videoId);
        let selected = "";
        if (i === 0) {
            selected = "active";
        }
        videoIndexStr = videoIndexStr + `<li data-num="${i}" class="sliderIndex ${selected}" onClick="setActiveVideo('${videoIdList[i]}', 'manual')"></li>`;
    }
    document.querySelector(".videoindexParent").innerHTML = videoIndexStr;
    let randomVid = videoIdList[Math.floor(Math.random() * videoIdList.length)];
    console.log("randomVidNum: " + randomVid + " - number: " + videoIdList.indexOf(randomVid));
    setActiveVideo(randomVid, "auto");
}
else {
    loadYouTubePlaylist();
}

function toggleTimer(mode) {

    console.log("Mode: " + mode);

    if (mode === "auto") {
        document.querySelector("[data-bt='pause']").classList.remove("hide");
        document.querySelector("[data-bt='play']").classList.add("hide");

        theInterval = setInterval(startCalling, 5000);
        console.log("STARTED");
        runningCarousel = true;

        return false;

    }

    if (mode === "manual") {
        console.log("STOPPED");
        document.querySelector("[data-bt='pause']").classList.add("hide");
        document.querySelector("[data-bt='play']").classList.remove("hide");

        clearInterval(theInterval);
        theInterval = null;
        runningCarousel = false;
        return false;
    }



}



function startCalling(option) {
    if (option === undefined) {
        option = "auto";
    }
    activeVideo = Number(document.querySelector(".active.sliderIndex").dataset.num);

    console.log("activeVideo: " + activeVideo + " (typeof activeVideo): " + (typeof activeVideo));
    let newActive = activeVideo + 1;
    if (newActive < 0) newActive = videoIdList.length;
    if (newActive > videoIdList.length - 1) newActive = 0;

    activeVideo = newActive;

    if (option === "manual") {
        console.log("we stopped it");
        setActiveVideo(videoIdList[activeVideo], "manual");
        return false;
    } else {
        console.log("we are moving on!");
        setActiveVideo(videoIdList[activeVideo], "auto");
    }



}

function nextVideo() {

    let newActive = activeVideo + 1;
    if (newActive < 0) newActive = videoIdList.length;
    if (newActive > videoIdList.length - 1) newActive = 0;

    activeVideo = newActive;
    setActiveVideo(videoIdList[activeVideo], "manual");

}


function previousVideo() {
    let newActive = activeVideo - 1;
    if (newActive < 0) newActive = videoIdList.length;
    if (newActive > videoIdList.length - 1) newActive = 0;

    activeVideo = newActive;
    setActiveVideo(videoIdList[activeVideo], "manual");
}









