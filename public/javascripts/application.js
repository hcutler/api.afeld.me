(function($){
  var Panel = function(data){
    this.data = data;
    this.$selected = null;
    this.childPanel = null;
  };

  Panel.prototype.render = function(){
    var data = this.data;

    if ($.isArray(data)){
      $list = $('<ol class="panel" start="0">');
    } else {
      $list = $('<ul class="panel">');
    }

    var self = this;
    $.each(data, function(key, val){
      var $li = self.createListItem(key, val);
      $list.append($li);
    });

    // handle expand/collapse
    $list.on('click', 'a.key', $.proxy(this.onKeyClicked, this));

    this.$el = $list;
    return this;
  };


  // private
  Panel.prototype.createListItem = function(key, val){
    var $li = $('<li>'),
      isObj = $.isPlainObject(val),
      $key, $val;

    if (isObj || $.isArray(val)){
      // nested data
      $key = $('<a class="key" href="#' + key + '">' + key + '</a>');
      $key.data('obj', val);

      if (isObj){
        $val = $('<span class="val object">{…}</span>');
      } else {
        // can assume it's an Array
        $val = $('<span class="val array">[…]</span>');
      }
    } else {
      // normal key-value
      var valType = typeof val;
      $key = $('<span class="key">' + key + '</span>');
      $val = $('<span class="val ' + valType + '">' + JSON.stringify(val) + '</span>');
    }

    $li.append($key, ': ', $val);
    return $li;
  };

  // private
  Panel.prototype.onKeyClicked = function(e){
    var $key = $(e.currentTarget),
      nestedData = $key.data('obj'),
      childPanel = this.childPanel;

    // remove any existing child panel
    if (childPanel){
      this.childPanel.remove();
      this.childPanel = null;
      this.$selected.removeClass('selected');
      this.$selected = null;
    }

    // only open if an existing panel wasn't being toggled off
    if (!childPanel || childPanel.data !== nestedData){
      // open new panel
      childPanel = new Panel(nestedData);
      childPanel.render();
      childPanel.$el.insertAfter(this.$el);
      this.childPanel = childPanel;

      var $selected = $key.closest('li');
      $selected.addClass('selected');
      this.$selected = $selected;
    }
  };

  // recursively remove this and all child panels
  Panel.prototype.remove = function(){
    this.$el.remove();
    if (this.childPanel){
      this.childPanel.remove();
    }
  };



  $.fn.jsonPanes = function(data){
    var panel = new Panel(data);
    panel.render();
    $(this).html(panel.$el);
  };
})(jQuery);
