
processInvalidUser = function(data){
  //generate validation token
  var userLinkToken = generateGuid();

  var trimmedMessage = data.text.trim();
  var command = data.text.match(RegExp(/\[[a-z A-Z]+\]/))[0].toLowerCase();


  //generate validate response message
  var validate = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
    attachments: [
        {
          pretext: "Your validation link:",
          title: "http://localhost:3000/slack/validate"+"#"+ data.user+":" + data.team.toString()+":"+userLinkToken,
          title_link: "http://localhost:3000/slack/validate"+"#"+ data.user+":" + data.team.toString()+":"+userLinkToken,
          fallback: "Tets",
          color: "#36a64f",
        }
    ]
  };

  switch(command){
    case '[validate]':
      
      SlackValidationTokens.update({slack_user: data.user},
      {
        slack_user: data.user,
        validation_token: userLinkToken
      },
      {upsert:true});

      bot.postMessage(data.user,"", validate);

      bot.postMessage(data.channel, "", validate);
      
      break;
      //END [VALIDATE]
    case '[test]':
      console.log("wtf")
      bot.postMessageToUser(user.profile.display_name,"","reply from test");
      
      break;
      //END [TEST]
    default:
      bot.postMessageToUser(user.profile.display_name,"If you received this message it's because you're not validated yet use [validate] to be able to talk with the bot",ok)
      break;
  }



}

proccessMessage = function (message, slackUser) {
	var re = RegExp(/\[[a-z A-Z]+\]/)
  var trimmedMessage = message.trim();
	var validateCommand = message.match(re)
  var userLinkToken = generateGuid()
	var ok = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
  }

  var help = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
    attachments: [
        {
            fallback: "Help",
            color: "#36a64f",
            pretext: "Help only display the available commands right now",
            title: "Commands:",
            text: "[help] \n [pChange]",
            footer: "TalkingBot",
        }
    ]
  }

  var notValidated = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
    attachments: [{
      callback_id: "validation",
      color: "#ff0000",
      pretext: "Hey! You're not validated yet!",
      actions: [{
          name: "validate",
          text: "Validate Now!",
          type: "button",
          value: "validate"
        },
        {
          name: "later",
          text: "Validate Later",
          style: "danger",
          type: "button",
          value: "notNow",
          confirm: {
            title: "Are you sure?",
            text: "If you say yes you will not be able to communicate with ...... Do you want to continiue ? \n To validate yourself later just use the command: [validate]",
            ok_text: "Yes",
            dismiss_text: "No",
          }
        }
      ]
    }]
  }
  var changeP = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
    text: "Choose what to do.",
    attachments: [{
      text: "Choose a option",
      fallback: "Couldn't complete the action",
      callback_id: "options",
      color: "#3AA3E3",
      attachment_type: "default",
      actions: [
        {
          name: "pChange",
          text: "Change Project",
          type: "button",
          value: "pChange"
        },
        {
          name: "break",
          text: "Go for a break",
          type: "button",
          value: "breakTime"
        },
        {
          name: "endDay",
          text: "End Day",
          style: "danger",
          type: "button",
          value: "endDay",
          confirm: {
            title: "Are you sure?",
            text: "After saying yes your hours from now on will not count has work hours. Do you want to continiue ?",
            ok_text: "Yes",
            dismiss_text: "No",
          }
        }
      ]
    }]
  }

  var testIt = {
    username: "Squirrel",
    icon_emoji: ":squirrel:",
    attachments: [
        {
          pretext: "Your validation link:",
          title: "http://localhost:3000/slack/validate"+"#"+ slackUser.user.toString()+":" + slackUser.user.toString()+":"+userLinkToken.toString(),
          title_link: "http://localhost:3000/slack/validate"+"#"+ slackUser.user.toString()+":"+userLinkToken.toString(),
          fallback: "Tets",
          color: "#36a64f",
        }
    ]
}
  // var vacation = {
  //   username: "Squirrel",
  //   icon_emoji: ":squirrel:",
  //   text: "Are you in vacation ?",
  //   attachments: [{
  //     fallback: "Couldn't complete the action",
  //     callback_id: "options",
  //     color: "#3AA3E3",
  //     attachment_type: "default",
  //           "actions": [
  //               {
  //                   "name": "yes ",
  //                   "text": "Yes",
  //                   "type": "button",
  //                   "value": "yes"
  //               },
  //               {
  //                   "name": "no",
  //                   "text": "No",
  //                   "type": "button",
  //                   "value": "working"
  //               }
  //           ]
  //       }
  //   ]
  // }
  // var wichProject = {
  //   username: "Squirrel",
  //   icon_emoji: ":squirrel:",
  //   text: "Wich project are you working on ?",
  //   attachments: [{
  //     fallback: "Couldn't complete the action",
  //     callback_id: "options",
  //     color: "#3AA3E3",
  //     attachment_type: "default",
  //     text: "Maybe list in this text the available projects that the user can select from ?????"
  //   }]
  // }
	var command = validateCommand[0].toLowerCase()
  var commandString = message.replace(validateCommand[0], "").trim().toLowerCase()

  switch(command){
    case '[help]':
      bot.postMessage("D7Q88S747","", help);
      break;
    case '[pchange]':
      bot.postMessageToUser(slackUser.user,"", changeP);
      break;
    default:
      bot.postMessageToUser(slackUser.user,"Didn't understand", ok)
      break;
    }
}