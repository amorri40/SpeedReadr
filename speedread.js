/*
Bookmarklet: javascript:var%20i,s,ss=['https://dl.dropbox.com/s/8yg9z7vt77thyji/speedread.js','http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}void(0);
*/

speedreadr_font_size='4em';
speedreadr_font_weight='bold';
speedreaderWPM=350;
speedreadr_words_at_a_time=1;
words_per_second=speedreaderWPM/60;
words_per_milli=1000/words_per_second;


number_of_parents=0;
global_paused=true;

global_i=0;
current_element_words="";

global_target={};
global_next_target={};

function main() {
    console.log('start of speedreadr');

        var body=$('body')[0];

        speedreadrDiv=document.createElement("div"); 
        speedreadrDiv.className="speedReadr";
        speedreadrDiv.innerHTML="<div id='speedreadrWord'><div id='speedreadrCurrentWord'></div> <div><button onclick='global_paused=false; showWord();'>Play</button> <button onclick='global_paused=true'>Pause</button> <button onclick='speedreadr_gotoNextElement()'>Next Element</button> <button onclick='speedreadr_gotoPreviousElement()'>Previous Element</button> <button id='speedreadr_setparents' onclick='setParents(null)'>Set parents</button> <button id='speedreadr_setwpm' onclick='setWpm(null)'>Set wpm</button> <button id='speedreadr_setfontsize'>Set font size</button></div></div>";
        body.appendChild(speedreadrDiv);

        $(speedreadrDiv).css('position','fixed');
        $(speedreadrDiv).css('bottom','0px');
        $(speedreadrDiv).css('left','25%');
        $(speedreadrDiv).css('right','25%');
        $(speedreadrDiv).css('background','rgba(0,0,0,0.5)');
        $(speedreadrDiv).css('border-top','20px');
        $(speedreadrDiv).css('padding-top','20px');


        $(speedreadrDiv).css('background','-webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(47%,#f6f6f6), color-stop(100%,#ededed)) -webkit-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -o-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -ms-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%)')

        $('#speedreadrCurrentWord').css('font-size',speedreadr_font_size);
        $('#speedreadrCurrentWord').css('font-weight',speedreadr_font_weight);
        $('#speedreadrCurrentWord').css('width','100%');
        $('#speedreadrCurrentWord').css('height','100%');
        $('#speedreadrCurrentWord').css('text-align','center');
        $('#speedreadrCurrentWord').css('padding-bottom','10px');
        $('#speedreadrCurrentWord').css('color','white');

        $('#speedreadr_setwpm')[0].innerText="Wpm:"+speedreaderWPM;
        $('#speedreadr_setfontsize')[0].innerText="FontSize:"+speedreadr_font_size;
        $('#speedreadr_setparents')[0].innerText="Parents:"+number_of_parents;
        console.log("Speed reading!!");
}

function setWpm(number) {
    speedreadr_setProperty(number,"How many words per minute?",'#speedreadr_setwpm',"WPM:",speedreaderWPM);
    words_per_second=speedreaderWPM/60;
    words_per_milli=1000/words_per_second;
}


function setParents(number) {
    if (number==null)
    number_of_parents=window.prompt("How many parent elements from selection to read?",number_of_parents);
    else number_of_parents=number;

    $('#speedreadr_setparents')[0].innerText="Parents:"+number_of_parents;
}

function speedreadr_setProperty(number,question,element,property_name,property_to_set) {
    if (number==null)
    property_to_set=window.prompt(question,property_to_set);
    else property_to_set=number;

    $(element)[0].innerText=property_name+property_to_set;
}

function speedreadr_gotoNextElement() {
    MoveToElement(); 
}

/*
 ShowWord is called for every word that is to be displayed
*/
function showWord() {
    if (global_paused) return;
    if (current_element_words.length>global_i) {
        $('#speedreadrCurrentWord')[0].innerText=current_element_words[global_i];
        setTimeout(showWord,words_per_milli);
        global_i=global_i+1;
    }
else { 
    global_i=0;
    //now move on to the next element
    $(global_target).css('background-color','rgba(144,238,144,0.4)'); //set the finished element to green
    
    MoveToElement();
    //start the words
    setTimeout(showWord,words_per_milli);
}
}

function MoveToElement() {
    if (global_target==null) return;
    global_target=global_next_target;
    global_next_target=global_target.nextElementSibling;
    current_element_words=getWordListFromString(global_target.textContent);
    $(global_target).css('background-color','rgba(255, 251, 204,0.5)');
    global_target.scrollIntoViewIfNeeded();
}

function handleTouchEnd(e){
    if (global_paused == false) {
        global_paused=true; 
        return; 
    } else {
        global_paused=false;
        global_i=0;

        global_target=e.target;

        console.log("how many characters:"+global_target.innerText.length);
        if (global_target.innerText.length<70) setParents(number_of_parents+1);

        for (i=0;i<number_of_parents; i++) {
            global_target=global_target.parentElement;
        }
        global_next_target=global_target;
        MoveToElement();
        //start the words
        setTimeout(showWord,words_per_milli);
    }

}

function getWordListFromString(text) {
    text=text.replace('->',' -> ');
    return text.replace(/[\r\n]/g,' ').replace(/\./g,' ').replace(/ +(?= )/g,' ').replace(/\s\s/gi,' ').split(' ');
}

document.addEventListener('dblclick', handleTouchEnd, false);

/*
 Wait for JQuery to be loaded before running this script
*/
function checkJquery() {
    if (window.jQuery) {
        main();
    } else {
        window.setTimeout(checkJquery, 100);
    }
}

checkJquery();

