#!/usr/bin/perl

if (@ARGV < 2){
    print "Uh oh - don't forget - arg 1 is full controller name and arg 2 is path to index.js\n";
    die;
} 
sub generate_controller {
    $controller_name = $_[0];    
    @controller_components = ($controller_name =~ m/([^\.]+)/g);
    return @controller_components;
}

sub generate_routes_controller_string {
    my $controller_string = $_[0];
    my $controller_url_string = $_[1];
    my $routes_controller_string = <<"END_CONTROLLER";
.state('$controller_string', 
       { 
	 url: '$controller_url_string',
	 views: {
	     '\@': {
	       templateUrl: '$controller_string.html',
	       controller: '$controller_string',
	     }
	   }
       })//REPLACE_ME
END_CONTROLLER
return $routes_controller_string;
}

sub make_and_append_to_routes_file {
    $routes_file_name = $_[0];
    $routes_controller_string = $_[1];
    $controller_name = $_[2];
    
    open($input1,'<', "$routes_file_name");
    $old_file="";
    while($line = <$input1>){
	if ($line=~ /\'$controller_name\'/){
	    return;
	}
	$line=~ s/\/\/REPLACE_ME/$routes_controller_string/;
	$old_file=$old_file.$line;
    }
    close input1;
    open($output1,'>',"$routes_file_name");
    print $output1 $old_file;
    close $output1;
}

sub make_controller_and_html_file {
    $controller_name = $_[0];
    $controller_base = <<"END_CONTROLLER";
app.controller(
    '$controller_name',
    function(\$scope, \$http, \$uibModal, \$state, \$location, Page, StatusModal) {
        Page.set_title('');
	\$scope.get_all_params(\$scope);
        //\$scope.back_string = ''
})
END_CONTROLLER
    open($output1,'>',"$controller_name.js");
    print $output1 $controller_base;
    close $output1;
    open($output1,'>',"$controller_name.html");
    close $output1;    
}

$route_base_config = <<'END_ROUTES';
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider//REPLACE_ME
})
END_ROUTES

my $controller_string = $ARGV[0];
my @controller_components_full = generate_controller($controller_string);

$routes_file_name = "routes_$controller_components_full[0].$controller_components_full[1].js";
if (!-e $routes_file_name){
    open($output1,'>',$routes_file_name);
    print $output1 $route_base_config;
    close $output1;
}

for($controller_component_index=1;$controller_component_index<@controller_components_full;$controller_component_index++){
    @controller_components_subset = @controller_components_full[0..$controller_component_index];
    my $controller_string = join('.',@controller_components_subset);
    if($controller_component_index == 1){
	$prepend_slash = '';
    }  else {
	$prepend_slash = '/';
    }
    my $controller_url_string = $prepend_slash.$controller_components_subset[$#controller_components_subset];
    my $routes_controller_string = generate_routes_controller_string($controller_string,$controller_url_string);
    make_and_append_to_routes_file($routes_file_name,$routes_controller_string,$controller_string);
    make_controller_and_html_file($controller_string);
    open($output1,'>>',"$ARGV[1]");
    print $output1 "\nrequire('./".$controller_string.".js')";
    close $output1;
}





