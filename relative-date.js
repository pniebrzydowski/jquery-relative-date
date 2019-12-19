(function($, window, document, undefined) {
  var pluginName = "relativeDate";

  parseValue = function(textValue) {
    if (!textValue) {
      return { unit: "", number: "" };
    }
    var values = textValue.split("-")[1];
    var unit = values.slice(values.length - 1);
    var number = values.slice(0, values.length - 1);
    return {
      unit: unit,
      number: number
    };
  };

  getValueFromParts = function(number, unit) {
    if (!number | !unit) {
      return "now";
    }
    return "now-" + number + unit;
  };

  RelativeDate = function(element, options, dataName) {
    var self = this;
    this.element = element;
    this.$element = $(element);
    this.options = options;
    this.dataName = dataName;
    this.unitOptions = options.unitOptions;

    this._updateValue = function() {
      var number = self.$numberField.val();
      var unit = self.$unitField.val();
      var newValue = getValueFromParts(number, unit);
      self.$element.val(newValue).change();
    };

    this._addEventListeners = function() {
      this.$numberField.on("change", self._updateValue);
      this.$unitField.on("change", self._updateValue);
    };

    this.create = function() {
      var value = self.$element.val();
      if (!value) {
        self.$element.val(self.options.defaultValue);
      }

      var parsedValue = parseValue(value);

      self.$element.css("display", "none");
      self.numberField = document.createElement("input");
      self.numberField.setAttribute("type", "number");
      self.numberField.setAttribute("min", 0);
      self.$numberField = $(self.numberField);
      self.$numberField.val(parsedValue.number);

      var opts = [];
      self.unitOptions.forEach(opt => {
        var newField = document.createElement("option");
        newField.setAttribute("value", opt.value);
        $(newField).html(opt.label);
        opts.push($(newField));
      });

      self.unitField = document.createElement("select");
      self.$unitField = $(self.unitField).html(opts);
      self.$unitField.val(parsedValue.unit);

      self.$element.after(self.$numberField, self.$unitField).change();

      self._addEventListeners();
      return self;
    };

    return this;
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      var element = $(this),
        plugin,
        dataName = pluginName,
        obj = {};

      if ($.data(element[0], dataName)) {
        return;
      }

      options = $.extend({}, $.fn[pluginName].options, options);

      plugin = new RelativeDate(this, options, dataName).create();

      $.data(element[0], dataName, plugin);

      obj[pluginName] = function(elem) {
        return $(elem).data(dataName) !== undefined;
      };

      $.extend($.expr[":"], obj);
    });
  };

  $.fn[pluginName].options = {
    defaultValue: "",
    unitOptions: [
      {
        value: "d",
        label: "day(s) ago"
      },
      {
        value: "w",
        label: "week(s) ago"
      },
      {
        value: "m",
        label: "month(s) ago"
      }
    ]
  };
})(jQuery, window, document);
