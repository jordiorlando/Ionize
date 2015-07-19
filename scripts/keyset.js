var app = document.querySelector('#app');

app.saveKeyset = function() {
  // JSON.stringify($scope.serializedRaw)
  var blob = new Blob([''], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, "keyset.json");
};
