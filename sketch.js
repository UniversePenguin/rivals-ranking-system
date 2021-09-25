//Region Buttons
let regionNA;
let regionEU;
let regionOCE;
let regionMisc;

//Season Buttons
let seasonOne;
let seasonTwo;
let seasonThree;
let seasonFour;
let seasonFive;
let seasonSix;

//Setting Buttons
let onlineEnable;
let offlineEnable;

//System Buttons
let kInput;
let scaleInput;
let topXInput;

//Download Button
let downloadButton;

//Execute Button
let executeButton;

let previousList;

let allSets;

function preload() {
    allSets = loadJSON('./allRCSSets.json');
}

function setup() {
    noCanvas();

    //Cleaning up sets

    let temp = [];
    Object.values(allSets).forEach(x => {
        temp.push(x);
    })

    allSets = temp;
    delete(temp);

    allSets = allSets.sort((a, b) => {
        return a.metadata.completedAt - b.metadata.completedAt;
    })

    for (let i = 0; i < allSets.length; i++) {
        if (allSets[i].winner.name == "LBO") {
            allSets[i].winner.id = 156127;
        }
        if (allSets[i].loser.name == "LBO") {
            allSets[i].loser.id = 156127;
        }
    }

    //Region Buttons
    regionNA = createCheckbox('NA', true);
    regionNA.parent('regionCell');

    regionEU = createCheckbox('EU', true);
    regionEU.parent('regionCell');

    regionOCE = createCheckbox('OCE', true);
    regionOCE.parent('regionCell');

    regionMisc = createCheckbox('Misc', true);
    regionMisc.parent('regionCell');

    //Season Buttons
    seasonOne = createCheckbox('Season 1', true);
    seasonOne.parent('seasonCell');

    seasonTwo = createCheckbox('Season 2', true);
    seasonTwo.parent('seasonCell');
    
    seasonThree = createCheckbox('Season 3', true);
    seasonThree.parent('seasonCell');
    
    seasonFour = createCheckbox('Season 4', true);
    seasonFour.parent('seasonCell');
    
    seasonFive = createCheckbox('Season 5', true);
    seasonFive.parent('seasonCell');
    
    seasonSix = createCheckbox('Season 6', true);
    seasonSix.parent('seasonCell');
    
    //Setting Buttons
    offlineEnable = createCheckbox('Offline', true);
    offlineEnable.parent('settingCell');

    onlineEnable = createCheckbox('Online', true);
    onlineEnable.parent('settingCell');

    //System Buttons
    kInput = createInput(32);
    kInput.parent('kCell');

    scaleInput = createInput(400);
    scaleInput.parent('scaleCell');

    topXInput = createInput(100);
    topXInput.parent('topXCell');

    //Download Button
    downloadButton = createButton('Download Raw Data');
    downloadButton.parent('downloadCell');
    downloadButton.mousePressed(downloadData);

    //Execute Button
    executeButton = createButton('Execute');
    executeButton.mousePressed(runQuery);

}

function runQuery() {

    if (previousList) previousList.remove();

    acceptedRegions = []
    if (regionNA.checked()) {
        acceptedRegions.push('NA');
    }
    if (regionEU.checked()) {
        acceptedRegions.push('EU');
        }
    if (regionOCE.checked()) {
        acceptedRegions.push('OCE');
    }
    if (regionMisc.checked()) {
        acceptedRegions.push('Misc');
    }

    let acceptedSeasons = [];
    if (seasonOne.checked()) {
        acceptedSeasons.push(1);
    }
    if (seasonTwo.checked()) {
        acceptedSeasons.push(2);
    }
    if (seasonThree.checked()) {
        acceptedSeasons.push(3);
    }
    if (seasonFour.checked()) {
        acceptedSeasons.push(4);
    }
    if (seasonFive.checked()) {
        acceptedSeasons.push(5);
    }
    if (seasonSix.checked()) {
        acceptedSeasons.push(6);
    }

    let acceptedSettings = [];
    if (onlineEnable.checked()) {
        acceptedSettings.push('online');
    } 
    if (offlineEnable.checked()) {
        acceptedSettings.push('offline');
    }
    
    let filteredSets = allSets.filter(x => {
        let toReturn = true;

        if (acceptedRegions.indexOf(x.metadata.region) == -1) {
            toReturn = false;
        } else if (acceptedSeasons.indexOf(x.metadata.season) == -1) {
            toReturn = false;
        };
        
        if (!onlineEnable.checked() && x.metadata.isOnline) {
            toReturn = false;
        }
        if (!offlineEnable.checked() && !x.metadata.isOnline) {
            toReturn = false;
        }
        return toReturn;

    })

    let initKValue = kInput.value();
    let initScaleValue = scaleInput.value();

    if (initKValue == '') {
        initKValue = 32;
    }
    if (initScaleValue == '') {
        initScaleValue = 400;
    }

    let thisRatingSystem = new ELOSystem(parseInt(initKValue), parseInt(initScaleValue));

    for (let set of filteredSets) {
        thisRatingSystem.runMatch(set.winner, set.loser, set.winner.id);
    }

    let leaderboard = thisRatingSystem.printLeaderboard().split('\n');

    leaderboard = leaderboard.slice(0, topXInput.value());

    for (let i = 0; i < leaderboard.length; i++) {
        leaderboard[i] = leaderboard[i].split('|');
    }

    for (let x in leaderboard) {
        for (let y in leaderboard[x]) {
            leaderboard[x][y] = leaderboard[x][y].trim();
        }
    }

    let outputTable = createElement('table');
    previousList = outputTable;
    outputTable.id('output');
    
    for (let x of leaderboard) {
        let temp = createElement('tr');
        temp.parent(outputTable);

        let ranking = createElement('td', x[0]);
        let name = createElement('td', x[1]);
        let rating = createElement('td', x[2]);

        ranking.parent(temp);
        name.parent(temp);
        rating.parent(temp);

    }

}

function downloadData() {
    save(allSets, "data.json");
}
