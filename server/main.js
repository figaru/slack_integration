import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Future = Npm.require('fibers/future');
    Fiber  = Npm.require('fibers');

    var SlackBot = require('slackbots');
  
    // create a bot
    bot = new SlackBot({
        token: Meteor.settings.slack.bot, // Add a bot https://my.slack.com/services/new/bot and put the token 
        name: 'opziobot'
    });
  

    bot.on('start', Meteor.bindEnvironment(function() {
        // more information about additional params https://api.slack.com/methods/chat.postMessage
        var params = {
            icon_emoji: ':cat:'
        };
    }));

    bot.on('message', Meteor.bindEnvironment(function(data) {  
        if (data.text != undefined && data.type != 'hello' && data.type != 'user_typing' && data.subtype == null) {
            console.log(data);
            processUserMessages(data,bot);
        }
        //bot.postMessageToUser('daniel.abrantes95', "hey");
    })); 
});


