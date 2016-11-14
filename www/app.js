angular.module("thehonorclub", ["ionic", "ionic-datepicker",/* "ionic-timepicker",*/ "firebase", "ionic.contrib.ui.tinderCards"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider/*, ionicTimePickerProvider*/) {
  // Default state
  //$urlRouterProvider.otherwise('/login');
  $urlRouterProvider.otherwise('/evmtRequest');

  // Configure ionic datepicker
  var datePickerObj = {
    inputDate: new Date(),
    titleLabel: 'Select a Date',
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: false,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    from: new Date(2016, 8, 1),
    to: new Date(2020, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

  /*
  // Configure ionic timepicker
  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 15,
    setLabel: 'Set',
    closeLabel: 'Close'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);
  */


}).directive('noScroll', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
}).controller('CardsCtrl', function($scope, TDCardDelegate) {
  var cardTypes = [
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/max.jpg', name: 'Andy', skill: 'AngularJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/ben.png', name: 'Bob', skill: 'NodeJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/perry.jpg', name: 'Charlie', skill: 'Ionic' },
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  }

  $scope.cards = [];
  for(var i = 0; i < 3; i++) $scope.addCard();
}).controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});;
