app.controller("loginController", ["$uibModal", "$scope", "$location", "growl", "modalAlert", "dataprovider", "utils", "spinnerService", "$routeParams", 'validator',
    function ($uibModal, $scope, $location, growl, modalAlert, dataprovider, utils, spinnerService, $routeParams, validator) {


        $scope.userName = "";
        $scope.userPassword = "";
        $scope.registerName = "";
        $scope.registerPass = "";
        $scope.registerPassRepeat = "";
        $scope.showLogIn = true;
        
        $scope.register = function (showLogIn) {
            if(showLogIn) {
                $scope.showLogIn = false
                return;
            }
            spinnerService.show();
            var validRegister = validator.validateRegister({
                pass: $scope.registerPass,
                confirmPass: $scope.registerPassRepeat,
                name: $scope.registerName
            })

            if (!validRegister) return

            var payload = {
                NAME: $scope.registerName,
                PASSWORD: $scope.registerPass
            }

            dataprovider.registerUser(payload).then(function (response) {
                if (response.data.ET_RETURN.MSGTY !== "E") {
                    spinnerService.hide();
                    growl.success(response.data.ET_RETURN.MSGTX)
                    clearInputRegister();
                } else {
                    spinnerService.hide();
                    growl.error(response.data.ET_RETURN.MSGTX)
                }
            })
        }

        $scope.login = function (showLogIn) {
            if(!showLogIn) {
                $scope.showLogIn = true
                return;
            }
            console.log('loging..')
            spinnerService.show();
            var payload = {
                IS_LOGIN: {
                    NAME: $scope.userName,
                    PASS: $scope.userPassword,
                }
            }
            dataprovider.checkCardData(payload).then(function (response) {
                if (response.data.ET_RETURN.TYPE !== "E") {
                    dataprovider.getCardData(payload).then(function (response) {
                        if (response.data.ET_RETURN) {
                            if (utils.checkReturn(response.data.ET_RETURN[0])) {
                                utils.authUser()
                                setTimeout(function () {
                                    growl.success(response.data.ET_RETURN[0].MSGTX)
                                }, 10)
                                utils.setData('response', response.data.persons)
                                
                                spinnerService.hide();
                                goDetails();
                            } else {
                                spinnerService.hide();
                                growl.error(response.data.ET_RETURN[0].MSGTX)
                                $scope.clearInputLogin()
                            }
                        } else {
                            spinnerService.hide();
                            growl.error('Wystąpił nieoczekiwany błąd.')
                        }
                    }).then(function () {
                        spinnerService.hide()
                    });
                } else {
                    spinnerService.hide();
                    growl.error(response.data.ET_RETURN.MSGTX)
                }
            })
        }

        $scope.clearInputLogin = function () {
            $scope.userName = "";
            $scope.userPassword = "";
        }

        var clearInputRegister = function () {
            $scope.registerName = "";
            $scope.registerPass = "";
            $scope.registerPassRepeat = "";
        }

        var goDetails = function () {
            $location.path('/details');
            spinnerService.show()
        };
    }])