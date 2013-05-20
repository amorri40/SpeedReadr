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

var i,s,ss=['https://dl.dropbox.com/s/40t2rblgah5ukon/jquery.min.js',
'https://dl.dropbox.com/s/8yg9z7vt77thyji/speedread.js'];
for(i=0;i!=ss.length;i++) {
        s=document.createElement('script');
        s.src=ss[i];
        document.body.appendChild(s);
}