var DAGPlugin = function(hook, vm) {
    hook.init(function() {
        window.vm = vm;
        window.hashchanged = false;
        $docsify.page = 0;

        if (!getPageParameter("page"))
            addPageParameter("page", $docsify.page)
    })

    hook.beforeEach(function(markdown, next) {
        next(parseMarkDown(markdown));
    });

    hook.afterEach(function(html, next) {
        next(parseHTML(html));
    });

    hook.doneEach(function() {
        pageLoaded();

        var p = getPageParameter("page");
        if (p != undefined && p != null)
            if (parseInt(p) == $docsify.page)
                return;

        loadPage(p != undefined && p != null ? parseInt(p) : $docsify.page);
    });

    hook.ready(function() {
        initVersionSelector();
    })
};

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
              v.folder == version.folder ? 'selected' : ''
          }>${v.label}</option>`
      )
      .join('')}
  </select>
  `;


    var version = getVersion();
    // Adding event listener
    selector.querySelector('select').value = version.folder;
    selector.querySelector('select').addEventListener('change', function() {
        window.location.replace(window.$docsify.home + "#/" + this.value + "/");
    });

    // Adding label
    var labelText = 'Version:';
    var label = document.createElement('span');
    label.className = 'version-selector-label';
    label.textContent = labelText;
    selector.insertBefore(label, selector.querySelector('select'));

    var nameEl = document.querySelector('.app-name');
    if (nameEl) {
        var versionLabel = version.label
        nameEl.innerHTML += ` <small id="vlabel">${versionLabel}</small>`;
        nameEl.parentNode.insertBefore(selector, nameEl.nextElementSibling);
    }
    return selector;
}

(function() {
    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], DAGPlugin);

    redirectToCorrectPage();
})();

function getVersion() {
    var loc = window.location.hash.replace("#/", "").split("/")[0];

    var version = $docsify.versions.find((v) => v.folder == loc);
    var defaultversion = $docsify.versions.find((v) => v.default);

    if (version)
        return version;

    return (defaultversion ? defaultversion : {folder: "/", label: "null", default: false});
}


function parseMarkDown(markdown) {
    markdown = markdown.replace(/{vName}/ig, getVersion().label).replace(/{vPath}/ig, getVersion().folder).replace(/{vDefault}/ig, getVersion().default);

    var pages = markdown.split(/{P\ (.*?)}/ig);
    pages.shift();
    if (pages.length == 0)
        pages = ["", markdown];

    $docsify.pages = [];
    for (var i = 0; i < pages.length / 2; i++)
        $docsify.pages.push({token: pages[i * 2], data: pages[i * 2 + 1].replace("\r\n", "")});
    
    markdown = $docsify.pages[$docsify.page ? $docsify.page : 0].data;
    window.title = $docsify.pages[$docsify.page ? $docsify.page : 0].token
    markdown += "\n\n>Last Modify: {docsify-updated}";
    
    return markdown;
}

function parseHTML(html) {
    html += "<button id='left' onclick='previousePage()'>Left</button><button id='right' onclick='nextPage()'>Right</button>"

    return html;
}

function adjustVersionChange() {
    if (document.getElementById("vlabel"))
        document.getElementById("vlabel").innerText = getVersion().label;

    if (document.getElementById('version-selector'))
        document.getElementById('version-selector').value = getVersion().folder;
}

function setCodeTypeName() {
    var codeblocks = document.getElementsByTagName("pre");

    for (var i = 0; i < codeblocks.length; i++) {
        if (codeblocks[i].getAttribute("data-lang") == "csharp")
            codeblocks[i].setAttribute("data-lang", "c#");
    }
}


function previousePage() {
    loadPage($docsify.page - 1);
}

function nextPage() {
    loadPage($docsify.page + 1);
}

function loadPage(page) {
    if (page == undefined || page == null)
        return;

    $docsify.page = page >= 0 ? (page < $docsify.pages.length ? page : $docsify.pages.length - 1) : 0;

    window.vm.route.query = {page: $docsify.page}
    addPageParameter("page", $docsify.page);
    
    
    window.vm._fetch();
    pageLoaded();
}


function getPageParameters() {
    var url = window.location.hash;

    if (url.includes("/?"))
        url = url.split("/?")[1];
    else 
        return [];

    url = url.includes("&") ? url.split("&") : [url]
    for(var i = 0; i < url.length; i++)
        url[i] = url[i].includes("=") ? {key: url[i].split("=")[0], value: url[i].split("=")[1]} : {key: url[i], value: undefined};

    return url;
}

function getPageParameter(key) {
    var params = getPageParameters();
    for (var i = 0; i < params.length; i++) {
        if (params[i].key == key)
            return params[i].value
    }

    return null;
}

function addPageParameter(key, value) {
    var params = getPageParameters();
    var found = false;
    for(var i = 0; i < params.length; i++) {
        if (params[i].key == key) {
            params[i].value = value.toString();
            found = true;
            break;
        }
    }

    if (!found)
        params.push({key: key.toString(), value: value.toString()})

    setPageParameters(params);
}

function clearPageParameters() {
    setPageParameters([])
}

function setPageParameters(params) {
    for (var i = 0; i < params.length; i++) {
        if (params[i].key == "page") {
            var page = params[i].value;
            params.splice(i, 1);
            params.reverse();
            params.push({key: "page", value: page});
            params.reverse();
            break;
        }
    }
    var url = window.location.hash.includes("/?") ? window.location.hash.split("/?")[0] + "/" : window.location.hash;

    url = params.length != 0 ? url + "?" : url;
    for (var i = 0; i < params.length; i++) {
        if (!url.endsWith("?"))
            url += "&";
        url += params[i].key + (params[i].value != undefined ? "=" + params[i].value.toString() : "");
    }
    
    window.hashchanged = window.location.hash != url;
    window.location.hash = url;
}

function pageLoaded() {
    setCodeTypeName();
    adjustVersionChange();
}





function redirectToCorrectPage() {
    window.addEventListener("hashchange", (event) => {
        if (window.hashchanged) {
            window.hashchanged = false;
            return;
        }

        var p = getPageParameter("page");
        if (p != undefined && p != null)
            loadPage(parseInt(p));
        else {
            addPageParameter("page", $docsify.page);
            loadPage($docsify.page);
        }
    });

    if (window.location.pathname === $docsify.home || window.location.pathname === $docsify.home + 'index.html') {
        for (var i = 0; i < $docsify.versions.length; i++) {
            if ((window.location.hash.includes("?") ? window.location.hash.split("?")[0] : window.location.hash) == "#/" + $docsify.versions[i].folder + "/") {
                return;
            }

            if (window.location.hash == "#/" + $docsify.versions[i].folder) {
                window.location.replace($docsify.home + '#/' + $docsify.versions[i].folder + '/');
                break;
            }
        }
        var defaultVersion = $docsify.versions.find((v) => v.default).folder;
        window.location.replace($docsify.home + '#/' + defaultVersion + '/');
    }
}