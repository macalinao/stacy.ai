var socket = io();

angular.module('stacy', ['ui.router', 'uiGmapgoogle-maps'])

.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})

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

  $urlRouterProvider.otherwise('/');

})

.controller('HomeCtrl', function($scope, $location) {

  $scope.go = function() {
    if (!$scope.destination) return;
    $location.path('/chat').search('place=' + $scope.destination);
  };

})

.controller('ChatCtrl', function($scope, $location) {

  $scope.messages = [];

  $scope.sendMsg = function() {
    if (!$scope.chatMsg) return;
    sendMsg($scope.chatMsg);
    $scope.chatMsg = '';
  };

  socket.on('msg', function(msg){
    addMsg('to', msg.msg);
    processMsg(msg);
    $scope.$apply();
  });

  function processMsg(msg) {
    // todo process msg
    console.log(msg);
    if (msg.session && msg.session.geocode) {
      var geocode = msg.session.geocode;
      $scope.map.center = {
        latitude: geocode.lat,
        longitude: geocode.lng
      };
    }
  }

  function sendMsg(msg) {
    addMsg('from', msg);
    socket.emit('msg', msg);
  }

  function addMsg(who, msg) {
    $scope.messages.push({
      who: who,
      msg: msg
    });
    onUpdateMsg();
  }

  function onUpdateMsg() {
    var el = $('#chatMessages')[0];
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
  }

  var place = $location.search().place;
  sendMsg('Plan my trip to ' + place + '.');

  $scope.map = {
    center: {
      latitude: 45,
      longitude: -73
    },
    zoom: 13
  };

});
