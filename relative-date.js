(function($, window, document, undefined) {
  var pluginName = "relativeDate";

  RelativeDate = function(element, options, dataName) {
    this.element = element;
    this.$element = $(element);
    this.options = options;
    this.dataName = dataName;

    (this._events = function() {
      return this;
    }),
      (this.create = function() {
        var value = this.$element.val();
        if (!value) {
          this.$element.val(this.options.defaultValue);
        }
        return this;
      });
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
    defaultValue: ""
  };
})(jQuery, window, document);
