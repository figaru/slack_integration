Router.route('/',{
    name: 'userDashboard',
	waitOn: function(){
		var subscriptions = [
			Meteor.subscribe('slack')
        ];
        
        //Meteor.call("slack.validate");

		return subscriptions;
	},
	action: function () {
        this.render("slack");
    }
});


Router.route("slack/auth", function() {
    if(this.params.query.code){
        Meteor.call("slack.oauth", this.params.query.code);
    }
    this.redirect("/");
});

Router.route('/slack/validate', function () {
    var toSplit = this.params.hash
    var res = toSplit.split(":");
    var slack_user = res[0];
    var slack_team = res[1];
    var validation_token = res[2];

    Meteor.call('slack.validate', slack_user, slack_team, validation_token);
    
    this.redirect("/");    
});