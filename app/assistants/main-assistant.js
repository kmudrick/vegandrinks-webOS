function MainAssistant(data) {
  
  this.data = data;
 
  this.listAttributes = {
    itemTemplate: "main/entryTemplate",
    swipeToDelete: false,
    reorderable: false
  };
  
  this.listModel = {
    listTitle: "List Title",
    items: [
      { id : "beer", name : "Beer" },
      { id : "wine", name : "Wine" },
      { id : "liquor", name : "Liquor" }
    ]
  };
  
}

MainAssistant.prototype.setup = function() {
  this.controller.setupWidget("categoriesList", this.listAttributes, this.listModel);
  
  this.listTapHandler = this.onListTap.bindAsEventListener(this);
  this.controller.listen("categoriesList", Mojo.Event.listTap, this.listTapHandler);
};

MainAssistant.prototype.onListTap = function(event) {
  if (event.item.id) {
    this.controller.stageController.pushScene("list", event.item.name, this.data[event.item.id]);
  }
}

MainAssistant.prototype.activate = function(event) { };

MainAssistant.prototype.deactivate = function(event) { };

MainAssistant.prototype.cleanup = function(event) {
  this.controller.stopListening("categoriesList", Mojo.Event.listTap, this.listTapHandler);
};
