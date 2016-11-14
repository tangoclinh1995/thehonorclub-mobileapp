angular.module("thehonorclub")
  .factory("$matchingCalculationHelper", function () {
    var CEIL = 1000,
        WEIGHT_SKILLS = 0.45,
        WEIGHT_POSITIONS = 0.55;



    function cmpFunc(x, y) {
      return y.weight - x.weight;
    }



    return function (user, team) {
      var mapUserSkills = {},
          mapUserPositions = {};

      for (var i = 0, len = user["skills"].length; i < len; ++i) {
        mapUserSkills[user["skills"][i]] = 1;
      }

      for (var i = 0, len = user["desired_positions"].length; i < len; ++i) {
        mapUserPositions[user["desired_positions"][i]] = 1;
      }

      var teamSkills = [],
        teamPositions = [];

      var teamSkillCount = 0,
        teamPositionCount = 0;

      var matchSkillScore, matchPositionScore;

      var mostMatchedSkills = [],
        mostMatchedPositions = [],
        maxNum;
      
      maxNum = 0;
      for (sk in team["skills_needed"]) {
        maxNum = Math.max(maxNum, team["skills_needed"][sk]);

        teamSkills.push({
          name: sk,
          weight: team["skills_needed"][sk]
        });

      }

      for (var i = 0, len = teamSkills.length; i < len; ++i) {
        teamSkills[i].weight = maxNum + 1 - teamSkills[i].weight;
        teamSkillCount += teamSkills[i].weight;  
      }

      maxNum = 0;
      for (pos in team["positions_needed"]) {
        maxNum = Math.max(maxNum, team["positions_needed"][pos]);

        teamPositions.push({
          name: pos,
          weight: team["positions_needed"][pos]
        });

      }

      for (var i = 0, len = teamPositions.length; i < len; ++i) {
        teamPositions[i].weight = maxNum + 1 - teamPositions[i].weight;
        teamSkillCount += teamSkills[i].weight;  
      }

      teamSkills.sort(cmpFunc);
      teamPositions.sort(cmpFunc);      

      matchSkillScore = 0;
      matchPositionScore = 0;

      for (var i = 0, len = teamSkills.length; i < len; ++i) {
        teamSkills[i].weight /= teamSkillCount;

        if (mapUserSkills[teamSkills[i].name]) {
          matchSkillScore += teamSkills[i].weight;
          
          if (mostMatchedSkills.length < 2) {
            mostMatchedSkills.push(teamSkills[i].name);
          }

        }

      }

      for (var i = 0, len = teamPositions.length; i < len; ++i) {
        teamPositions[i].weight /= teamPositionCount;

        if (mapUserPositions[teamPositions[i].name]) {
          matchPositionScore += teamPositions[i].weight;

          if (mostMatchedPositions.length < 2) {
            mostMatchedPositions.push(teamPositions[i].name);
          }

        }

      }

      return {
        matching_score: Math.round((WEIGHT_SKILLS * matchSkillScore + WEIGHT_POSITIONS * matchPositionScore) * 100),
        most_matched_skills: mostMatchedSkills,
        most_matched_positions: mostMatchedPositions
      }

    };

  });