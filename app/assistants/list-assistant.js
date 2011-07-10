function ListAssistant(title, list) {
  this.title = title;
  this.list = list;
}

ListAssistant.prototype.setup = function() {
  this.controller.get("title").update($L(this.title));
  this.resultsList = this.controller.get("resultsList");
  this.controller.setupWidget("resultsList",
      this.attributes = {
        itemTemplate: 'list/entry',
        emptyTemplate: 'list/empty',
        swipeToDelete: false,
        reorderable: false,
        filterFunction: this.searchList.bind(this),
        delay: 350,
        formatters: {
          "updated_on" : function(unused, model) {
            // 2011-05-13T18:50:00-04:00
            if (!model.updated_on) {
              return "N/A";
            }
            var pieces = /(\d{4})-(\d{2})-(\d{2})(.*)/.exec(model.updated_on);
            // Note: month is 0-11
            var d = new Date(pieces[1],pieces[2]-1,pieces[3]);
            if (d) {
              return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
            }
            return "N/A";
          },
          "notes" : function(unused, model) {
            if (!model.notes) {
              return "N/A";
            }
            return model.notes.gsub("\r\n", "<br/>");
          },
          "status": function(unused, model) {
            if (!model.status) {
              Mojo.Log.error("%s has no status", model.company_name);
              return "N/A";
            }
            if (model.status.toLowerCase() == "vegan friendly") {
              return "Vegan";
            }
            // Some Vegan Friendly Options
            if (model.status.toLowerCase() == "has some vegan options"
                || model.status.toLowerCase() == "some vegan friendly options") {
              return "Some Vegan";
            }
            if (model.status.toLowerCase() == "not vegan friendly") {
              return "Not Vegan";
            }
            Mojo.Log.info("Company %s has status %s", model.company_name, model.status);
            return "N/A";
          },
          "color": function(unused, model) {
            if (!model.red_yellow_green) {
              Mojo.Log.error("%s has no color", model.company_name);
              return "black";
            }
            if (model.red_yellow_green.toLowerCase() == "red") {
              return "red";
            }
            if (model.red_yellow_green.toLowerCase() == "green") {
              return "green";
            }
            if (model.red_yellow_green.toLowerCase() == "yellow") {
              return "#FF9900";
            }
          },
          "location" : function(unused, model) {
            var locationPieces = [ ];
            if (model.city) {
              locationPieces.push(model.city);
            }
            if (model.state) {
              locationPieces.push(model.state);
            }
            if (locationPieces.length < 2) {
              locationPieces.push(model.country);
            }
            return locationPieces.join(", ");
          }
        }
      }
  );
  
  this.listTapHandler = this.onListTap.bindAsEventListener(this);
  this.controller.listen("resultsList", Mojo.Event.listTap, this.listTapHandler);
};

ListAssistant.prototype.onListTap = function(event) {
  var company = event.item;
  var detailsElement = $("details" + company.id);
  detailsElement.toggleClassName("none");
  detailsElement.toggleClassName("details");
};


ListAssistant.prototype.searchList = function(filterString, listWidget, offset, count) {
  try {
    var subset = [];
    var totalSubsetSize = 0;
    var i = 0;
    var filter = filterString.toLowerCase();
    while (i < this.list.length) {
      var company = this.list[i].company;
      if (company.company_name.toLowerCase().include(filter)
          || (company.notes && company.notes.toLowerCase().include(filter))) {
        if (subset.length < count && totalSubsetSize >= offset) {
          subset.push(company);
        }
        totalSubsetSize++;
      }
      i++;
    }
    listWidget.mojo.noticeUpdatedItems(offset, subset);
    listWidget.mojo.setLength(totalSubsetSize);
    listWidget.mojo.setCount(totalSubsetSize);
    this.filter = filterString;
  }
  catch (e) {
    Mojo.Log.error("Could not handle", e);
  }
};

ListAssistant.prototype.parseDate = function(dateString) {
  var pieces = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(dateString);
  // Note: month is 0-11
  return new Date(pieces[1],pieces[2]-1,pieces[3],pieces[4],pieces[5],pieces[6]);
};

ListAssistant.prototype.showSearch = function() {
  try {
    this.controller.get("resultsList").mojo.open();
  } 
  catch (e) {
    Mojo.Log.error(e); 
  }
};

ListAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ListAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ListAssistant.prototype.cleanup = function(event) {
  this.controller.stopListening("resultsList", Mojo.Event.listTap, this.listTapHandler);
};
