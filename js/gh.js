(function () {
    window.onload = function () {
        setTimeout(function () {
            StartGetInfo();
        }, 1 * 1000);
    }

    let url = "https://api.github.com/projects/3211436/columns";
    let token = "?access_token=e1643d3c12c5264ec69c8fa18cfd64b2b7d78bd1";

    let todoID = "ToDo";
    let progressID = "Progress";
    let doneID = "Done";

    let filler = "Config";

    function StartGetProjectInfo() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/projects/3211436" + token, true);
        xhr.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
        var response = "";
        xhr.onload = function () {
            response = this.responseText;
            StartInnerUpdateTime(response);
        }
        xhr.send();
    }

    function StartGetInfo() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url + token, true);
        xhr.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
        var response = "";
        xhr.onload = function () {
            response = this.responseText;
            StartInner(response);
        }
        xhr.send();
    }

    function StartGetCardsProgressInfo(link) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", link + token, true);
        xhr.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
        var response = "";
        xhr.onload = function () {
            response = this.responseText;
            StartInnerProgressMsg(response)
        }
        xhr.send();
    }

    function StartGetCardsInfo(link, listCardName) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", link + token, true);
        xhr.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
        var response = "";
        xhr.onload = function () {
            response = this.responseText;
            StartInnerProgress(response, listCardName)
        }
        xhr.send();
    }

    function StartInnerUpdateTime(projectInfo) {
        var recentUpdateTime = getRecentUpdateTime(projectInfo);
        setRecentUpdateTime(recentUpdateTime);
    }

    function StartInnerProgress(cardNotesInfo, listCardName) {
        var notes = getAllCardsNote(cardNotesInfo);
        for (var j in notes) {

            if (listCardName == todoID) {
                innerCards(todoID, notes[j]);
            } else if (listCardName == progressID) {
                innerCards(progressID, notes[j]);
            } else if (listCardName == doneID) {
                innerCards(doneID, notes[j]);
            }

        }

    }

    function StartInnerProgressMsg(cardsListInfo) {
        var precent = getConfig(cardsListInfo, "Progress");
        setProgressBar(precent);

        var msg = getConfig(cardsListInfo, "ProgressMsg");
        setProgressBarMsg(msg);
    }

    function StartInner(listInfo) {
        var listCardNames = getCardNames(listInfo);

        StartGetProjectInfo();
        InnerAllCardsNotes(listCardNames, listInfo);
    }

    function InnerAllCardsNotes(listCardNames, listInfo) {
        for (var i in listCardNames) {
            var link = getCardsUrl(listInfo, listCardNames[i]);

            if (listCardNames[i] == filler) {
                StartGetCardsProgressInfo(link);

            } else {
                StartGetCardsInfo(link, listCardNames[i]);

            }

        }
    }

    function innerCards(id, notes) {

        var element = document.getElementById(id);
        var msg = "<li class='list-group-item'>" + notes + "</li>";
        element.innerHTML += msg;

    }

    function setProgressBar(precent) {
        var element = document.getElementById("progressBar");
        element.style = "width:" + precent + "%";
    }

    function setProgressBarMsg(msg) {
        var element = document.getElementById("progressbarMsg");
        element.innerHTML = msg;

    }

    function setRecentUpdateTime(timevalue) {
        var element = document.getElementById("recentUpdateTime");
        element.innerHTML = timevalue;
    }

    function getRecentUpdateTime(timevalue) {
        let users = JSON.parse(timevalue);
        var output = "";
        for (var i in users) {
            if (i == "updated_at") {
                output += `${users[i]}`;
            }
        }
        return output;
    }

    function getCardNames(msg) {

        let users = JSON.parse(msg);
        var allNames = new Array();
        for (let i in users) {
            allNames[i] = `${users[i].name}`;
        }
        return allNames;
    }

    function getCardsUrl(msg, name) {

        let users = JSON.parse(msg);
        let output = '';
        for (let i in users) {
            var cardName = `${users[i].name}`;
            if (cardName == name) {
                output += `
			${users[i].cards_url}
			`;
            }
        }
        return output;
    }

    function getConfig(msg, configName) {

        var lists = JSON.parse(msg);
        var note = '';
        for (let i in lists) {
            note = `${lists[i].note}`;
            note = note.replace("\\", "");

            if (note.includes(configName)) {

                var jsonList = JSON.parse("{" + note + "}");
                var output = "";
                for (var j in jsonList) {
                    if (j == configName) {
                        output = jsonList[j];
                    }
                }

                return output;
            }
        }

        return "NULL";
    }

    function getAllCardsNote(msg) {
        let lists = JSON.parse(msg);
        var allNotes = new Array();
        for (let i in lists) {
            allNotes[i] = `${lists[i].note}`;
        }
        return allNotes;
    }
})(this);
