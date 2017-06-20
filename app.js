// This loads the environment variables from the .env file
require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require("request");

var specifics = require('./src/requestSpecificData');
//Dependencies
var reportId='EA8836BF451BF05F9B9A08A9D2EB44C2';
global.reportId=reportId;
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
   appPassword: "bS5r46iC0kzmmnP4cm51BTv"
});



server.post('/', connector.listen());
//POST Call Handler


var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('2ce0da1c25354c2bb16ef5cb0f61e43f');
bot.recognizer(recognizer);
//Create Bot Object


var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);


    intents.matches('AttributesIntent', [

                function (session, args) {
                    console.log("Attributes Intent Called");
                    console.log("Args : "+JSON.stringify(args));

                    global.savedAddress = session.message.address;



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
                      generateReportData(tokenObtained, function(responseString){
                          console.log(responseString);
                          //console.log("savedAddress : "+savedAddress);
                          session.send(responseString);
                          session.endDialog();

                      });
                      //Get Report

                    });

                    function generateReportData(authTokenRecieved, callback){

                        console.log("Inside Passing Function : "+authTokenRecieved);

                        console.log("Auth Token : "+authTokenRecieved);
                        var options = { method: 'POST',
                          url: 'http://52.3.221.183:1234/json-data-api/reports/'+global.reportId+'/instances',
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


                           var columnContainer=[];
                           var columnString="";

                            var metricsLength=JSON.parse(body).result.definition.metrics.length;//Put JSON parse
                            console.log("Metrics Length : "+metricsLength);


                          for(var i=0;i<metricsLength;i++){
                              var metricsParams = JSON.parse(body).result.definition.metrics[i].name.substring(JSON.parse(body).result.definition.metrics[i].name.indexOf(".")+1);
                              metricsParams=metricsParams.charAt(0).toUpperCase() + metricsParams.slice(1);

                              columnContainer.push(metricsParams);
                              columnString=columnString+""+metricsParams+"\n";


                          }
                          console.log(columnString);

                          var responseString="This is a "+reportNameDetail+" for the respective "+arrayString+" from Citi for its clients.";
                          console.log(responseString);
                          console.log("SESSION");

                          callback(responseString);

                        });
                    }
                  }
              ]);//Webhook Intent Fired

      intents.matches('DefaultWelcomeIntent', [
                    function (session, args) {
                      //global.verifyFlag=0;
                       //session.send('Inquiry Intent Called API.AI', session.message.text);
                       console.log("Welcome Intent Fired");
                       console.log("Args : "+JSON.stringify(args));
                        //console.log("New Conversation Intent Called 1.0");
                        var responseString="Hi there. I am Citi Assistant. How can I help you?"
                        session.send(responseString);
                        //global.savedAddress = session.message.address;
                        //startNewConversation(savedAddress);
                  }
                ]);//Welcome Intent Fired

      intents.matches('CapabilitiesIntent', [
                    function (session, args) {
                       //session.send('Inquiry Intent Called API.AI', session.message.text);
                       console.log("Capabilities Intent Fired");
                       console.log("Args : "+JSON.stringify(args));
                        //console.log("New Conversation Intent Called 1.0");
                        var responseString="I can give you information of a report from Microstrategy data. You can just ask me for any specific type of data and I'll get it for you."
                        session.send(responseString);
                        //global.savedAddress = session.message.address;
                        //startNewConversation(savedAddress);
                  }
                ]);//Capabilities Intent Fired

      intents.matches('ReportSpecificDataInquiryIntent', [
                    function (session, args) {
                      console.log("Report Specific Data Intent Called");
                      console.log("Args : "+JSON.stringify(args));
                      var prompt = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
                      prompt=prompt.entity;
                      console.log("Prompt : "+prompt);
                      //Save fulfillment messages

                      if(prompt==='Specific Response Fulfilled'){

                          var entityObtained = builder.EntityRecognizer.findEntity(args.entities, 'dataSpecificEntity');
                          global.entityObtained=entityObtained;
                          var clientNameObtained = builder.EntityRecognizer.findEntity(args.entities, 'clientNamesEntity');
                          global.clientNameObtained=clientNameObtained;
                          var timeRangeObtained = builder.EntityRecognizer.findEntity(args.entities, 'date-period');
                          global.timeRangeObtained=timeRangeObtained;
                          //All recieved
                      }
                      // else
                      // {
                      //     var entityObtained = builder.EntityRecognizer.findEntity(args.entities, 'dataSpecificEntity');
                      //     var clientNameObtained = builder.EntityRecognizer.findEntity(args.entities, 'clientNamesEntity');
                      //     var timeRangeObtained = builder.EntityRecognizer.findEntity(args.entities, 'date-period');
                      //     if(entityObtained!=undefined&&clientNameObtained==undefined&&timeRangeObtained==undefined){
                      //       global.entityObtained = entityObtained;
                      //       console.log("entityObtained Saved : "+JSON.stringify(global.entityObtained));
                      //       session.send(prompt);
                      //     //  session.send(prompt);
                      //     }
                      //     else if(clientNameObtained!=undefined&&entityObtained!=undefined&&timeRangeObtained==undefined){
                      //       global.clientNameObtained = clientNameObtained;
                      //       global.entityObtained = entityObtained;
                      //       console.log("clientNameObtained Saved : "+JSON.stringify(global.clientNameObtained));
                      //       console.log("entityObtained Saved : "+JSON.stringify(global.entityObtained));
                      //       session.send(prompt);
                      //     //  session.send(prompt);
                      //     }
                      //     else if(timeRangeObtained&&entityObtained&&clientNameObtained){
                      //       global.timeRangeObtained = timeRangeObtained;
                      //       global.entityObtained = entityObtained;
                      //       global.clientNameObtained = clientNameObtained;
                      //       console.log("timeRangeObtained Saved : "+JSON.stringify(global.timeRangeObtained));
                      //       console.log("entityObtained Saved : "+JSON.stringify(global.timeRangeObtained));
                      //       console.log("clientNameObtained Saved : "+JSON.stringify(global.timeRangeObtained));
                      //       //session.send(prompt);
                      //     //  session.send(prompt);
                      //     }

                          //Send prompt
                      
                      // var timeRangePrompt = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
                      // console.log("Time Range : Prompt "+JSON.stringify(timeRangePrompt));
                      // var projectNameObtained = builder.EntityRecognizer.findEntity(args.entities, 'projectNameEntity');

                      console.log("entityObtained : "+JSON.stringify(entityObtained)+" , clientNameObtained : "+JSON.stringify(clientNameObtained)+" , timeRangeObtained : "+JSON.stringify(timeRangeObtained));

                      if(entityObtained&&clientNameObtained&&timeRangeObtained){

                        console.log("All Entities Recieved as Input from User");
                        console.log("Data Specific Entity Lot : "+JSON.stringify(entityObtained));
                        var entityValue=entityObtained.entity;
                        global.entityValueHere=entityValue;
                        console.log("Data Specific Entity Value : "+entityValue);
                          //Entity Value Obtained


                        var clientName=clientNameObtained.entity;
                        console.log("Client Name Obtained : "+clientName);
                        global.clientName=clientName;
                        //Client Name Obtained


                        var timeRangeInput=timeRangeObtained.entity;
                        console.log("Custom Time Range : "+timeRangeInput.slice(0,4));
                        global.timeRangeInput=timeRangeInput.slice(0,4);

                        // var entityValueHere='cash and cash equivalents';
                        // global.entityValueHere=entityValueHere;


                        var reportId='EA8836BF451BF05F9B9A08A9D2EB44C2';
                        global.reportId=reportId;



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

                        request(options, entityValue, function (error, response, body) {
                          if (error) throw new Error(error);


                          var tokenObtained=JSON.parse(body).authToken;
                          console.log("Token : "+tokenObtained);
                          console.log("Report ID : "+reportId);
                          //Get Auth Token
                          generateReportSpecificData(tokenObtained, entityValue, function(responseString){
                              console.log(responseString);
                              //console.log("savedAddress : "+savedAddress);
                              session.send(responseString);
                              session.endDialog();

                           });
                          //Get Report

                         });
                        }

                        function generateReportSpecificData(authTokenRecieved, entityValueHere, callback){

                          //  console.log("Inside Passing Function : "+authTokenRecieved);
                            console.log("Entity Value Inside Passing Function : "+entityValueHere);
                            console.log("Auth Token : "+authTokenRecieved);
                            var options = { method: 'POST',
                            url: 'http://52.3.221.183:1234/json-data-api/reports/'+reportId+'/instances',
                            qs: { offset: '0', limit: '1000' },
                            headers:
                            { 'postman-token': 'bcb857d0-8c81-47e4-47fc-97f53abc5816',
                               'cache-control': 'no-cache',
                               'x-mstr-authtoken': authTokenRecieved,
                               accept: 'application/vnd.mstr.dataapi.v0+json',
                               'content-type': 'application/vnd.mstr.dataapi.v0+json' } };

                          request(options, entityValueHere, function (error, response, body) {
                            if (error) throw new Error(error);

                            //var array=[];
                            //var arrayString="";
                            //console.log(JSON.parse(body));
                            var responseString=specifics.RequestSpecificData(body);




                              callback(responseString);

                            });
                        }
                      }
                  ]);

               intents.onDefault(function(session){
                   session.send("Sorry...can you please rephrase?");
               });

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
