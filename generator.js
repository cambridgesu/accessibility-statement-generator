/*jslint browser: true, white: true, single: true, for: true, long: true */
/*global $, alert, console, window, jQuery */


// Accessibility statement generator logic
var generator = (function ($) {
	
	'use strict';
	
	return {
		
		// Constructor
		init: function ()
		{
			// Hide JS message and show section as JS support confirmed
			$('.noJS').hide ();
			$('.requireJS').show ();
			
			// Style tooltips and set title
			$('span[title]').each (function (i, spanElement) {
				$(spanElement).parent()[0].title = spanElement.title;
				$(spanElement).parent().tooltip();
				$(spanElement).text('?');
				$(spanElement).addClass('tooltipindicator');
			});
			
			// Hide the short version questions block by default
			$('#shortquestions').hide();
			
			// Inactive questions button toggle handling
			generator.toggle ($("#greyed"));
			$("#greyed").click (function () {
				generator.toggle ($('#greyed')[0]);
			});
			
			// Type (standard / short) button toggle handling
			generator.toggle ($("#type"));
			$("#type").click (function () {
				generator.toggle ($("#type")[0]);
			});
			
			// Select which type (questions / short questions)
			$("#type").click (generator.chooseType);
			
			// Generate the result (for either the standard / short version)
			$("#generate button").click (generator.generateChoice);
			
			// Handle button for selection of the result box
			$("#select").click (function () {
				$('#result').focus();
				$('#result').select();
			});
			
			// Standard version
			generator.toggleSteps ();
			generator.accessChange ();
			generator.filmChange ();
			generator.separateWording ();
			$('#access').change (generator.toggleSteps);
			$('#access').click (generator.toggleSteps);
			$('#separateaccess').change (generator.toggleSteps);
			$('#separateaccess').click (generator.toggleSteps);
			$('#separateaccess').change(generator.separateWording);
			$('#separateaccess').click (generator.separateWording);
			$('#access').change (generator.accessChange);
			$('#film').change (generator.filmChange);
			$('#film').click(generator.filmChange);
			$('#greyed').click (generator.refresh);
			$('#type').click (generator.refresh);
			
			// Short version
			generator.toggleStepsShort();
			generator.accessChangeShort ();
			generator.separateWordingShort ();
			$('#accessshort').change (generator.toggleStepsShort);
			$('#accessshort').click (generator.toggleStepsShort);
			$('#separateaccessshort').change (generator.toggleStepsShort);
			$('#separateaccessshort').click (generator.toggleStepsShort);
			$('#separateaccessshort').change (generator.separateWordingShort);
			$('#separateaccessshort').click (generator.separateWordingShort);
			$('#accessshort').change (generator.accessChangeShort);
			$('#greyed').click (generator.refreshShort);
			$('#type').click (generator.refreshShort);
		},
		
		
		// Function to toggle between button pairs
		toggle: function (toggle)
		{
			// Set the border style
			$(toggle).closest ('div').css ({
				borderStyle: (toggle.checked ? 'inset' : 'outset')
			});
			
			// Toggle which label to show
			if (toggle.checked) {
				$(toggle).parent().find('span.selected').show();
				$(toggle).parent().find('span.unselected').hide();
			} else {
				$(toggle).parent().find('span.selected').hide();
				$(toggle).parent().find('span.unselected').show();
			}
		},
		
		
		// Function to select which type (questions / short questions)
		chooseType: function ()
		{
			$('#result').hide();
			$('#select').hide();
			if ($("#type")[0].checked) {	// If the (single) checkbox is ticked
				$('#questions').fadeOut (function () {
					$('#shortquestions').fadeIn ('slow');
				});
			} else {
				$('#shortquestions').fadeOut (function () {
					$('#questions').fadeIn ('slow');
				});
			}
		},
		
		
		// Function to determine whether the result generation should use the standard or short version
		generateChoice: function ()
		{
			if ($("#type")[0].checked) {
				generator.generateshort ();
			} else {
				generator.generate ();
			}
		},
		
		
		enableTree: function (where, enable)
		{
			if ($('#greyed')[0].checked) {
				$('input, select', where).attr ('disabled', (enable ? null : 'disabled'));
				$('label', where).toggleClass ('grey', !enable);
				$(where).slideDown();
			} else {
				if (enable) {
					$('label', where).removeClass ('grey');
					$(where).slideDown();
				} else {
					$('label', where).removeClass ('grey');
					$(where).slideUp();
				}
			}
		},
		
		
		refresh: function ()
		{
			generator.toggleSteps ();
			generator.accessChange ();
			generator.filmChange ();
			generator.separateWording ();
		},
		
		
		toggleSteps: function ()
		{
			var accessType = $('#access input:checked').val ();
			var separateRoute = $('#separateaccess_yes')[0].checked;
			var enable = !((accessType == 'wa' || accessType == 'sf') && separateRoute == false);
			generator.enableTree ($('#steps'), enable);
		},
		
		
		accessChange: function ()
		{
			var enable = ($('#access_wa')[0].checked || $('#access_sf')[0].checked);
			generator.enableTree ($('#separateaccess')[0], enable);
		},
		
		
		filmChange: function ()
		{
			var enable = $('#film_yes')[0].checked;
			generator.enableTree ($('#filmhide')[0], enable);
		},
		
		
		separateWording: function ()
		{
			if ($('#separateaccess_yes')[0].checked) {
				$("#separateshow").show ();
			} else {
				$("#separateshow").hide ();
			}
		},
		
		
		refreshShort: function ()
		{
			generator.toggleStepsShort ();
			generator.accessChangeShort ();
			generator.separateWordingShort ();
		},
		
		
		toggleStepsShort: function ()
		{
			var accessType = $('#accessshort input:checked').val();
			var separateRoute = $('#separateaccessshort_yes')[0].checked;
			var enable = !((accessType == 'wa' || accessType == 'sf') && separateRoute == false);
			generator.enableTree ($('#stepsshort'), enable);
		},
		
		
		accessChangeShort: function ()
		{
			var enable = ($('#accessshort_wa')[0].checked || $('#accessshort_sf')[0].checked);
			generator.enableTree ($('#separateaccessshort')[0], enable);
		},
		
		
		separateWordingShort: function ()
		{
			if ($('#separateaccessshort_yes')[0].checked) {
				$("#separateshowshort").show();
			} else {
				$("#separateshowshort").hide();
			}
		},
		
		
		// Function to generate the standard version
		generate: function ()
		{
			var s = '';
			var accessType = $('#access input:checked').val();
			
			var separateRoute = false;
			if ($('#access_wa')[0].checked || $('#access_sf')[0].checked) {
				separateRoute = $('#separateaccess_yes')[0].checked;
			}
			
			var stepnumber = "";
			var stepheight = "";
			var handrail = "";
			if (!((accessType == 'wa' || accessType == 'sf') && separateRoute == false)) {
				stepnumber = $('#steps_count')[0].value.trim();
				stepheight = $('#steps_height input:checked').val();
				handrail = $('#steps_hr input:checked').val();
			}
			
			var comment = $('#comment')[0].value.trim();
			var contact = $('#contact')[0].value.trim();
			
			//
			// Statement generation starts here
			//

			var prefix = 'There is ';
			var postfix = '. ';
			var stepinfo = new Boolean();
			stepinfo = (stepnumber != "" || (stepheight != undefined && stepheight != "") || (handrail != undefined && handrail != ""));

			if (accessType == 'wa') {
				s += prefix + "wheelchair access";
			} else if (accessType == 'sf') {
				s += prefix + "step-free access (but not full wheelchair access)";
			} else if (accessType == 'no') {
				s += prefix + "no step-free access";
			}

			if (separateRoute) {
				s += " via a secondary route";
				var septext = ' to the main entrance';
			}
			if (accessType != undefined && accessType != "" && stepinfo) {
				s += " and ";
				prefix = "";
			} else if (accessType != undefined && accessType != "") {
				s += postfix;
			} else if (stepnumber != "1" && stepnumber != "one") {
				prefix = "There are ";
			}
			if (stepinfo) {
				if (stepnumber == "1" || stepnumber == "one") {
					if (stepheight == "lip") {
						postfix = "a lip";
					} else {
						postfix = "step";
					}
				} else {
					if (stepheight == "lip") {
						postfix = "lips";
					} else {
						postfix = "steps";
					}
				}
				if (stepheight == "lip") {
					if (stepnumber != "") {
						s += prefix + stepnumber + " " + postfix;
					} else {
						s += prefix + postfix;
					}
				} else {
					if (stepnumber != "" && (stepheight != undefined && stepheight != "")) {
						s += prefix + stepnumber + " " + stepheight + " " + postfix;
					} else if (stepnumber != "") {
						s += prefix + stepnumber + " " + postfix;
					} else if (stepheight != undefined && stepheight != "") {
						s += prefix + stepheight + " " + postfix;
					} else {
						s += prefix + postfix;
					}
				}
				if (handrail == "no") {
					s += ", with no handrail";
				} else if (handrail == "one") {
					s += ", with a handrail on one side";
				} else if (handrail == "both") {
					s += ", with a handrail on both sides";
				}
				if (septext != undefined) {
					s += septext;
				}
				s += ". ";
			}
			
			// Determine the facilities available / unavailable
			// This generates the yes, no, reqad and req arrays for lists of what is available
			var buckets = generator.determineFacilitiesAvailability ();
			
			// Process the 'yes' options
			s += generator.compileOptions (buckets.yes, 'There is ', 'and');
			
			// Process the 'by request in advance' options
			s += generator.compileOptions (buckets.reqad, 'There is ', 'and', ', by request in advance');
			
			// Process the 'by request at the event' options
			s += generator.compileOptions (buckets.req, 'There is ', 'and', ', by request at the event');
			
			// Process the 'no' options
			s += generator.compileOptions (buckets.no, "There isn't ", 'or');
			
			// Add comment, if any
			s += generator.processText (s, comment);
			
			// Add contact details, if any
			s += generator.processText (s, contact, 'You can contact us about access on ');
			
			// Show the result
			generator.showResult (s);
		},
		
		
		// Function to determine the facilities available / unavailable
		determineFacilitiesAvailability: function ()
		{
			// Generate the yes, no, reqad and req arrays for lists of what is available
			var options = {
				seating,
				wheelchairtoilet,
				genderneutraltoilet,
				hearingloop,
				bsl,
				quietspace,
				parking,
				bluebadge,
				subtitles,
				cc,
				audiodescription,
				englishaudio,
			};
			
			// Initialise buckets for each group
			var buckets = {yes: [], no: [], reqad: [], req: []};
			
			// Determine the chosen group, and the value for each option
			var splitRegexp = /^(yes|no|reqad|req): (.+)/;
			var matches, value, description;
			$.each (options, function (option) {
				
				// Obtain the value, or skip if not answered
				value = $('#' + option + ' input:checked').val();
				if (!value) {return;}	// I.e. continue to next
				
				// Split out the value; e.g. "yes: a hearing loop" would be put in the "yes" group with "a hearing loop" as the description
				matches = value.split (splitRegexp);
				value = matches[1];
				description = matches[2];
				
				// Add to the bucket
				buckets[value].push (description);
			});
			
			// Return the lists
			return buckets;
		},
		

		// Function to generate the short version
		generateshort: function ()
		{
			var s = '';
			var accessType = $('#accessshort input:checked').val();
			
			var separateRoute = false;
			if ($('#accessshort_wa')[0].checked || $('#accessshort_sf')[0].checked) {
				separateRoute = $('#separateaccessshort_yes')[0].checked;
			}
			
			var stepnumber = "";
			if (!((accessType == 'wa' || accessType == 'sf') && separateRoute == false)) {
				stepnumber = $('#stepsshort_data')[0].value.trim();
			}
			
			// Generate the yes array for lists of what is available
			var checkboxes = {
				paddedseatingshort: 'padded seating',
				basicseatingshort: 'basic seating',
				wheelchairtoiletshort: 'an accessible toilet',
				genderneutraltoiletshort: 'a gender neutral toilet',
				hearingloopshort: 'a hearing loop',
				bslshort: 'a BSL interpreter',
				quietspaceshort: 'a designated quiet space',
				parkingshort: 'general car parking',
				bluebadgeshort: 'blue badge parking',
				subtitlesshort: 'subtitles',
				ccshort: 'closed caption',
				audiodescriptionshort: 'audio description',
				englishaudioshort: 'english audio'
			};
			var yes = [];
			$.each (checkboxes, function (id, string) {
				if ($('#' + id)[0].checked) {
					yes.push (string);
				}
			});
			
			var comment = $('#commentshort')[0].value.trim();
			var contact = $('#contactshort')[0].value.trim();
			
			//
			// Statement generation starts here
			//

			var prefix = 'There is ';
			var postfix = '. ';
			if (accessType == 'wa') {
				s += prefix + "wheelchair access";
			} else if (accessType == 'sf') {
				s += prefix + "limited step-free access";
			} else if (accessType == 'no') {
				s += prefix + "no step-free access";
			}

			if (separateRoute) {
				s += " via a secondary route";
				var septext = ' to the main entrance';
			}
			
			if (accessType != undefined && accessType != "" && stepnumber != "" && stepnumber != undefined) {
				s += " and ";
				prefix = "";
			} else if (accessType != undefined && accessType != "") {
				s += postfix;
			}

			if (stepnumber != "" && stepnumber != undefined) {
				if (stepnumber == "1" || stepnumber == "one") {
					prefix = "There is ";
					postfix = " step";
				}
				else {
					prefix += "There are ";
					postfix = " steps";
				}
				if (accessType != undefined && accessType != "") {
					s += stepnumber + postfix;
				} else {
					s += prefix + stepnumber + postfix;
				}
				if (septext != undefined) {
					s += septext;
				}
				s += ". ";
			}

			// Process the checkbox options
			s += generator.compileOptions (yes, 'There is ');
			
			// Add comment, if any
			s += generator.processText (s, comment);
			
			// Add contact details, if any
			s += generator.processText (s, contact, 'You can contact us about access on ');
			
			// Show the result
			generator.showResult (s);
		},
		
		
		// Function to compile a list of options to a sentence
		compileOptions: function (options, prefix, separator, suffix)
		{
			// Return nothing if no value
			if (!options.length) {return '';}
			
			// Start with the prefix
			var result = prefix;
			
			// If there is more than one, set the last also to have the separator (e.g. and/or) (assuming use of Oxford Comma)
			var total = options.length;
			if (total > 1) {
				var lastIndex = total - 1;
				options[lastIndex] = separator + ' ' + options[lastIndex];
			}
			
			// Implode the list
			result += options.join (', ');
			
			// Add suffix if required
			if (suffix) {
				result += suffix;
			}
			
			// End sentence with a dot
			result += '. ';
			
			// Return the result
			return result;
		},
		
		
		// Function to process text options
		processText: function (s, comment, prefix)
		{
			// Return nothing if no value
			if (!comment.length) {return '';}
			
			// Start the result
			var result = '';
			
			// Add newline if there is already other results
			if (s.length) {result += "\n";}
			
			// Add prefix if required
			if (prefix) {
				result += prefix;
			}
			
			// Add the comment
			result += comment;
			
			// Return the result
			return result;
		},
		
		
		// Function to show the result
		showResult: function (result)
		{
			// Write the value into the box
			$('#result').val (result);
			
			// Show the result box
			$('#result').show();
			
			// Adjust the text box size if required
			var text = $('#result')[0];
			text.style.height = 10 + 'px';
			var adjustedHeight = text.clientHeight;
			adjustedHeight = Math.max (text.scrollHeight, adjustedHeight);
			adjustedHeight = adjustedHeight - 20;
			text.style.height = adjustedHeight + 'px';
			
			// Show the selection control
			$('#select').show ();
		}
	};
	
} (jQuery));