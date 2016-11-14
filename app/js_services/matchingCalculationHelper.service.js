angular.module("thehonorclub")
  .factory("$matchingCalculationHelper", function () {
    var CEIL = 1000,
        WEIGHT_SKILLS = 0.4,
        WEIGHT_POSITIONS = 0.6;



    function cmpFunc(x, y) {
      return y.weight - x.weight;
    }



    return function (user, team) {
      var mapUserSkills, mapUserPositions;

      for (i in user["skills"]) {
        mapUserSkills[user["skills"][i]] = 1;
      }

      for (i in user["desired_positions"]) {
        mapUserPositions[user["desired_positions"][i]] = 1;
      }

      var teamSkills = [],
        teamPositions = [];

      var teamSkillCount = 0,
        teamPositionCount = 0;

      var matchSkillScore, matchPositionScore;

      var mostMatchedSkills = [],
        mostMatchedPositions = [];
      var tmp;

      for (sk in team["skills_needed"]) {
        tmp = CEIL - team["skills_needed"][sk];

        teamSkills.push({
          name: sk,
          weight: tmp
        });

        teamSkillCount += tmp;
      }

      for (pos in team["positions_needed"]) {
        tmp = CEIL - team["positions_needed"][pos];

        teamPositions.push({
          name: pos,
          weight: tmp
        });

        teamPositionCount += tmp;
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
        matching_score: WEIGHT_SKILLS * matchSkillScore + WEIGHT_POSITIONS * matchPositionScore,
        most_matched_skills: mostMatchedSkills,
        most_matched_positions: mostMatchedPositions
      }

    };

  });