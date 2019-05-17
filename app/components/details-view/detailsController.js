app.controller("detailsController", ["$uibModal", "$scope", "$location", "growl", "modalConfirm", "modalAlert",
	"dataprovider", "utils", "spinnerService", "$rootScope", "$routeParams", function ($uibModal, $scope, $location, growl, modalConfirm,
		modalAlert, dataprovider, utils, spinnerService, $rootScope, $routeParams) {

		if (!utils.checkLogin()) return; // przerwanie jeżeli nie jestem zalogowany
		var idleTime = 0;
		var response = utils.getData('response');
		$scope.empInfo = response[0].ES_HEADER;
		$scope.passwords = response[0].PASSWORDS;
		$scope.index = 0;

		//Increment the idle time counter every minute.
		var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

		//Zero the idle timer on mouse movement.
		$('body').mousemove(function (e) {
			idleTime = 0;
		});
		$('body').keypress(function (e) {
			idleTime = 0;
		});

		function timerIncrement() {
			idleTime = idleTime + 1;
			if (idleTime > 5) { // 5 minutes
				logout();
				clearInterval(idleInterval)
			}
		}
		var ctrl = function() {

		}
		var modalOptions = {
			templateUrl: 'components/details-view/addEntry.html',
			windowClass: 'app-modal-window',
			controller: ctrl,
			keyboard: false,
			backdrop: 'static'
		};
		
		$scope.addModal = function() {
			return $uibModal.open(modalOptions).result;
		}

		$scope.send = function () {
			spinnerService.show();
			var payload = {SITE: $scope.name, PASS: $scope.pass, PERNR: $scope.empInfo.PERNR}

			dataprovider.saveCardData(payload).then(function success(response) {
				if (response.data.ET_RETURN) {
					if (utils.checkReturn(response.data.ET_RETURN)) {
						spinnerService.hide();
						setTimeout(function () {
							growl.success(response.data.ET_RETURN.MSGTX)
						})
						$scope.clearInput();
					} else {
						spinnerService.hide();
						growl.error(response.data.ET_RETURN.MSGTX)
					}
				} else {
					spinnerService.hide();
					growl.error('Wystapił nieoczekiwany błąd.')
					return;
				}
			})
		}

		$scope.clearInput = function () {
			$scope.name = "";
			$scope.pass = "";
		}

		//logout
		var logout = function () {
			$location.path('/');
		}

		$scope.logout = function () {
			modalConfirm.modalConfirm("Czy na pewno chcesz się wylogować?").result.then(function ok() {
				logout();
			}, function cancel() {
			});
		}
	}])