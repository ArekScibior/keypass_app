app.directive('currentDate', function () {
	return {
		restrict: 'EA',
		scope: {},
		template: [
            '<div class="row">',
                '<div class="col-md-12">',
                    '<p class="date"> {{dayName}}, {{date}}</p>',
                '</div>',
            '</div>'
		].join(''),
		controller: ["$scope", "$interval", "$filter", function ($scope, $interval, $filter) {

            var getFullDate = function() {
                var date = moment().format('DD.MM.YYYY');
                var time =  moment().format('HH:mm:ss');

                return date + ", " + time;
            }
            // var days = [
            //     {value:1, text:'Poniedziałek'},
            //     {value:2, text:'Wtorek'},
            //     {value:3, text:'Środa'},
            //     {value:4, text:'Czwartek'},
            //     {value:5, text:'Piątek'},
            //     {value:6, text:'Sobota'},
            //     {value:7, text:'Niedziela'}
            // ];
            $interval(function() {
                $scope.date = getFullDate()
                $scope.dayName = moment().locale('en').format('dddd');
            }, 1000)

		}]
	};
});