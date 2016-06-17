angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.player_add', {
            url: '/player_add',
            views: {
                '@': {
                    templateUrl: 'app/player_add/player_add.html',
                    controller: 'app.player_add',
                },
		'backbutton@app.player_add':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
		'player_add_progress@app.player_add':{
                    templateUrl: 'app/player_add/player_add_progress.html',		    
		}
            }
	}).state(
        'app.player_add.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'app/player_add/process/process.html',
                    controller: 'app.player_add.process',
                },
		'backbutton@app.player_add.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
		'player_add_progress@app.player_add.process':{
                    templateUrl: 'app/player_add/player_add_progress.html',		    
		}

            },
	    params: {
		newPlayerInfo: {}
	    }
	}).state(
        'app.player_add.process.edit_linked_division', {
            url: '/edit_linked_division/:playerId',
            views: {
                '@': {
                    templateUrl: 'app/player_add/process/edit_linked_division/edit_linked_division.html',
                    controller: 'app.player_add.process.edit_linked_division',
                },
		'backbutton@app.player_add.process.edit_linked_division':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add.process.edit_linked_division':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
		'player_add_progress@app.player_add.process.edit_linked_division':{
                    templateUrl: 'app/player_add/player_add_progress.html',		    
		}
            }
	}).state(
        'app.player_add.process.edit_linked_division.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'app/player_add/process/edit_linked_division/process/process.html',
                    controller: 'app.player_add.process.edit_linked_division.process',
                },
		'backbutton@app.player_add.process.edit_linked_division.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add.process.edit_linked_division.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
		'player_add_progress@app.player_add.process.edit_linked_division.process':{
                    templateUrl: 'app/player_add/player_add_progress.html',		    
		}
            },
	    params: {
		divisionId: {}
	    }
	}).state(
        'app.player_add.process.edit_linked_division.process.ticket_purchase', {
            url: '/ticket_purchase',
            views: {
                '@': {
                    templateUrl: 'app/player_add/process/edit_linked_division/process/ticket_purchase/ticket_purchase.html',
                    controller: 'app.player_add.process.edit_linked_division.process.ticket_purchase',
                },
		'backbutton@app.player_add.process.edit_linked_division.process.ticket_purchase':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add.process.edit_linked_division.process.ticket_purchase':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
		'player_add_progress@app.player_add.process.edit_linked_division.process.ticket_purchase':{
                    templateUrl: 'app/player_add/player_add_progress.html',		    
		}
            },
	}).state('app.player_add.process.edit_linked_division.process.ticket_purchase.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_add/process/edit_linked_division/process/ticket_purchase/process/process.html',
 	       controller: 'app.player_add.process.edit_linked_division.process.ticket_purchase.process',
 	     },
		'backbutton@app.player_add.process.edit_linked_division.process.ticket_purchase.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_add.process.edit_linked_division.process.ticket_purchase.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
	     'player_add_progress@app.player_add.process.edit_linked_division.process.ticket_purchase.process':{
                 templateUrl: 'app/player_add/player_add_progress.html',		    
	     }
 	 },
	    params: {addedTokens:{}}
       })//REPLACE_ME

});
