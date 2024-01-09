var DAGPlugin = function (hook, vm) {
  hook.init(function() {

  });

  hook.afterEach(function(html) {
    var selector = document.createElement('div');
    selector.className = 'version-selector';
    var versions = window.$docsify.versions;
    selector.innerHTML = `
      <select>
          ${versions
          .map(
              (v) =>
              `<option value="${v.folder}" ${
                  v.default ? 'selected' : ''
              }>${v.label}</option>`
          )
          .join('')}
      </select>
      `;

     return html + selector.outerHTML;
  })
};


(function () {
  // Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat($docsify.plugins || [], DAGPlugin);
})();

(function() {
  console.log(window.location.pathname);
  if (window.location.pathname === window.$docsify.home || window.location.pathname === window.$docsify.home + 'index.html' || window.location.pathname === window.$docsify.home + '#' || window.location.pathname === window.$docsify.home + '#/') {
    var defaultVersion = window.$docsify.versions.find((v) => v.default).folder;
    window.location.replace(window.$docsify.home + '#/' + defaultVersion + '/');
  }
})();