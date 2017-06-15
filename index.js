var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "72308ad8-d853-4775-8019-d2fee6686eb2",
    appPassword: "4DXyKmdrpejRao5fTZeH8NF"
});

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

var recognizer = new apiairecognizer("2ce0da1c25354c2bb16ef5cb0f61e43f");
var intents = new builder.IntentDialog({
         recognizers: [recognizer]
});

bot.dialog('/',intents);

intents.matches('ReportSpecificDataInquiryIntent',[
    function(session,args){
        var entityObtained = builder.EntityRecognizer.findEntity(args.entities, 'dataSpecificEntity');
        var projectNameObtained = builder.EntityRecognizer.findEntity(args.entities, 'projectNameEntity');
        if (entityObtained&&projectNameObtained){
            //var city_name = city.entity;

                session.send("Here is your complete report data on "+entityObtained+" for "+projectNameObtained);

        }else{
            builder.Prompts.text(session, 'Which is the project?');
        }
    },
    function(session,results){
        var entityObtained = results.response;
                console.log(session.message);
                console.log(results);
                session.send("You have requested data for " + entityObtained);

    }
]);

// intents.matches('smalltalk.greetings',function(session, args){
//     var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
//     if (fulfillment){
//         var speech = fulfillment.entity;
//         session.send(speech);
//     }else{
//         session.send('Sorry...not sure how to respond to that');
//     }
// });

intents.onDefault(function(session){
    session.send("Sorry...can you please rephrase?");
});
