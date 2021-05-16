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
		
		
		enableTree: function (where, on)
		{
			if ($('#greyed')[0].checked) {
				$('input, select', where).attr ('disabled', on ? null : 'disabled');
				$('label', where).toggleClass ('grey', !on);
				$(where).slideDown();
			} else {
				if (on) {
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
			var separateRoute = $('#separateaccess_y')[0].checked;
			generator.enableTree ($('#steps'), !((accessType == 'wa' || accessType == 'sf') && separateRoute == false));
		},
		
		
		accessChange: function ()
		{
			generator.enableTree ($('#separateaccess')[0], ($('#access_wa')[0].checked || $('#access_sf')[0].checked));
		},
		
		
		filmChange: function ()
		{
			generator.enableTree ($('#filmhide')[0], $('#film_y')[0].checked);
		},
		
		
		separateWording: function ()
		{
			if ($('#separateaccess_y')[0].checked) {
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
			var separateRoute = $('#separateaccessshort_y')[0].checked;
			generator.enableTree ($('#stepsshort'), !((accessType == 'wa' || accessType == 'sf') && separateRoute == false));
		},
		
		
		accessChangeShort: function ()
		{
			generator.enableTree ($('#separateaccessshort')[0], ($('#accessshort_wa')[0].checked || $('#accessshort_sf')[0].checked));
		},
		
		
		separateWordingShort: function ()
		{
			if ($('#separateaccessshort_y')[0].checked) {
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
				separateRoute = $('#separateaccess_y')[0].checked;
			}
			
			var stepnumber = "";
			var stepheight = "";
			var handrail = "";
			if (!((accessType == 'wa' || accessType == 'sf') && separateRoute == false)) {
				stepnumber = $('#steps_count')[0].value;
				if (stepnumber == "\s") {stepnumber = "";}
				stepheight = $('#steps_height input:checked').val();
				handrail = $('#steps_hr input:checked').val();
			}
			
			var seating = $('#seat input:checked').val();
			var wheelchairtoilet = $('#wheelchairtoilet input:checked').val();
			var genderneutraltoilet = $('#genderneutraltoilet input:checked').val();
			var hearingloop = $('#hearingloop input:checked').val();
			var bsl = $('#bsl input:checked').val();
			var quiet = $('#quiet input:checked').val();
			var parking = $('#park input:checked').val();
			var blue = $('#blue input:checked').val();
			var film = $('#film input:checked').val();
			
			var sub = "";
			var cc = "";
			var audiodescription = "";
			var english = "";
			if (film == "y") {
				sub = $('#sub input:checked').val();
				cc = $('#cc input:checked').val();
				audiodescription = $('#audiodescription input:checked').val();
				english = $('#englishaudio input:checked').val();
			}
			
			var comment = $('#comment')[0].value;
			if (comment == "\s") {comment = "";}
			var contact = $('#contact')[0].value;
			if (contact == "\s") {contact = "";}
			var yes = [];
			var no = [];
			var reqad = [];
			var req = [];
			//
			//Generating the yes, no, reqad and req arrays for lists of what is available
			//
			if (seating == "yp") { yes.push("padded seating"); }
			else if (seating == "yn") { yes.push("basic seating"); }
			else if (seating == "y") { yes.push("seating"); }
			else if (seating == "n") { no.push("seating"); }

			if (wheelchairtoilet == "y") { yes.push("an accessible toilet"); }
			else if (wheelchairtoilet == "p") { yes.push("a partially accessible toilet"); }
			else if (wheelchairtoilet == "n") { no.push("an accessible toilet"); }

			if (genderneutraltoilet == "y") { yes.push("a gender neutral toilet"); }
			else if (genderneutraltoilet == "n") { no.push("a gender neutral toilet"); }

			if (hearingloop == "y") { yes.push("a hearing loop"); }
			else if (hearingloop == "n") { no.push("a hearing loop"); }
			else if (hearingloop == "reqad") { reqad.push("a hearing loop"); }
			else if (hearingloop == "req") { req.push("a hearing loop"); }

			if (bsl == "y") { yes.push("a BSL interpreter"); }
			else if (bsl == "n") { no.push("a BSL interpreter"); }
			else if (bsl == "reqad") { reqad.push("a BSL interpreter"); }
			else if (bsl == "req") { req.push("a BSL interpreter"); }

			if (quiet == "y") { yes.push("a designated quiet space"); }
			else if (quiet == "n") { no.push("a designated quiet space"); }
			else if (quiet == "reqad") { reqad.push("a designated quiet space"); }
			else if (quiet == "req") { req.push("a designated quiet space"); }

			if (parking == "y") { yes.push("general car parking"); }
			else if (parking == "n") { no.push("general car parking"); }
			else if (parking == "reqad") { reqad.push("general car parking"); }
			else if (parking == "req") { req.push("general car parking"); }

			if (blue == "y") { yes.push("blue badge parking"); }
			else if (blue == "n") { no.push("blue badge parking"); }
			else if (blue == "reqad") { reqad.push("blue badge parking"); }
			else if (blue == "req") { req.push("blue badge parking"); }

			if (sub == "y") { yes.push("subtitles"); }
			else if (sub == "n") { no.push("subtitles"); }
			else if (sub == "reqad") { reqad.push("subtitles"); }
			else if (sub == "req") { req.push("subtitles"); }

			if (cc == "y") { yes.push("closed caption"); }
			else if (cc == "n") { no.push("closed caption"); }
			else if (cc == "reqad") { reqad.push("closed caption"); }
			else if (cc == "req") { req.push("closed caption"); }

			if (audiodescription == "y") { yes.push("audio description"); }
			else if (audiodescription == "n") { no.push("audio description"); }
			else if (audiodescription == "reqad") { reqad.push("audio description"); }
			else if (audiodescription == "req") { req.push("audio description"); }

			if (english == "y") { yes.push("english audio"); }
			else if (english == "n") { no.push("english audio"); }
			else if (english == "reqad") { reqad.push("english audio"); }
			else if (english == "req") { req.push("english audio"); }

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
			var index;
			if (yes.length > 1) {
				s += "There is ";
				for (index in yes) {
					if (index < yes.length - 1) {
						s += yes[index] + ", ";
					} else {
						s += "and " + yes[index] + ". ";
					}
				}
			} else if (yes.length == 1) {
				s += "There is " + yes[0] + ". ";
			}

			if (reqad.length > 1) {
				s += "There is ";
				for (index in reqad) {
					if (index < reqad.length - 1) {
						s += reqad[index] + ", ";
					} else {
						s += "and " + reqad[index] + " by request in advance. ";
					}
				}
			} else if (reqad.length == 1) {
				s += "There is " + reqad[0] + " by request in advance. ";
			}

			if (req.length > 1) {
				s += "There is ";
				for (index in req) {
					if (index < req.length - 1) {
						s += req[index] + ", ";
					} else {
						s += "and " + req[index] + " by request at the event. ";
					}
				}
			} else if (req.length == 1) {
				s += "There is " + req[0] + " by request at the event. ";
			}

			if (no.length > 1) {
				s += "This isn't ";
				for (index in no) {
					if (index < no.length - 1) {
						s += no[index] + ", ";
					} else {
						s += "or " + no[index] + ". ";
					}
				}
			} else if (no.length == 1) {
				s += "There isn't " + no[0] + ". ";
			}
			if (comment != "" && s != "") {
				s += "\n" + comment;
			} else if (comment != "") {
				s += comment;
			}
			if (contact != "" && s != "") {
				s += "\n You can contact us about access on " + contact;
			} else if (contact != "") {
				s += "You can contact us about access on " + contact;
			}
			$('#result').val(s);
			$('#result').show();
			var text = $('#result')[0];
			text.style.height = 10 + "px";
			var adjustedHeight = text.clientHeight;
			adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
			adjustedHeight = adjustedHeight - 20;
			text.style.height = adjustedHeight + "px";
			/*$('#result').hide();
			$('#result').slideDown();*/
			$('#select').show();
		},
		

		// Function to generate the short version
		generateshort: function ()
		{
			var s = '';
			var accessType = $('#accessshort input:checked').val();
			
			var separateRoute = false;
			if ($('#accessshort_wa')[0].checked || $('#accessshort_sf')[0].checked) {
				separateRoute = $('#separateaccessshort_y')[0].checked;
			}
			
			var stepnumber = "";
			if (!((accessType == 'wa' || accessType == 'sf') && separateRoute == false)) {
				stepnumber = $('#stepsshort_data')[0].value;
			}
			if (stepnumber == "\s") {stepnumber = "";}
			
			var paddedseating = $('#paddedseat')[0].checked;
			var basicseating = $('#basicseat')[0].checked;
			var wheelchairtoilet = $('#wheelchairtoiletshort')[0].checked;
			var genderneutraltoilet = $('#genderneutraltoiletshort')[0].checked;
			var hearingloop = $('#hearingloopshort')[0].checked;
			var bsl = $('#bslshort')[0].checked;
			var quiet = $('#quietshort')[0].checked;
			var parking = $('#parkshort')[0].checked;
			var blue = $('#blueshort')[0].checked;
			var sub = $('#subshort')[0].checked;
			var cc = $('#ccshort')[0].checked;
			var audiodescription = $('#audiodescriptionshort')[0].checked;
			var english = $('#englishaudioshort')[0].checked;
			var comment = $('#commentshort')[0].value;
			if (comment == "\s") {comment = "";}
			var contact = $('#contactshort')[0].value;
			if (contact == "\s") {contact = "";}
			var yes = [];
			//
			//Generating the yes array for lists of what is available
			//
			if (paddedseating == true) { yes.push("padded seating"); }
			if (basicseating == true) { yes.push("basic seating"); }
			if (wheelchairtoilet == true) { yes.push("an accessible toilet"); }
			if (genderneutraltoilet == true) { yes.push("a gender neutral toilet"); }
			if (hearingloop == true) { yes.push("a hearing loop"); }
			if (bsl == true) { yes.push("a BSL interpreter"); }
			if (quiet == true) { yes.push("a designated quiet space"); }
			if (parking == true) { yes.push("general car parking"); }
			if (blue == true) { yes.push("blue badge parking"); }
			if (sub == true) { yes.push("subtitles"); }
			if (cc == true) { yes.push("closed caption"); }
			if (audiodescription == true) { yes.push("audio description"); }
			if (english == true) { yes.push("english audio"); }
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

			var index;
			if (yes.length > 1) {
				s += "There is ";
				for (index in yes) {
					if (index < yes.length - 1) {
						s += yes[index] + ", ";
					} else {
						s += "and " + yes[index] + ". ";
					}
				}
			} else if (yes.length == 1) {
				s += "There is " + yes[0] + ". ";
			}
			if (comment != "" && s != "") {
				s += "\n" + comment;
			} else if (comment != "") {
				s += comment;
			}
			if (contact != "" && s != "") {
				s += "\n You can contact us about access on " + contact;
			} else if (contact != "") {
				s += "You can contact us about access on " + contact;
			}
			$('#result').val(s);
			$('#result').show();
			var text = $('#result')[0];
			text.style.height = 10 + "px";
			var adjustedHeight = text.clientHeight;
			adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
			adjustedHeight = adjustedHeight - 20;
			text.style.height = adjustedHeight + "px";
			$('#select').show();
		}
	};
	
} (jQuery));