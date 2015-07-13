var app = document.querySelector('#app');

app.saveKeyset = function() {
  // JSON.stringify($scope.serializedRaw)
  var blob = new Blob(["[\n{This is a keyset file}\n]"], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
  saveAs(blob, "keyset.json");
};
