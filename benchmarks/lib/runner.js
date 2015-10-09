var select = document.querySelector('.change-fixture');
var iframe = document.querySelector('.fixture');
var timeTaken = document.querySelector('.time');
var hasLogged = false;

var fetch = window.fetch || function fetch(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      var DONE = this.DONE || 4;

      if (this.readyState === DONE) {
        resolve({
          text: function() {
            return xhr.responseText;
          }
        });
      }
    };

    xhr.open('GET', url, true);
    xhr.send(null);
  });
};

select.onchange = function() {
  var getTemplate = fetch(this.value);

  getTemplate
    .then(function(resp) {
      return resp.text();
    })
    .then(combyne)
    .then(function(template) {
      var window = iframe.contentWindow.window;
      var document = iframe.contentDocument;
      var count = 100;
      var lastCalled = Date.now();

      window.template = template;

      template.registerFilter('log', console.log.bind(console));

      template.registerFilter('force', function(array, max) {
        if (array.length > max) {
          array.length = max;
        }
        else if (array.length < max) {
          array.length = max;
        }

        return array;
      });

      document.open()
      document.write(template.render({}));
      document.close();

      function startRendering() {
        var start = Date.now();

        window.done = function() {
          requestAnimationFrame(startRendering);
        };

        window.render(count);
      }

      iframe.onload = startRendering;
    });
};

