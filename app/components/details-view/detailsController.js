app.controller("detailsController", ["$uibModal", "$scope", "$location", "growl", "modalConfirm",
	"dataprovider", "utils", "spinnerService", "$rootScope", "$routeParams", function ($uibModal, $scope, $location, growl, modalConfirm, 
		dataprovider, utils, spinnerService, $rootScope, $routeParams) {

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
		var ctrl = function ($scope, $uibModalInstance, data) {
			$scope.newPassword = '';
			$scope.newName = ""

			// var getData = function () {
			// 	dataprovider.refreshData().then(function (response) {
			// 		utils.setData('response', response.data.persons)
			// 		$scope.passwords = response.data.persons[0].PASSWORDS;
			// 	})
			// }

			$scope.send = function () {
				//spinnerService.show();
				var payload = {
					IS_LOGIN: {
						NAME: data.userName.NAME
					},
					DATA: [
						{SITE: $scope.newName, PASSWORD: $scope.newPassword}
					],
					ACTIO: "ADD"
				}
				$uibModalInstance.close(payload)
			}

		}
		var modalOptions = {
			templateUrl: 'components/details-view/addEntry.html',
			windowClass: 'app-modal-window',
			controller: ctrl,
			keyboard: false,
			backdrop: 'static',
			resolve: {
				data : function (){ return {passwords:$scope.passwords, userName: $scope.empInfo }}
			}
		};
		
		var clearInputs = function () {
			$scope.newPassword = '';
			$scope.newName = ""
		}
		
		var sendData = function(data) {
			spinnerService.show()
			addToLocalPasswords = function() {
				_.each(data.DATA, function(v) {
					$scope.passwords.push({SITE: v.SITE, PASSWORD: v.PASSWORD});
				})
			}
			dataprovider.saveCardData(data).then(function success(response) {
				if (response.data.ET_RETURN) {
					if (utils.checkReturn(response.data.ET_RETURN)) {
						spinnerService.hide();
						setTimeout(function () {
							growl.success(response.data.ET_RETURN.MSGTX)
							if (data.ACTIO !== "DEL") {
								addToLocalPasswords();
							}
						})
						$scope.arrToRemove = [];
						clearInputs();
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
		$scope.confirmDelete = function() {
			var payload = {
				IS_LOGIN: {
					NAME: $scope.empInfo.NAME
				},
				DATA: $scope.arrToRemove,
				ACTIO: "DEL"
			}
			sendData(payload)
		}
		$scope.arrToRemove = []
		$scope.removePassword = function(pass) {
			var passInArr = _.find($scope.passwords, function(v) {
				return v.SITE == pass.SITE && v.PASSWORD == pass.PASSWORD;
			})
			$scope.arrToRemove.push(pass)
			if (passInArr) {
				var idx = _.findIndex($scope.passwords, passInArr)
				$scope.passwords.splice(idx, 1)
			}
		}
		$scope.addModal = function() {
			$uibModal.open(modalOptions).result.then(function(data) {
				sendData(data)
			}, function() {
			})
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