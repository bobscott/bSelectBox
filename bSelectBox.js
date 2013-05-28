(function ($, window, document, undefined) {
    // Default options
    var pluginName = "bSelectBox",				// Sets the name of the plugin
        defaults = {
			mainClass: "bSelectBox",			// Class name on the outer wrapper - 'bSelectBox' required for default style sheet
			customClass: "",					// Other class names on the outer wrapper
			openClass: "open",					// Class that is added when the drop-down menu is open
			selectedClass: "optionSelected",	// Class that is added on the selected item from the drop-down menu
			setWidth: true,						// Automatically sets width to longest item in drop-down menu
			before: function(){},				// Function that runs before plugin code execute
			after: function(){}					// Function that runs after plugin code execute
		};

	// The constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
		this.trim = function(str) {
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
        this.init();
    }
    Plugin.prototype = {
        init: function() {
			var options = this.options,
			element = this.element,
			classes = this.trim(options.mainClass + ' ' + options.customClass),
			$selectMarkup = $('<div class="' + classes + '"><div class="selectBox"><p data-value=""></p><span></span></div></div>'),
			currentValue = $(element).val();
			value = '',
			text = '',
			optionList = '',
			optionWidth = 0,
			$optionMarkup = $('<div class="selectOptions"><ol></ol></div>');

			// Function before plugin executes
			options.before();			

			// Get values for existing select box options
			$('option', element).each(function(){
				value = $(this).val();
				text = $(this).text();
				optionList += '<li><span data-value="' + value + '">' + text + '</span></li>';
			});

			// Put option list inside options wrapper
			$('ol', $optionMarkup).append(optionList);
			
			// Put options wrapper inside select box wrapper
			$('.selectBox', $selectMarkup).after($optionMarkup);

			// Add custom select box to page
			$(element).after($selectMarkup);
			
			// Find max width of selectbox and set width
			if (options.setWidth){
				$selectMarkup.addClass(options.openClass);
				optionWidth = $('.selectOptions', $selectMarkup).width() - $('.selectBox', $selectMarkup).css('padding-left').split('px')[0] - $('.selectBox', $selectMarkup).css('padding-right').split('px')[0];
				$selectMarkup.removeClass(options.openClass);
				$('.selectBox', $selectMarkup).width(optionWidth);
			}

			// Hide orginal select box
			$(element).hide();

			/*===========================
			Event Bindings
			============================*/
			// When the custom select box is clicked
			$('.selectBox', $selectMarkup).click(function(e){
				e.stopPropagation();
				// Add open class to parent
				$(this).parent().toggleClass(options.openClass);
			});
			
			// When an option is clicked from the custom select box
			$('.selectOptions span', $selectMarkup).click(function(e){
				e.stopPropagation();
				var value = $(this).attr('data-value'),
				text = $(this).text();
				
				// Set values in custom select box
				$('p', $selectMarkup).text(text).attr('data-value', value);
				
				// Set value in orignal select box
				$(element).val(value);
				
				// Remove open class from parent
				$(this).closest('.' + options.mainClass + '.open').removeClass(options.openClass);
				
				// Remove selected class from li
				$('.' + options.selectedClass, $selectMarkup).removeClass(options.selectedClass);
				
				// Add selected class to clicked element
				$(this).parent().addClass(options.selectedClass);
			});

			// Select the currently selected option in the orginal select box
			$('.selectOptions span[data-value="' + currentValue + '"]', $selectMarkup).eq(0).click();
			
			// Function after plugin executes
			options.after();
        }
    };

    // A wrapper around the constructor that prevents against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
})(jQuery, window, document);