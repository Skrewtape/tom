app.controller(
    'results_home_divisions_results',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        $scope.division_id=$state.params.divisionId;
	$scope.division_name=$state.params.divisionName;
	$scope.tournament_name=$state.params.tournamentName;
	if($scope.division_name == 'all'){
	    breadcrumb_string = $scope.tournament_name+', Division '+$scope.division_name+' Rankings';
	} else {
	    breadcrumb_string = $scope.tournament_name+' Rankings';
	}
	params = [];
	params.push({name:'divisionId',value:$scope.division_id});
//	params.push({name:'divisionId',value:$scope.tournament_name});
//	params.push({name:'divisionId',value:$scope.division_id});
	$scope.add_to_bobo_breadcrumbs({route:$state.current.name,title:breadcrumb_string,params:params})
	
	$scope.get_rankings = function(){
            $http.get('[APIHOST]/division/'+$scope.division_id+'/rankings',{timeout:5000}).success(
                function(data) {
                    $scope.rankings = data.rankings;
		    StatusModal.loaded()
                }
            );
        };
	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {
                    $scope.machines = data;
		    $scope.get_rankings()
                }
            );
        };
	$scope.get_players = function(){
            $http.get('[APIHOST]/player',{timeout:5000}).success(
                function(data) {
		    console.log(data)
                    $scope.players = data.players;
		    $scope.get_machines()
                }
            );
        };
	

	StatusModal.loading();
        $scope.get_players();

	//StatusModal.loading();
        //$scope.get_tournaments();
                
    });
