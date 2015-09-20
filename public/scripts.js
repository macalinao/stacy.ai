angular.module('stacy', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  }).state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl'
  });

  $urlRouterProvider.otherwise('/chat');

})

.controller('HomeCtrl', function($scope) {
})

.controller('ChatCtrl', function($scope) {

  $scope.messages = [{
    who: 'from',
    msg: 'Test'
  }, {
    who: 'to',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }, {
    who: 'to',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }];

  $scope.sendMsg = function() {
    addMsg('from', $scope.chatMsg);
    $scope.chatMsg = '';
  };

  function addMsg(who, msg) {
    $scope.messages.push({
      who: who,
      msg: msg
    });
    onUpdateMsg();
  }

  function onUpdateMsg() {
    var el = $('#chatMessages')[0];
    el.scrollTop = el.scrollHeight;
  }

});
