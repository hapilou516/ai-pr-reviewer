// src/utils/verifyType.ts
function isType(type) {
  return function(value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}
var variableTypeDetection = {
  isNumber: isType("Number"),
  isString: isType("String"),
  isBoolean: isType("Boolean"),
  isNull: isType("Null"),
  isUndefined: isType("Undefined"),
  isSymbol: isType("Symbol"),
  isFunction: isType("Function"),
  isObject: isType("Object"),
  isArray: isType("Array"),
  isProcess: isType("process"),
  isWindow: isType("Window")
};

// src/utils/global.ts
var isBrowserEnv = variableTypeDetection.isWindow(typeof window !== "undefined" ? window : 0);
function getGlobal() {
  return window;
}
var _global = getGlobal();
var _support = getGlobalSupport();
_support.deviceInfo = {
  browserVersion: "unknown",
  // uaResult.browser.version,
  browser: "unknown",
  // uaResult.browser.name,
  osVersion: "unknown",
  // uaResult.os.version,
  os: "unknown",
  // uaResult.os.name,
  ua: (navigator == null ? void 0 : navigator.userAgent) || "unknown",
  device: "unknown",
  // uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: "unknown"
  // uaResult.device.type ? uaResult.device.type : 'Pc',
};
_support.hasError = false;
_support.errorMap = /* @__PURE__ */ new Map();
_support.replaceFlag = _support.replaceFlag || {};
var replaceFlag = _support.replaceFlag;
function setFlag(replaceType, isSet) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
function getGlobalSupport() {
  _global.__channelwill__ = _global.__channelwill__ || {};
  return _global.__channelwill__;
}

// src/utils/browser.ts
function htmlElementAsString(target) {
  const tagName = target.tagName.toLowerCase();
  if (tagName === "body") {
    return "";
  }
  let classNames = target.classList.value;
  classNames = classNames !== "" ? ` class='${classNames}'` : "";
  const id = target.id ? ` id="${target.id}"` : "";
  const innerText = target.innerText;
  return `<${tagName}${id}${classNames !== "" ? classNames : ""}>${innerText}</${tagName}>`;
}
function parseUrlToObj(url) {
  if (!url) {
    return {};
  }
  const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) {
    return {};
  }
  const query = match[6] || "";
  const fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment
  };
}
function setSilentFlag({
  silentXhr = true,
  silentFetch = true,
  silentClick = true,
  silentHistory = true,
  silentError = true,
  silentHashchange = true,
  silentUnhandledrejection = true,
  silentWhiteScreen = false
}) {
  setFlag("xhr" /* XHR */, !silentXhr);
  setFlag("fetch" /* FETCH */, !silentFetch);
  setFlag("click" /* CLICK */, !silentClick);
  setFlag("history" /* HISTORY */, !silentHistory);
  setFlag("error" /* ERROR */, !silentError);
  setFlag("hashchange" /* HASHCHANGE */, !silentHashchange);
  setFlag("unhandledrejection" /* UNHANDLEDREJECTION */, !silentUnhandledrejection);
  setFlag("whiteScreen" /* WHITESCREEN */, !silentWhiteScreen);
}
function getErrorUid(input) {
  return window.btoa(encodeURIComponent(input));
}
function hashMapExist(hash) {
  const exist = _support.errorMap.has(hash);
  if (!exist) {
    _support.errorMap.set(hash, true);
  }
  return exist;
}
export {
  getErrorUid,
  hashMapExist,
  htmlElementAsString,
  parseUrlToObj,
  setSilentFlag
};
