var DAGPlugin = function (hook, vm) {
  hook.init(function() {

  });

  hook.ready(function() {
    var selector = initVersionSelector();
  })
};

function initVersionSelector(vm) {
  // Version selector
  var versions = window.$docsify.versions;
  var selector = document.createElement('div');
  selector.className = 'version-selector';
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
  
  // Adding event listener
  var versionPath = (window.location.pathname && window.location.pathname.split('/')[1]) || defaultVersion;
  selector.querySelector('select').value = versionPath;
  selector.querySelector('select').addEventListener('change', function () {
      updateVersion(this.value);
  });

  // Adding label
  var labelText = 'Version:';
  var label = document.createElement('span');
  label.className = 'version-selector-label';
  label.textContent = labelText;
  selector.insertBefore(label, selector.querySelector('select'));
  
  var nameEl = document.querySelector('.app-name');
  if (nameEl) {
      var versionLabel = versions.find((v) => v.folder === versionPath).label;
      nameEl.innerHTML += ` <small>${versionLabel}</small>`;
      nameEl.parentNode.insertBefore(selector, nameEl.nextElementSibling);
  }
  return selector;
}

(function () {
  // Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat($docsify.plugins || [], DAGPlugin);
})();

(function() {
  console.log(window.location.hash);
  if (window.location.pathname === window.$docsify.home || window.location.pathname === window.$docsify.home + 'index.html' || window.location.pathname === window.$docsify.home + '#' || window.location.pathname === window.$docsify.home + '#/') {
    var defaultVersion = window.$docsify.versions.find((v) => v.default).folder;
    window.location.replace(window.$docsify.home + '#/' + defaultVersion + '/');
  }
})();