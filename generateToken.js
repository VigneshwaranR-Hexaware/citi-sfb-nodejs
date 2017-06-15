module.exports={
  'MicrostrategyTokenGenerator': function(reportId){
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
      //return tokenObtained;
      });
  }
}
