var semanticLabels = ["casual","chic","classic","clear","cool casual","dandy","dynamic","elegant","gorgeous","modern","natural","pretty","romantic"];
var fontLabels = ["Old Standard TT, serif", "Merriweather, serif", "Open Sans, san serif", "Lato, san serif", "Roboto, san serif",
									"Pacifico, cursive", "Tangerine, cursive", "Waiting for the Sunrise, cursive", "Inconsolata", "Lobster, cursive", "Monoton, cursive"];
var colorLabels = ["Dropbox Blue", "Tumblr Dark Turquoise", "Foursquare Logo Blue", "Twitter Blue", "YouTube Red", "Instagram Blue", "Pinterest Red", "Snapchat Yellow", "Flickr Pink", "Vimeo Green", "Facebook Blue", "Google+ Red", "Linkedin Blue", "Quora Burgundy", "Vine Green", "WhatsApp Green", "VK Blue"];

var active = {
	"color" : false, 
	"font" : false, 
	"semantic" : false
}


var fcCount = {}

var Semantics = function() {
				this.casual = 0;
				this.chic = 0;
				this.classic = 0;
				this.clear = 0;
				this.cool = 0;
				this.dandy = 0;
				this.dynamic = 0;
				this.elegant = 0;
				this.gorgeous = 0;
				this.modern = 0;
				this.natural = 0;
				this.pretty = 0;
				this.romantic = 0;
				this.total = 0;
};


Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function populateOptions(pickerTag, labels) {
	var picker = $(pickerTag);
	$.each(labels, function(index) {
	  picker.append($("<option />").val(labels[index]).text(labels[index]));
	});
}

function generateLabels(fname){
	var labels = []
	d3.csv(fname, function(data) {   // key - hexavalue, val - color name
		for(var i = 0; i < data.length; i++) {
			labels.push(data[i]["Name"]);
		}
		return labels;
	});
}


function initData() {
	generateCount();
	// $.when( $.ajax( generateCount() ) ).then(function() {
	// 	$.when( $.ajax( calculateProb() ) ).then(function() {
	// 		sortProb();
	// 	});
	// });
}

function generateCount(){
	d3.csv('data/font_color.csv', function(data) {
		for (var i = 1; i < data.length; i++) {
			var row = data[i]
			var name = '';
			for (var key in row) {
				// if( key === type ) name = row[key];
				if(row[key] == 1) {
					fcCount[key]++;
					fcCount.total++;

					// if (dataCount[name][key] > max) max = dataCount[name][key];
					// if (dataCount[name][key] < min) min = dataCount[name][key];
				}
			}
		}
		dataSize = Object.size(fcCount);
	});
}

function showViz() {
	console.log(fcCount);
}

$(document).ready(function() { 

	// $('#fontpicker').prop("disabled", true);
	// $('#colorpicker').prop("disabled", true);
	// $('#semanticpicker').prop("disabled", true);

	for( var k in active ) {
		active[k] = false;
	}

	// var checkers = $('.checker').on('change', function(e){
	// 	console.log(e.target.checked);
	// 	if(e.target.checked) {
	// 		event.preventDefault();
	// 		$('#' + e.target.value + 'picker').prop("disabled", false);
	// 		$(this).next(e.target).removeClass('disabled');
	// 	}
	// 	else {
	// 		event.preventDefault();
	// 		$('#' + e.target.value + 'picker').prop('disabled', true);
	// 		$(this).next(e.target).addClass('disabled');
	// 	}
	// });

	// fontLabels = generateLabels("data/fontcodes.csv", '#fontpicker');
	// colorLabels = generateLabels("data/colorcodes.csv", '#colorpicker');
	populateOptions('#fontpicker', fontLabels);
	populateOptions('#colorpicker', colorLabels);
	populateOptions('#semanticpicker', semanticLabels);
	initData();
});

