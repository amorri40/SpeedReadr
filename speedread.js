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
global_target_time_delay=0;
global_next_time_delay=0;

function main() {
    console.log('start of speedreadr');

        var body=$('body')[0];

        speedreadrDiv=document.createElement("div"); 
        speedreadrDiv.className="speedReadr";
        speedreadrDiv.innerHTML="<div id='speedreadrWord'><div id='speedreadrCurrentWord'></div> <div id='speedreadr_buttonDiv'><button class='speedreadrButton' onclick='play_pause_button()' id='speedreadr_playPause'>Play</button> <button class='speedreadrButton' onclick='speedreadr_gotoNextElement()'>Next Element</button> <button class='speedreadrButton' onclick='speedreadr_gotoPreviousElement()'>Previous Element</button> <button class='speedreadrButton' id='speedreadr_setparents' onclick='setParents(null)'>Set parents</button> <button class='speedreadrButton' id='speedreadr_setwpm' onclick='setWpm(null)'>Set wpm</button> <button class='speedreadrButton' id='speedreadr_setfontsize'>Set font size</button></div></div>";
        body.appendChild(speedreadrDiv);

        $(speedreadrDiv).css('position','fixed');
        $(speedreadrDiv).css('bottom','0px');
        $(speedreadrDiv).css('left','15%');
        $(speedreadrDiv).css('right','15%');
        $(speedreadrDiv).css('background','rgba(0,0,0,0.2)');
        $(speedreadrDiv).css('border-top','20px');
        $(speedreadrDiv).css('padding-top','5px');
        $(speedreadrDiv).css('padding-left','5px');
        $(speedreadrDiv).css('z-index','999'); //make sure this is always on top of everything
        $(speedreadrDiv).css('font-size','1.0em');

        $('#speedreadr_buttonDiv').css('background','rgba(0,0,0,0.0)');

        $('.speedreadrButton').css('font','bold 0.7em Verdana, Geneva, sans-serif');
        $('.speedreadrButton').css('color','rgb(255, 255, 255)');
        $('.speedreadrButton').css('background','-webkit-gradient( linear, left top, left bottom, from(rgb(18, 159, 253)), to(rgb(0, 103, 171)))');
        $('.speedreadrButton').css('box-shadow','0px 1px 3px rgba(000, 000, 000, 0.5), inset 0px 0px 2px rgba(255, 255, 255, 0.7)');
        $('.speedreadrButton').css('border','1px solid rgb(7, 100, 128)');
        $('.speedreadrButton').css('border-radius','3px');
        $('.speedreadrButton').css('text-transform','uppercase');
        $('.speedreadrButton').css('width','auto');
        $('.speedreadrButton').css('padding','3px');

        $(speedreadrDiv).css('background','-webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(47%,#f6f6f6), color-stop(100%,#ededed)) -webkit-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -o-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -ms-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%)')

        $('#speedreadrCurrentWord').css('font-size',speedreadr_font_size);
        $('#speedreadrCurrentWord').css('font-weight',speedreadr_font_weight);
        $('#speedreadrCurrentWord').css('width','100%');
        $('#speedreadrCurrentWord').css('height','100%');
        $('#speedreadrCurrentWord').css('text-align','center');
        $('#speedreadrCurrentWord').css('padding-bottom','10px');
        $('#speedreadrCurrentWord').css('color','white');
        $('#speedreadrCurrentWord').css('background','rgba(0,0,0,0.0)');

        $('#speedreadr_setwpm')[0].innerText="Wpm:"+speedreaderWPM;
        $('#speedreadr_setfontsize')[0].innerText="FontSize:"+speedreadr_font_size;
        $('#speedreadr_setparents')[0].innerText="Parents:"+number_of_parents;

        console.log("Speed reading!!");
}

function play_pause_button() {
    speedreadr_setPause(!global_paused); showWord();

}

