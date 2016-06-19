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
  <span></span>
</div>
<div ui-view="backbutton"></div>
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
 	     },
             'backbutton\@$full_module_name':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton\@$full_module_name':{
               templateUrl: 'shared_html/not_backbutton.html'
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





