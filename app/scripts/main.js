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

var cover = function(){
	var module = {};
	module.init = function($cover){
		module.cover = $cover;
		$cover.css('cursor', 'pointer');
		$cover.click(function(e){
			e.preventDefault();
			var target = $cover.data('target'),
				diff = $('.fixed-menu>nav').height() + $('.fixed-toolbar').height(),
				offset = $(target).offset().top - diff;
			$('html, body').animate({
				scrollTop: offset
			});
		});
	}
	return module;
}


var modules = {
	cover: cover()
};

$('[data-modules').each(function(){
	var moduleNames = $(this).data('modules').split(',');
	for (var i in moduleNames) {
		var moduleName = moduleNames[i];
		if (modules.hasOwnProperty(moduleName)) {
			if (modules[moduleName].init) {
				modules[moduleName].init($(this));
			}
		}
	}
})