/**
 * Created by JackyFang on 12/13/16.
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

/* The Intents module contains a list of the possible intents that might be returned by the API */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ConversationResponse$" }] */
/* global Animations: true, Api: true, Panel: true */

var ConversationResponse = (function() {
    'use strict';

    //definition of default STT language model

    var responseFunctions;
    //alert("ConversationResponse");

    return {
        init: init,
        responseHandler: responseHandler
    };

    function init() {
        //alert("ConversationResponse -- init");
        setupResponseFunctions();
        setupResponseHandling();
    }

    function setupResponseFunctions() {
        //alert("ConversationResponse -- setupResponseFunctions");
        responseFunctions = {
            turn_on: {
                appliance: {
                    AC: function() { Panel.ac('lo'); },
                    fan: function() { Panel.ac('lo'); },
                    heater: function() { Panel.heat('lo'); },
                    lights: function() { alert("function of turn_on_lightsOn is triggerred"); },//Animations.lightsOn(); },
                    wipers: function() { Animations.wipersOn('lo'); }
                },
                genre: function () { alert("function playMusic"); }//function(value) { Panel.playMusic(value); }
            },
            traffic_update: {
                appliance: {
                    AC: function() { Panel.ac('lo'); },
                    fan: function() { Panel.ac('lo'); },
                    heater: function() { Panel.heat('lo'); },
                    lights: function() { alert("function of turn_on_lightsOn is triggerred in traffic"); },//Animations.lightsOn(); },
                    wipers: function() { Animations.wipersOn('lo'); }
                },
                genre: function (value) {
                    var src = "music/tll.mp3";
                    Media.play(src);
                } //alert("function playMusic - value: "+value); }
            },
            turn_off: {
                appliance: {
                    lights: function() { Animations.lightsOff(); },
                    wipers: function() { Animations.wipersOff(); }
                }
            },
            turn_up: {
                appliance: {
                    AC: function() { Panel.ac('hi'); },
                    fan: function() { Panel.ac('hi'); },
                    heater: function() { Panel.heat('hi'); },
                    music: function() { Panel.playMusic('general'); },
                    wipers: function() { Animations.wipersOn('hi'); }
                },
                genre: function(value) { Panel.playMusic(value); }
            },
            turn_down: {
                appliance: {
                    AC: function() { Panel.ac('lo'); },
                    fan: function() { Panel.ac('lo'); },
                    heater: function() { Panel.heat('lo'); },
                    music: function() { Panel.playMusic('general'); },
                    wipers: function() { Animations.wipersOn('lo'); }
                },
                genre: function(value) { Panel.playMusic(value); }
            },
            locate_amenity: {
                amenity: {
                    gas: function() { Panel.mapGas(); },
                    restaurant: function() { Panel.mapFoodCuisine(); },
                    restroom: function() { Panel.mapRestrooms(); }
                },
                option: function(choice) { Panel.mapNavigation(choice); },
                cuisine: function() { Panel.mapFoodNumbers(); },
                func: function() { Panel.mapGeneral(); }
            },
            off_topic: {
                amenity: {
                    gas: function() { Panel.mapGas(); },
                    restaurant: function() { Panel.mapFoodCuisine(); },
                    restroom: function() { Panel.mapRestrooms(); }
                },
                cuisine: function() { Panel.mapFoodNumbers(); },
                genre: function(value) { Panel.playMusic(value); }
            }
        };
    }

    // Create a callback when a new Watson response is received to handle Watson's response
    function setupResponseHandling() {
        //alert("ConversationResponse -- setupResponseHandling");
        var currentResponsePayloadSetter = Api.setResponsePayload;
        Api.setResponsePayload = function(newPayloadStr) {
            currentResponsePayloadSetter.call(Api, newPayloadStr);
            console.log("response -- setupResponseHandling -- newPayloadStr:"+newPayloadStr)
            responseHandler(JSON.parse(newPayloadStr));
        };
    }

    // Called when a Watson response is received, manages the behavior of the app based - Action to Waston response
    // on the user intent that was determined by Watson
    function responseHandler(data) {
        //alert("ConversationResponse -- responseHandler");
        if (data && data.intents && data.entities && !data.output.error) {
            /*
             * - move to http.response to check the response then for preHandling
            // Check if message is handled by retrieve and rank and there is no message set
            alert("data.context.call_retrieve_and_rank: "+data.context.call_retrieve_and_rank+"--- data.output.text: "+data.output.text);
            if (data.context.call_retrieve_and_rank && data.output.text) {
                alert("Out of scope");
                // TODO add EIR link
                data.output.text = ['I am not able to answer that. You can try asking the'
                + ' <a href="https://conversation-enhanced.mybluemix.net/" target="_blank">Enhanced Information Retrieval App</a>'];
                Api.setResponsePayload(JSON.stringify(data));
                return;
            }
            */
            //console.log("responseHandler -- data: "+JSON.stringify(data));
            var primaryIntent = data.intents[0];
            if (primaryIntent) {
                handleBasicCase(primaryIntent, data.entities);
            }
        }
        //alert("ConversationResponse -- responseHandler -- completed");
    }

    /*
     * 根据response 来判断, off_topic/out off scope, 进行enhanced处理,提示中文输入或者爬虫获取互联网答案 - 参考enhanced -
     * rest/ProxyResource.java 和retrieve_and_rank/Query.java
     */
    // Handles the case where there is valid intent and entities
    function handleBasicCase(primaryIntent, entities) {
        //alert("ConversationResponse -- handleBasicCase -- primaryIntent: "+JSON.stringify(primaryIntent));
        var genreFound = null;
        // If multiple entities appear (with the exception of music),
        // do not perform any actions
        console.log("handleBasicCase -- primaryIntent: "+primaryIntent+" -- entities: "+JSON.stringify(entities));
        if (entities.length > 1) {

            var invalidMultipleEntities = true;
            switch (primaryIntent.intent) {
                case 'turn_on':
                    console.log("ConversationResponse -- handleBasicCase -- working on turn_on tasks");
                    break;
                case 'turn_off':
                case 'turn_up':
                case 'turn_down':
                    console.log("ConversationResponse -- handleBasicCase -- working on turn_on tasks");
                    entities.forEach(function(currentEntity) {
                        var entityType = currentEntity.entity;
                        if (entityType === 'genre') {
                            invalidMultipleEntities = false;
                            genreFound = currentEntity;
                        }
                    });
                    break;
                default:
                    invalidMultipleEntities = false;
                    break;
            }
        }

        // Otherwise, just take the first one (or the genre if one was found) and
        // look for the correct function to run
        if  (!invalidMultipleEntities) {

            var primaryEntity = (genreFound || entities[0]);
            console.log("handleBasicCase -- primaryEntity: "+JSON.stringify(primaryEntity));
            //alert("ConversationResponse -- handleBasicCase -- primaryEntity: "+JSON.stringify(primaryEntity));
            callResponseFunction(primaryIntent, primaryEntity);
        }
    }

    // Calls the appropriate response function based on the given intent and entity returned by Watson
    function callResponseFunction(primaryIntent, primaryEntity) {
        console.log("callResponseFunction -- primaryIntent.intent: "+primaryIntent.intent);
        var intent = responseFunctions[primaryIntent.intent];
        console.log("callResponseFunction -- intent: "+JSON.stringify(intent));
        console.log("intent function: "+typeof intent);
        if (typeof intent === 'function') {
            console.log("intent function: "+typeof intent);
            intent(primaryEntity.entity, primaryEntity.value);
        } else if (intent) {
            console.log("intent: "+JSON.stringify(intent));
            console.log("primaryEntity: "+JSON.stringify(primaryEntity));
            console.log("typeof intent.func: "+typeof intent.func);
            if (primaryEntity) {
                var entityType = intent[primaryEntity.entity];

                if (typeof entityType === 'function') {
                    entityType(primaryEntity.value);
                } else if (entityType) {
                    var entityValue = entityType[primaryEntity.value];
                    if (typeof entityValue === 'function') {
                        entityValue();
                    } else if (entityValue && typeof entityValue.func === 'function') {
                        entityValue.func();
                    } else if (typeof entityType.func === 'function') {
                        entityType.func();
                    }
                }
            } else if (typeof intent.func === 'function') {
                intent.func();
            }
            console.log("primaryEntity -- completed ");
        }
    }
}());