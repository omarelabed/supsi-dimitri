/*global $:false */
'use strict';

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
	defaultModules: [
		'isotope',
		'headers'
	]
};

// MODULES //

// cover module
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
	};
	return module;
};

// headers module
var headers = function(){
	var module = {};
	module.init = function($headers){
		module.headers = $headers;
		$(window).resize(function(){
			module.setContentMargin();
		});
		module.setContentMargin();
	};
	module.setContentMargin = function(){
		var fh = $('.fixed-toolbar').height(),
			bs = parseInt(config.mediaQueries['$break-medium']);
		fh = ($(window).width() < bs ? 0 : fh);
		var top = $('.fixed-menu>nav').height() + fh;
		$('.main-content').css('margin-top', top + 'px');
	}
	return module;
};

// isotope
var isotope = function(){
	var module = {};
	module.init = function($grid){
		$grid = (typeof $grid === 'undefined' ? $('.grid') : $grid);
		module.grid = $grid;
		$grid.on('layoutComplete', function(event) {
			var el = $(this);
			$(this).siblings('.grid-overlay').fadeOut();
		});
		$grid.isotope({
			itemSelector: '.grid-item',
			layoutMode: 'masonry'
		});
	};
	return module;
};


// register modules
var modules = {
	cover: cover(),
	headers: headers(),
	isotope: isotope()
};


// INITIALIZE/DEPLOY MODULES

// deploy single module
var deployModule = function(moduleName, $el){
	if (modules.hasOwnProperty(moduleName)) {
		if (modules[moduleName].init) {
			modules[moduleName].init($el);
		}
	}
};

// deploy modules from js
var deployDefaultModules = function(){
	for (var i in config.defaultModules) {
		deployModule(config.defaultModules[i]);
	}
};

// deploy modules on DOM
var deployDomModules = function() {
	$('[data-modules').each(function(){
		var moduleNames = $(this).data('modules').split(',');
		for (var i in moduleNames) {
			var moduleName = moduleNames[i];
			deployModule(moduleName, $(this));
		}
	});
};

// deploy all modules
var deployModules = function(){
	deployDefaultModules();
	deployDomModules();
};

// initialize modules
deployModules();
