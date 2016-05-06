angular.module('tom_directives.purchase_tickets_summary_button', []);
angular.module('tom_directives.purchase_tickets_summary_button').directive('purchaseTicketssummarybutton', function() {
    return {
	require: '^^purchaseTickets',
	templateUrl: 'directives/purchase_tickets_summary_button.html',
	controller: function($scope, $element, $attrs){
	    $scope.tokenType=$attrs.tokentype;
	    $scope.resourceType=$attrs.resourcetype;
	    $scope.divisionIdName=$attrs.divisionidname;
	}
    };
});;

