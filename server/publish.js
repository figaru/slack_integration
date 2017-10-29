Meteor.publish('slack', function(){
	return Slack.find({});
});
