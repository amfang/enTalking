var Music = (function() {
    'use strict';
    var music;
    alert("Music");

    return {
        init: init
        //,
        //play: playMusic,
        //stop: stopMusic
    };

    function init() {
        alert("Music -- init");
        initMusic();
    }

    function initMusic() {
        alert("Music -- initMusic");
        music = document.createElement('audio'); //生成一个audio元素
        music.controls = true; //这样控件才能显示出来
        music.src = 'music/tll.mp3'; //音乐的路径
    }


}());