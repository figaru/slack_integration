
Template.slack.rendered = function(){
    Session.set("slack.channels", []);
};

Template.slack.helpers({
    'channels':function(){

        Meteor.call("slack.channels", function(err, channels){
            if(err){
                console.log(err);
            }else{
                Session.set("slack.channels", channels);
            }
        });

        return Session.get("slack.channels");
    },
    'integrated':function(){
        let hasSlack = Slack.findOne({user: Meteor.userId()});

        if(hasSlack){
            return true;
        }else{
            return false;
        }
    }   
});

Template.slack.events({
    'click #integrate':function(){
        Meteor.call("slack.integrate", function(err, data){
            if(err){

            }else{
                window.location = data;
            }
        });
    },
    'click #revoke':function(){
        Meteor.call("slack.revoke");
    }
});