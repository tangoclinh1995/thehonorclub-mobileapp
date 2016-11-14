describe("$matchingCalculationHelper", function() {
  var TESTING_DATA = [
    {
      user: {
        skills: ["a", "c"],
        desired_positions: ["d"]
      },
      team: {
        skills_needed: {
          "b": 1
        },
        positions_needed: {
          "d": 0
        },
      },
      test_result: {
        matching_score: 55,
        most_matched_skills: [],
        most_matched_positions: ["d"]
      }

    },

    {
      user: {
        skills: ["a", "b", "c", "d"],
        desired_positions: ["e"]
      },
      team: {
        skills_needed: {
          "t": 5,
          "b": 1,
          "d": 0
        },
        positions_needed: {
          "f": 1,
          "g": 2
        },
      },
      test_result: {
        matching_score: 41,
        most_matched_skills: ["d", "b"],
        most_matched_positions: []
      }

    },

    {
      user: {
        skills: ["a", "b", "c", "d"],
        desired_positions: ["f"]
      },
      team: {
        skills_needed: {
          "t": 5,
          "b": 1,
          "d": 0
        },
        positions_needed: {
          "f": 1,
          "g": 2
        },
      },
      test_result: {
        matching_score: 78,
        most_matched_skills: ["d", "b"],
        most_matched_positions: ["f"]
      }

    },

    {
      user: {
        skills: ["a", "b"],
        desired_positions: ["t"]
      },
      team: {
        skills_needed: {
          "d": 1,
          "e": 2,
          "f": 5
        },
        positions_needed: {
          "x": 0,
          "y": 3
        },
      },
      test_result: {
        matching_score: 0,
        most_matched_skills: [],
        most_matched_positions: []
      }

    }

  ];



  var $matchingCalculationHelper;

  beforeEach(module("thehonorclub"));

  beforeEach(inject(function(_$matchingCalculationHelper_) {
    $matchingCalculationHelper = _$matchingCalculationHelper_;
  }));

  it("Can result correct result", function() {
    for (var i = 0, len = TESTING_DATA.length; i < len; ++i) {
      var result = $matchingCalculationHelper(TESTING_DATA[i].user, TESTING_DATA[i].team);
      
      expect(result).toEqual(TESTING_DATA[i].test_result);
    }

  });

});