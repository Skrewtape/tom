/*global app*/
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
        'home.scorekeeper.selectmachine.recordscore', {
            url: '/recordscore/:machineId/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.html',
                    controller: 'scorekeeper_selectmachine_recordscore',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole', {
            url: '/asshole',
            views: {
                '@': {
                    templateUrl: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.html',
                    controller: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process', {
            url: '/good_riddance',
            views: {
                '@': {
                    templateUrl: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process.html',
                    controller: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.void', {
            url: '/void/entryId/:entryId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.void.html',
                    controller: 'scorekeeper_selectmachine_recordscore_void',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.confirm', {
            url: '/entryId/:entryId/newScore/:newScore',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.confirm.html',
                    controller: 'scorekeeper_selectmachine_recordscore_confirm',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.confirm.player_is_an_asshole', {
            url: '/asshole',
            views: {
                '@': {
                    templateUrl: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.html',
                    controller: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.confirm.player_is_an_asshole.process', {
            url: '/good_riddance',
            views: {
                '@': {
                    templateUrl: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process.html',
                    controller: 'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine.recordscore.confirm.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.confirm.process.html',
                    controller: 'scorekeeper_selectmachine_recordscore_confirm_process',
                }
            }
	})
});

