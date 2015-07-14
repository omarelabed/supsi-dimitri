"use strict";

var config = {
	mediaQueries: {
		/* Custom, iPhone Retina */ 
		'$break-extra-small': '320px',
		/* Extra Small Devices, Phones */ 
		'$break-small': '480px',
		/* Small Devices, Tablets */
		'$break-medium': '768px',
		/* Medium Devices, Desktops */
		'$break-large':	'992px',
		/* Large Devices, Wide Screens */
		'$break-extra-large': '1200px'
	}
}

var fixedMenu = function(){
	var module = {},
		$fm = $('.fixed-menu');
	// actions
	module.toggle = function(close) {
		var bm = config.mediaQueries['$break-medium'],
			top = parseInt($fm.css('top')),
			w = $(window).outerWidth();
		if (Modernizr.mq('(min-width: ' + bm + ')')) {
			$fm.removeAttr('style');
			return;
		}
		if (close || top===0) {
			var mh = $fm.height(),
				th = $fm.find('.toggle').height(),
				top = (th - mh);
		} else {
			top = 0;
		}
		$fm.animate({'top': top + 'px'}, 'fast');
	}

	// initializations
	module.init = function() {
		module.initToggle();
		module.toggle();
		module.initOnResize();
	};
	module.initToggle = function() {
		$fm.find('.toggle').click(function(e){
			e.preventDefault();
			module.toggle();
		});
	}
	module.initOnResize = function(){
		$(window).resize(function(){
			module.toggle(true);
		});
	}
	return module;	
}

var modules = {
	// fixedMenu: fixedMenu()
};

$('[data-modules').each(function(){
	var moduleNames = $(this).data('modules').split(',');
	for (var i in moduleNames) {
		var moduleName = moduleNames[i];
		if (modules.hasOwnProperty(moduleName)) {
			if (modules[moduleName].init) {
				modules[moduleName].init();
			}
		}
	}
})