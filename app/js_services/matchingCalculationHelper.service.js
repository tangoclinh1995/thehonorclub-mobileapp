angular.module("thehonorclub")
.factory("$matchingCalculationHelper", function() {
  var CEIL = 1000;        


  return function(user, team) {
    var skills = [],
        positions = [];

    var skillCount = 0,
        positionCount = 0;

    var mostMatchedSkills = [],
        mostMatchedPositions = [];

    for (sk in team["skills_needed"]) {
      skills.push({
        name: sk,
        count: CEIL - team["skills_needed"][sk]
      });

      skillCount += (CEIL - team["skills_needed"][sk]);
    }

    for (pos in team["positions_needed"]) {
      positions.push({
        name: pos,
        count: CEIL - team["positions_needed"][pos]
      });

      positionCount += (CEIL - team["positions_needed"][pos]);
    }

    

  };

});