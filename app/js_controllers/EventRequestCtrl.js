angular.module("thehonorclub") 
.controller('EventRequestCtrl', function($scope, ionicTimePicker, ionicDatePicker) {

  var startTimeObj = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.startTime = ("0" + selectedTime.getUTCHours()).slice(-2) + ":" + ("0" + selectedTime.getUTCMinutes()).slice(-2);
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
        $scope.endTime = ("0" + selectedTime.getUTCHours()).slice(-2) + ":" + ("0" + selectedTime.getUTCMinutes()).slice(-2);
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
  };

  var startDateObj = {
    callback: function (val) {  //Mandatory
      var selectedStartDate = new Date(val);
      console.log(selectedStartDate);
      $scope.startDate = selectedStartDate.getFullYear() + "/" + ("0" + (selectedStartDate.getMonth() + 1)).slice(-2) + "/" + ("0" + selectedStartDate.getDate()).slice(-2);
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
      $scope.endDate = selectedEndDate.getFullYear() + "/" + ("0" + (selectedEndDate.getMonth() + 1)).slice(-2) + "/" + ("0" + selectedEndDate.getDate()).slice(-2);
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
    ionicTimePicker.openTimePicker(endTimeObj);
  };

  $scope.callStartDatePicker = function() {
    ionicDatePicker.openDatePicker(startDateObj);
  };

  $scope.callEndDatePicker = function() {
    endDateObj.from = new Date($scope.startDate);
    ionicDatePicker.openDatePicker(endDateObj);
  };

});