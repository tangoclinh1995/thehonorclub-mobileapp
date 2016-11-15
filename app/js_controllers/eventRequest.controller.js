angular.module("thehonorclub") 

.controller('EventRequestCtrl', function($scope, ionicTimePicker, ionicDatePicker) {

  var ref = firebase.database().ref().child("event");

  var startTimeObj = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.startTime = moment.utc(selectedTime).format("HH:mm");
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
  };

  var endTimeObj = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.endTime = moment.utc(selectedTime).format("HH:mm");
      }
    },

    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15          //Optional
  };

  var startDateObj = {
    callback: function (val) {  //Mandatory
      var selectedStartDate = new Date(val);
      $scope.startDate = moment.utc(selectedStartDate).format("YYYY-MM-DD");
    },
    from: new Date(2016, 1, 1), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [0],       //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup'       //Optional
  };


  var endDateObj = {
    callback: function (val) {  //Mandatory
      var selectedEndDate = new Date(val);
      $scope.endDate = moment.utc(selectedEndDate).format("YYYY-MM-DD");
    },
    from: new Date(2016, 1, 1), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [0],       //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup'       //Optional
  };

  $scope.startDate = '';
  $scope.endDate = '';
  $scope.startTime = '';
  $scope.endTime = '';

  $scope.callStartTimer = function() {
    ionicTimePicker.openTimePicker(startTimeObj);
  };

  $scope.callEndTimer = function() {
    endTimeObj.from = new Date($scope.startTime);
    ionicTimePicker.openTimePicker(endTimeObj);
  };

  $scope.callStartDatePicker = function() {
    ionicDatePicker.openDatePicker(startDateObj);
  };

  $scope.callEndDatePicker = function() {
    endDateObj.from = new Date($scope.startDate);
    ionicDatePicker.openDatePicker(endDateObj);
  };


  $scope.addEvent = function() {
    var startTimeStamp = moment.utc($scope.startDate, "YYYY-MM-DD Z").add(moment.duration($scope.startTime)).unix();
    //var startTimeStamp = moment($scope.startDate, "YYYY-MM-DD Z").unix();
    var endTimeStamp = moment.utc($scope.endDate, "YYYY-MM-DD Z").add(moment.duration($scope.endTime)).unix();

    var newEventRef = firebase.database().ref().child("event").push();
    newEventRef.set({
      name: $scope.name,
      description: $scope.description,
      timestamp_begin: startTimeStamp,
      timestamp_end: endTimeStamp,
      min_member_per_team: $scope.minSize,
      max_member_per_team: $scope.maxSize,
      email: $scope.email,
      location: $scope.location
    });

  };
})

.config(function(ionicDatePickerProvider, ionicTimePickerProvider) {
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

  // Configure ionic timepicker
  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 15,
    setLabel: 'Set',
    closeLabel: 'Close'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);

});