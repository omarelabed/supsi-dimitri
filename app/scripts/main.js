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
		'headers'
	]
};

// MODULES //

var helpers = {
	getHeadersTop : function(){
		var fh = $('.fixed-toolbar').height(),
			bs = parseInt(config.mediaQueries['$break-medium']);
		fh = ($(window).width() < bs ? 0 : fh);
		var top = $('.fixed-menu>nav').height() + fh;
		return top;
	}
};

// cover module
var cover = function(){
	var module = {};
	module.init = function($cover){
		module.cover = $cover;
		$cover.css('cursor', 'pointer');
		$cover.click(function(e){
			e.preventDefault();
			var target = $cover.data('target'),
				diff = helpers.getHeadersTop(),
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
		var top = helpers.getHeadersTop();
		$('.main-content').css('margin-top', top + 'px');
	}
	return module;
};

// isotope
var isotope = function(){
	var module = {};
	module.init = function($grid){
		if (typeof $grid === 'undefined') {
			$grid = $('.grid');
		} else {
			$grid = ($grid.hasClass('grid') ? $grid : $grid.find('.grid'));
		}
		if ($grid.length === 0) return;
		module.grid = $grid;
		module.initIsotope($grid);
		module.initFilters($grid);
	};
	module.initIsotope = function($grid) {
		$grid.on('layoutComplete', function(event) {
			var el = $(this);
			$(this).siblings('.grid-overlay').fadeOut();
		});
		$grid.isotope({
			itemSelector: '.grid-item',
			layoutMode: 'masonry'
		});
	};
	module.initFilters = function($grid) {
		$grid.siblings('.grid-filters')
			.find('[data-filter]')
			.click(function(){
				var $el = $(this),
					filter = $el.data('filter');
				$el.addClass('active').siblings('.grid-filter').removeClass('active');
				$grid.isotope({filter: filter});
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
	$('[data-modules]').each(function(){
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
