var DAGPlugin = function (hook, vm) {
  hook.doneEach(function() {
if(document.getElementById("vlabel") != null)
   document.getElementById("vlabel").innerText = window.location.hash;

/*var nameEl1 = document.querySelector('.app-name');
  if (nameEl1) {
      var versionLabel2 = window.location.hash;// vm.config.versions.find((v) => window.location.hash.includes(v.folder)).label;
      nameEl1.innerHTML += ` <small id="vlabel">${versionLabel2}</small>`;
alert(versionLabel2);
      //nameEl.parentNode.insertBefore(selector, nameEl.nextElementSibling);
  }
*/
//return markdown;
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
  var versionPath = (window.location.hash && window.location.hash.split("?id=")[0].split('/')[1]) || defaultVersion;
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
      nameEl.innerHTML += ` <small id="vlabel">${versionLabel}</small>`;
      nameEl.parentNode.insertBefore(selector, nameEl.nextElementSibling);
  }
  return selector;
}

function updateVersion(version) {
  window.location.replace(window.$docsify.home + "#/" + version + "/");
}

(function () {
  // Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat($docsify.plugins || [], DAGPlugin);
})();

(function() {
  if (window.location.pathname === window.$docsify.home || window.location.pathname === window.$docsify.home + 'index.html' || window.location.hash === '/#' || window.location.hash === '/#/') {
var existiert = false;
for(var i = 0; window.$docsify.versions.length; i++) {
 if (window.location.hash == "/#/" + window.$docsify.versions[i].folder + "/"){
return;
}


if (window.location.hash == "/#/" + window.$docsify.versions[i].folder){
window.location.replace(window.$docsify.home + '#/' + window.$docsify.versions[i].folder + '/');
break;
}
}
    var defaultVersion = window.$docsify.versions.find((v) => v.default).folder;
    window.location.replace(window.$docsify.home + '#/' + defaultVersion + '/');
  }
})();