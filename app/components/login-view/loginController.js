app.controller("loginController", ["$scope", "$location", "$http", "growl", "dataprovider", "utils", "spinnerService", "$routeParams", 'validator',
    function ($scope, $location, $http, growl, dataprovider, utils, spinnerService, $routeParams, validator) {


        $scope.userName = "";
        $scope.userPassword = "";
        $scope.registerName = "";
        $scope.registerPass = "";
        $scope.registerPassRepeat = "";
        $scope.showLogIn = true;
        

        (function () {
            $scope.onAddAttachment = async function () {
                $scope.filesToDisplay = []
                var files = document.getElementById('files').files;
                console.time('start')
                var packs = _.chunk(files, 30)
                for (var i = 0; i <= packs.length; i++) {
                    await getBase64AndSend(packs[i])
                        .then(async function (response) {
                            $scope.filesToDisplay.push(response)
                            $scope.filesToDisplay = _.flatten($scope.filesToDisplay)
                            loadNewFiles($scope.filesToDisplay)
                        })
                    console.log('filesToDisplay', $scope.filesToDisplay)
                }
                console.timeEnd('start')
            }
            
            loadNewFiles = function (data){
                $scope.filesToDisplay = data;      
                $scope.$apply();
            }

            var getBase64AndSend, sendFiles;

            getBase64AndSend = function (files, idx) {
                return new Promise(function (resolve, reject) {
                    var filesToSend, length;
                    length = 0;
                    filesToSend = [];
                    return _.each(files, function (v) {
                        var base64Output, reader;
                        length++;
                        length = length;
                        reader = new FileReader();
                        reader.readAsDataURL(v);
                        base64Output = "";
                        return reader.onload = async function () {
                            var outputFile;
                            console.log('onLoad');
                            idx = reader.result.indexOf('base64,') + 7;
                            base64Output = reader.result.slice(idx, reader.result.length);
                            outputFile = {
                                data: base64Output,
                                fileName: v.name
                            };
                            filesToSend.push(outputFile);
                            if (files.length === filesToSend.length) {
                                // here send to server
                                var pickedNames = _.map(filesToSend, function(currentObject) { return _.pick(currentObject, "fileName"); });
                                $http.get('https://jsonplaceholder.typicode.com/todos/1').then(function(response) {
                                    console.log('response', response)
                                    setTimeout(function() { resolve(pickedNames)},4000)
                                })
                                //     var pickedNames = _.map(filesToSend, function(currentObject) { return _.pick(currentObject, "fileName"); });
                                //     resolve(pickedNames)
                                // },2000);
                            }
                        };
                    });
                });
            };

        }).call(this);


        $scope.register = function (showLogIn) {
            if (showLogIn) {
                $scope.showLogIn = false
                clearInputLogin();
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
            if (!showLogIn) {
                $scope.showLogIn = true
                clearInputRegister();
                return;
            }
            console.log('loging..')

            var validLogin = validator.validateLogin({
                name: $scope.userName,
                pass: $scope.userPassword,
            })

            if (!validLogin) return;

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

        var clearInputLogin = function () {
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