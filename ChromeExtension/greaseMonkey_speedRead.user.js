// ==UserScript==
// @name       SpeedReadr
// @namespace  http://alasdairmorrison.com
// @version    0.58
// @description  speed read the web!
// @match      http://*/*
// @copyright  2013+, Alasdair Morrison
// @include http(s?)://*/*
// ==/UserScript==

if (window.top != window.self)  //don't run on frames or iframes
{
   return;
}

var i,s,ss=['https://raw.github.com/amorri40/SpeedReadr/master/jquery.min.js',
'https://dl.dropbox.com/s/4747vqcdo4rse2f/mespeak.js',
'https://dl.dropbox.com/s/tdf19x7ifnha9zx/speedread.js']; //https://raw.github.com/amorri40/SpeedReadr/master/speedread.js
for(i=0;i!=ss.length;i++) {
        s=document.createElement('script');
        s.src=ss[i];
        document.body.appendChild(s);
}