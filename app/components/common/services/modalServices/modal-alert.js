app.factory('modalAlert', ['$uibModal', function( $uibModal) {
    
        return {
            openModalAlert: function(message) {  
                var modalInstance = $uibModal.open({
                    controller:  ["$uibModalInstance","$scope",function($uibModalInstance, $scope) {
                        $scope.message = message
                        $scope.ok = function() {
                            $uibModalInstance.close();
                        }
            
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        }
                    }],
                    size: 'md',
                    keyboard: false,
                    backdrop: 'static',
                    templateUrl: 'components/modals-temp/modal-alert.html'
                })
            }
        }
    }])