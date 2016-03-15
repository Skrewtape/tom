app.controller(
    'tournament',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('List Tournaments');        
        $scope.tournaments = undefined;
        $scope.tournament = {single_division:false,tournament_name:''};
        $http.get('[APIHOST]/tournament',{timeout:5000}).success(
            function(data) {
                $scope.tournaments = data;                
            }
        );
        
        $scope.setTournamentActive = function(tournament){
            StatusModal.loading();
            if(tournament.active==true){
                $http.put('[APIHOST]/tournament/'+tournament.tournament_id+'/begin',{},{timeout:5000}).success(
                    function(active) {
                        StatusModal.loaded();
                    }
                );                
            }else{
                $http.put('[APIHOST]/tournament/'+tournament.tournament_id+'/end',{},{timeout:5000}).success(
                    function(deactive) {
                        StatusModal.loaded();                                                
                    }
                );                
            }
        };
        
        $scope.create_division = function(tournament){
            StatusModal.loading();
            $http.post('[APIHOST]/division',{division_name: tournament.new_division_name,tournament_id: tournament.tournament_id},{timeout:5000}).success(
                function(data){
                    StatusModal.loaded();
                    console.log('success');
                    tournament.new_division_name = undefined;
		    if(tournament.divisions == undefined){
			tournament.divisions = [];
		    }
                    tournament.divisions.push(data);
                });
        };
        $scope.create_tournament = function(){            
            StatusModal.loading();
            $http.post('[APIHOST]/tournament',{tournament_name: $scope.tournament.tournament_name,single_division: $scope.tournament.single_division},{timeout:5000}).success(
                function(data){
                    console.log('success');
                    tournament_name = $scope.tournament_name;
                    single_division = $scope.single_division;
                    $scope.tournament_name = undefined;
                    $scope.single_division = undefined;
                    $scope.tournaments[data.tournament_id]=data;
                    StatusModal.loaded();
                });
            };
            
        });
