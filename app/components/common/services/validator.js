angular.module('app')
.factory('validator', ['growl', '$location', '$filter', 'spinnerService',
    function (growl, $location, $filter, spinnerService) {
        
        var validateRegister = function (payload) {
            var valid = true;

            if (payload.name.length < 4) {
                growl.error('The name is too short. 4 characters required.')
                spinnerService.hide();
                valid = false;
                return;
            }
            
            if (payload.pass.length < 6 || payload.confirmPass.length < 6) {
                growl.error('The passwords are too short. 6 characters required.')
                spinnerService.hide();
                valid = false;
                return;
            }

            if (payload.pass !== payload.confirmPass) {
                growl.error('The passwords are different.')
                spinnerService.hide();
                valid = false;
                return;
            }

            return valid;
        }

        var validateLogin = function (payload) {
            var valid = true;

            if (payload.name == "") {
                growl.error('Username cannot be empty.')
                spinnerService.hide();
                valid = false;
                return;
            }

            if (payload.pass == "") {
                growl.error('Password cannot be empty.')
                spinnerService.hide();
                valid = false;
                return;
            }

            if (payload.name.length < 4) {
                growl.error('The name is too short. 4 characters required.')
                spinnerService.hide();
                valid = false;
                return;
            }
            
            if (payload.pass.length < 6) {
                growl.error('The passwords is too short. 6 characters required.')
                spinnerService.hide();
                valid = false;
                return;
            }

            return valid;
        }
   
    return {
        validateRegister: validateRegister,
        validateLogin: validateLogin
    }
}])