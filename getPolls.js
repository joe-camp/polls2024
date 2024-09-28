$(document).ready(function(){

console.log("Hello");

//Variable for the states drop-down element
var stateDropdown = document.getElementById('selector');

//Variable for the value of the search input field
var stateSelection;

console.log("Initial selection: ",stateDropdown.value);

//Listen for changes to the value of the state dropdown element
//When change is detected, update the stateSelection to the new selection
stateDropdown.addEventListener('input',newSelection);

stateSelection = stateDropdown.value;

//Variables for the URL for the data we will fetch
//example: https://projects.fivethirtyeight.com/polls/pennsylvania/polls.json
var pollUrl1="https://projects.fivethirtyeight.com/polls/president-general/2024/";
var pollUrl2="/polls.json";
var pollUrlComplete=pollUrl1+stateDropdown.options[stateDropdown.selectedIndex].innerHTML.toLowerCase()+pollUrl2;
//console.log(pollUrlComplete);

//The function to update things when a new state is selected
function newSelection(){
    //console.log("New selection detected");
    stateSelection = stateDropdown.options[stateDropdown.selectedIndex].innerHTML.toLowerCase();
    console.log("New selection detected: ",stateSelection);
    stateSelection = stateSelection.replace(/\s+/g, '-').toLowerCase();

    pollUrlComplete=pollUrl1+stateSelection+pollUrl2;
    //console.log(pollUrlComplete);
    pollsListDiv=document.getElementById("pollsList");
    pollsListDiv.innerHTML="";
    getPolls();
}

getPolls();

function getPolls(){
    console.log(pollUrlComplete);
    fetch(pollUrlComplete)
    .then(response => response.json())
    .then(data => {
        var numberOfResults = data.length;
        console.log("Number of Polls: "+numberOfResults);

        function SortByDate(a, b){
            var aD = new Date(a.endDate).getTime(), bD = new Date(b.endDate).getTime(); 
            return ((aD < bD) ? -1 : ((aD > bD) ? 1 : 0));
        }

        console.log(data.sort(SortByDate)); 

        mostRecent=numberOfResults-1;

        var bottomResult = numberOfResults-11;
        let count = mostRecent;

        while(count>bottomResult){
    
            var option1label = data[count].answers[0].choice;
            var option1pct = data[count].answers[0].pct;

            var option2label = data[count].answers[1].choice;
            var option2pct = data[count].answers[1].pct;

            var diff1 = option1pct - option2pct;
            diff1=diff1.toFixed(1);
            //console.log(diff1);

            var pollster = data[count].pollster;
            //console.log(data[mostRecent].pollster);
            var sampleSize = data[count].sampleSize;
            //console.log(data[mostRecent].sampleSize);
            var population = data[count].population;
            //console.log(data[mostRecent].population);
            var startDate = data[count].startDate;
            //console.log(data[mostRecent].startDate);
            var endDate = data[count].endDate;
            var url = data[count].url;
            //console.log(data[mostRecent].endDate);
            var infoline = pollster+" survey of "+sampleSize+" "+population;
            var dateLine = "Conducted "+startDate+" through "+endDate;
            urlObject=document.createElement('a');
            urlObject.innerHTML='Link to Poll';
            urlObject.setAttribute('href', url);
            //console.log(dateLine);

            //Create the parent element
            const addedPoll=document.createElement("div");
            addedPoll.classList.add("pollsListing");

            //Create the p element for the percentages
            const percentages=document.createElement("p");
            percentages.classList.add("percentages");

            option1pct+="%";
            option2pct+="%";

            //Underline the winning candidate and append the difference between their number
            if(option1pct > option2pct){
                option1label="<u>"+option1label+"</u>";
                option1pct+=(" (+"+diff1+")");
            }
            if(option2pct > option1pct){
                option2label="<u>"+option2label+"</u>";
                option2pct+=(" (+"+Math.abs(diff1)+")");
            }

            percentages.innerHTML=option1label+": "+option1pct+" | "+option2label+": "+option2pct;
            //percentages.innerHTML=option1label+": "+option1pct+"% | "+option2label+": "+option2pct+"% | "+option3label+": "+option3pct+"% | "+option4label+": "+option4pct+"%";
            addedPoll.append(percentages);

            const breakline=document.createElement("br");
            addedPoll.append(breakline);

            //Create the p element for the infoline
            const infolineNew=document.createElement("p");
            infolineNew.classList.add("infoline");
            infolineNew.innerHTML=infoline;
            addedPoll.append(infolineNew);

            //Create the p element for the dateline
            const dateLineNew=document.createElement("p");
            dateLineNew.classList.add("dateLine");
            dateLineNew.innerHTML=dateLine;
            addedPoll.append(dateLineNew);

            //Create the p element for the urlLine
            const urlLineNew=document.createElement("p");
            urlLineNew.classList.add("infoline");
            urlLineNew.append(urlObject);
            addedPoll.append(urlLineNew);

            //Append the parent element to the List element
            pollsListDiv=document.getElementById("pollsList");
            pollsListDiv.append(addedPoll);

            //Background color settings
            if(option1pct > option2pct){
                addedPoll.style.backgroundColor="#a1b4ff";
            }
            if(option2pct > option1pct){
                addedPoll.style.backgroundColor="#ffa6a6";
            }
            
            count--;
        }


    }
)}

})