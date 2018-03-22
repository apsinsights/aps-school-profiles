		
	 /**
	 * @name Introduction
     * @file Function list for code to generate School Profiles on APS Insights.
     * @author John Keltz
	 */
	
	/*javascript outline
	
	Step 1: Write functions
	
	Step 2: Make filter
	
	Step 3: make graphs after school selection
		Step 3.1 make graphs
		Step 3.2 generate and reset buttons
		Step 3.3 drop "select a school" row from school list
		Step 3.4 make line graph
		Step 3.5: Line/bar graph toggle buttons
		
	Step 4: Add comparison school
		Step 4.1: make second filter for a comparison school
		...
		
	Step 5: Update graphs from year buttons
		Step 5.1: CCRPI year buttons
		Step 5.2: Milestones year buttons
		Step 5.3: SGP year buttons
		Step 5.4: BTO year buttons
		Step 5.5: Graduation year buttons
		Step 5.6: Attendance year buttons
		Step 5.7: Climate year buttons
	*/

	//Step 1: Write functions
	
	//set colors for above / average / below
	var aboveColor = "#51b364"
	var averageColor = "#F0BD27"
	var belowColor = "#E03531"
	
	/**
	*@namespace Bar_Graph_Functions
	*@description These functions generate the bar graphs, or support that purpose.
	*/
	
	/**
	*@namespace Bar_Graph2_Functions
	*/
	
	/**
	*@namespace Text_Functions
	*@description These functions generate the short descriptive text next to the graphs.
	*/
	
	/**
	*@namespace Line_Graph_Functions
	*@description These functions generate the line graphs, or support that purpose.
	*/
	
	/**
	*@namespace Button_Functions
	*@description These functions generate or toggle buttons, or support that purpose.
	*/
	
	/**
	*@namespace General
	*@description These functions are used for a stand-alone purpose or to support several other areas.
	*/
	
	/**
	*This function compares a school value to the district and state values and outputs the bar color for the school value.
	*@memberof Bar_Graph_Functions
	*@param {number} school the school data point
	*@param {number} district the district average data point
	*@param {number} state the state average data point
	*@returns {string} the hex code for the bar graph color
	*/
	function dataColor(school,district,state){
	
		//find number of decimals for data
		if(Math.floor(district)>1){
			var ci = 1;
			}else {
			var ci = .01;
			}
	
		if(school > Math.max(district,state) + ci){
			return aboveColor;
		} else if (school < Math.min(district,state) - ci) {
			return belowColor;
		} else {
			return averageColor;
		}
	};
	
	/**
	*This function recieves the bar graph array and outputs the color array. It calls {@link dataColor} to build the color array.
	*@memberof Bar_Graph_Functions
	*@param {array} matrix data array that will generate the bar graph
	*@returns {array} an array of color hex codes to color the bar graph
	*/
	function colorArray(matrix){
		var tempColor = [];
					
		for(var i = 0; i < matrix[0].length-3; i++) { //won't work for attendance...
			var tempLength = matrix[0].length
			tempColor.push(dataColor(matrix[1][i+1], matrix[1][tempLength-2], matrix[1][tempLength-1]))
		}
		tempColor.push('#989CA3');
		tempColor.push('#D3D3D3');
		return tempColor;
	}

	/**
	*This function recieves the attendance bar graph array and outputs the color array. It calls dataColor to build the color array. It's similar to colorArray but does not use a state value.
	*@memberof Bar_Graph_Functions
	*@param {array} matrix data array that will generate the bar graph
	*@returns {array} an array of color hex codes to color the bar graph
	*/
	function attColorArray(matrix){
		var tempColor = [];
					
		for(var i = 0; i < matrix[0].length-2; i++) { //won't work for attendance...
			var tempLength = matrix[0].length
			tempColor.push(dataColor(matrix[1][i+1], matrix[1][tempLength-1], matrix[1][tempLength-1]))
		}
		tempColor.push('#989CA3');
		return tempColor;
	}
	
	/**
	*This function makes the color array for Beat the Odds by looking up the bto_status value for the current selection.
	*@memberof Bar_Graph_Functions
	*@param {array} array data array that will generate the bar graph
	*@param {number} year year of the BTO data
	*@param {array} dataset school profile source data
	*@returns {array} an array of color hex codes to color the bar graph
	*/
	function btoColorArray(array,year,dataset){	
		var tempArray = [];
		for(var i = 0; i < array[0].length-1; i++) {
			for(var j = 0; j < dataset.length; j++) {
				if(dataset[j].school === array[0][i+1]  && dataset[j].year.replace(/\s/g, '') == year) {
					if(dataset[j].bto_status == "Above"){
						tempArray.push('#51b364')
					} else if (dataset[j].bto_status == "Below") {
						tempArray.push('#E03531')
					} else {
						tempArray.push('#F0BD27')
					}
				}
			}
		}	
		return tempArray;
	}

	/**
	*This function passes an all blue color array the same length as the data. This allows the subgroup graphs to use the same bar graph function as the achievement graphs.
	*@memberof Bar_Graph_Functions
	*@param {array} array data array that will generate the bar graph
	*@returns {array} an array of color hex codes to color the bar graph
	*/
	function simpleColorArray(array){
		var tempColorArray = [];
		for(var i = 0; i < array[0].length - 1; i++){
			tempColorArray.push('#4E79A7');
		}
		return tempColorArray;
	}

	/**
	*This function writes the text next to the CCRPI graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} selectedSchoolValue school ccrpi score
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the CCRPI graph
	*/
	function ccrpiText(selectedSchoolName, selectedSchoolValue, selectedYear){
		if(selectedSchoolValue){
			if(selectedYear=="3YearAvg"){
				var ccrpiText = "CCRPI is the state's school rating sytem. " +  selectedSchoolName + ' had an average CCRPI of <b>' + selectedSchoolValue + "</b> over the past three years. This graph compares " +  selectedSchoolName + "'s CCRPI to the district and state results."
			}
			else{
				var ccrpiText = "CCRPI is the state's school rating sytem. " +  selectedSchoolName + ' had a CCRPI of <b>' + selectedSchoolValue + "</b> in " + selectedYear +". This graph compares " +  selectedSchoolName + "'s CCRPI to the district and state results."
			};
		} else{var ccrpiText = "CCRPI is the state's school rating sytem."}
		document.getElementById("ccrpiParagraph").innerHTML = ccrpiText;	
	};
	
	/**
	*This function writes the text next to the Milestones graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} english the school's english proficiency rate
	*@param {number} math the school's math proficiency rate
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the Milestones graph
	*/
	function milesText(selectedSchoolName, english, math, selectedYear){
		if(english){
			var milesText = "In "+ selectedYear + ", <b>" + english + "%</b> of students at " +  selectedSchoolName + ' scored proficient or better in English and <b>' + math + "%</b> in Math. This graph compares school proficiency rates at " +  selectedSchoolName + " to the district and state."
		} else{var milesText = "This graph compares school proficiency rates at " +  selectedSchoolName + " to the district and state."}
		document.getElementById("milesParagraph").innerHTML = milesText;	
	};
	
	/**
	*This function writes the text next to the student growth graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} math the school's math SGP score
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the Milestones graph
	*/
	function sgpText(selectedSchoolName, math, selectedYear){
		if(math){
			if(selectedYear=="3YearAvg"){
				var sgpText = "The proficiency rates above show current achievement levels, while student growth measures whether students are learning over time. Over the past three years, <b>" + math + "%</b> of students at " + selectedSchoolName + " had typical or high growth in Math."
			}
			else {
			var sgpText = "The proficiency rates above show current achievement levels, while student growth measures whether students are learning over time. In " + selectedYear + ", <b>" + math + "%</b> of students at " + selectedSchoolName + " had typical or high growth in Math."
			};
		} else{sgpText = "The proficiency rates above show current achievement levels, while student growth measures whether students are learning over time."};
		document.getElementById("sgpParagraph").innerHTML = sgpText;	
	};
	
	/**
	*This function writes the text next to the graduation graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} gradrate the school's graduation rate
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the Milestones graph
	*/
	function gradText(selectedSchoolName, gradrate, selectedYear){
		if(gradrate){
			var gradText = selectedSchoolName + "'s " + selectedYear + " graduation rate was <b>" +  gradrate + "%</b>. This graph compares graduation rates at " +  selectedSchoolName + " to the district and state."
		} else{var gradText = "This graph compares graduation rates at " +  selectedSchoolName + " to the district and state."}
		document.getElementById("gradParagraph").innerHTML = gradText;	
	};
	
	/**
	*This function writes the text next to the beat the odds graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} score the school's beat the odds score
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the BTO graph
	*/
	function btoText(selectedSchoolName, score, selectedYear){

		var higher_lower;
	
		if(score >= 0){higher_lower = "higher"}
			else{higher_lower = "lower"};
	
		if(score | score == 0){
			if(selectedYear=="3YearAvg"){
				var btoText = "This metric compares a school's CCRPI score to schools that serve similar students. " + selectedSchoolName + "'s three year average of CCRPI scores was <b>" + Math.abs(score) + "</b> points " + higher_lower + " than similar schools."
			}
			else {
			var btoText = "This metric compares a school's CCRPI score to schools that serve similar students. " + selectedSchoolName + "'s " + selectedYear + " CCRPI score was <b>" + Math.abs(score) + "</b> points " + higher_lower + " than similar schools."
			};
		} else{btoText = "This metric compares a school's CCRPI score to schools that serve similar students."};
		document.getElementById("btoParagraph").innerHTML = btoText;	
	};

	/**
	*This function writes the text next to the attendance graph.
	*@memberof Text_Functions
	*@param {string} selectedSchoolName short version of school name
	*@param {number} score the school's attendance rate
	*@param {string} selectedYear selected year
	*@returns {string} Text next to the attendance graph
	*/
	function attText(selectedSchoolName, score, selectedYear){
	
		if(score){
			var attText = "The percentage of students who missed less than six days at " + selectedSchoolName + " was <b>" + score + "%</b> during the " + selectedYear + " school year."
		} else{attText = "This metric shows the percentage of students who missed less than six days."};
		document.getElementById("attParagraph").innerHTML = attText;	
	};
	
	/**
	*This function writes the text next to the enrollment graph. It uses the global variable selectedSchoolName to identify school.
	*@memberof Text_Functions
	*@param {array} dataMatrix source data fro school profile
	*@param {array} yearMatrix list of years with enrollment data
	*@returns {string} Text next to the enrollment graph
	*/
	function enrollText(dataMatrix,yearMatrix){
	
		for(var i = 0; i < dataMatrix.length; i++){
			if(dataMatrix[i][0] == selectedSchoolName){
				var enrollment = dataMatrix[i][dataMatrix[i].length-1]
			}
		}	
		
		var lastYear = yearMatrix[yearMatrix.length-1]
		
		var enrollText = selectedSchoolName + " had <b>" + enrollment + "</b> students enrolled during the " + lastYear + " school year. This graph shows changes in enrollment over time."
		document.getElementById("enrollParagraph").innerHTML = enrollText;	
	};

	/**
	*This function writes the text next to the subgroup graph. Unlike other text, it focuses on explaining the data dates, which aren't otherwise clear.
	*@memberof Text_Functions
	*@param {string} subgroupDate the year that the subgroup data is from
	*@param {number} mobilityDate the year that the mobility data is from
	*@param {string} directCertDate the year that the direct cert data is from
	*@returns {string} Text next to the subgroup graph
	*/
	function subgroupText(subgroupDate,mobilityDate,directCertDate){
	//addresses two most likely cases. might need to add additional logic...
		if(subgroupDate == mobilityDate && subgroupDate == directCertDate){
			var subgroupText = "This graph shows the percentage of students in different subgroups during the " + subgroupDate + " school year. Direct certification is a measure of school poverty."
		}
		else if(subgroupDate == mobilityDate && subgroupDate > directCertDate){
			var subgroupText = "This graph shows the percentage of students in different subgroups. Direct certification is a measure of school poverty. Data is from the " + subgroupDate + " school year, except direct certification, which is from " + directCertDate + "."
		}
		else{var subgroupText = "This graph shows the percentage of students in different subgroups. Direct certification is a measure of school poverty."}
		document.getElementById("subgroupParagraph").innerHTML = subgroupText;	
	};
	
	/**
	*This function writes the text next to the race graph.
	*@memberof Text_Functions
	*@param {string} school school name
	*@param {string} compareSchool compare school name
	*@param {string} tempYear selected year
	*@returns {string} Text next to the race graph
	*/
	function raceText(school,compareSchool,tempYear){
		if(compareSchool){
			var raceText = "This graph shows the percentage of students by race/ethnicity at " + school + " and " + compareSchool + " during the " + tempYear + " school year.";
			document.getElementById("raceParagraph").innerHTML = raceText;	
		
		}
		else{
			var raceText = "This graph shows the percentage of students by race/ethnicity at " + school + " during the " + tempYear + " school year.";
			document.getElementById("raceParagraph").innerHTML = raceText;	
		}
	};
	
	/**
	*This function writes the text next to the climate graph.
	*@memberof Text_Functions
	*@param {string} school school name
	*@param {number} score school's result on "I feel safe at school" question
	*@param {string} tempYear selected year
	*@returns {string} Text next to the climate graph
	*/
	//climate text
	function climateText(school,score,tempYear){
		var climateText = 'Georgia administers an annual school climate survey. In ' + tempYear + ', <b>' + score + '%</b> of students at ' + school + ' responded positively to the statement, "I feel safe at school."';
		document.getElementById("climateParagraph").innerHTML = climateText;	
	};

	/**
	*This function generates a bar graph using c3.js.
	*@memberof Bar_Graph_Functions
	*@param {array} dataArray Array formatted for cs.js graph function. This is usually generated by the function arrayValues. First line is school names, second line is values corresponding to school names.
	*@param {array} colors List of hex colors for bar graph. Usually generated by {@link colorArray} or a similar function.
	*@param {string} labelFormat d3.js label format. Usually '.0%' or '.1f' (i.e a percentage with zero decimals, or a regular number with one decimal.)
	*@param {string} divID name of the div ID where the graph should go.
	*@returns {object} A bar graph attached to the selected div ID.
	*/
	///////////make bar graph
	function barGraph(dataArray, colors, labelFormat, divID){
	
		var errorMessage = null;
		
		//have to copy line by line because otherwith javascript just copies the references to the objects, and then changes the original object when we splice
		//https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
		var line0 = dataArray[0].slice(0);
		var line1 = dataArray[1].slice(0);
		var dataArray2 = [line0,line1];  
		
		//change axis depending on data
		if(divID == '#btoGraph') {
			var axisMax = 23;
			var axisMin = -23;
		}
		else {
			if (labelFormat=='.0%') {
				  var axisMax = 1;
				} else {
				  var axisMax = 100;
				};
			};
		
		
		//set error message div
		if(divID == '#elaMilesGraph' || divID == '#mathMilesGraph')
			{var messageID = 'milesMessage'}
		else if (divID == '#elaSGPGraph' || divID == '#mathSGPGraph')
			{var messageID = 'sgpMessage'}
		else if (divID == '#btoGraph')
			{var messageID = 'btoMessage'}
		else if (divID == '#ccrpiGraph')
			{var messageID = 'ccrpiMessage'}
		else if (divID == '#attGraph')
			{var messageID = 'attMessage'}
		else if (divID == '#gradGraph')
			{var messageID = 'gradMessage'}
		else if (divID == '#raceGraph')
			{var messageID = 'raceMessage'}
		else if (divID == '#subgroupGraph')
			{var messageID = 'subgroupMessage'}
		else if (divID == '#likeSchoolGraph' || divID == '#safeSchoolGraph')
			{var messageID = 'climateMessage'}

			
		$('#'+messageID).empty(); //drop prior error message

		// error message for missing data
		//doesn't work if the school has no line for that year
		for(var i = dataArray2[0].length - 1; i > 0; i--){
			if(dataArray2[1][i] == null  && divID == '#subgroupGraph'){
				errorMessage = "<span style='font-size:80%; font-style: italic; padding-left: 10px;'>Missing data.</span>"
				dataArray2[0].splice(i,1);
				dataArray2[1].splice(i,1);
				colors.splice(i-1,1);
			}
			else if(dataArray2[1][i] == null){
				errorMessage = "<span style='font-size:80%; font-style: italic; padding-left: 10px;'>" + dataArray2[0][i] + " did not recieve a score.</span>"
				dataArray2[0].splice(i,1);
				dataArray2[1].splice(i,1);
				colors.splice(i-1,1);
			};
		}

		
		//set error message
		if(errorMessage){document.getElementById(messageID).innerHTML = errorMessage;}
		
		//set padding for schoolname
		var leftPadding = 50
		
		for(var i = 1; i < dataArray2[0].length; i++) {
			if(leftPadding < dataArray2[0][i].length * 7 + 5){
				leftPadding = Math.min(dataArray2[0][i].length * 7 + 5,160)
			}
		}
		
		var graphHeight = (dataArray2[0].length-1)*18 + 6 //change height based on number of schools... (intercept is because there is more padding on a single observation)
		
		$(divID).css("min-height",graphHeight); //set min height to fix mobile overlap problem. c3 only sets the max height.
		
		var chart = c3.generate({
			bindto: divID,
			size: {
				//height: graphHeight
				height: graphHeight
			},
			
			padding: {
				left: leftPadding
				//left: Math.max(dataArray2[0][1].length * 7 + 5, dataArray2[0][2].length * 7 + 5, 50) //rough formula... can we measure actual length?
				//try: https://stackoverflow.com/questions/14569415/read-width-of-d3-text-element
				//or: https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
			},
			data: {
				x: 'x',
				columns: dataArray2,
				type: 'bar',
				//labels: true,
				labels: {
					format: d3.format(labelFormat) //'.0%' or '.1f'
				},
				color: function (color, d) {
				return colors[d.index];
				}
			},
			bar: {
			  width:  {
				ratio: 0.7 // sets ratio of bar width to open space
			}
			},
			axis: {
				rotated: true, //switches from vertical bar to horizontal
				x: {
					type: 'category',
					tick: {
						multiline: false
					}
				},
				y: {
					show: false,
					max: axisMax,
					min: axisMin
				}
			},
			grid: {
				y: {
					lines: [{value:0}]
				}
			},
			tooltip: {
			  show: false
			},
			legend: {
				show: false
			}
		});

	};
	
	/**
	*This function generates a bar graph using c3.js. Similar to {@link barGraph}, but for graphing two schools per category, used for race/ethnicity and subgroups when there is a comparison school.
	*@memberof Bar_Graph2_Functions
	*@param {array} dataArray Array formatted for cs.js graph function. This is generated by the function {@link combineRaceArray}. First line is school names, second line is values corresponding to school names.
	*@param {string} labelFormat d3.js label format. Usually '.0%' or '.1f' (i.e a percentage with zero decimals, or a regular number with one decimal.)
	*@param {string} divID name of the div ID where the graph should go.
	*@returns {object} A bar graph with two schools per category (i.e. race or subgroup) attached to the selected div ID.
	*/
	function barGraph2(dataArray, labelFormat, divID){
	
		if (labelFormat=='.0%') {
			  var axisMax = 1;
			} else {
			  var axisMax = 100;
			};
			
		var line0 = dataArray[0].slice(0);
		var line1 = dataArray[1].slice(0);
		var line2 = dataArray[2].slice(0);
		var dataArray2 = [line0,line1,line2];  

		var errorMessage = null;		
		
		//set error message div
		if (divID == '#raceGraph')
			{var messageID = 'raceMessage'}
		else if (divID == '#subgroupGraph')
			{var messageID = 'subgroupMessage'}

		$('#'+messageID).empty(); //drop prior error message

		// error message for missing data
		//doesn't work if the school has no line for that year
		for(var i = dataArray2[0].length - 1; i > 0; i--){
			if(dataArray2[1][i] == null || dataArray2[2][i] == null){
				errorMessage = "<span style='font-size:80%; font-style: italic; padding-left: 10px;'>Missing data.</span>"
			}
		}

		//set error message
		if(errorMessage){document.getElementById(messageID).innerHTML = errorMessage;}
			
		//set padding for schoolname
		var leftPadding = 50
		
		for(var i = 1; i < dataArray2[0].length; i++) {
			if(leftPadding < dataArray2[0][i].length * 7 + 5){
				leftPadding = Math.min(dataArray2[0][i].length * 7 + 5,120)
			}
		}
		
		var graphHeight = (dataArray2[0].length)*32 + 6 //change height based on number of schools... (intercept is because there is more padding on a single observation)

		$(divID).css("min-height",graphHeight); //set min height to fix mobile overlap problem. c3 only sets the max height.
		
		var chart = c3.generate({
			bindto: divID,
			size: {
				height: graphHeight
			},
			
			padding: {
				left: leftPadding
				//try: https://stackoverflow.com/questions/14569415/read-width-of-d3-text-element
				//or: https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
			},
			data: {
				x: 'x',
				columns: dataArray2,
				type: 'bar',
				//labels: true,
				labels: {
					format: function(v, id, i, j){
						if(v==null){return ""}
						else{format = d3.format(labelFormat); return format(v)}
					}
				}
			},
			bar: {
			  width:  {
				ratio: 0.7 // sets ratio of bar width to open space
			}
			},
			axis: {
				rotated: true, //switches from vertical bar to horizontal
				x: {
					type: 'category'
				},
				y: {
					show: false,
					max: axisMax,
				}
			},
			grid: {
				y: {
					lines: [{value:0}]
				}
			},
			tooltip: {
			  show: false
			},
			legend: {
				show: true
			}
		});

	};
	
		
	/**
	*This function generates a line graph using c3.js.
	*@memberof Line_Graph_Functions
	*@param {array} dataArray Array formatted for cs.js graph function. This is generated by the function {@link lineData}. Each row is a school name and then a list of values by year.
	*@param {array} yearArray List of years for the line graph. This is generated by the function {@link yearData}.
	*@param {array} lineColor Array of hex colors for line graph. This is generated by the function {@link lineColorArray}.
	*@param {string} title Title at the top of the graph.
	*@param {string} divID name of the div ID where the graph should go.
	*@returns {object} A line graph attached to the selected div ID.
	*/
	function lineGraph(dataArray, yearArray, lineColor, title, divName){
	
		//key takes up more space when there are more schools, so increase height
		var graphHeight = 180 + 15*Math.max(dataArray.length-4,0)
		
		if(divName == "#enrollGraph"){
			var lineFormat = '.0f';
			var lineAxisMin = 0;
			var paddingBottom = 0;
		}else{var lineFormat = '.0%'}

		$(divName).css("min-height",graphHeight); //set min height to fix mobile overlap problem. c3 only sets the max height.
			
		var chart = c3.generate({
			bindto: divName,
			size: {
				height: graphHeight
			},
			data: {
				columns:
				dataArray,
				type: 'line',
				//labels: true,
				labels: {
					format: 
						function (v, id, i, j) {
							if(id == selectedSchoolName && v != null) return d3.format(lineFormat)(v); //only main school gets data labels
							//other option: if(j == 0) return v;
						}
				},
			},
			color: {
				pattern: lineColor
			},
			axis: {
				x: {
					type: 'category',
					categories: yearArray
				},
				y: {
					tick: {
					format: d3.format(lineFormat),
					count: 5
					},
					padding: {
						top: 20,
						bottom: paddingBottom
					},
					min: lineAxisMin,
				},
			},
			tooltip: {
			  show: true
			},
			legend: {
				show: true
			},
			title: {
				text: title
			}
		});

	}; 
	

	//declare name variable so it exists outside the function
		//can use this elesewhere to differentiate merged schools from final school
	var selectedSchoolName
	
	/**
	*This function looks up the short name for a school.
	*@memberof General
	*@param {string} school long schoolname, as shown in the filter.
	*@param {array} dataset school profile data file
	*@returns {string} short school name
	*/
	function shortName(school,dataset){
		var tempName
		for(var i = 0; i < dataset.length; i++) {
			if(dataset[i].schoolname === school) {
				tempName = (dataset[i].school);
			}
		}
		return tempName;
	}
		
	/**
	*This function makes a data array that can be used by the barGraph function. 
	*@memberof Bar_Graph_Functions
	*@param {string} subject the name of the column in the source data containing our values
	*@param {string} school long school name, as shown in the filter
	*@param {string} compareSchool long comparison school name, as shown in the filter
	*@param {string} year selected year
	*@param {array} dataset school profile data file
	*@returns {array} First line is school names, second line is values corresponding to school names.
	*/
	function arrayValues(subject,school,compareSchool,year,dataset){
	//this function makes a data array that can be used by the barGraph function
	
		//two rows of the array
		var tempNames = ['x']
		var tempValues = ['value']		
		
		//school value
		for(var i = 0; i < dataset.length; i++) {
			if(dataset[i].schoolname === school && dataset[i].year.replace(/\s/g, '') == year) { //replace function makes this robust to year = "3 Year Average" (it drops the spaces)
				tempNames.push(dataset[i].school);
				if(dataset[i][subject]){tempValue2 = dataset[i][subject]*1} else{tempValue2 = null}
				tempValues.push(tempValue2);  
			}
		}
		if(tempValues.length == 1){ //if school/year observation was missing we still need the name
			var backupName
			for(var i = 0; i < dataset.length; i++) {
				if(dataset[i].schoolname === school ) { 
					backupName = dataset[i].school
				}
			}
			tempNames.push(backupName);  
			tempValues.push(null);
		}
		//compare school value
		if(compareSchool) {
			for(var i = 0; i < dataset.length; i++) {
				if(dataset[i].schoolname === compareSchool && dataset[i].year.replace(/\s/g, '') == year) { //replace function makes this robust to year = "3 Year Average" (it drops the spaces)
					tempNames.push(dataset[i].school);
					if(dataset[i][subject]){tempValue2 = dataset[i][subject]*1} else{tempValue2 = null}
					tempValues.push(tempValue2); 
				}
			}
			if(tempValues.length == 2){ //if school/year observation was missing we still need the name
				var backupName
				for(var i = 0; i < dataset.length; i++) {
					if(dataset[i].schoolname === compareSchool ) { 
						backupName = dataset[i].school
					}
				}
				tempNames.push(backupName);  
				tempValues.push(null);
			}
		}
		if(subject != "bto_score"){
			for(var i = 0; i < dataset.length; i++) {
				if(dataset[i].schoolname === "Atlanta" && dataset[i].year.replace(/\s/g, '') == year) { //replace function makes this robust to year = "3 Year Average" (it drops the spaces)
					tempValues.push(dataset[i][subject]*1); 
					tempNames.push(dataset[i].schoolname); 
				}
			}	
		}
		if(subject != "bto_score" && subject != "attend" && subject != "like_school" && subject != "safe_school"){
			for(var i = 0; i < dataset.length; i++) {
				if(dataset[i].schoolname === "Georgia" && dataset[i].year.replace(/\s/g, '') == year) { //replace function makes this robust to year = "3 Year Average" (it drops the spaces)
					tempValues.push(dataset[i][subject]*1); 
					tempNames.push(dataset[i].schoolname); 
				}	
			}
		}
		return [tempNames,tempValues];
	}
	
	/**
	*This function makes a data array that can be used by the barGraph function. Not many input variables b/c school should only have one data line with race values.
	*@memberof Bar_Graph_Functions
	*@param {string} school long school name, as shown in the filter
	*@param {array} dataset school profile data file
	*@returns {array} First line is race/ethnicity names, second line is percentages.
	*/
	function raceArrayValues(school,dataset){
		
		//two rows of the array
		var tempNames = ['x']
		var tempValues = ['value']	
		
		for(var i = 0; i < dataset.length; i++){
			if(dataset[i].schoolname == school && (dataset[i].black != null | dataset[i].white != null | dataset[i].hispanic != null)){
				if(dataset[i].american_indian){
					tempNames.push("American Indian")
					tempValues.push(dataset[i].american_indian)
				}
				if(dataset[i].asian){
					tempNames.push("Asian")
					tempValues.push(dataset[i].asian)
				}
				if(dataset[i].black){
					tempNames.push("Black")
					tempValues.push(dataset[i].black)
				}
				if(dataset[i].hispanic){
					tempNames.push("Hispanic")
					tempValues.push(dataset[i].hispanic)
				}
				if(dataset[i].pacific_islander){
					tempNames.push("Pacific Islander")
					tempValues.push(dataset[i].pacific_islander)
				}
				if(dataset[i].two_or_more){
					tempNames.push("Two or More")
					tempValues.push(dataset[i].two_or_more)
				}
				if(dataset[i].white){
					tempNames.push("White")
					tempValues.push(dataset[i].white)
				}
			}
		}
		
		return [tempNames,tempValues];
	}
	
	/**
	*This function combines race arrays for two schools into one data array that can be used by the barGraph2 function. Also used to combine subgroup arrays.
	*@memberof Bar_Graph2_Functions
	*@param {string} school1 long school name, as shown in the filter
	*@param {string} school2 long comparison school name, as shown in the filter
	*@param {array} values generated by {@link raceArrayValues} for school 1
	*@param {array} values generated by {@link raceArrayValues} for school 2
	*@returns {array} First line is race/ethnicity names, second and third line are percentages by school.
	*/	
	function combineRaceArray(school1,school2,raceMatrix1,raceMatrix2){
		//get list of race groups without leading "x"
		var raceList = raceMatrix1[0].slice(0);
		raceList.shift()
		
		var raceList2 = raceMatrix2[0].slice(0);
		raceList2.shift()
		
		for(var i = 0; i < raceList2.length; i++) {
			if($.inArray(raceList2[i], raceList) == -1){
				raceList.push(raceList2[i]);
			}
		}	
		
		//sort year list
		raceList.sort();
		
		//replace x-fast
		raceList.unshift("x")
		
		//make school 1 values
		var data1 = [school1]
		
		for(var i = 1; i < raceList.length; i++){
			var tempCount = 0;
			for(var j = 1; j < raceMatrix1[0].length; j++){
				if(raceMatrix1[0][j] == raceList[i]){
					data1.push(Number(raceMatrix1[1][j]))
					tempCount++;
				}
			}
			//if race is not found-
			if(tempCount == 0){data1.push(0)}
		}
		
		var data2 = [school2]
		
		for(var i = 1; i < raceList.length; i++){
			var tempCount = 0;
			for(var j = 1; j < raceMatrix2[0].length; j++){
				if(raceMatrix2[0][j] == raceList[i]){
					data2.push(Number(raceMatrix2[1][j]))
					tempCount++;
				}
			}
			//if race is not found-
			if(tempCount == 0){data2.push(0)}
		}

		return[raceList,data1,data2]
		
	}
	
	/**
	*This function makes a data array that can be used by the barGraph function. Not many input variables b/c school should only have one data line with subgroup values.
	*@memberof Bar_Graph_Functions
	*@param {string} school long school name, as shown in the filter
	*@param {array} dataset school profile data file
	*@returns {array} First line is subgroup names, second line is percentages.
	*/	
	function subgroupArrayValues(school,dataset){
		
		//two rows of the array
		var tempNames = ['x','Direct Certification','English Learners','Mobile Students','Students with Disabilities']
		var tempValues = ['value']	

		for(var i = 0; i < dataset.length; i++){
			if(dataset[i].schoolname == school && dataset[i].direct_cert != ""){
					tempValues.push(dataset[i].direct_cert)
			}
		}
		if(tempValues.length == 1){tempValues.push(null)}
		
		for(var i = 0; i < dataset.length; i++){
			if(dataset[i].schoolname == school && dataset[i].lep != ""){
					tempValues.push(dataset[i].lep)
			}
		}
		if(tempValues.length == 2){tempValues.push(null)}		
		
		for(var i = 0; i < dataset.length; i++){
			if(dataset[i].schoolname == school && dataset[i].mobility != ""){
					tempValues.push(dataset[i].mobility)
			}
		}
		if(tempValues.length == 3){tempValues.push(null)}		
		
		for(var i = 0; i < dataset.length; i++){
			if(dataset[i].schoolname == school && dataset[i].swd != ""){
					tempValues.push(dataset[i].swd)
			}
		}
		if(tempValues.length == 4){tempValues.push(null)}	
		
		return [tempNames,tempValues];
	}
	
	 
	/**
	*This function hides the Milestones line graph and shows the bar graph.
	*@memberof Button_Functions
	*/	
	function switchToBar(){
		document.getElementById('elaLineGraph').style.display = "none";
		document.getElementById('mathLineGraph').style.display = "none";
		document.getElementById('milesBarGraph').style.display = "block";
		document.getElementById('milesButtonGroup').style.display = "block";
		document.getElementById('milesLine').src = "https://apsinsights.org/wp-content/uploads/2018/03/Line-Icon.png"
		document.getElementById('milesBar').src = "https://apsinsights.org/wp-content/uploads/2018/03/Bar-Icon-Gray.png"
	 }
	 
	/**
	*This function hides the Milestones bar graph and shows the line graph.
	*@memberof Button_Functions
	*/	
	function switchToLine(){
		document.getElementById('elaLineGraph').style.display = "block";
		document.getElementById('mathLineGraph').style.display = "block";
		document.getElementById('milesBarGraph').style.display = "none";
		document.getElementById('milesButtonGroup').style.display = "none";
		document.getElementById('milesLine').src = "https://apsinsights.org/wp-content/uploads/2018/03/Line-Icon-Gray.png"
		document.getElementById('milesBar').src = "https://apsinsights.org/wp-content/uploads/2018/03/Bar-Icon.png"
	 }
	 
	/**
	*This function makes the selected button bold.
	*@memberof Button_Functions
	*@param {string} year selected year
	*@param {string} content nickname used for content area when naming divs and IDs
	*/	
	 function buttonUpdate(year,content){
		$("."+content+"YearButtons").css("font-weight", "normal");
		$("."+content+"YearButtons").css("color", "#95aec9");
		$("#"+content+year).css("font-weight", "bold");
		$("#"+content+year).css("color", "#4e79a7");
	}
		
	
	/**
	*This function writes html code to make buttons. It loops through the data to make a button for each year that contains non-null values.
	*@memberof Button_Functions
	*@param {string} content nickname used for content area when naming divs and IDs
	*@param {string} column column in the dataset that contains our values
	*@param {string} idName div ID where the buttons will be drawn
	*@param {string} dataset school profile source data
	*/	
	function makeButtons(content,column,idName,dataset){
		yearArray = [];
		
		//make array of years with no duplicates
		for(var i = 0; i < dataset.length; i++) {
			if($.inArray(dataset[i].year, yearArray) == -1 && dataset[i][column] != ""){
				yearArray.push(dataset[i].year);
			}
		}	
		
		//sort year list
		yearArray.sort();
		
		//set div id for button location
		var buttonLocation = document.getElementById(idName)
		
		//Create a button for each year
		for(var i = 0; i < yearArray.length; i++) {
			var button = document.createElement("button");
			button.innerHTML = yearArray[i];
			button.classList.add("buttons");
			button.classList.add(content+"YearButtons");
			button.setAttribute("id",content+yearArray[i].replace(/\s/g, '')); //replace code drops spaces to allow for "3 year avg" as a value
			button.setAttribute("value",yearArray[i].replace(/\s/g, '')); 
			
			// append button to div
			buttonLocation.appendChild(button);
			
			//add a line after buttons, except after the last button
			if (i < yearArray.length - 1){
				var line = document.createElement("HR");
				buttonLocation.appendChild(line);
			};
		};
	};
	
	/**
	*This function finds the max year for a given field. This is then used for default graph selections.
	*@memberof General
	*@param {string} column column name in the dataset that contains our values
	*@param {string} dataset school profile source data
	*/	
	function maxYear(column,dataset){
		var tempYear = 0;
		for(var i = 0; i < dataset.length; i++) {
			if(dataset[i].year > tempYear && dataset[i][column] != ""){
				tempYear = dataset[i].year;
			}
		}
		return tempYear;
	};
	

	/**
	*This functionmakes a list of years that contain non-null values.
	*@memberof Line_Graph_Functions
	*@param {string} subject column name in the dataset that contains our values
	*@param {string} dataset school profile source data
	*/	
	function yearData(subject,dataset){
		///get year list
		tempYearArray = []
		//make array of years with no duplicates
		for(var i = 0; i < dataset.length; i++) {
			if($.inArray(dataset[i].year, tempYearArray) == -1 && dataset[i][subject] != ""){
				tempYearArray.push(dataset[i].year);
			}
		}
		tempYearArray.sort();
		return tempYearArray;
	}
	

	/**
	*This function makes a data array that can be used by {@link lineGraph}. 
	*@memberof Line_Graph_Functions
	*@param {string} subject the name of the column in the source data containing our values
	*@param {string} selectedSchool long school name, as shown in the filter
	*@param {string} compareSchool long comparison school name, as shown in the filter
	*@param {array} dataset school profile data file
	*@param {array} yearArray list of relevant years, created by {@link yearData}
	*@returns {array} First line is school names, second line is values corresponding to school names.
	*/
	function lineData(subject,selectedSchool,compareSchool,dataset,yearArray){
		//make school list
		//school list searches for long name and makes a list of short names to include consolidated schools
		tempSchoolList = [];
		for(var i = 0; i < dataset.length; i++) {
			if(dataset[i].schoolname === selectedSchool && $.inArray(dataset[i].school, tempSchoolList) == -1){
				tempSchoolList.push(dataset[i].school)
			}
		}
		//add compare school names
		if(compareSchool){
			for(var i = 0; i < dataset.length; i++) {
				if(dataset[i].schoolname === compareSchool && $.inArray(dataset[i].school, tempSchoolList) == -1){
					tempSchoolList.push(dataset[i].school)
				}
			}
		}
		if(subject != "enrollment"){tempSchoolList.push("Atlanta")}
		if(subject != "enrollment"){tempSchoolList.push("Georgia")}
				
		//loop through school list to make data array for each school
		tempOuterArray = [];
		for(var i = 0; i < tempSchoolList.length; i++){
			tempInnerArray = [tempSchoolList[i]];
			//add a data point for each year
			for(var j = 0; j < yearArray.length; j++){
				tempCount = 0;
				for(var k = 0; k < dataset.length; k++) {
					if(dataset[k].school === tempSchoolList[i]  && dataset[k].year == yearArray[j]) {
						if(dataset[k][subject]){tempInnerArray.push(dataset[k][subject])*1}else{tempInnerArray.push(null)}
						tempCount++;
					}
				}
				if(tempCount == 0){tempInnerArray.push(null)}; //still need to fill array if no observation tempInnerArray.push(null); 
				tempCount = 0;
			}
			tempOuterArray.push(tempInnerArray);
		}
		return tempOuterArray;
	};
	
	/**
	*This function makes a color list to send to {@link lineGraph}. It cycles through the Tableau color pallette and then uses shades of gray for the district and state.
	*@memberof Line_Graph_Functions
	*@param {string} subject the name of the column in the source data containing our values
	*@param {array} line graph data, created by {@link lineData}
	*@returns {array} List of colors.
	*/
	function lineColorArray(subject,matrix){
		//make list of colors
		var baseColors = ['#1F77B4','#FF7F0E','#9467BD','#8C564B','#EC77C2','#BCBD22','#AEC7E8','#FFBB78','#FF9896']
		
		var tempColor = [];
		
		var gap = 0;
		if(subject!="enrollment"){gap=2}
					
		for(var i = 0; i < matrix.length-gap; i++) { 
			tempColor.push(baseColors[i])
		}
		if(subject!="enrollment"){
			tempColor.push('#989CA3');
			tempColor.push('#D3D3D3');
		}
		return tempColor;
	}
	
	/**
	*This function checks for messages about the school, such as 'the school is the result of a recent merger...'.
	*@memberof General
	*@param {string} school name of school
	*@param {array} dataset school profile data file
	*@returns {string} message that the school is new, or has a recent merger, and how this impacts the data.
	*/
	function getMessage(school,dataset){
		for(var i = 0; i < dataset.length; i++) {
			if(dataset[i].School === school) {
				return dataset[i].Message
			}
		}
	}
	
	/**
	*This function checks whether the school has multiple levels and, if so, generates a message.
	*@memberof General
	*@param {string} school1 name of school
	*@param {array} dataset1 school profile data file
	*@param {string} gradeLevel selected grade level
	*@returns {string} message that the school has multiple grade levels and how this impacts the data.
	*/
	function checkLevels(school1,dataset1,gradeLevel){
		
		//find max year
		var tempYear = 0;
		for(var i = 0; i < dataset1.length; i++) {
			if(dataset1[i].year > tempYear && dataset1[i].year != "3 Year Avg"){
				tempYear = dataset1[i].year;
				schoolNumber = dataset1[i].schoolnumber;
			}
		}
		
		//find schoolnumber
		var schoolNumber
		for(var i = 0; i < dataset1.length; i++) {
			if(dataset1[i].year == tempYear && dataset1[i].schoolname === school1 && dataset1[i].grade_cluster === gradeLevel){
				schoolNumber = dataset1[i].schoolnumber;
			}
		}
		
		//find levels
		tempLevelList = [];
		for(var i = 0; i < dataset1.length; i++) {
			if(dataset1[i].year == tempYear && dataset1[i].schoolname === school1 && dataset1[i].schoolnumber === schoolNumber && $.inArray(dataset1[i].grade_cluster, tempLevelList) == -1){
				tempLevelList.push(dataset1[i].grade_cluster)
			}
		}		
		
		if(tempLevelList.length > 1){
			var tempText = school1 + " contains multiple grade levels. The data below shows results for students at the " + gradeLevel + " level, with two exceptions. The School Rating Comparison section and the Subgroups section show results for all levels combined, because GOSA does not report these results seperately."
		}
		
		return tempText;
		
	};
	

	/**
	*This function is used by the select2 filter so it will only search text that matches the beginning of the school name (i.e. "m" matches Morningside and Miles only
	*@memberof General
	*/		
	function matchStart(params, data) {
		params.term = params.term || '';				
		if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
			return data;
		}
		return false;
	}
	
	/**
	*This function opens a print window and makes a printer-friendly version of the school profile. Note we pass current css libraries tot the new page, plus "printschoolprofilestyle.css" which adds custom css to drop things we don't want to print, like navigation icons and info buttons. The ws.css library, "custom_w3.css" is also edited, to get the print layout to show the desktop view instead of mobile.
	*@memberof General
	*/	
	
	function PrintPage()
	{	//alert messages for IE and firefox, else, print page
		if(false || !!document.documentMode){alert("Custom school profile printing is not compatable with Internet Explorer. Use your browser's print options or switch to Google Chrome.")}
		else if(typeof InstallTrigger !== 'undefined'){alert("Custom school profile printing is not compatable with Firefox. Use your browser's print options or switch to Google Chrome.")}
		else{		
			var hiddenFrame = $('<iframe id="printWindow" style="display: none"></iframe>').appendTo('body')[0];
			hiddenFrame.contentWindow.printAndRemove = function() {
			//document.getElementById('printWindow').contentWindow.printAndRemove = function() {
				hiddenFrame.contentWindow.print();
				$(hiddenFrame).remove();
			};
			var htmlDocument = "<!doctype html>"+
						"<html><head>"
						+ '<link rel="stylesheet" type="text/css" href="https://apsinsights.org/wp-content/uploads/2018/03/c3.min_.css" media="all" />'
						+ '<link rel="stylesheet" type="text/css" href="https://apsinsights.org/wp-content/uploads/2018/03/custom_w3.css" media="all" />'
						+ '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" media="all" />'
						+ '<link rel="stylesheet" type="text/css" href="https://apsinsights.org/documents/2018/03/printschoolprofilestyle.css" media="all" />'
						+ '</head><body onload="printAndRemove();">' // Print only after document is loaded
						+ document.getElementById("displayContent2").innerHTML
						+ '</body>'
						+ "</html>";
			var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
			doc.write(htmlDocument);
			doc.close();
		}
	
	}
		
	 //Step 2: Make filter
	 
	//this code runs on load and calls the above functions
		//it also includes onchange actions to update acording to filter changes
	
	var filterCount = 0;
	
	//record all of the html so we can wipe it and rewrite it
	var schoolFilterHtml = document.getElementById("schoolFilters").innerHTML;
	var postFilterHtml = document.getElementById("postFilter").innerHTML;
		
	/**
	*This function is run when a user selects a grade level, and then kicks off the school filters.
	*@memberof General
	*/
	function filterLevel(){
		
		filterCount++;
	
		//remove "Select a Grade Level"
		if(filterCount==1){
			var filter = document.getElementById("levelFilter");
			filter.remove(0); //removes first element in list
			
			$("#levelGap").css("display","none")
			
			$("#levelFilter").css("box-shadow", "0px 0px 0px white")
			//$(".chosen-container").css("box-shadow", "0px 0px 8px orange")
		}
		
		var level = document.getElementById("levelFilter").value;
		
		//drop previous data, etc...
		$("#schoolFilters").empty();
		$("#postFilter").empty();
		$("#displayContent2").empty();
		
		//re-write html
		document.getElementById("displayContent").innerHTML = schoolFilterHtml;	
		
		//show spinner while data for school filter loads
		$('.loader').css("visibility","visible");
		
		//the timeout is set at 0 seconds. this is a trick to get js to render the spinner command above instead of waiting for everything in the parent function to execute
		setTimeout(function(){
			
			//load school messages. how can we re-write so we don't load message again if grade level filter changes?
			d3.csv("https://github.com/johnkeltz/aps-school-profiles/blob/master/resources/school%20messages.csv", function(error, messages){
				
				//load data. how can we re-write so we don't load data again if grade level filter changes?
				d3.csv("https://github.com/johnkeltz/aps-school-profiles/blob/master/resources/school%20data.csv", function(error, schoolData) {
					
					var data = [];
					data.push(schoolData[0]); //push "select a school" row
					for(var i = 1; i < schoolData.length; i++) {
						if(schoolData[i].grade_cluster === level) {
							data.push(schoolData[i]);	
						}
					}
					
					//blank out first row
					data[0].schoolname = "";
					
					//set id and class
					var select = d3.select("#filter")
						.append("select")
						.attr("class","school_select")

					/*find max year*/
					var maxYearAny = 0
					
					for(var i = 0; i < data.length; i++) {	
						if(data[i].year > maxYearAny && data[i].year != "3 Year Avg"){
							maxYearAny = data[i].year;
						}
					}
						
					/*new array of current schools only*/
					var data2 = [];
					 for(var i = 0; i < data.length; i++) {
						if(data[i].year === maxYearAny && data[i].school!="Atlanta" && data[i].school!="Georgia") {
							data2.push(data[i]);
						}
					}
					
					//make html option list for drop down
					select.selectAll("option")
					  .data(data2)
					  .enter()
						.append("option")
						.attr("ccrpi_score", function (d) { return d.value; })
						.text(function (d) { return d.schoolname; });
									
					//use chosen to display filter list	
					//$('.school_select').chosen({ width: "290px" });
					
					$('.school_select').select2({
						placeholder:"Select a School",
						matcher: function(params, data) {
							return matchStart(params, data);
						},
						width: "290px"
					});
					
					//record that this is first time generating the filter list, so we know to drop "select school" text only once
					var use = 1;
							
					//Step 3: make graphs after school selection
					
					//get selected school	
					//after initial load, most interactivity happens here...
					//make first graphs after school select
				
					//$('.school_select').chosen().change(function(){
					//$('.school_select').selectize().change(function(){
					
					$('.school_select').change(function(){
					
						var selectedSchool = $(this).find("option:selected").val();
					
						//show spinner while graphs load
						$('.loader').css("visibility","visible");
						
						setTimeout(function(){
							
							$("#schoolGap").css("display","none")
							
							$(".hideCompare").css("display","inline");
							
							//re-write html
							document.getElementById("displayContent2").innerHTML = postFilterHtml;	
							
							//drop HS content
							if(level != 'High'){$("#highDiv").empty();}
							
							//Step 3.1 make graphs
							//find max year value for each field	
							
							if(use==1){
								maxCCRPIYear = maxYear("ccrpi_score",data).replace(/\s/g, '');
								maxMilesYear = maxYear("ela",data);
								maxSGPYear = maxYear("ela_sgp",data).replace(/\s/g, '');
								maxBTOYear = maxYear("bto_score",data).replace(/\s/g, '');
								maxAttYear = maxYear("attend",data).replace(/\s/g, '');
								maxRaceYear = maxYear("black",data).replace(/\s/g, '');
								maxSubgroupYear = maxYear("swd",data).replace(/\s/g, '');
								maxMobilityYear = maxYear("mobility",data).replace(/\s/g, '');
								maxDirectCertYear = maxYear("direct_cert",data).replace(/\s/g, '');
								maxClimateYear = maxYear("like_school",data).replace(/\s/g, '');
								if(level=="High"){maxGradYear = maxYear("grad_rate",data).replace(/\s/g, '');}
							};
							
										
							//create variables now so they're available more globally
							var compareSchool;
							var compareSchoolName;
							
							/////get names and values			
							selectedSchoolName = shortName(selectedSchool,data2);
							
							//print school title
							//schoolTitle
							document.getElementById("schoolTitle").innerHTML = selectedSchool;	
							
							//get school message
							schoolMessage = getMessage(selectedSchoolName,messages);
							if(schoolMessage){document.getElementById("schoolMessage").innerHTML = "<br>" + schoolMessage;}
							
							//use schoolData to check for multiple grade bands
							levelMessage = checkLevels(selectedSchool,schoolData,level)
							
							if(levelMessage){document.getElementById("levelMessage").innerHTML = levelMessage + "<br><br>";}
							
							ccrpiMatrix = arrayValues("ccrpi_score",selectedSchool,compareSchool,maxCCRPIYear,data);
							ccrpiBarColor = colorArray(ccrpiMatrix)
							
							elaMatrix = arrayValues("ela",selectedSchool,compareSchool,maxMilesYear,data)
							mathMatrix = arrayValues("math",selectedSchool,compareSchool,maxMilesYear,data)
							elaBarColor = colorArray(elaMatrix)
							mathBarColor = colorArray(mathMatrix)
							
							elaSGPMatrix = arrayValues("ela_sgp",selectedSchool,compareSchool,maxSGPYear,data)
							mathSGPMatrix = arrayValues("math_sgp",selectedSchool,compareSchool,maxSGPYear,data)
							elaSGPBarColor = colorArray(elaSGPMatrix)
							mathSGPBarColor = colorArray(mathSGPMatrix)
							
							btoMatrix = arrayValues("bto_score",selectedSchool,compareSchool,maxBTOYear,data)
							btoBarColor = btoColorArray(btoMatrix,maxBTOYear,data)
							
							attMatrix = arrayValues("attend",selectedSchool,compareSchool,maxAttYear,data)
							attBarColor = attColorArray(attMatrix)
							
							likeSchoolMatrix = arrayValues("like_school",selectedSchool,compareSchool,maxClimateYear,data)
							likeSchoolBarColor = attColorArray(likeSchoolMatrix)
							
							safeSchoolMatrix = arrayValues("safe_school",selectedSchool,compareSchool,maxClimateYear,data)
							safeSchoolBarColor = attColorArray(safeSchoolMatrix)
							
							tempRaceMatrix = raceArrayValues(selectedSchool,data)
							var race0 = tempRaceMatrix[0].slice(0);
							var race1 = tempRaceMatrix[1].slice(0);
							var raceMatrix = [race0,race1];  
							raceBarColor = simpleColorArray(raceMatrix)

							subgroupMatrix = subgroupArrayValues(selectedSchool,data);
							subgroupBarColor = simpleColorArray(subgroupMatrix);
							
							
							//////make graphs and text		
							barGraph(ccrpiMatrix,ccrpiBarColor,'.1f','#ccrpiGraph'); 
							ccrpiText(ccrpiMatrix[0][1], ccrpiMatrix[1][1], maxCCRPIYear);
							
							barGraph(elaMatrix,elaBarColor,'.0%','#elaMilesGraph');
							barGraph(mathMatrix,mathBarColor,'.0%','#mathMilesGraph');	
							milesText(mathMatrix[0][1], Math.round(elaMatrix[1][1]*100), Math.round(mathMatrix[1][1]*100), maxMilesYear);
							
							barGraph(elaSGPMatrix,elaSGPBarColor,'.0%','#elaSGPGraph');
							barGraph(mathSGPMatrix,mathSGPBarColor,'.0%','#mathSGPGraph');				
							sgpText(mathSGPMatrix[0][1], Math.round(mathSGPMatrix[1][1]*100), maxSGPYear);
							
							barGraph(btoMatrix,btoBarColor,'.1f','#btoGraph');
							btoText(btoMatrix[0][1],btoMatrix[1][1],maxBTOYear);

							barGraph(attMatrix,attBarColor,'.0%','#attGraph');
							attText(attMatrix[0][1],Math.round(attMatrix[1][1]*100),maxAttYear);
							
							barGraph(likeSchoolMatrix,likeSchoolBarColor,'.0%','#likeSchoolGraph');
							barGraph(safeSchoolMatrix,safeSchoolBarColor,'.0%','#safeSchoolGraph');	
							climateText(safeSchoolMatrix[0][1],Math.round(safeSchoolMatrix[1][1]*100),maxClimateYear);
							
							barGraph(raceMatrix,raceBarColor,'.0%','#raceGraph');
							raceText(selectedSchoolName,compareSchoolName,maxRaceYear);
							//document.getElementById("raceLabel").innerHTML = selectedSchoolName; 		
							
							barGraph(subgroupMatrix,subgroupBarColor,'.0%','#subgroupGraph');
							subgroupText(maxSubgroupYear,maxMobilityYear,maxDirectCertYear);
							
							if(level=="High"){
								gradMatrix = arrayValues("grad_rate",selectedSchool,compareSchool,maxGradYear,data);
								gradBarColor = colorArray(gradMatrix)
								barGraph(gradMatrix,gradBarColor,'.0%','#gradGraph'); 
								gradText(gradMatrix[0][1], Math.round(gradMatrix[1][1]*100), maxGradYear);
							}
							
							//Step 3.2 generate and reset buttons
							//only generate buttons once
							//if(use==1){
							makeButtons("ccrpi","ccrpi_score","ccrpiButtonGroup",data)
							makeButtons("miles","ela","milesButtonGroup",data)
							makeButtons("sgp","ela_sgp","sgpButtonGroup",data)
							makeButtons("bto","bto_score","btoButtonGroup",data)
							makeButtons("att","attend","attButtonGroup",data)
							makeButtons("climate","like_school","climateButtonGroup",data)
							if(level=="High"){makeButtons("grad","grad_rate","gradButtonGroup",data)}
							//};
							
							//reset buttons
							buttonUpdate(maxMilesYear,"miles");
							buttonUpdate(maxCCRPIYear,"ccrpi");
							buttonUpdate(maxSGPYear,"sgp");
							buttonUpdate(maxBTOYear,"bto");
							buttonUpdate(maxAttYear,"att");
							buttonUpdate(maxClimateYear,"climate");
							if(level=="High"){buttonUpdate(maxGradYear,"grad");}

							//unhide buttons
							$(".hideGroup").css("display","block");
							$(".hideGroup1").css("display","inline");
									
							//switch back to bar if line was selected
							switchToLine()
							
							//Step 3.3 drop "select a school" row from school list
							//check if this is the first time using the filter
							/*
							if(use==1){
								//remove first list element
								$(".school_select").find("option").eq(0).remove();
								//update chosen list
								$('.school_select').trigger("chosen:updated");
							};
							*/
							
							//Step 3.4 make line graphs (Milestones)

							var elaYearArray = yearData("ela",data)
							var elaLineArray = lineData("ela",selectedSchool,compareSchool,data,elaYearArray)
							var elaColorArray = lineColorArray("ela",elaLineArray)
							
							lineGraph(elaLineArray,elaYearArray, elaColorArray, 'English', '#elaLineGraph')
							
							var mathYearArray = yearData("math",data)
							var mathLineArray = lineData("math",selectedSchool,compareSchool,data,mathYearArray)
							var mathColorArray = lineColorArray("math",mathLineArray)
							
							lineGraph(mathLineArray,mathYearArray, mathColorArray, 'Math', '#mathLineGraph')
							
							var enrollYearArray = yearData("enrollment",data)
							var enrollLineArray = lineData("enrollment",selectedSchool,compareSchool,data,enrollYearArray)
							var enrollColorArray = lineColorArray("enrollment",enrollLineArray)
							
							lineGraph(enrollLineArray,enrollYearArray, enrollColorArray, null, '#enrollGraph')
							enrollText(enrollLineArray,enrollYearArray)
											

							//Step 3.5: Line/bar graph toggle buttons
							
							$("#milesLine").on('click',function(){
								switchToLine()		

								//this fixes a sizing bug in d3...
								//https://github.com/krispo/angular-nvd3/issues/40
								var event
								if (typeof Event === 'function') {
								  event = new Event('resize')
								} else {
								  event = document.createEvent('Event')
								  event.initEvent('resize', true, true)
								}
								window.dispatchEvent(event)
								
							});
							
							$("#milesBar").on('click',function(){
								switchToBar()				
							});
							
							//variable to record that there is no comparison school selected
							var compareSchoolIndicator = 0;
							
							//end of intial graph generation
							
							//make variable here so it is semi-global
							var use2;
							
								
							//Step 4: Add comparison school
							if(use > 1){
								//wipe out second chosen filter so we can regenerate
								//remove entire div
								$("#filter2").remove();
								
								//then replace div...
								var div = d3.select("#filter2Parent")
									.append("div")
									.attr("id","filter2")
									.attr("class","w3-container w3-padding-small")
							};
								
							var select = d3.select("#filter2")
								.append("select")
								.attr("class","school_select2")

								
							//make html option list for drop down
							select.selectAll("option")
								.data(data2)
								.enter()
								.append("option")
								.attr("ccrpi_score", function (d) { return d.value; })
								.text(function (d) { return d.schoolname; });

							//replace "select a school" with "Optional: Add Comparison School"
							//$(".school_select2").find("option").eq(0).text('Add Comparison School?');	
							
							//record ahead of time that this is first time generating the comparison filter list, so we know to drop "select school" text only once
							use2 = 1;
							
							//don't set original school as an option
							for(var i = 0; i < data2.length; i++) {
								if(data2[i].schoolname === selectedSchool) {
								$(".school_select2").find("option").eq(i).remove();
								}
							}		
							
							//use chosen to display filter list	
							//$('.school_select2').chosen({ width: "290px" });
							
							$('.school_select2').select2({
								placeholder:"Add Comparison School?",
								matcher: function(params, data) {
									return matchStart(params, data);
								},
								width: "290px"
							});
							
							use++;
							
							//////make a new graph if a comparison school is selected
							//$('.school_select2').chosen().change(function(){
							$('.school_select2').change(function(){
								compareSchool = $(this).find("option:selected").val();
							
								$('.loader').css("visibility","visible");
						
								setTimeout(function(){
							
									compareSchoolName = shortName(compareSchool,data2);
												
									document.getElementById("schoolTitle").innerHTML = selectedSchool + "<span style='font-size:80% !important'><br>and<br></span>" + compareSchool;	
												
									//set indicator that there is a comparison school...
									compareSchoolIndicator = 1;
												
									//drop comparison school text
									/*
									if(use2==1){
										//remove first list element
										$(".school_select2").find("option").eq(0).remove();
										//update chosen list
										$('.school_select2').trigger("chosen:updated");
									};
									*/
									use2++;
									
									//get school message
									compareSchoolMessage = getMessage(compareSchoolName,messages);
									if(compareSchoolMessage){		
										document.getElementById("compareMessage").innerHTML = "<br>" + compareSchoolMessage;	
									}
									
									//reset main school values
									ccrpiMatrix = arrayValues("ccrpi_score",selectedSchool,compareSchool,maxCCRPIYear,data);	//allows compare school to be null
									ccrpiBarColor = colorArray(ccrpiMatrix);
									
									elaMatrix = arrayValues("ela",selectedSchool,compareSchool,maxMilesYear,data)
									mathMatrix = arrayValues("math",selectedSchool,compareSchool,maxMilesYear,data)
									elaBarColor = colorArray(elaMatrix)
									mathBarColor = colorArray(mathMatrix)
									
									elaSGPMatrix = arrayValues("ela_sgp",selectedSchool,compareSchool,maxSGPYear,data)
									mathSGPMatrix = arrayValues("math_sgp",selectedSchool,compareSchool,maxSGPYear,data)
									elaSGPBarColor = colorArray(elaSGPMatrix)
									mathSGPBarColor = colorArray(mathSGPMatrix)
									
									btoMatrix = arrayValues("bto_score",selectedSchool,compareSchool,maxBTOYear,data)
									btoBarColor = btoColorArray(btoMatrix,maxBTOYear,data)
									
									attMatrix = arrayValues("attend",selectedSchool,compareSchool,maxAttYear,data)
									attBarColor = attColorArray(attMatrix)						
								
									likeSchoolMatrix = arrayValues("like_school",selectedSchool,compareSchool,maxClimateYear,data)
									likeSchoolBarColor = attColorArray(likeSchoolMatrix)
									
									safeSchoolMatrix = arrayValues("safe_school",selectedSchool,compareSchool,maxClimateYear,data)
									safeSchoolBarColor = attColorArray(safeSchoolMatrix)
									
									tempCompareRaceMatrix = raceArrayValues(compareSchool,data)
									var line0 = tempCompareRaceMatrix[0].slice(0);
									var line1 = tempCompareRaceMatrix[1].slice(0);
									var compareRaceMatrix = [line0,line1];  
									//compareRaceBarColor = simpleColorArray(compareRaceMatrix)
									
									//combineRaceArray(selectedSchoolName,compareSchoolName,raceMatrix,compareRaceMatrix);
									fullRaceMatrix = combineRaceArray(selectedSchoolName,compareSchoolName,raceMatrix,compareRaceMatrix);
									
									compareSubgroupMatrix = subgroupArrayValues(compareSchool,data);
									//switch "value" to schoolname
									subgroupMatrix[1][0] = selectedSchoolName
									compareSubgroupMatrix[1][0] = compareSchoolName
									fullSubgroupMatrix =[subgroupMatrix[0],subgroupMatrix[1],compareSubgroupMatrix[1]]

									//make graphs and text	
									barGraph(ccrpiMatrix,ccrpiBarColor,'.1f','#ccrpiGraph'); 
									ccrpiText(ccrpiMatrix[0][1], ccrpiMatrix[1][1], maxCCRPIYear);
									
									barGraph(elaMatrix,elaBarColor,'.0%','#elaMilesGraph');
									barGraph(mathMatrix,mathBarColor,'.0%','#mathMilesGraph');	
									milesText(mathMatrix[0][1], Math.round(elaMatrix[1][1]*100), Math.round(mathMatrix[1][1]*100), maxMilesYear);
									
									barGraph(elaSGPMatrix,elaSGPBarColor,'.0%','#elaSGPGraph');
									barGraph(mathSGPMatrix,mathSGPBarColor,'.0%','#mathSGPGraph');	
									sgpText(mathSGPMatrix[0][1], Math.round(mathSGPMatrix[1][1]*100), maxSGPYear);
									
									barGraph(btoMatrix,btoBarColor,'.1f','#btoGraph');
									btoText(btoMatrix[0][1],btoMatrix[1][1],maxBTOYear);
									
									barGraph(attMatrix,attBarColor,'.0%','#attGraph');
									attText(attMatrix[0][1],Math.round(attMatrix[1][1]*100),maxAttYear);
									
									barGraph(likeSchoolMatrix,likeSchoolBarColor,'.0%','#likeSchoolGraph');
									barGraph(safeSchoolMatrix,safeSchoolBarColor,'.0%','#safeSchoolGraph');	
									climateText(safeSchoolMatrix[0][1],Math.round(safeSchoolMatrix[1][1]*100),maxClimateYear);
										
									barGraph2(fullRaceMatrix,'.0%','#raceGraph');
									raceText(selectedSchoolName,compareSchoolName,maxRaceYear);
									//document.getElementById("compareRaceLabel").innerHTML = compareSchoolName; 
									
									barGraph2(fullSubgroupMatrix,'.0%','#subgroupGraph');
									
									if(level=="High"){
										gradMatrix = arrayValues("grad_rate",selectedSchool,compareSchool,maxGradYear,data);
										gradBarColor = colorArray(gradMatrix)
										barGraph(gradMatrix,gradBarColor,'.0%','#gradGraph'); 
										gradText(gradMatrix[0][1], Math.round(gradMatrix[1][1]*100), maxGradYear);
									}
									
									//resets buttons		
									buttonUpdate(maxMilesYear,"miles");
									buttonUpdate(maxCCRPIYear,"ccrpi");
									buttonUpdate(maxSGPYear,"sgp");
									buttonUpdate(maxBTOYear,"bto");
									buttonUpdate(maxAttYear,"attend");
									if(level=="High"){buttonUpdate(maxGradYear,"grad");}
									
									//switch back to line if bar was selected
									switchToLine();
									
									//make new line graphs
									var elaYearArray = yearData("ela",data)
									var elaLineArray = lineData("ela",selectedSchool,compareSchool,data,elaYearArray)
									var elaColorArray = lineColorArray("ela",elaLineArray)
									
									lineGraph(elaLineArray,elaYearArray, elaColorArray, 'English', '#elaLineGraph')
									
									var mathYearArray = yearData("math",data)
									var mathLineArray = lineData("math",selectedSchool,compareSchool,data,mathYearArray)
									var mathColorArray = lineColorArray("math",mathLineArray)
									
									lineGraph(mathLineArray,mathYearArray, mathColorArray, 'Math', '#mathLineGraph')
									
									
									var enrollYearArray = yearData("enrollment",data)
									var enrollLineArray = lineData("enrollment",selectedSchool,compareSchool,data,enrollYearArray)
									var enrollColorArray = lineColorArray("enrollment",enrollLineArray)
									
									lineGraph(enrollLineArray,enrollYearArray, enrollColorArray, null, '#enrollGraph')
									enrollText(enrollLineArray,enrollYearArray)
									
									$('.loader').css("visibility","hidden");
							
								}, 0);
								
							});
							
							//Step 5: Update graphs from year buttons
							
							//Step 5.1: CCRPI year buttons
							$(".ccrpiYearButtons").on('click',function(){
							
								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"ccrpi");
								
								//update ccrpi
								ccrpiMatrix = arrayValues("ccrpi_score",selectedSchool,compareSchool,year,data);	//allows compare school to be null
							
								ccrpiBarColor = colorArray(ccrpiMatrix)
							
								barGraph(ccrpiMatrix,ccrpiBarColor,'.1f','#ccrpiGraph'); 
								
								ccrpiText(ccrpiMatrix[0][1], ccrpiMatrix[1][1], year);
							})
							
							
							//Step 5.2: Milestones year buttons
							$(".milesYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"miles");
								
								elaMatrix = arrayValues("ela",selectedSchool,compareSchool,year,data)
								mathMatrix = arrayValues("math",selectedSchool,compareSchool,year,data)
								
								elaBarColor = colorArray(elaMatrix)
								mathBarColor = colorArray(mathMatrix)
										
								barGraph(elaMatrix,elaBarColor,'.0%','#elaMilesGraph');
								barGraph(mathMatrix,mathBarColor,'.0%','#mathMilesGraph');	
								
								milesText(mathMatrix[0][1], Math.round(elaMatrix[1][1]*100), Math.round(mathMatrix[1][1]*100), year);
							})
							
							
							//Step 5.3: SGP year buttons
							$(".sgpYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"sgp");
							
								elaSGPMatrix = arrayValues("ela_sgp",selectedSchool,compareSchool,year,data)
								mathSGPMatrix = arrayValues("math_sgp",selectedSchool,compareSchool,year,data)
								
								elaSGPBarColor = colorArray(elaSGPMatrix)
								mathSGPBarColor = colorArray(mathSGPMatrix)
										
								barGraph(elaSGPMatrix,elaSGPBarColor,'.0%','#elaSGPGraph');
								barGraph(mathSGPMatrix,mathSGPBarColor,'.0%','#mathSGPGraph');	
								
								sgpText(mathSGPMatrix[0][1], Math.round(mathSGPMatrix[1][1]*100), year);
							
							})
							
							//Step 5.4: BTO year buttons
							$(".btoYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"bto");
								
								btoMatrix = arrayValues("bto_score",selectedSchool,compareSchool,year,data)
								btoBarColor = btoColorArray(btoMatrix,year,data)
								
								/*
								//update arguments for graph if no comparison school
								if (compareSchoolIndicator == 0){
									btoBarColor = [btoColor(selectedSchool,year,data)];
								};
									
								//update arguments for graph if there is a comparison school
								if (compareSchoolIndicator == 1){
									btoBarColor = [btoColor(selectedSchool,year,data),btoColor(compareSchool,year,data)];
								};
									*/		
											
								barGraph(btoMatrix,btoBarColor,'.1f','#btoGraph');
								btoText(btoMatrix[0][1],btoMatrix[1][1],year);
								
							});
							
							//Step 5.5: Graduation year buttons
							$(".gradYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"grad");
								
								gradMatrix = arrayValues("grad_rate",selectedSchool,compareSchool,year,data)
								gradBarColor = colorArray(gradMatrix)	
							
								barGraph(gradMatrix,gradBarColor,'.0%','#gradGraph');
								gradText(gradMatrix[0][1],Math.round(gradMatrix[1][1]*100),year);
								
							});
							
							//Step 5.6: Att year buttons
							$(".attYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"att");
								
								attMatrix = arrayValues("attend",selectedSchool,compareSchool,year,data)
								attBarColor = attColorArray(attMatrix)	
							
								barGraph(attMatrix,attBarColor,'.0%','#attGraph');
								attText(attMatrix[0][1],Math.round(attMatrix[1][1]*100),year);
								
							});
												
							//Step 5.7: Climate year buttons
							$(".climateYearButtons").on('click',function(){

								//update year
								var year = $(this).val();
								
								//make selected button bold
								buttonUpdate(year,"climate");
								
								likeSchoolMatrix = arrayValues("like_school",selectedSchool,compareSchool,year,data)
								likeSchoolBarColor = attColorArray(likeSchoolMatrix)
								
								safeSchoolMatrix = arrayValues("safe_school",selectedSchool,compareSchool,year,data)
								safeSchoolBarColor = attColorArray(safeSchoolMatrix)
								
								barGraph(likeSchoolMatrix,likeSchoolBarColor,'.0%','#likeSchoolGraph');
								barGraph(safeSchoolMatrix,safeSchoolBarColor,'.0%','#safeSchoolGraph');	
								climateText(safeSchoolMatrix[0][1],safeSchoolMatrix[1][1]*100,maxClimateYear);
								
							
							});
							
							$('.loader').css("visibility","hidden");
							
						}, 0);	
						
					});
					
				
				}) //data load close
				
			})

			$('.loader').css("visibility","hidden");
			
		}, 0);	
		
	}
