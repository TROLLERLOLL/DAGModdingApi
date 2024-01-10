var DAGPlugin = function(hook, vm) {
    hook.beforeEach(function(markdown, next) {
        if(markdown.toLowerCase().startsWith("$settings")) {
            var settingstemp = markdown.split("\n")[0].replace("\r", "").replace(/$settings\ /ig, "").split(";");
            var settings = {};
            for (var i = 0; i < settingstemp.length; i++)
                settings[settingstemp[i].split("=")[0].toLowerCase()] = parseType(settingstemp[i].split("=")[1]);

            console.log(settings);
            
            var returnval = markdown.split("\n");

            markdown = "";
            for (var i = 1; i < returnval.length; i++) 
                markdown += returnval[i] + "\n";

            next(markdown);
        }
        else
            next(markdown);
    });
    
    hook.afterEach(function(html, next) {
        next(html.replace(/{{versionLabel}}/g, getVersionName()));
    });
    
    hook.doneEach(function() {

        var codeblocks = document.getElementsByTagName("pre");

        for (var i = 0; i < codeblocks.length; i++) {
            if (codeblocks[i].getAttribute("data-lang") == "csharp")
                codeblocks[i].setAttribute("data-lang", "c#");
        }

        if (document.getElementById("vlabel"))
            document.getElementById("vlabel").innerText = getVersionName(); 
        
        if (document.getElementById('version-selector'))
            document.getElementById('version-selector').value = getVersion();
        
    });

    hook.ready(function() {
        var selector = initVersionSelector();
    })
};

function parseType(object) {
    if (object.toLowerCase() == "true")
        return true;

    if (object.toLowerCase() == "false")
        return false;

    return object;
}

function initVersionSelector() {
    // Version selector
    var versions = window.$docsify.versions;
    var selector = document.createElement('div');
    selector.className = 'version-selector';
    var version = getVersion();
    selector.innerHTML = `
  <select id="version-selector">
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
    var versionPath = getVersion();
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
    var name = $docsify.versions.find((v) => v.folder == version).label;

    if (name)
        return name;

    return;
}

function getVersion() {
    var loc = window.location.hash.replace("#/", "").split("/")[0];

    var version = $docsify.versions.find((v) => v.folder == loc);
    var defaultversion = $docsify.versions.find((v) => v.default);

    if (version)
        return version.folder;

    return (defaultversion ? defaultversion.folder : undefined);
}
