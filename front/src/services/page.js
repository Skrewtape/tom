/*global app*/
//poop page
angular.module('tom_services.page', []);
angular.module('tom_services.page').factory('Page', function() {
    var title = '';
    var logged_in_user = {};
    var mobile_navbar_title = '';
    return {
	title: function() { return title; },
	set_title: function(new_title) { title = new_title; },
        logged_in_user: function() { return logged_in_user; },
        set_logged_in_user: function(new_user) { logged_in_user = new_user; },
        has_role: function(role) { 
            return logged_in_user && logged_in_user.roles && (
                logged_in_user.roles.indexOf(role) != -1
            );
        },
    };
});