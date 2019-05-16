angular.module('app')
.factory('utils', ['growl', '$location', '$filter',
    function (growl, $location, $filter) {
        var obj = {};
        var dics;
        var isLogin;

        var getData = function (key) {
            return obj[key];
        }

        var setData = function (key, value) {
            obj[key] = value;
        }

        var getTime = function() {
            var time = $filter('date')(new Date(), 'HH:mm:ss');
            return time;
        }
        var getDate = function() {
            var date = $filter('date')(new Date(), 'dd.MM.yyyy');
            return date;
        }
        var checkReturn = function(ret) {
            if(ret.MSGTY === "W") {
                growl.warning(ret.MSGTX)
            } else if (ret.MSGTY === "E") {
                growl.error(ret.MSGTX)
            } 
            return ret.MSGTY === "S"
        }
        var getDicsDesc = function(key, id) {
            if(dics !== undefined && dics[key]) {
                var findDesc = _.find(dics[key], function(obj) {
                    return obj[key+"ID"] === id
                })
                if(findDesc) {
                    return findDesc.DESC
                } else {
                return id
                }
            } else {
                return id;
            }
        }
        var setDics = function(d) {
            dics = d;
        }
        var getDics = function() {
            return dics;
        }
        var checkLogin = function() {
            if(!isLogin) {
                $location.path('/')
                return false;
            } else {
                console.log("You are logged")
                return true;
            }
        }
        var authUser = function() {
            isLogin = true
        }
        
    return {
        setData: setData,
        getData: getData,
        checkReturn: checkReturn,
        getDicsDesc: getDicsDesc,
        setDics: setDics,
        getDics: getDics,
        getTime: getTime,
        getDate: getDate,
        checkLogin: checkLogin,
        authUser: authUser
    }
}])