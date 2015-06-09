(function () {
	'use strict';

	var pasteque = function(globalFunction) {
			return {
        restrict: 'E',
				scope: {
					data: "=",
					type: "@"
				},
				link: function(scope, element, attrs) {
					var container = document.createElement('div');
					container.className = "containerChart";
					var incrementDegre = 0;
					var valueTotal = 1; //1 = 100%

					scope.$watch('data', function(newVal, oldVal) {
				    if(scope.data === undefined) return;
				    //console.log(scope.data);

				    // at this point it is defined, do work
				    switch(scope.type){
				    	case 'pie':
				    		roundedElement(scope.data.value, valueTotal, scope.data.bgColor);
				    		break;
				    	case 'donut':
				    		roundedElement(scope.data.value, valueTotal, scope.data.bgColor);
				    		break;
				    	case 'line':
				    		lineChart(scope.data);
				    		break;
				    	case 'progressbar':
				    		progressBar(scope.data);
				    		break;
				    	default:
				    		console.warn('error !');
				    		break;
				    }
				  }, false);
				  container.className += ' '+scope.type;

				  //Function rounded chart Pie and Donut
	        function roundedElement(objValue, valueTotal, bgColor) {
	        	var elementCount = document.createElement('div');
	        	elementCount.className = 'mask count';
	        	var percentValue = globalFunction.convertPercent(objValue, valueTotal);
	        	var degreValue = globalFunction.convertDegre(percentValue);
	        	var interval = 360 - degreValue;


	        	var childElement = document.createElement('div');
	        	childElement.className = 'round '+ bgColor;
						
	        	if(incrementDegre > 0) {
	        		elementCount.style.cssText = 'transform: rotate('+incrementDegre+'deg); -webkit-transform: rotate('+incrementDegre+'deg);';
						}

						childElement.style.cssText = 'transform: rotate('+degreValue+'deg); -webkit-transform: rotate('+degreValue+'deg);';

						if(percentValue > 50) {
							elementCount.className += ' gt50';
							var elementCountCloned = childElement.cloneNode(true);
							elementCountCloned.className += ' fill';
							elementCount.appendChild(elementCountCloned);
						}

						if(scope.type === 'donut') {
							//Add legend
							var percentLegend = document.createElement("span");
							percentLegend.className = "legendDonut";
							percentLegend.textContent = percentValue+"%";
							container.appendChild(percentLegend);
						}

						//Append element
	        	container.appendChild(elementCount);
	        	elementCount.appendChild(childElement);

	        	//Increment value to create a circle
						incrementDegre += degreValue;
	        }

	        function lineChart(objValue) {
						var maxArr;
						var delta;
						var valTemp;
						var dataline = objValue;
						var legend = objValue.legend;
						var heightContainer = container.offsetHeight;
						var yChartLine = document.getElementById('yChartLine');
						var valueChart = document.getElementById('valueChart');
						var LiElementValueWL = (parseFloat(container.offsetWidth)+80)/dataline.xlabel.length;
						var heightLabelY = heightContainer/dataline.xlabel.length;
						var legendUl = document.createElement('ul');
						legendUl.className = 'legendLine ul-reset';
						var ulXLabel = document.createElement('ul');
						var ulYLabel = document.createElement('ul');
						ulXLabel.className = 'xChartLine ul-reset';
						ulYLabel.className = 'yChartLine ul-reset';
						var arrMaxArr = [];

						//Check max Value
						for(var l=0; l<dataline.lines.length; l++) {
							maxArr = parseFloat(Math.ceil(globalFunction.getMaxOfArray(dataline.lines[l])/10)*10);
							arrMaxArr.push(maxArr);
						}

						maxArr = parseFloat(Math.ceil(globalFunction.getMaxOfArray(arrMaxArr)/10)*10);
						delta = maxArr/dataline.xlabel.length;

						//Create points
						for(var j=0; j<dataline.lines.length; j++) {
							var ulElementData = document.createElement('ul');
							ulElementData.className = "valueChart ul-reset line-"+(j+1);
							
							for(var k=0; k<dataline.lines[j].length; k++) {
								var liElementData = document.createElement('li');
								var spanText = document.createElement('span');
								spanText.className = 'textLineData';
								spanText.textContent = dataline.lines[j][k];
								liElementData.appendChild(spanText);

								var valueBottom = globalFunction.crossProduct(dataline.lines[j][k], maxArr, heightContainer);

								if(valueBottom < 8) {
									liElementData.className = "upTextLine";
								}

								liElementData.style.cssText = 'bottom:'+valueBottom+'px; width:'+LiElementValueWL+'px; left: '+LiElementValueWL*k+'px;';
								liElementData.setAttribute('data-bottom', valueBottom);
								liElementData.setAttribute('data-left', LiElementValueWL);
								ulElementData.appendChild(liElementData);

							}
							container.appendChild(ulElementData);
						}
						
						//Create label X and Y
						for (var i=0; i<dataline.xlabel.length; i++) {
							var liElementX = document.createElement('li');
							liElementX.textContent = dataline.xlabel[i];
							liElementX.style.cssText = 'width:'+LiElementValueWL+'px';
							ulXLabel.appendChild(liElementX);

							var valueY = maxArr - delta*i;
							var liElementY = document.createElement('li');
							liElementY.textContent = valueY + '%';
							liElementY.style.cssText = 'height:'+heightLabelY+'px;';
							ulYLabel.appendChild(liElementY);
						}

						container.appendChild(ulYLabel);
						container.appendChild(ulXLabel);
 
						var liElementParse = document.querySelectorAll('.valueChart li');

						//Create line
						Array.prototype.forEach.call(liElementParse, function(li) {
							var adjVal;
							var result;
							
							if(li.nextElementSibling !== null) {
								var nextBottomValue = li.nextElementSibling.getAttribute('data-bottom');
							  var leftValue = li.getAttribute('data-left');
							  var bottomValue = li.getAttribute('data-bottom');
							  var spanElement = document.createElement('span');
							  spanElement.className = 'lineSpan';
							  if(parseFloat(nextBottomValue) > parseFloat(bottomValue)) {
							  	adjVal = nextBottomValue - bottomValue;
							  	result = -(Math.atan(adjVal/leftValue) * 180/Math.PI);
							  }else {
							  	adjVal = bottomValue - nextBottomValue;
							  	result = 90-(Math.atan(leftValue/adjVal) * 180/Math.PI);
							  }
							  var hypVal = Math.sqrt(Math.pow(adjVal, 2) + Math.pow(leftValue, 2));
							  spanElement.style.cssText = 'transform: rotate('+result+'deg); width:'+hypVal+'px;';
							  li.appendChild(spanElement);

						  }
						});
						
						//Create legend
						for(var m = 0; m < legend.length; m++) {
							var liLegend = document.createElement('li');
							liLegend.className = 'legend-'+(m+1);
							liLegend.textContent = legend[m];
							legendUl.appendChild(liLegend);
						}

						container.appendChild(legendUl);

	        }

	        function progressBar(objValue) {
	        	var progressEl = document.createElement('ul');
	        	progressEl.className = "ul-reset";
	        	//console.log(objValue);
	        	for(var o in objValue) {
	        		//console.log(o);
	        		var liElement = document.createElement('li');
	        		var legend = document.createElement('span');
	        		legend.textContent = objValue[o].legend;
	        		legend.className = "legend";
	        		liElement.appendChild(legend);

	        		var progEl = document.createElement('div');
	        		progEl.className = "progressbarContainer";
	        		var value = document.createElement('div');
	        		value.className = "valueProgress";
	        		var spanValue = document.createElement('span');
	        		var convertedValue = globalFunction.convertPercent(objValue[o].value, 1);
	        		value.style.width = convertedValue + "%";
	        		spanValue.textContent = convertedValue + "%";
	        		value.appendChild(spanValue);
	        		progEl.appendChild(value);

	        		liElement.appendChild(progEl);
	        		progressEl.appendChild(liElement);
	        	}
	        	container.appendChild(progressEl);
	        }

	        // Append to DOM
	        //console.log(container);
	        element.append(container);
	        
				}
    	};
	};

	module.exports = pasteque;

}());