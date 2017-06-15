// This loads the environment variables from the .env file
require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require("request");
//Dependencies

var savedAddress;
var conversationIndex=0; //Conversation Counter
//Global Session Holder variables

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create connector and listen for messages
var connector = new builder.ChatConnector({
   appId: "72308ad8-d853-4775-8019-d2fee6686eb2",
   appPassword: "4DXyKmdrpejRao5fTZeH8NF"
});



server.post('/', connector.listen());
//POST Call Handler


var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('2ce0da1c25354c2bb16ef5cb0f61e43f');
bot.recognizer(recognizer);
//Create Bot Object


var intents = new builder.IntentDialog({ recognizers: [recognizer] })

                .matches('AttributesIntent', [

                function (session, args, next) {
                    console.log("Webhook Intent Called");
                    console.log("Args : "+JSON.stringify(args));

                    global.savedAddress = session.message.address;

                    var reportId='EA8836BF451BF05F9B9A08A9D2EB44C2';

                    var options = { method: 'POST',
                      url: 'http://52.3.221.183:1234/json-data-api/sessions',
                      headers:
                      { 'postman-token': 'ffbe2e8a-6732-e2dc-357a-4e7b77afa663',
                         'cache-control': 'no-cache',
                         accept: 'application/vnd.mstr.dataapi.v0+json',
                         'content-type': 'application/json',
                         'x-authmode': '1',
                         'x-username': 'administrator',
                         'x-projectname': 'Hello World',
                         'x-port': '34952',
                         'x-iservername': 'localhost' } };
                         console.log("Triggering POST call for Session Generation");

                    request(options, reportId, function (error, response, body) {
                      if (error) throw new Error(error);


                      var tokenObtained=JSON.parse(body).authToken;
                      console.log("Token : "+tokenObtained);
                      console.log("Report ID : "+reportId);
                      //Get Auth Token
                      generateReportData(tokenObtained,reportId, function(responseString){
                          console.log(responseString);
                          //console.log("savedAddress : "+savedAddress);
                          session.send(responseString);
                          session.endDialog();

                      });
                      //Get Report

                    });

                    function generateReportData(authTokenRecieved,reportIdentifier, callback){

                        console.log("Inside Passing Function : "+authTokenRecieved);

                        console.log("Auth Token : "+authTokenRecieved);
                        var options = { method: 'POST',
                          url: 'http://52.3.221.183:1234/json-data-api/reports/'+reportIdentifier+'/instances',
                          qs: { offset: '0', limit: '1000' },
                          headers:
                          { 'postman-token': 'bcb857d0-8c81-47e4-47fc-97f53abc5816',
                             'cache-control': 'no-cache',
                             'x-mstr-authtoken': authTokenRecieved,
                             accept: 'application/vnd.mstr.dataapi.v0+json',
                             'content-type': 'application/vnd.mstr.dataapi.v0+json' } };

                        request(options, function (error, response, body) {
                          if (error) throw new Error(error);

                          var array=[];
                          var arrayString="";
                          console.log("Complete : "+JSON.stringify(JSON.parse(body).result.definition.attributes));
                          var attributeLength=JSON.parse(body).result.definition.attributes.length;
                          console.log("Attributes Length : "+attributeLength);

                          for(var i=0;i<attributeLength;i++){
                              var attributeParams = JSON.parse(body).result.definition.attributes[i].name.substring(JSON.parse(body).result.definition.attributes[i].name.indexOf(".")+1);
                              array.push(attributeParams);
                              arrayString=arrayString+""+attributeParams+" ";

                          }
                          console.log(arrayString);
                          arrayString = arrayString.substring(0, arrayString.length-1);
                          arrayString=arrayString.replace(/\s+/g, ", ");
                          arrayString=arrayString.replace(/,(?=[^,]*$)/, ' and');
                          console.log(arrayString);
                          var reportNameDetail = JSON.parse(body).result.definition.attributes[0].name.substring(0,JSON.parse(body).result.definition.attributes[0].name.indexOf("."));
                          console.log(reportNameDetail);

                          var responseString="This is a "+reportNameDetail+" for the respective "+arrayString+" attributes";
                          console.log(responseString);
                          console.log("SESSION");

                          callback(responseString);

                        });
                    }
                  }
              ])//Webhook Intent Fired

                .matches('DefaultWelcomeIntent', [
                    function (session, args, next) {
                      global.verifyFlag=0;
                       //session.send('Inquiry Intent Called API.AI', session.message.text);
                       console.log("Welcome Intent Fired");
                       console.log("Args : "+JSON.stringify(args));
                        //console.log("New Conversation Intent Called 1.0");
                        var responseString="Hi there. I am Citi Assistant. How can I help you?"
                        session.send(responseString);
                        //global.savedAddress = session.message.address;
                        //startNewConversation(savedAddress);
                  }
                ])//Welcome Intent Fired

                .matches('CapabilitiesIntent', [
                    function (session, args, next) {
                       //session.send('Inquiry Intent Called API.AI', session.message.text);
                       console.log("Capabilities Intent Fired");
                       console.log("Args : "+JSON.stringify(args));
                        //console.log("New Conversation Intent Called 1.0");
                        var responseString="I can give you information of a report from Microstrategy data. You can just ask me for any specific type of data and I'll get it for you."
                        session.send(responseString);
                        //global.savedAddress = session.message.address;
                        //startNewConversation(savedAddress);
                  }
                ])//Capabilities Intent Fired

                .matches('ReportSpecificDataInquiryIntent', [
                    function (session, args, next) {
                      console.log("Report Specific Data Intent Called");
                      console.log("Args : "+JSON.stringify(args));

                      var entityObtained = builder.EntityRecognizer.findEntity(args.entities, 'dataSpecificEntity');
                      var projectNameObtained = builder.EntityRecognizer.findEntity(args.entities, 'projectNameEntity');

                      if(entityObtained&&projectNameObtained){

                        console.log("Data Specific Entity Lot : "+JSON.stringify(entityObtained));
                        var entityValue=entityObtained.entity;
                        global.entityValue=entityValue;
                        console.log("Data Specific Entity Value : "+entityValue);

                        console.log("Project Name Entity Lot : "+JSON.stringify(projectNameObtained));
                        var projectValue=projectNameObtained.entity;
                        global.projectValue=projectValue;
                        console.log("Project Name Entity Value : "+projectValue);

                        var responseString="Here is your report data.";
                        session.send(responseString);
                        //SENDING DIRECT RESPONSE FOR ALL VALUES INCLUDED INTENT STYLE
                      }//If User says project name along with inquiry request

                      else{
                          console.log("Project Name not Known. Asking User to Provide");
                          builder.Prompts.text(session, 'Please tell me the Project name');
                      }//If user has not mentioned the Project name along with inquiry request
                      //SENDING PROMPT
                 },
                 function(session,next)
                  {
                      console.log("Fulfilled Specific Request Response");
                      console.log(JSON.stringify(session));
                      console.log(JSON.stringify(next));
                      session.send("Here is your report ");

                  } //SENDING FULFILLED RESPONSE
               ])//Specific Data Inquiry Intent Fired


                .onDefault((session) => {
                        console.log("I'm sorry, I didn't understand that.");
                        session.send("FallbackIntent").endDialog();
                  //Default Fallback Intent Fired
});

