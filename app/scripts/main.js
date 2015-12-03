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
	],
	api: {
		staff: {
			all: 'http://localhost:8888/staff.php'
		}
	}
};

// MODULES //

// helpers
var helpers = {
	getHeadersTop: function(){
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
	module.init = function($cover) {
		$cover = (typeof $cover === 'undefined' ? $('.main-cover') : $cover);
		module.cover = $cover;
		if ($cover.find('.cover-item').length <= 1) {
			return;
		}
		module.initSlide();
	};
	module.initSlide = function() {
		setInterval(function(){
			module.slide();
		}, 4000);
	};
	module.slide = function(){
		var $cover = module.cover,
			$items = $cover.find('.cover-item'),
			$currentItem = $cover.find('.cover-item.active').fadeOut('fast').removeClass('active'),
			i = $currentItem.index()+1,
			j = i % $items.length,
			$nextItem = $items.eq(j);
		// $nextItem = ($nextItem.length===0 ? $cover.first('.cover-item') : $nextItem);
		$nextItem.fadeIn('slow').addClass('active');
	};
	return module;
};

// coverlay module
var coverlay = function(){
	var module = {};
	module.init = function($coverlay){
		module.coverlay = $coverlay;
		$coverlay.css('cursor', 'pointer');
		$coverlay.click(function(e){
			e.preventDefault();
			var target = $coverlay.data('target'),
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
	};
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
		if ($grid.length === 0) {
			return;
		}
		module.grid = $grid;
		module.initIsotope($grid);
		module.initFilters($grid);
	};
	module.initIsotope = function($grid) {
		$grid.on('layoutComplete', function() {
			$(this).siblings('.grid-overlay').fadeOut('slow');
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

// staff
var staff = function(){
	var module = {};
	module.init = function($el){
		console.log($el);
		module.fetchStaffJson();
	};
	module.fetchStaffJson = function(){
		$.getJSON(config.api.staff.all, function(data){
			console.log(data);
		});
	};
	return module;
};

// register modules
var modules = {
	cover: cover(),
	coverlay: coverlay(),
	headers: headers(),
	isotope: isotope(),
	staff: staff()
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
		var moduleNames = $(this).data('modules').split(' ');
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
