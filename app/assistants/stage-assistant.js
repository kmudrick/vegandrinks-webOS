function StageAssistant() {
  
  // data object, will be keyed by category
  this.data = { 
    beer   : { },
    wine   : { },
    liquor : { }
  };
  
  this.parseCount = 0;
}

StageAssistant.prototype.setup = function() {
  for (var category in this.data) {
    var start = (new Date()).getTime();
    var dataLocation = "data/" + category + ".json";
    Mojo.Log.info("Loading %s data", category);
    var request = new Ajax.Request(dataLocation, {
      method: 'get',
      evalJSON: 'true',
      onComplete: this.parsedData.bind(this, start, category)
    });
  }
}

StageAssistant.prototype.parsedData = function(start, category, transport) {
  var json = transport.responseText.evalJSON(true);
  var end = (new Date()).getTime();
  var elapsed = end - start;
  Mojo.Log.info("Loaded %s data in %s ms", category, elapsed);
  this.data[category] = json;
  if (++this.parseCount == 3) {
    this.onComplete();
  }
}

StageAssistant.prototype.onComplete = function() {
  Mojo.Controller.stageController.swapScene("main", this.data);
}