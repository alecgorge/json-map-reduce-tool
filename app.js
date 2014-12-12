Array.prototype.move = function(old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

var container = document.getElementById('jsoneditor');
var container2 = document.getElementById('jsoneditor2');

var options = {
  mode: 'tree',
  modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
  error: function(err) {
    alert(err.toString());
  }
};

new_editor = ace.edit("new-editor");
edit_editor = ace.edit("edit-editor");

function ctrler($scope) {
  $scope.items = [
    {
      "type": "filter",
      "name": "Songs named Possum",
      "code": "function (object) {\n  return object.Title.indexOf('Possum') === 0;\n}\n"
    }
  ];

  $scope.data = {};
  $scope.data.name = "";
  $scope.data.edit_name = "";
  $scope.editing = false;
  $scope.editing_index = -1;
  $scope.is_horiz = true;

  $scope.edit = function(i) {
    $scope.editing = true;
    $scope.editing_index = i;
    $scope.data.edit_name = $scope.items[i].name;
    edit_editor.getSession().setValue($scope.items[i].code);
  }

  $scope.save = function() {
    localStorage["json"] = editor.getText();
    localStorage["data"] = JSON.stringify($scope.items);
    localStorage["new_editor"] = JSON.stringify(new_editor.getSession().getValue());
    localStorage["is_horiz"] = JSON.stringify($scope.is_horiz);
  }

  $scope.hydrate = function() {
    if (localStorage["json"]) editor.setText(localStorage["json"]);
    if (localStorage["data"]) $scope.items = JSON.parse(localStorage["data"]);
    if (localStorage["new_editor"]) new_editor.getSession().setValue(JSON.parse(localStorage["new_editor"]));
    if (localStorage["is_horiz"]) $scope.is_horiz = JSON.parse(localStorage["new_editor"]);
  }

  $scope.moveUp = function(i) {
    $scope.items.move(i, i - 1);
    $scope.save();
  }
  $scope.moveDown = function(i) {
    $scope.items.move(i, i + 1);
    $scope.save();
  }
  $scope.delete = function(i) {
    $scope.items.splice(i, 1);
    $scope.save();
  }

  $scope.switchToAdd = function() {
    $scope.data.edit_name = "";
    edit_editor.getSession().setValue("");
    $scope.editing = false;
  }

  $scope.add = function(type) {
    if ($scope.editing) {
      if ($scope.data.edit_name.length == 0) {
        alert("Name this operation!");
        return;
      }

      $scope.items[$scope.editing_index] = {
        "type": type,
        "name": $scope.data.edit_name,
        "code": edit_editor.getSession().getValue()
      };

      return;
    }

    if ($scope.data.name.length == 0) {
      alert("Name this operation!");
      return;
    }

    $scope.items.push({
      "type": type,
      "name": $scope.data.name,
      "code": new_editor.getSession().getValue()
    });

    $scope.data.name = "";
    new_editor.getSession().setValue("function (object) {\n  return object;\n}");

    $scope.save();
  }

  $scope.run = function() {
    if ($scope.items.length == 0) {
      return;
    }

    var nj = editor.get();
    var j = JSON.parse(JSON.stringify(nj));

    $scope.items.forEach(function(v) {
      try {
        j = j[v.type].call(j, eval("(" + v.code + ")"));
      } catch (e) {
        alert("Error in " + v.name + "\n\n" + e);
      }
    });

    editor2.set(j);
    editor2.expandAll();
  }

  $scope.hydrate();
  $scope.run();

  setInterval(function() {
    $scope.save();
    window.dispatchEvent(new Event('resize'));
  }, 1000);
}


var json = [{
  "SourceFile": "1993 Jams mix/ph_jams93_000.mp3",
  "Title": "Bowie - 1993-02-03 Portland, ME",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:07:22 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "6.8 MB"
}, {
  "SourceFile": "1993 Jams mix/ph_jams93_001.mp3",
  "Title": "Tweezer - 1993-02-03 Portland, ME",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:06:13 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "5.7 MB"
}, {
  "SourceFile": "1993 Jams mix/ph_jams93_002.mp3",
  "Title": "YEM - 1993-02-03 Portland, ME",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:06:11 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "5.7 MB"
}, {
  "SourceFile": "1993 Jams mix/ph_jams93_003.mp3",
  "Title": "Possum - 1993-02-03 Portland, ME",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:05:36 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "5.1 MB"
}, {
  "SourceFile": "1993 Jams mix/ph_jams93_004.mp3",
  "Title": "Stash - 1993-02-04 Providence",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:06:08 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "5.6 MB"
}, {
  "SourceFile": "1993 Jams mix/ph_jams93_005.mp3",
  "Title": "Antelope - 1993-02-04 Providence",
  "Album": "Phish Just Jams 1993",
  "Artist": "Phish",
  "Duration": "0:04:48 (approx)",
  "AudioBitrate": "128 kbps",
  "FileSize": "4.4 MB"
}];

var editor = new JSONEditor(container, options, json);
editor.setMode('code');
var editor2 = new JSONEditor(container2, {
  modes: ['code', 'text', 'view'],
  editable: function() {
    return false;
  }
}, json);

editor2.expandAll();