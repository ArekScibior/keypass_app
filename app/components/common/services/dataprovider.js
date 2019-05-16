app.factory('dataprovider', ['$http', '$q',  
    function ($http, $q) {
        var serverUrl = 'http://127.0.0.1:8081/z_back/z_back_rest_api?sap-client=010&FUNCTION='; //lokalnie
 
        var checkCardData = function (payload) {
            var moduleName = 'Z_CARD_CHECK' 
            var url = serverUrl + moduleName; 
            return $http.post(url, payload);
        }

        var registerUser = function (payload) {
            var moduleName = 'Z_CARD_USER_REGISTER' 
            var url = serverUrl + moduleName; 
            return $http.post(url, payload);
        }
        
        var getCardData = function (payload) {
            var moduleName = 'Z_CARD_DATA_GET' 
            var url = serverUrl + moduleName; 
            return $http.post(url, payload);
        }

        var saveCardData = function (payload) {
            var moduleName = 'Z_CARD_DATA_SET' 
            var url = serverUrl + moduleName;      
            console.log('data', payload)     
            return $http.post(url, payload);
        }

        var methods = {
            getCardData: getCardData,
            saveCardData: saveCardData,
            checkCardData: checkCardData,
            registerUser: registerUser
        }
        return methods;
    }
]);

 

