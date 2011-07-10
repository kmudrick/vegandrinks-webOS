function StageAssistant() { 
  VeganDrinks = { };
}

StageAssistant.prototype.setup = function() {
  var start = (new Date()).getTime();
  var request = new Ajax.Request("misc/beer.json", {
    method: 'get',
    evalJSON: 'true',
    onComplete: this.parsedData.bind(this, start)
  });
}

StageAssistant.prototype.parsedData = function(start, transport) {
  var json = transport.responseText.evalJSON(true);
  var end = (new Date()).getTime();
  var elapsed = end - start;
  Mojo.Log.info("Loaded data in %s ms", elapsed);
  VeganDrinks.Beer = json;
  Mojo.Controller.stageController.swapScene("list", "Beer", VeganDrinks.Beer);
}