bot.dialog('/', intents);

// //console.log("INtent----"+JSON.stringify(intents));
// bot.dialog('/profile', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);
//
// bot.dialog('/helloword', [
//
//     function (session, results) {
//         session.send('Hello User');
//         conversationIndex=1;
//
//     }
// ]);

server.get('/', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('Proactive Notification triggered');
    next();
  }//Proavtive Notifications
  //GET Call Response Header Definitions
);


function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification from an external Call');
  msg.textLocale('en-US');
  bot.send(msg);
}//GET Call Notification Function


function startNewConversation(add){

    console.log("LastConversationID" + add.conversation.id);
    var address = { id: '7',
  channelId: 'skypeforbusiness',
  user:
   { id: 'sip:ashishdubey@rnddevlab.onmicrosoft.com',
     name: 'ashish Dubey' },
  conversation:
   { isGroup: true,
     id: add.conversation.id },
  bot:
   { id: 'sip:micro@rnddevlab.onmicrosoft.com',
     name: 'sip:micro@rnddevlab.onmicrosoft.com' },
  serviceUrl: 'https://webpoolsg20r04.infra.lync.com/platformservice/tgt-c98ad92f33ed54008a30cbb5bd5314f9/botframework' };

        console.log('Starting new conversation for address:', address);
        var newConversationAddress = Object.assign({}, address);
     //   delete newConversationAddress.conversation;
        bot.beginDialog(newConversationAddress, 'survey', null, function (err) {
                if (err) {
                    // error ocurred while starting new conversation. Channel not supported?
                    bot.send(new builder.Message()
                        .text('This channel does not support this operation: ' + err.message)
                        .address(address));
                }
            });



}


// bot.dialog('survey', [
//     function (session) {
//         builder.Prompts.text(session, 'Hello... What\'s your name?');
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         builder.Prompts.number(session, 'Hi ' + results.response + ', How many years have you been coding?');
//     },
//     function (session, results) {
//         session.userData.coding = results.response;
//         builder.Prompts.choice(session, 'What language do you code Node using? ', ['JavaScript', 'CoffeeScript', 'TypeScript']);
//     },
//     function (session, results) {
//         session.userData.language = results.response.entity;
//         session.endDialog('Got it... ' + session.userData.name +
//             ' you\'ve been programming for ' + session.userData.coding +
//             ' years and use ' + session.userData.language + '.');
//     }
// ]);
