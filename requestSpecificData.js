module.exports={
  "RequestSpecificData" : function(body){

      var index;
      var metricFlag=0;
      var metricsLength=JSON.parse(body).result.definition.metrics.length;
      console.log("Metrics Length : "+metricsLength);

      for(var i=0;i<metricsLength;i++){

          var metricsParams = JSON.parse(body).result.definition.metrics[i].name.substring(JSON.parse(body).result.definition.metrics[i].name.indexOf(".")+1);
          //console.log(metricsParams);
          if(entityValueHere===metricsParams){
              index=i;
              metricFlag=1;
          }
          //array.push(metricsParams);
          //arrayString=arrayString+""+metricsParams+" ";


      }
      if(metricFlag==1){
          console.log("Found Metrics for "+JSON.parse(body).result.definition.metrics[index].name.substring(JSON.parse(body).result.definition.metrics[index].name.indexOf(".")+1));
          var metricsMin=JSON.parse(body).result.definition.metrics[index].min;
          global.metricsMin=metricsMin;
          var metricsMax=JSON.parse(body).result.definition.metrics[index].max;
          global.metricsMax=metricsMax;
          console.log("Min Metrics : "+metricsMin);
          console.log("Max Metrics : "+metricsMax);


          var indexSecond;
          var childrenSubOneFlag=0;
          console.log("Length of Root Data : "+JSON.parse(body).result.data.root.children.length);
          var timeRange=JSON.parse(body).result.data.root.children.length;
          console.log("Global Time Range Input : "+global.timeRangeInput);
          global.initialTimeRange=JSON.stringify(JSON.parse(body).result.data.root.children[0].element.name).slice(1,5);
          console.log("Initial Time Range as Recorded : "+global.initialTimeRange);
          global.lastTimeRange=JSON.stringify(JSON.parse(body).result.data.root.children[timeRange-1].element.name).slice(1,5);
          console.log("Final Time Range as Recorded : "+global.lastTimeRange);
          for(var j=0;j<timeRange;j++){
              //console.log(JSON.stringify(JSON.parse(body).result.data.root.children[j].element.name).slice(1,5));

              var timeRangeValue=JSON.stringify(JSON.parse(body).result.data.root.children[j].element.name).slice(1,5);

              if(timeRangeValue===global.timeRangeInput){
                  indexSecond=j;
                  childrenSubOneFlag=1;

              }
          }
          console.log("Found First Index : "+index);
          if(childrenSubOneFlag==1){
              var idRecieved=JSON.parse(body).result.data.root.children[indexSecond].element.id;



              //console.log(JSON.parse(body).result.data.root.children[index].children[0].element.name);

              var childrenRange = JSON.parse(body).result.data.root.children[indexSecond].children.length;
              console.log("Children Range length : "+childrenRange);

              var indexChild;
              var childrenSubTwoFlag=0;
              for(var k=0;k<childrenRange;k++){

                  var clientNameValue = JSON.parse(body).result.data.root.children[indexSecond].children[k].element.name;
                  if(clientNameValue==global.clientName){
                      indexChild=k;
                      childrenSubTwoFlag=1;

                  }

              }
              console.log("Found Second Index : "+indexSecond);
              if(childrenSubTwoFlag==1){
                  console.log("Found the Client Data");
                  //console.log(JSON.parse(body).result.data.root.children[index].children[indexChild].metrics);
                  //console.log("Data Set Length : "+JSON.parse(body).result.data.root.children[index].children[indexChild].metrics.length);
                  var dataSetKey = JSON.parse(body).result.definition.metrics[index].name;
                  if(JSON.parse(body).result.data.root.children[indexSecond].children[indexChild].metrics.hasOwnProperty(dataSetKey)){
                      console.log("Data Set Exists");
                      var rateableValue=JSON.parse(body).result.data.root.children[indexSecond].children[indexChild].metrics[dataSetKey].rv;
                      console.log("RV : "+rateableValue);
                      var futureValue=JSON.parse(body).result.data.root.children[indexSecond].children[indexChild].metrics[dataSetKey].fv;
                      console.log("FV : "+futureValue);
                      var marketIndex=JSON.parse(body).result.data.root.children[indexSecond].children[indexChild].metrics[dataSetKey].mi;
                      console.log("MI : "+marketIndex);

                      var responseString="I have found the data you wanted. The client "+global.clientName+"\'s "+global.entityValueHere+" had Rateable Value : "+rateableValue+" for the year "+global.timeRangeInput;
                      return responseString;
                  }

              }
              else if(childrenSubTwoFlag==0){
                  console.log("Client Data does not exist");
                  var responseString="This report doesnt have any data on "+global.clientName;
                  return responseString;
              }



          }
          else if(childrenSubOneFlag==0){
              console.log("Did Not Find Requsted Year Entry for "+global.timeRangeInput);
              var responseString="There is no recorded data for "+global.clientName+" for the Year of "+global.timeRangeInput+". The data in the report only contains values from "+global.initialTimeRange+" to "+global.lastTimeRange+".";
              return responseString;
          }
          //console.log(JSON.stringify(JSON.parse(body).result.data.root.children[0].element.name).slice(1,5));
          //var dateRequired=JSON.stringify(JSON.parse(body).result.data.root.children[0].element.name).slice(1,5);

      }
      else if(metricFlag==0){
          console.log("Metrics for "+entityValueHere+" do not exist");
          var responseString="There are no Metrics for "+entityValueHere+" in this report";
          return responseString;
      }
    }

};
