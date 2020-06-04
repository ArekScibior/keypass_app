app.controller("detailsController", ["$uibModal", "$scope", "$location", "growl", "modalConfirm",
	"dataprovider", "utils", "spinnerService", "$rootScope", "$routeParams", function ($uibModal, $scope, $location, growl, modalConfirm, 
		dataprovider, utils, spinnerService, $rootScope, $routeParams) {

		if (!utils.checkLogin()) return; // przerwanie jeżeli nie jestem zalogowany
		var idleTime = 0;
		var response = utils.getData('response');
		$scope.empInfo = response[0].ES_HEADER;
		$scope.passwords = response[0].PASSWORDS;
		$scope.index = 0;
		var initPasswords = response[0].PASSWORDS.slice();
		$scope.isInit = false;

		$scope.arrToRemove = []
		$scope.arrToAdd = []
		

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

			$scope.send = function () {
				var objToAdd = {SITE: $scope.newName, PASSWORD: $scope.newPassword}
				if ($scope.newName == "" || $scope.newPassword == "") {
					growl.error('Please, fill in all fields.')
				} else {
					$uibModalInstance.close(objToAdd)
				}
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
		
		var getData = function() {
			var payload = {IS_LOGIN: $scope.empInfo}
			dataprovider.getCardData(payload).then(function (response) {
				if (response.data.ET_RETURN) {
					if (utils.checkReturn(response.data.ET_RETURN[0])) {
						$scope.passwords = response.data.persons[0].PASSWORDS
						initPasswords = response.data.persons[0].PASSWORDS.slice();
					}
				}
			})
		}
		var sendData = function(data) {
			spinnerService.show()
			dataprovider.saveCardData(data).then(function success(response) {
				if (response.data.ET_RETURN) {
					if (utils.checkReturn(response.data.ET_RETURN)) {
						spinnerService.hide();
						setTimeout(function () {
							growl.success(response.data.ET_RETURN.MSGTX)
							getData()
							if (data.ACTIO == "ADD") {
								$scope.arrToAdd = [];
							} else {
								$scope.arrToRemove = [];
							}
						})
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

		$scope.$watch('passwords', function(nv, ov) {
			_.each(nv, function(v) {
				_.omit(v, '$$hashKey')
			})
			_.each(initPasswords, function(v) {
				_.omit(v, '$$hashKey')
			})

			//sprawdzenie czy hasła do usunięcia pochodza z serwera czy sa lokalne.
			var isInInit = _.some($scope.arrToRemove, function(v) {
				return _.contains(initPasswords, v)
			})
			//jeżeli są lokalne i nie ma ich w początkowych hasłach z serwera ustawiamy tablicę na pustą.
			if (!isInInit) {
				$scope.arrToRemove = [];
			}
			if (JSON.stringify(nv)==JSON.stringify(initPasswords)) {
				$scope.isInit = true;
				$scope.arrToRemove = [];
				$scope.arrToAdd = [];
			} else {
				$scope.isInit = false;
			}
		},true)

		$scope.restore = function () {
			_.each($scope.arrToRemove, function(v) {
				$scope.passwords.push(v)
			})
			$scope.arrToRemove = [];
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

		$scope.confirmAdd = function() {
			var payload = {
				IS_LOGIN: {
					NAME: $scope.empInfo.NAME
				},
				DATA: $scope.arrToAdd,
				ACTIO: "ADD"
			}
			sendData(payload)
		}

		$scope.removePassword = function(pass) {
			var passInArr = _.find($scope.passwords, function(v) {
				return v.SITE == pass.SITE && v.PASSWORD == pass.PASSWORD;
			})
			$scope.arrToRemove.push(pass)

			//usunięcie lokalnych haseł z tablicy do dodania jezeli to hasło zostało usunięte
			var removeFromAdd = _.contains($scope.arrToAdd, pass)
			if (removeFromAdd) {
				var idx = _.findIndex($scope.arrToAdd, pass)
				$scope.arrToAdd.splice(idx, 1)
			}

			if (passInArr) {
				var idx = _.findIndex($scope.passwords, passInArr)
				$scope.passwords.splice(idx, 1)
			}
		}
		$scope.addPassword = function() {
			$uibModal.open(modalOptions).result.then(function(data) {
				$scope.arrToAdd.push(data)
				$scope.passwords.push(data)
			}, function() {
			})
		}

		//logout
		var logout = function () {
			$location.path('/');
		}

		$scope.logout = function () {
			modalConfirm.modalConfirm("Are you sure you want to log out?").result.then(function ok() {
				logout();
			}, function cancel() {
			});
		}
	}])