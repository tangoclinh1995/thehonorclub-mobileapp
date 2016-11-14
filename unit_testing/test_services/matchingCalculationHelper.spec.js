describe("$matchingCalculationHelper", function() {
  var TESTING_DATA = [
    {
      user: {
        skills: ["a", "c"],
        desired_position: ["d"]
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
        skills: [],
        desired_position: []
      },
      team: {
        skills_needed: {
        },
        positions_needed: {

        },
      },
      test_result: {
        matching_score: 1,
        most_matched_skills: [],
        most_matched_positions: []
      }

    },

    {
      user: {
        skills: [],
        desired_position: []
      },
      team: {
        skills_needed: {
        },
        positions_needed: {

        },
      },
      test_result: {
        matching_score: 1,
        most_matched_skills: [],
        most_matched_positions: []
      }

    },

    {
      user: {
        skills: [],
        desired_position: []
      },
      team: {
        skills_needed: {
        },
        positions_needed: {

        },
      },
      test_result: {
        matching_score: 1,
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
    for (var i = 0, len = TESTING_DATA.length; i < 1; ++i) {
      var result = $matchingCalculationHelper(TESTING_DATA[i].user, TESTING_DATA[i].team);

      console.log(result);

      expect(result).toEqual(TESTING_DATA[i].test_result);
    }

  });

});