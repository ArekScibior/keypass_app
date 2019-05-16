angular.module('app')

.factory('spinnerService', [
    function () {
	
	var _spinner = {
		counter: 0
	};
	
	var show = function () {
	    _spinner.counter++;
	};
	
	var hide = function () {
	    if (_spinner.counter === 0) return;
	    _spinner.counter--;
	};
	
	var reset = function () {
	    _spinner.counter = 0;
	};
	
	return {
	    show: show,
	    hide: hide,
	    reset: reset,
	    object: _spinner
	};
    }
]);