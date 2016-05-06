angular.module('tom_directives.purchase_tickets_button', []);
angular.module('tom_directives.purchase_tickets_button').directive('purchaseTicketsbutton', function() {
    return {
	require: '^^purchaseTickets',
	templateUrl: 'directives/purchase_tickets_button.html',
	controller: function($scope, $element, $attrs){
	    $scope.tokenType=$attrs.tokentype;
	    $scope.resourceType=$attrs.resourcetype;
	    $scope.divisionIdName=$attrs.divisionidname;
	}
    };
});;

