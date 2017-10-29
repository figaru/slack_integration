processUserMessages = function (data, bot) {

  var slackUser = SlackUsers.findOne({"slack_user": data.user});

  if (slackUser) {
    console.log("Valid")
    proccessMessage(data.text, slackUser);
  }else{
    console.log("Invalid")
    processInvalidUser(data);
  }
  return;
}

