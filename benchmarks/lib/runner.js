var select = document.querySelector('.change-fixture');
var iframe = document.querySelector('.fixture');
var timeTaken = document.querySelector('.time');

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
      var count = 50;
      var lastCalled = Date.now();

      window.template = template;

      document.open()
      document.write(template.render({ rows: [{ name: 'test' }] }));
      document.close();

      var updateFPS = _.throttle(function(fps, start, currentCall) {
        var fpsClass = 'good';
        if (fps < 40) {
          fpsClass = 'okay';
        }
        if (fps < 20) {
          fpsClass = 'bad';
        }
        var html = (currentCall - start) + 'ms / ';
        html += '<span class="' + fpsClass + '">' + Math.ceil(fps) + 'fps</span>';
        timeTaken.innerHTML = html;
      }, 100);

      function startRendering() {
        var start = Date.now();

        window.done = function(time) {
          var currentCall = Date.now();
          var fps = (1 / ((currentCall - lastCalled) / 1000));
          updateFPS(fps, start, currentCall);
          lastCalled = currentCall;
          //setTimeout(startRendering, 5000);
          requestAnimationFrame(startRendering);
        };

        window.render(count);
      }

      iframe.onload = startRendering;
    });
};

