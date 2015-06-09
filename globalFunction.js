(function () {
	'use strict';

	var globalFunction = function() {
		return {
			roundToTwo: function (num) {
				return +(Math.round(num + "e+2")  + "e-2");
			},
			convertPercent: function (number, numberMax) {
				return Math.round((parseFloat(number) / parseFloat(numberMax)) * 100);
			},
			convertDegre: function (value) {
				return this.roundToTwo((parseFloat(value)*360)/100);
			}
		};
	};

	module.exports = globalFunction;
}());