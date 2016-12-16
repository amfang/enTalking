/**
 * Created by JackyFang on 12/15/16.
 */
/*
 * Copyright © 2016 I.B.M. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* The Animations module handles all animated parts of the app (in the SVG) */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Animations$" }] */
/* global Common: true, Snap: true, mina: true, Panel: true */

var Media = (function() {
    'use strict';

    var media;
    //alert("Media");
    // Publicly accessible methods defined
    return {
        init: init,
        play: mediaPlay,
        stop: mediaStop
    };

    // Initialize the animations
    function init() {
        //alert("Media -- init");
        media = document.createElement('audio'); //生成一个audio元素
        media.controls = true; //这样控件才能显示出来
        media.src = 'music/tll.mp3'; //音乐的路径
    }

    //
    function mediaPlay() {
        //alert("mediaPlay");
        /*if (TTSModule.audio !== null && !TTSModule.audio.ended) {
            alert("TTSModule.audio pause");
            TTSModule.audio.pause();
        }*/

        media.play();
    }

    // Load the dashboard and wipers
    function mediaStop() {
        if (!media.paused) {
            //alert("audioStop");
            media.pause(); //HTML5 audio don't have stop, only pause then set time to 0
            media.currentTime = 0.0;
        }
    }
}());
