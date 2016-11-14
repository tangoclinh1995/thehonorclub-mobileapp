angular.module("thehonorclub")
.factory("$tagStandardizeHelper", function() {
  return function(tag) {
    tag = tag.trim().toLowerCase();

    while (tag.indexOf("  ") != -1) {
      tag = tag.replace("  ", " ");
    };

    return tag;
  };

});