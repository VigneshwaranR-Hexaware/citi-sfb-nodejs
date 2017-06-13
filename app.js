// This loads the environment variables from the .env file
require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
//Dependencies

var savedAddress; //Variable to save the session address of user for Proactive messaging


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

//Configure the Bot Object
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('2ce0da1c25354c2bb16ef5cb0f61e43f');
bot.recognizer(recognizer);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

console.log("Getting Ready");
bot.dialog('/', intents); //Listening to messages as Query Parameters with POST call

console.log("Intent----"+JSON.stringify(intents));

intents.matches('WebhookIntent', [
    function (session, args, next) {
       //savedAddress = session.message.address;
       console.log("Webhook Intent Triggered");
       console.log("Args : "+JSON.stringify(args));
       session.send('Exit Intent Called API.AI', session.message.text);

    }//Response for Webhook Intent Returned
]),


intents.matches('inquiryIntent', [
    function (session, args, next) {
      console.log("Webhook Intent Triggered");
      console.log("Args : "+JSON.stringify(args));
      session.send('Inquiry Intent Called API.AI', session.message.text);

    }//Response for inquiry Intent Returned
]);




server.get('/', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
  }
);//GET call response sent on HTTP GET calls the Postback URL


function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}
