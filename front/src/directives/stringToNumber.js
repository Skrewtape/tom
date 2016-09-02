//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.string_to_number', []);
angular.module('tom_directives.string_to_number').directive('stringToNumber', function() {
 return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
          console.log('in parser : '+value);
          return '' + value;
      });
        ngModel.$formatters.push(function(value) {
            new_value = value.split(",").join(".");
            console.log('in formatter : '+parseFloat(new_value));                        
            return parseFloat(new_value);
      });
    }
 };
});
