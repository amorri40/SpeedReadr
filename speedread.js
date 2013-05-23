/*
Bookmarklet: javascript:var%20i,s,ss = ['https://dl.dropbox.com/s/8yg9z7vt77thyji/speedread.js', 'http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}void(0);
*/

/*
 JSHint comments
*/
/*global $, jQuery, document*/

var speedreadr = function () {

    /*
     Field variables
    */
    var speedreadr_font_size = '4em';
    var speedreadr_font_weight = 'bold';
    var speedreaderWPM = 350;
    var speedreadr_words_at_a_time = 5;
    var words_per_second = speedreaderWPM / 60;
    var words_per_milli = 1000 / words_per_second;


    var number_of_parents = 0;
    var global_paused = true;
    var speedreadr_total_words = 0;

    var global_i = 0;
    var current_element_words = "";

    var global_target = {};
    var global_next_target = {};
    var global_target_time_delay = 0;
    var global_next_time_delay = 0;
    var speedreadrDiv;

    var global_moved_up=false;
    var global_timeoutId=null;
    var global_audio_mode=true;

    /**
     * The main function is called when jquery has loaded to setup the main interface
     * 
     */
    function main() {
        var body = $('body')[0];

        speedreadrDiv = document.createElement("div");
        speedreadrDiv.className = "speedReadr";
        speedreadrDiv.innerHTML = "<div id='speedreadrWord'><div id='speedreadrCurrentWord'></div> <div id='speedreadr_buttonDiv'>" +
            "<button class='speedreadrButton' onclick='speedreadr.play_pause_button()' id='speedreadr_playPause'>Play</button>" +
            " <button class='speedreadrButton' onclick='speedreadr.speedreadr_gotoNextElement()'>Next Element</button> <button class='speedreadrButton' onclick='speedreadr.speedreadr_gotoPreviousElement()'>Previous Element</button>" +
            " <button class='speedreadrButton' id='speedreadr_setwpm' onclick='speedreadr.setWpm(null)'>Set wpm</button>" +
            " <button class='speedreadrButton' id='speedreadr_setfontsize'>Set font size</button>" +
            " <button class='speedreadrButton' id='speedreadr_close' onclick='speedreadr.close()'>Close</button> <span id='speedreadr_showStats'></span></div></div>";
        body.appendChild(speedreadrDiv);

        $(speedreadrDiv).css('position', 'fixed');
        $(speedreadrDiv).css('bottom', '0px');
        $(speedreadrDiv).css('left', '15%');
        $(speedreadrDiv).css('right', '15%');
        $(speedreadrDiv).css('background', 'rgba(0,0,0,0.2)');
        //$(speedreadrDiv).css('border-top', '20px');
        $(speedreadrDiv).css('padding-top', '20px');
        $(speedreadrDiv).css('padding-left', '5px');
        $(speedreadrDiv).css('z-index', '999'); //make sure this is always on top of everything
        $(speedreadrDiv).css('font-size', '1.0em');

        $('#speedreadr_buttonDiv').css('background', 'rgba(0,0,0,0.0)');

        $('#speedreadr_buttonDiv').css('font', 'bold 0.7em Verdana, Geneva, sans-serif');
        $('.speedreadrButton').css('color', 'rgb(255, 255, 255)');
        $('.speedreadrButton').css('background', '-webkit-gradient( linear, left top, left bottom, from(rgb(18, 159, 253)), to(rgb(0, 103, 171)))');
        $('.speedreadrButton').css('box-shadow', '0px 1px 3px rgba(000, 000, 000, 0.5), inset 0px 0px 2px rgba(255, 255, 255, 0.7)');
        $('.speedreadrButton').css('border', '1px solid rgb(7, 100, 128)');
        $('.speedreadrButton').css('border-radius', '3px');
        $('.speedreadrButton').css('text-transform', 'uppercase');
        $('.speedreadrButton').css('width', 'auto');
        $('.speedreadrButton').css('padding', '3px');

        $(speedreadrDiv).css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(47%,#f6f6f6), color-stop(100%,#ededed)) -webkit-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -o-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%) -ms-linear-gradient(top, #ffffff 0%,#f6f6f6 47%,#ededed 100%)');

        $('#speedreadrCurrentWord').css('font-size', speedreadr_font_size);
        $('#speedreadrCurrentWord').css('font-weight', speedreadr_font_weight);
        $('#speedreadrCurrentWord').css('width', '100%');
        $('#speedreadrCurrentWord').css('height', '100%');
        $('#speedreadrCurrentWord').css('text-align', 'center');
        $('#speedreadrCurrentWord').css('padding-bottom', '10px');
        $('#speedreadrCurrentWord').css('color', 'white');
        //$('#speedreadrCurrentWord').css('background', 'rgba(0,0,0,0.0)');
        $('#speedreadrWord').css('background', 'rgba(0,0,0,0.0)');

        $('#speedreadr_setwpm')[0].innerText = "Wpm:" + speedreaderWPM;
        $('#speedreadr_setfontsize')[0].innerText = "FontSize:" + speedreadr_font_size;

        $('#speedreadr_showStats').css('color', 'rgb(255, 255, 255)');

        console.log("Speed reading!!");
    }

    /**
     * Set whether the main speed reader should pause or not
     * @param  {bool} shouldPause whether speedreadr should pause
     * @return {void}
     */
    function speedreadr_setPause(shouldPause) {
        if (shouldPause) {
            $(speedreadrDiv).css('background', 'rgba(0,0,0,0.2)');
            global_paused = true;
            $('#speedreadr_playPause')[0].innerText = "Play";
            window.clearTimeout(global_timeoutId);
        } else {
            $(speedreadrDiv).css('background', 'rgba(0,0,0,1.0)');
            global_paused = false;
            $('#speedreadr_playPause')[0].innerText = "Pause";
            showWord();
        }
    }


/*
 The set property function allows users to set a value for properties such as WPM or font size using a window prompt
*/
    function speedreadr_setProperty(number,question,element,property_name,property_to_set) {
        if (number===null)
        property_to_set = window.prompt(question,property_to_set);
        else property_to_set = number;

        $(element)[0].innerText = property_name + property_to_set;
        return property_to_set
    }



    /*
     ShowWord is called for every word that is to be displayed
    */
    function showWord() {
        if (global_paused) return;
        if (global_audio_mode) return;
        
        speedreadr_total_words=speedreadr_total_words+speedreadr_words_at_a_time;
        $('#speedreadr_showStats')[0].innerText = "Total words:" + speedreadr_total_words + " Delay:" + global_target_time_delay;
        if (current_element_words.length>global_i) {
            var words_to_read = "";
            for (i=0; i<speedreadr_words_at_a_time; i++) {
                if (current_element_words[global_i] == undefined) break;
                words_to_read += " "+current_element_words[global_i];
                global_i=global_i + 1;
            }
            $('#speedreadrCurrentWord')[0].innerText=words_to_read;
            
        
        }
        else {
            global_i = 0;
            setFinishedColorForElement(global_target);
            //now move on to the next element            
            MoveToNextElement();
            global_target_time_delay=0; //reset time delay when moving element
            
        }
        global_timeoutId=setTimeout(showWord,(words_per_milli*speedreadr_words_at_a_time) + global_target_time_delay);
    }

/*
 Takes in an element and sets the background colour to indicate it has finished
*/
    function setFinishedColorForElement(el) {
        $(el).css('background-color', 'rgba(144,238,144,0.4)'); //set the finished element to green
        if (global_moved_up)
            $(el.parentElement).css('background-color', 'rgba(144,238,144,0.4)'); //we moved up the DOM so do the same for the parent
    }

/*
 Takes in an element and sets the background colour to indicate it is about to be read out
*/
    function setReadingColorForElement(el) {
        $(el).css('background-color', 'rgba(255, 251, 204,0.5)'); //set the element currently being read to yelowish
        if (global_moved_up)
            $(el.parentElement).css('background-color', 'rgba(255, 251, 204,0.5)'); //we moved up the DOM so do the same for the parent
    }

    function move_up_element_tree(el) {
        /*
            check if we need to add a delay for any elements we pass (either the current element or parent) 
        */
            delay_for_nodes(el,true);
            delay_for_nodes(el.parentElement,true);
            global_moved_up=true;
        /*
         We move up by getting the parentElement and then along to get its sibling
        */
            var parent_sibling = el.parentElement.nextSibling;
            if (parent_sibling===null)
                return move_up_element_tree(el.parentElement);
            else
                return move_down_element_tree(parent_sibling); // [TODO] shouldn't this be return?
    }

    /*
     Moves down the DOM from the element el until it finds a node which can be read, when it finds one it returns it
     Note: this function is recursive
    */
    function move_down_element_tree(el) {
        delay_for_nodes(el,false);
        delay_for_nodes(el.parentElement,false);

        if (el.nodeName=="#text") return el;
        if (el.nodeName=="P") return el;
        if (el.nodeName=="A") return el;
        if (el.nodeName=="IFRAME"|| el.nodeName=="SCRIPT" || el.nodeName=="#comment") {
            // we want to ignore these elements by either going to next sibling or mving back to parent
            if (el.nextSibling !== null)
                return move_down_element_tree(el.nextSibling); //move to the next sibling
            else
                return move_up_element_tree(el); //no sibling so move back up the tree
        }
        if (el.firstChild === null) return el; //no child
        if (el.firstChild.childNodes>0) return move_down_element_tree(el.firstChild);
        else {
            return el.firstChild;
        }
    }

    /*
     delay_for_nodes either adds or removes a time delay based on which element was just parsed in the DOM tree
     This is useful for addig a delay on list items and removing the delay when moving back up out of the list
    */
    function delay_for_nodes(el,isToBeRemoved) {
        if (el.nodeName=="LI" || el.nodeName=="OL" || el.nodeName=="UL") {
            console.log("Add List Item delay");
            if (isToBeRemoved) global_next_time_delay = 0;
            else
                global_next_time_delay = 100;
        } else if (el.nodeName.search(/H[1..9]/) === 0) {
            console.log("Add Heading delay to" + el.nodeName + " remove?" + isToBeRemoved);
            if (isToBeRemoved) {
                global_next_time_delay = 0;
            }
            else {
                global_next_time_delay = 500;
            }
        }
    }

    /*
        Moves from the target to the next target
    */
    function MoveToNextElement() {

        if (global_target===null) return;

        if (global_next_target===null) {
            move_up_element_tree(global_target);
        }
        //reset some variables
        delay_for_nodes(global_target,true); //remove delay for previous target
        global_moved_up=false;

        //now lets move to the next target
        global_target_time_delay = global_next_time_delay;
        global_target = global_next_target;

        //now before we start the current target lets get the next target
        if (global_target.nextSibling !== null) {
            global_next_target = move_down_element_tree(global_target.nextSibling);
        } else {
            global_next_target = move_up_element_tree(global_target);
        }

        //now that we have the target lets get the word list from it
        current_element_words = getWordListFromString(global_target.textContent);
        if (window.meSpeak && global_audio_mode) meSpeak.speak(''+current_element_words.join(''),{speed:speedreaderWPM});
            

        //to make sure the user knows where it is reading lets scroll to the element we are currently reading
        setReadingColorForElement(global_target);
        if (global_target.scrollIntoViewIfNeeded !== undefined)
            global_target.scrollIntoViewIfNeeded();
    }

    /*
     speedreadr_handleDoubleClick is called on double click in order to start the speed reader at the words that was double clicked
    */
    function speedreadr_handleDoubleClick(e){
        if (global_paused === false) {
            speedreadr_setPause(true);
            return;
        } else {
            $(speedreadrDiv).show();
            
            global_i = 0;

            global_target = move_down_element_tree(e.target);
            global_next_target = global_target; //they both need to be the same initially, so when moving to the next element it will still goto global_target
            MoveToNextElement();
            speedreadr_setPause(false);
        }

    }

    /*
     getWordListFromString takes in a String and returns a word list, but it performs
     a certain number of basic text modifications in order to improve the readig experience
    */
    function getWordListFromString(text) {
        text = text.replace('->', ' -> '); // arrows are often used to seperate steps in tutorials
        wordList = text.replace(/[\r\n]/g, ' ').replace(/ +(?= )/g, ' ').replace(/\s\s/gi, ' ').split(' '); //replace whitespace //.replace(/\./g, ' ')
        wordList = speedreadr_cleanWordList(wordList);
        return wordList;
    }

    /*
     Removes blank strings and urls from the word list as there is no point displaying a long url when speed reading
    */
    function speedreadr_cleanWordList(list){
      var returnList = [];
      for(var i = 0; i<list.length; i++){
          if (list[i].indexOf('http://')!==0 && list[i]!==''){
            returnList.push(list[i]);
        }
      }
      return returnList;
    }

    /*
     Event handling code
     On double click: start the speed reader
     On right click: pause the speed reader
     */

    document.addEventListener('dblclick', speedreadr_handleDoubleClick, false);
    document.addEventListener('contextmenu', handleRightClick, false);
    $(speedreadrDiv).click(function() {speedreadr.play_pause_button();});

    function handleRightClick(e) {
        if (!global_paused) speedreadr_setPause(true);
    }

function loadTTS() {
    if (window.meSpeak) {
    meSpeak.loadConfig("https://dl.dropbox.com/s/8077u3p9epji075/mespeak_config.json");
    meSpeak.loadVoice('https://dl.dropbox.com/s/1m3idwfuq7spwr5/en-sc.json');
    meSpeak.speak('Loaded');
} else {
    window.setTimeout(loadTTS, 100);
}
}

    /*
     Wait for JQuery to be loaded before running this script
    */
    function checkJquery() {
        if ($) { //check if jquery is defined
            main();
            //now that it has loaded add a click function to the main div, so it will play/pause when clicked
            $('#speedreadrCurrentWord').click(function() {speedreadr.play_pause_button();});
            if (global_audio_mode)
            loadTTS();
        } else {
            window.setTimeout(checkJquery, 100);
        }
    }

    checkJquery();

    return {
        play_pause_button : function() {
            speedreadr_setPause(!global_paused);
        },
        speedreadr_gotoNextElement : function() {
            MoveToNextElement();
        },
        close : function() {
            $(speedreadrDiv).hide();
        },
        /**
         * SetWPM takes in how fast the speed reader should show words in words per minute
         * It then performs internal calculations to work out how many milliseconds until the next word
         * @param {int} number number of words per minute
         */
        setWpm : function(number) {
            number=speedreadr_setProperty(number,"How many words per minute?", '#speedreadr_setwpm', "WPM:", speedreaderWPM);
            speedreaderWPM=number;
            words_per_second = speedreaderWPM/60;
            words_per_milli = 1000/words_per_second;
        }
    };
}();
