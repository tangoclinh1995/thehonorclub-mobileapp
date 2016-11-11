angular.module("thehonorclub") 
.controller('EventRequestCtrl', function($scope, $firebaseArray, ionicTimePicker, ionicDatePicker) {

  var ref = firebase.database().ref().child("event");
  $scope.events = $firebaseArray(ref);

  var startTimeObj = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log(selectedTime);
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
        console.log(selectedTime);
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
      console.log(selectedStartDate);
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
    console.log('Called');
    var startTimeStamp = moment($scope.startDate, "YYYY-MM-DD").unix() + moment($scope.startTime, "HH:mm").unix();
    var endTimeStamp = moment($scope.endDate, "YYYY-MM-DD").unix() + moment($scope.endTime, "HH:mm").unix();

    console.log(startTimeStamp);
    console.log(endTimeStamp);
    $scope.events.$add({
      name: $scope.name,
      description: $scope.description,
      timestamp_begin: startTimeStamp,
      timestamp_end: endTimeStamp,
      min_member_per_team: $scope.minSize,
      max_member_per_team: $scope.maxSize
    });
  };
});