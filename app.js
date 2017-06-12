// // This loads the environment variables from the .env file
// require('dotenv-extended').load();
//
// var builder = require('botbuilder');
// var restify = require('restify');
//
// var apiairecognizer = require('api-ai-recognizer');
//
// var savedAddress;
//
//
// // Setup Restify Server
// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//     console.log('%s listening to %s', server.name, server.url);
// });
// // Create connector and listen for messages
// var connector = new builder.ChatConnector({
//    appId: "72308ad8-d853-4775-8019-d2fee6686eb2",
//    appPassword: "4DXyKmdrpejRao5fTZeH8NF"
// });
//
// server.post('/', connector.listen());
//
// var bot = new builder.UniversalBot(connector);
//
// var recognizer = new apiairecognizer('2ce0da1c25354c2bb16ef5cb0f61e43f');
//
// bot.recognizer(recognizer);
//
// var intents = new builder.IntentDialog({ recognizers: [recognizer] });
//
// bot.dialog('/', intents);
//
// console.log("INtent----"+JSON.stringify(intents));
//
// intents.matches('WebhookIntent', [
//     function (session, args, next) {
//        //savedAddress = session.message.address;
//
//         session.send('Exit Intent Called API.AI', session.message.text);
//     }
// ]),
//
//
// intents.matches('inquiryIntent', [
//     function (session, args, next) {
//        session.send('Inquiry Intent Called API.AI', session.message.text);
//     }
// ]);
//
//
//
// //
// // server.get('/', (req, res, next) => {
// //     sendProactiveMessage(savedAddress);
// //     res.send('triggered');
// //     next();
// //   }
// // );
// //
// //
// // function sendProactiveMessage(address) {
// //   var msg = new builder.Message().address(address);
// //   msg.text('Hello, this is a notification');
// //   msg.textLocale('en-US');
// //   bot.send(msg);
// // }


// var builder = require('botbuilder');
// var apiairecognizer = require('api-ai-recognizer');
// var connector = new builder.ConsoleConnector().listen();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');
//========================================================= // Bot Setup //=========================================================
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function ()
  {
      console.log('%s listening to %s', server.name, server.url);
  });

  // Create chat bot
  var connector = new builder.ChatConnector({ appId: "72308ad8-d853-4775-8019-d2fee6686eb2", appPassword: "4DXyKmdrpejRao5fTZeH8NF" });

var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('2ce0da1c25354c2bb16ef5cb0f61e43f');
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
bot.dialog('/',intents);
intents.matches('WebhookIntent',function(session)
  {
      session.send("Webhook Intent Success");
  });

intents.onDefault(function(session)
  {
      session.send("Sorry...can you please rephrase?");
  });



//
// var builder = require('botbuilder');
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);
// bot.dialog('/',function(session)
//     {
//         session.send("You said %s", session.message.text);
//     });
