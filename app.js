// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

var apiairecognizer = require('api-ai-recognizer');

var savedAddress;


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
   appId: "721fe4ed-d62f-4208-b894-9df8429ec24d",
   appPassword: "ReUeY2jOwL5gW9qU5UrouOs"
});

server.post('/', connector.listen());

var bot = new builder.UniversalBot(connector);

var recognizer = new apiairecognizer('32e46d92cc9d4008acaa15d36155e62f');

bot.recognizer(recognizer);

var intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', intents);

console.log("INtent----"+JSON.stringify(intents));

intents.matches('exitIntent', [
    function (session, args, next) {
       savedAddress = session.message.address;

        session.send('Exit Intent Called API.AI', session.message.text);
    }
]),


intents.matches('inquiryIntent', [
    function (session, args, next) {
       session.send('Inquiry Intent Called API.AI', session.message.text);
    }
]);


server.get('/', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
  }
);


function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}
