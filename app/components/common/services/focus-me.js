app.directive('focusMeDetails', function($timeout) {
    return {
      scope: { trigger: '=focusMeDetails' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if(value === true) { 
            //console.log('trigger',value);
            //$timeout(function() {
              element[0].focus();
              scope.trigger = false;
            //});
          }
        });
      }
    };
});