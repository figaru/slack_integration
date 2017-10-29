Meteor.methods({
    'slack.integrate':function(code){
        return "https://slack.com/oauth/authorize?scope=incoming-webhook,bot,chat:write:bot,users.profile:read&client_id=" + Meteor.settings.slack.client_id;
    },
    'slack.channels':function(){
        var slack = Slack.findOne({user: this.userId});
        
        var channels = new Future();

        if(slack){
            //console.log("https://slack.com/api/auth.test?token="+ slack.access.access_token +"&pretty=1");
            HTTP.call("GET", "https://slack.com/api/channels.list?token=" + slack.access.access_token,
            {},
            function(err, result) {
                if(err){
                    console.log(err);
                    channels.throw(err);
                }else{
                    var data = result.data;

                    if(data.ok){
                        //console.log("[SLACK] SUCC: Slack integration validated for userid: " + slack.user);

                        channels.return(data.channels);
                    }else{
                        //Slack.remove({'_id': slack._id});
                        console.log("[SLACK] ERR: Failed to retrieve slack channels for userid: " + slack.user);
                        console.log(data.error);
                        channels.return([]);
                    }
                }           
            });
        }else{
            console.log("[SLACK] ERR: User has no slack integration to validate.");
        }

        return channels.wait();
    },
    'slack.validate':function(){
        //https://slack.com/api/auth.test?token=
        var slack = Slack.findOne({user: this.userId});
        
        //console.log(slack);

        if(slack){
            //console.log("https://slack.com/api/auth.test?token="+ slack.access.access_token +"&pretty=1");
            HTTP.call("GET", "https://slack.com/api/auth.test?token=" + slack.access.access_token,
            {},
            function(err, result) {
                if(err){
                    console.log(err);
                }else{
                    var data = result.data;

                    if(data.ok){
                        console.log("[SLACK] SUCC: Slack integration validated for userid: " + slack.user);
                    }else{
                        //Slack.remove({'_id': slack._id});
                        console.log("[SLACK] ERR: Failed to validate integration slack for userid: " + slack.user);
                        console.log(data.error);
                    }
                }           
            });
        }else{
            console.log("[SLACK] ERR: User has no slack integration to validate.");
        }
    },  
    'slack.revoke':function(){
        //https://slack.com/api/auth.revoke?token=xoxp-2323827393-16111519414-20367011469-5f89a31i07
        var slack = Slack.findOne({user: this.userId});
        
        if(slack){
            HTTP.call("POST", "https://slack.com/api/auth.revoke?token="+ slack.access.access_token, 
            {},
            function(err, result) {
                if(err){
                    console.log(err);
                }else{
                    var data = result.data;

                    if(data.ok){
                        Slack.remove({'_id': slack._id});
                        console.log("[SLACK] SUCC: Slack integration revoked for userid: " + slack.user);
                    }else{
                        console.log("[SLACK] ERR: Failed to revoke integration slack for userid: " + slack.user);
                        console.log(data.error);
                    }
                    
                    
                }           
            });
        }else{
            console.log("[SLACK] ERR: User has no slack integration to revoke.");
        }

    },
    'slack.oauth':function(code){
        this.unblock();

        var user = this.userId;

        if(user){
            HTTP.call("GET", "https://slack.com/api/oauth.access?client_id="+Meteor.settings.slack.client_id+"&client_secret="+Meteor.settings.slack.client_secret+"&code="+code, 
            {},
            function(err, result) {
                if(err){
                    console.log(err);
                }else{
                    var data = result.data;

                    if(data.ok){
                        console.log("[SLACK] SUCC: Integrated slack for userid: " + user);

                        HTTP.call("POST", "https://slack.com/api/users.profile.get?token="+data.access_token+"&user="+data.user_id+"&pretty=1", 
                        {},
                        function(err, result) {
                            if(err){
                                console.log(err);
                            }else{
                                var profile = result.data.profile;
                                Slack.update({'user': user}, 
                                {
                                    user: user,
                                    access: data,
                                    profile: profile
                                }, 
                                {upsert: true});

                                SlackIntegrations.update({'user': user}, 
                                {
                                    user: user,
                                    access: data,
                                    profile: profile
                                }, 
                                {upsert: true});
                                
                               //bot.postMessageToUser(profile.display_name, "thank you for integrating with opz.io slack");                           
                            }           
                        });
                    }
                }
            });
        }else{
            console.log("[SLACK] ERR: Could not associate integration with any user.");
        } 
    },
    'slack.validate':function(slack_user, team, validation_token){
        this.unblock();

        console.log(this.userId);

        //Meteor.users.findOne({_id: this.userId, "externalServices.userId":slackId})
        var tokenExists = SlackValidationTokens.findOne({
            slack_user: slack_user,
            validation_token: validation_token,
        });

        if (typeof(tokenExists) !== "undefined") {

            SlackUsers.update({user: this.userId},
            {
                slack_user: slack_user,
                user: this.userId
            },
            {upsert:true});

            SlackValidationTokens.remove({_id: tokenExists._id});

            bot.postMessage(slack_user, "Thank your for validating! you can now interact with opziobot", {
                username: "Squirrel",
                icon_emoji: ":squirrel:",
            });
        }else{
            console.log("Didn't find any token")
        }
    },
    'slack.channel.post':function(channel, message){
        bot.postMessageToGroup(channel, message, function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log(data);
            }
        }); 
    },
    'slack.profile.get':function(team){
        var profile = new Future();

        var slack = SlackIntegrations.findOne({team: team});

        HTTP.call("POST", "https://slack.com/api/users.profile.get?token="+data.access_token+"&user="+data.user_id+"&pretty=1", 
        {},
        function(err, result) {
            if(err){
                console.log(err);
            }else{
                profile.return(result.data.profile);
            }           
        });

        return profile.wait();
    }
});
