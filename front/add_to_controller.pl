#!/usr/bin/perl

# goal : only add end of module path
# parse module into array - done
# get last element - done
# check dir exists, abort if it does - done
# mkdir - done
# output js from template
# output html from template
# put contents into routes
# insert module into parent module dependency

if (@ARGV < 2){
    print "Uh oh - don't forget - arg 1 is full module path ('blah.poop.arrr') and arg 2 is path to top level src dir\n";
    die;
}

$full_module_name = $ARGV[0];
$path_to_src_dir = $ARGV[1];

@module_path_array = split(/\./,$full_module_name);
$new_module = $module_path_array[$#module_path_array];
$parent_module = $module_path_array[$#module_path_array-1];
$parent_module_file_path = $path_to_src_dir.'/'.join('/',@module_path_array[0..$#module_path_array-1]);
$module_file_path = $path_to_src_dir.'/'.join('/',@module_path_array);
$module_relative_file_path = join('/',@module_path_array);
$routes_path = $path_to_src_dir.'/'.join('/',@module_path_array[0..1]);

if(-e $module_file_path){
    print "this is already here\n";
    die;
}

`mkdir -p $module_file_path`;

my $html_string = <<"END_HTML";
<div ui-content-for="title">
  <span>Add Player</span>
</div>
<div  ui-content-for="navbarAction">
    <a ui-sref='^' style='font-size:35px'>
      <i class="fa fa-arrow-circle-left" aria-hidden="true"> </i> Back
    </a>
</div>
<div class="scrollable">
  <!--<div style='background:#AAAAAA' ui-view='player_add_progress'></div>-->
    <div class="scrollable-content"  style='padding:10px'>
    </div>
  </div>
</div>
END_HTML

my $module_string = <<"END_MODULE";
angular.module('$full_module_name',[/*REPLACEMECHILD*/]);
angular.module('$full_module_name').controller(
    '$full_module_name',
    function(\$scope, \$state, StatusModal, TimeoutResources) {
	//\$scope.player_info=\$state.params.newPlayerInfo;
	//if(\$scope.checkForBlankParams(\$scope.player_info) == true){
	//    return;
	//}
	//\$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
END_MODULE

my $new_routes_string = <<"END_NEW_ROUTES";
angular.module('TOMApp').config(function(\$stateProvider, \$urlRouterProvider) {
    \$urlRouterProvider.otherwise('/app');
    
    \$stateProvider//REPLACE_ME
})
END_NEW_ROUTES

my $routes_string = <<"END_CONTROLLER";
.state('$full_module_name', 
        { 
 	 url: '/$new_module',
 	 views: {
 	     '\@': {
 	       templateUrl: '$module_relative_file_path/$new_module.html',
 	       controller: '$full_module_name',
 	     }
 	   }
       })//REPLACE_ME
END_CONTROLLER

open($output1,'>',"$module_file_path/$new_module.js");
print $output1 $module_string;
close output1;
open($output1,'>',"$module_file_path/$new_module.html");
print $output1 $html_string;
close output1;

$old_parent = replace_string_in_file($parent_module_file_path."/$parent_module.js",'\/\*REPLACEMECHILD\*\/',"'$full_module_name',\/*REPLACEMECHILD\*\/");
open($output1,'>',$parent_module_file_path."/$parent_module.js");
print $output1 $old_parent;
close output1;


if(!-e $routes_path."/routes.js"){
    my $output1;
    open($output1,'>',$routes_path."/routes.js");
    print $output1 $new_routes_string;
    close output1;
}
$old_routes = replace_string_in_file($routes_path."/routes.js",'\/\/REPLACE_ME',"$routes_string");
open($output1,'>',$routes_path."/routes.js");
print $output1 $old_routes;
close output1;



sub replace_string_in_file {
    my $file_name = $_[0];
    my $string_to_replace = $_[1];
    my $replacement_string = $_[2];
    my $input1;
    open($input1,'<', "$file_name");
    my $old_file="";
    while($line = <$input1>){
	$line=~ s/$string_to_replace/$replacement_string/;	
	$old_file=$old_file.$line;
    }
    close input1;
    return $old_file;
}

# if (@ARGV < 2){
#     print "Uh oh - don't forget - arg 1 is full controller name and arg 2 is path to index.js\n";
#     die;
# } 
# sub generate_controller {
#     $controller_name = $_[0];    
#     @controller_components = ($controller_name =~ m/([^\.]+)/g);
#     return @controller_components;
# }

# sub generate_routes_controller_string {
#     my $controller_string = $_[0];
#     my $controller_url_string = $_[1];
#     my $routes_controller_string = <<"END_CONTROLLER";
# .state('$controller_string', 
#        { 
# 	 url: '$controller_url_string',
# 	 views: {
# 	     '\@': {
# 	       templateUrl: '$controller_string.html',
# 	       controller: '$controller_string',
# 	     }
# 	   }
#        })//REPLACE_ME
# END_CONTROLLER
# return $routes_controller_string;
# }

# sub make_and_append_to_routes_file {
#     $routes_file_name = $_[0];
#     $routes_controller_string = $_[1];
#     $controller_name = $_[2];
    
#     open($input1,'<', "$routes_file_name");
#     $old_file="";
#     while($line = <$input1>){
# 	if ($line=~ /\'$controller_name\'/){
# 	    return;
# 	}
# 	$line=~ s/\/\/REPLACE_ME/$routes_controller_string/;
# 	$old_file=$old_file.$line;
#     }
#     close input1;
#     open($output1,'>',"$routes_file_name");
#     print $output1 $old_file;
#     close $output1;
# }

# sub make_controller_and_html_file {
#     $controller_name = $_[0];
#     $controller_base = <<"END_CONTROLLER";
# app.controller(
#     '$controller_name',
#     function(\$scope, \$http, \$uibModal, \$state, \$location, Page, StatusModal) {
#         Page.set_title('');
# 	\$scope.get_all_params(\$scope);
#         //\$scope.back_string = ''
# })
# END_CONTROLLER
#     open($output1,'>',"$controller_name.js");
#     print $output1 $controller_base;
#     close $output1;
#     open($output1,'>',"$controller_name.html");
#     close $output1;    
# }

# $route_base_config = <<'END_ROUTES';
# app.config(function($stateProvider, $urlRouterProvider) {
#     $urlRouterProvider.otherwise('/');

#     $stateProvider//REPLACE_ME
# })
# END_ROUTES

# my $controller_string = $ARGV[0];
# my @controller_components_full = generate_controller($controller_string);

# $routes_file_name = "routes_$controller_components_full[0].$controller_components_full[1].js";
# if (!-e $routes_file_name){
#     open($output1,'>',$routes_file_name);
#     print $output1 $route_base_config;
#     close $output1;
# }

# for($controller_component_index=1;$controller_component_index<@controller_components_full;$controller_component_index++){
#     @controller_components_subset = @controller_components_full[0..$controller_component_index];
#     my $controller_string = join('.',@controller_components_subset);
#     if($controller_component_index == 1){
# 	$prepend_slash = '';
#     }  else {
# 	$prepend_slash = '/';
#     }
#     my $controller_url_string = $prepend_slash.$controller_components_subset[$#controller_components_subset];
#     my $routes_controller_string = generate_routes_controller_string($controller_string,$controller_url_string);
#     make_and_append_to_routes_file($routes_file_name,$routes_controller_string,$controller_string);
#     make_controller_and_html_file($controller_string);
#     open($output1,'>>',"$ARGV[1]");
#     print $output1 "\nrequire('./".$controller_string.".js')";
#     close $output1;
# }





