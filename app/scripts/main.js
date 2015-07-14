"use strict";

// CONFIGS //
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
	},
	defaultModules: ['headers']
}

// MODULES //

// cover module
var cover = function(){
	var module = {};
	module.init = function($cover){
		module.cover = $cover;
		console.log($cover);
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

// headers module
var headers = function(){
	var module = {};
	module.init = function($headers){
		$(window).resize(function(){
			var top = $('.fixed-menu>nav').height() + $('.fixed-toolbar').height();
			$('.main-content').css('margin-top', top+'px');
		});
	}
	return module;
}

// register module
var modules = {
	cover: cover(),
	headers: headers()
};


// INITIALIZE/DEPLOY MODULES

// deploy single module
var deployModule = function(moduleName, $el){
	if (modules.hasOwnProperty(moduleName)) {
		if (modules[moduleName].init) {
			modules[moduleName].init($el);
		}
	}
}

// deploy modules from js
var deployDefaultModules = function(){
	for (var i in config.defaultModules) {
		deployModule(config.defaultModules[i]);
	}
}

// deploy modules on DOM
var deployDynamicModules = function() {
	$('[data-modules').each(function(){
		var moduleNames = $(this).data('modules').split(',');
		for (var i in moduleNames) {
			var moduleName = moduleNames[i];
			deployModule(moduleName, $(this));
		}
	});
}

// deploy all modules
var deployModules = function(){
	deployDefaultModules();
	deployDynamicModules();
}

// initialize modules
deployModules();