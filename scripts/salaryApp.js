var appRoot = 'https://radiant-heat-977.firebaseio.com/';
var myDataRef = new Firebase(appRoot);


myDataRef.on("value", function(response) {
  var data = response.val();
  var chartData = formatChartData(data);
  drawChart(chartData);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


var formatChartData = function (data) {
  var chartItems = getChartItems(data);

  var dataWithUniqueName = uniquifyNames(chartItems);

  return [
    {
      key:'unnecessary data',
      values: dataWithUniqueName
    }
  ];
}

var getChartItems = function (data) {
  var chartItems =[];
  for (var i in data) {
    chartItems.push(data[i]);
  };

  return chartItems;
}

var drawChart = function drawChart (data) {
  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.name })   
        .y(function(d) { return parseFloat(d.salary) })
        .staggerLabels(true)
        ;

    d3.select('#chart svg')
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}



//save new item
$(document).ready(function(){

  logGitData(initialCountLisetner);

  $('#addRecord').click(addRecordHandler);

  var btnShowLast = document.getElementById("showLast");
  btnShowLast.addEventListener("click", function showLastHandler (e) {
    showLastItem();
  });


  document.getElementById("recordCount")
          .addEventListener("click", function recordCountHandler (e) {
            loadFirebaseData(showRecordCountListener);
          });


  //document.getElementById("recordCount").addEventListener("click", anotherRecordCountHandler);

 // $('#addRecord').click(secondHandler);


 window.setTimeout(function () {
   document.getElementById("recordCount").setAttribute('class', 'btn btn-success');
 }, 2000)

});
  

var showRecordCountListener = function (chartItems) {
  showRecordCount(chartItems[0].values);      
}  

var initialCountLisetner = function () {
  var itemsObj = JSON.parse(this.responseText);
  var chartItems = getChartItems(itemsObj); 
  $('#initial-count').text(chartItems.length); 
}


function addRecordHandler() {
    
    var name = $('#name').val();
    var salary = $('#salary').val();
    
    if(!name || !salary){
      showDataError(name, salary);
      return;
    }

    addRecord(name, salary);

  }

  function addRecord (name, salary) {
    var newItem = getRecord(name, salary);
    myDataRef.push(newItem);
  }

  function getRecord (name, salary) {
    
    var newItem = {
      name: name,
      salary: salary
    };

    return newItem;
  }

  var logGitData = function logGitData (reqListener) {
  
    var url = "http://khan4019.github.io/advJSDebug/scripts/salaryData.json";

    var oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener);
    oReq.open("get", url, true);
    oReq.send();
};

function secondHandler(e) {
  console.log('why are you clicking around????');
}

var showLastItem = function () {
  myDataRef.on("value", function(response) {
    var items = response.val();
    for(var lastKey in items);
    var lastItem = items[lastKey];
    var lastRecord = getRecord(lastItem.name, lastItem.salary);
    displayLastItemDialog(lastRecord);
  }, function (error) {
    console.error("Failed to get data: " + error.code);
  });
}

var loadFirebaseData = function (resHandler) {
  myDataRef.on("value", function(response) {
    var data = response.val();
    var chartData = formatChartData(data);
    resHandler(chartData);
  }, function (error) {
    console.error("Failed to get data: " + error.code);
  });
}


var displayLastItemDialog = function (lastItem) {
    var dlg = $("#dialog-last-item");
    dlg.removeClass('hide');
    $('#showName').text(lastItem.name);
    $('#showSalary').text(d3.format(",.0f")(lastItem.salary));
    dlg.dialog({
      buttons: {
          "Ok" : function () {
              $(this).dialog("close");
          }
      }
  });
}

var showDataError = function (name, salary) {
 var dlg = $("#dialog-error");
    
  dlg.removeClass('hide');

  toggleErroMessage('#newName', name, "Who the hell you are talking about!");
  toggleErroMessage('#newSalary', salary,"How much that guy make!");

  dlg.dialog({
    width:600,
    buttons: {
        "Ok" : function () {
            $(this).dialog("close");
        }
    }
  }); 
}

function toggleErroMessage(selector, value, msg){
  if(value){
    $(selector+'Line').hide();
  }
  else{
    $(selector+'Line').show();
    $(selector).text(msg);
  }
}

var showRecordCount = function (data) {
 var dlg = $("#dialog-record-count");
    
  dlg.removeClass('hide');

  $('#numberOfRecords').text(data.length);

  dlg.dialog({
    buttons: {
        "Ok" : function () {
            $(this).dialog("close");
        }
    }
  }); 
}

var anotherRecordCountHandler = function anotherRecordCountHandler (e) {
  console.log('you have extra click handler');
}

/*
  bad data breaks code. Broken code needs more code to fix.
  and more code means higher job security. So, smile :)



  how it works: 
  we keep track of names in the "uniqueNames" object. 
  
  If a name exists in the uniqueNames object, you got a duplicate. 

  For a duplicate, you will add a white space
  to distinguish it from the previous one

  i hate writing comment. 
  need a coffee break!
*/

var uniquifyNames = function(items){
  var uniqueNames = {};
  
  return items.map(function (item) {
    if(uniqueNames[item.name]){
      uniqueNames[item.name] += " ";
      item.name += uniqueNames[item.name];

    }
    else{
      uniqueNames[item.name] = "";
    }
    return item;
  });
}