function speedreadr_setPause(bool) {
    if (bool) {
        //paused
        $(speedreadrDiv).css('background','rgba(0,0,0,0.2)');
        global_paused=true;
        $('#speedreadr_playPause')[0].innerText="Play";
    } else {
        //unpaused
        $(speedreadrDiv).css('background','rgba(0,0,0,1.0)');
        global_paused=false;
        $('#speedreadr_playPause')[0].innerText="Pause";
    }
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
        setTimeout(showWord,words_per_milli+global_target_time_delay);
        global_target_time_delay=global_next_time_delay;
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

function move_up_element_tree(el) {
    
   // console.log("We are trying to get sibling of the parent of:"+el.nodeName+" "+el.innerHTML);
   //     console.log("The parent is :"+el.parentElement.nodeName+" "+el.parentElement.innerHTML)
        
        var parent_sibling = el.parentElement.nextSibling;
        if (parent_sibling==null) {
            //console.log('unfortunetly this parent doesnt have a sibling');
            return move_up_element_tree(el.parentElement);
        }
      //  console.log("the next target shall be:"+parent_sibling);
        global_next_target=move_down_element_tree(parent_sibling);
}

function move_down_element_tree(el) {
   // console.log("move_down into "+el.nodeName+el.innerHTML);
    //if (el==null) return null;
    delay_for_nodes(el);
    if (el.nodeName=="#text") return el;
    if (el.nodeName=="P") return el;
    if (el.nodeName=="IFRAME"|| el.nodeName=="SCRIPT" || el.nodeName=="#comment") {
        console.log("ignoring:"+el.nodeName);
        //ignore these elements
        if (el.nextSibling!=null)
        return move_down_element_tree(el.nextSibling); //move back up to ignore iframes
        else
            return move_up_element_tree(el);
    }
    if (el.firstChild == null) return el; //no child
    if (el.firstChild.childNodes>0) return move_down_element_tree(el.firstChild);
    else {
        //console.log('no child elements for:'+el.firstChild.nodeName+' so we will return it');
        if (el.firstChild.nodeName=="#text") {
           // console.log("#text node so return parent");
            
            return el;
        } else if (el.firstChild.nodeName=="#comment") {
            if (el.firstChild.nextSibling !=null)
                return move_down_element_tree(el.firstChild.nextSibling) //is there a sibling to the comment return it
            else return move_up_element_tree(el.firstChild); //no sibling so move back up and ignore the comment
        }

        return el.firstChild;
    }
}

function delay_for_nodes(el) {
    if (el.nodeName=="LI") {
        console.log("List Item");
        global_next_time_delay=100;
    }
}

function MoveToElement() {
    global_next_time_delay=0;
    if (global_target==null) return;

    if (global_next_target==null) {
        move_up_element_tree(global_target);
    }

    global_target=global_next_target;
    if (global_target.nextSibling !=null) {
        global_next_target=move_down_element_tree(global_target.nextSibling);
    } else {
        console.log('no next sibling');
        global_next_target=move_up_element_tree(global_target);
    }



    current_element_words=getWordListFromString(global_target.textContent);
    $(global_target).css('background-color','rgba(255, 251, 204,0.5)');
    if (global_target.scrollIntoViewIfNeeded != null)
        global_target.scrollIntoViewIfNeeded();
}

function handleTouchEnd(e){
    if (global_paused == false) {
        speedreadr_setPause(true); 
        return; 
    } else {
        setParents(0); //initialise parents
        speedreadr_setPause(false);
        global_i=0;

        global_target=move_down_element_tree(e.target);

        console.log("how many characters:"+global_target.innerText.length);
        console.log(global_target.nodeName)
        global_target.is_heading=(global_target.nodeName.search(/H[1..9]/)==0);
        console.log("Is this a heading:"+global_target.is_heading);
        ignoreFormatElements();
        //if (global_target.innerText.length<70) setParents(number_of_parents+1);

        update_target_to_no_of_parents();
        global_next_target=global_target;
        MoveToElement();
        //start the words
        setTimeout(showWord,words_per_milli);
    }

}

function ignoreFormatElements() {
    var name_of_node=global_target.nodeName;
    if (name_of_node=="B") setParents(number_of_parents+1);
    if (name_of_node=="STRONG") setParents(number_of_parents+1);
}

function update_target_to_no_of_parents() {
    /*for (i=0;i<number_of_parents; i++) {
            global_target=global_target.parentElement;
        }*/
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

