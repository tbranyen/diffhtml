const { html, innerHTML } = require('diffhtml/lite');

// Render a div with dynamic children and onclick
function renderTime(time) {
  innerHTML(document.body, [diff.createTree("button", { "onclick": e => renderTime(new Date()) }, [diff.createTree('#text', null, "Get time")]), diff.createTree('#text', null, "\n    "), diff.createTree("output", {}, [time])]);
}

renderTime(new Date());
