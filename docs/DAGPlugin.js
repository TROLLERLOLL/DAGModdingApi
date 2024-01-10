var DAGPlugin = function(hook, vm) {
    hook.afterEach(function(html, next) {
        next(html.replace(/{{versionLabel}}/g, getVersionName()));
    });
    
    hook.doneEach(function() {

        var codeblocks = document.getElementsByTagName("pre");

        for (var i = 0; i < codeblocks.length; i++) {
            if (codeblocks[i].getAttribute("data-lang") == "csharp")
                codeblocks[i].setAttribute("data-lang", "c#");
        }
    });

    hook.ready(function() {
        var selector = initVersionSelector();
    })
};

function initVersionSelector() {
    // Version selector
    var versions = window.$docsify.versions;
    var selector = document.createElement('div');
    selector.className = 'version-selector';
    var version = getVersion();
    console.log(version);
    selector.innerHTML = `
  <select>
      ${versions
      .map(
          (v) =>
          `<option value="${v.folder}" ${
              v.folder == version ? 'selected' : ''
          }>${v.label}</option>`
      )
      .join('')}
  </select>
  `;

    // Adding event listener
    var versionPath = (window.location.hash && window.location.hash.split("?id=")[0].split('/')[1]) || defaultVersion;
    selector.querySelector('select').value = versionPath;
    selector.querySelector('select').addEventListener('change', function() {
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
        nameEl.innerHTML += ` <small id="vlabel">${versionLabel}</small>`;
        nameEl.parentNode.insertBefore(selector, nameEl.nextElementSibling);
    }
    return selector;
}

function updateVersion(version) {
    window.location.replace(window.$docsify.home + "#/" + version + "/");

    if (document.getElementById("vlabel") != null)
        document.getElementById("vlabel").innerText = window.$docsify.versions.find((v) => v.folder === version).label;
}

(function() {
    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], DAGPlugin);
})();

(function() {
    if (window.location.pathname === window.$docsify.home || window.location.pathname === window.$docsify.home + 'index.html' || window.location.hash === '/#' || window.location.hash === '/#/') {
        var existiert = false;
        for (var i = 0; i < $docsify.versions.length; i++) {
            if (window.location.hash == "#/" + $docsify.versions[i].folder + "/") {
                return;
            }


            if (window.location.hash == "#/" + $docsify.versions[i].folder) {
                window.location.replace(window.$docsify.home + '#/' + $docsify.versions[i].folder + '/');
                break;
            }
        }
        var defaultVersion = $docsify.versions.find((v) => v.default).folder;
        window.location.replace(window.$docsify.home + '#/' + defaultVersion + '/');
    }
})();

function getVersionName() {
    var version = getVersion();
    var name = $docsify.versions.find((v) => v.folder == loc).label;

    if (name)
        return name;

    return;
}

function getVersion() {
    var loc = window.location.hash.replace("#/", "").split("/")[0];

    var version = $docsify.versions.find((v) => v.folder == loc);
    var defaultversion = $docsify.versions.find((v) => v.default);

    if (version)
        return version;

    return (defaultversion ? defaultversion : undefined);
}
