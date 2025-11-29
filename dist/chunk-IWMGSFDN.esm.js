/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
var CONFIG = {
  PACKAGE: {
    NPM_NAME: "@rzl-zone/ziggy-route",
    PACKAGIST_NAME: "rzl-zone/ziggy-route",
    PREFIX: {
      NAME: "RZL ZIGGY"
    }
  },
  REPO: {
    LINK: "https://github.com/rzl-zone/ziggy-route"
  }
};

var isBoolean = (value) => {
  return typeof value === "boolean";
};
var isFunction = (value) => {
  return typeof value === "function";
};
function isNil(value) {
  return value == null;
}
function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return typeof value === "object" && !isNil(value) && !isArray(value);
}
function isPlainObject(value) {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
var isString = (value) => {
  return typeof value === "string";
};
function isNumberObject(value) {
  return isObject(value) && Object.prototype.toString.call(value) === "[object Number]";
}
function isNaN2(value) {
  return typeof value === "number" ? Number.isNaN(value) : isNumberObject(value) && Number.isNaN(value.valueOf());
}
var isNull = (val) => val === null;
var assertIsBoolean = (value, options = {}) => {
  if (isBoolean(value)) return;
  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "boolean"
  });
};
var isNumber = (value, options = {}) => {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const includeNaN = isPlainObject(options) && isBoolean(options.includeNaN) ? options.includeNaN : false;
  assertIsBoolean(includeNaN, {
    message: ({ currentType, validType }) => `Parameter \`includeNaN\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const aNumber = typeof value === "number";
  return includeNaN ? aNumber : aNumber && !Number.isNaN(value);
};
var isSymbol = (value) => {
  return typeof value === "symbol";
};
var isUndefined = (value) => {
  return typeof value === "undefined";
};
function isObjectOrArray(value) {
  return isArray(value) || isObject(value);
}
function hasOwnProp(obj, key, options = {}) {
  if (!isString(obj) && !isObjectOrArray(obj) && !isFunction(obj)) return false;
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Third parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const discardUndefined = options.discardUndefined === void 0 ? true : options.discardUndefined;
  const discardNull = options.discardNull === void 0 ? false : options.discardNull;
  assertIsBoolean(discardUndefined, {
    message: ({ currentType, validType }) => `Parameter \`discardUndefined\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  assertIsBoolean(discardNull, {
    message: ({ currentType, validType }) => `Parameter \`discardNull\` property of the \`options\` (third parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const path = [];
  if (isString(key) && key.trim().length > 0 || isNumber(key, { includeNaN: true })) {
    const strKey = isNumber(key, { includeNaN: true }) ? String(key) : key;
    strKey.split(".").forEach((k) => {
      const bracketMatch = k.match(/^\[(\d+)\]$/);
      const symbolMatch = k.match(/^Symbol\((.+)\)$/);
      if (bracketMatch) path.push(Number(bracketMatch[1]));
      else if (symbolMatch) path.push(Symbol.for(symbolMatch[1]));
      else if (!isNaN2(Number(k))) path.push(Number(k));
      else path.push(k);
    });
  } else if (isSymbol(key)) {
    path.push(key);
  } else {
    return false;
  }
  let current = isString(obj) && obj.trim().length > 0 ? Object(obj) : obj;
  for (const k of path) {
    if (isString(k) && k.trim().length > 0 || isNumber(k, { includeNaN: true })) {
      if (isNull(current) || !Object.prototype.hasOwnProperty.call(current, k)) {
        return false;
      }
      current = current[k];
    } else if (isSymbol(k)) {
      if (isNull(current) || typeof current !== "object" && !isFunction(current)) {
        return false;
      }
      const symbols = Object.getOwnPropertySymbols(current);
      const matched = symbols.find((s) => s === k || s.description === k.description);
      if (!matched) return false;
      current = current[matched];
    } else {
      return false;
    }
  }
  if (discardUndefined && isUndefined(current)) return false;
  if (discardNull && isNull(current)) return false;
  return true;
}
var isNonEmptyString = (value, options = {}) => {
  if (!isString(value)) return false;
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const trim = hasOwnProp(options, "trim") ? options.trim : true;
  assertIsBoolean(trim, {
    message: ({ currentType, validType }) => `Parameter \`trim\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const str = trim ? value.trim() : value;
  return str.length > 0;
};
var isError = (error) => {
  return Object.prototype.toString.call(error) === "[object Error]" || error instanceof Error;
};
var isBuffer = (value) => {
  return typeof Buffer !== "undefined" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(value);
};
function isStringObject(value) {
  return isObject(value) && Object.prototype.toString.call(value) === "[object String]";
}
function isBooleanObject(value) {
  return isObject(value) && Object.prototype.toString.call(value) === "[object Boolean]";
}
function isInfinityNumber(value) {
  if (typeof value === "number" || isNumberObject(value)) {
    const num = Number(value);
    return num === Infinity || num === -Infinity;
  }
  return false;
}
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
function isSet(value) {
  return Object.prototype.toString.call(value) === "[object Set]" || value instanceof Set;
}
var validateCaseInputWordsCase = (input) => {
  let result = "";
  if (isArray(input)) {
    result = input.map((x) => isNonEmptyString(x) ? x.trim() : "").filter((x) => x.length).join("-");
  } else if (isNonEmptyString(input)) {
    result = input.trim();
  }
  return result.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
};
var validateCaseIgnoreWordsCase = (ignoreWord) => {
  const result = /* @__PURE__ */ new Set([]);
  const normalizeWord = (word) => word.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean).join("");
  if (isNonEmptyString(ignoreWord)) {
    const clean = normalizeWord(ignoreWord);
    if (clean) result.add(clean);
  }
  if (isNonEmptyArray(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }
  if (isSet(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }
  return result;
};
var slugify = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  const slug = wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.toLowerCase();
  }).join("-");
  return slug.replace(/^-+|-+$/g, "");
};
var toDotCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.toLowerCase();
  }).join(".");
};
var toCamelCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word, index) => {
    if (ignoreWordsValidated.has(word)) return word;
    return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join("");
};
var toKebabCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.toLowerCase();
  }).join("-");
};
var toSnakeCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.toLowerCase();
  }).join("_");
};
var toLowerCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.toLowerCase();
  }).join(" ");
};
var toPascalCase = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join("");
};
var toPascalCaseSpace = (input, ignoreWord) => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";
  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);
  return wordsValidated.map((word) => {
    if (ignoreWordsValidated.has(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(" ");
};
var PreciseType = class _PreciseType {
  /** ----------------------------------------------------------
   * * ***Mapping table of JavaScript built-in and environment-specific types.***
   * ----------------------------------------------------------
   * - **Behavior:**
   *    - Maps internal or native type identifiers to **human-readable names** (usually PascalCase).
   *    - Keys are normalized to lowercase and stripped of spaces, dashes, or underscores.
   *    - Extend or modify entries to match your environment or platform.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - Not intended for direct use in application code.
   *
   * @internal
   */
  static FIXES_RAW = Object.freeze({
    // primitives
    string: "String",
    number: "Number",
    boolean: "Boolean",
    bigint: "Bigint",
    symbol: "Symbol",
    undefined: "Undefined",
    null: "Null",
    regexp: "Reg Exp",
    // reflect / proxy / atomics
    reflect: "Reflect",
    proxy: "Proxy",
    atomics: "Atomics",
    // core / objects
    array: "Array",
    object: "Object",
    function: "Function",
    arguments: "Arguments",
    // functions
    asyncfunction: "Async Function",
    generatorfunction: "Generator Function",
    asyncgeneratorfunction: "Async Generator Function",
    generator: "Generator",
    promise: "Promise",
    // errors
    evalerror: "Eval Error",
    rangeerror: "Range Error",
    referenceerror: "Reference Error",
    syntaxerror: "Syntax Error",
    typeerror: "Type Error",
    urierror: "URI Error",
    aggregateerror: "Aggregate Error",
    error: "Error",
    // typed arrays & binary
    int8array: "Int 8 Array",
    uint8array: "Uint 8 Array",
    uint8clampedarray: "Uint 8 Clamped Array",
    int16array: "Int 16 Array",
    uint16array: "Uint 16 Array",
    int32array: "Int 32 Array",
    uint32array: "Uint 32 Array",
    float32array: "Float 32 Array",
    float64array: "Float 64 Array",
    bigint64array: "Big Int 64 Array",
    biguint64array: "Big Uint 64 Array",
    arraybuffer: "Array Buffer",
    sharedarraybuffer: "Shared Array Buffer",
    dataview: "Data View",
    arraybufferview: "Array Buffer View",
    // collections
    map: "Map",
    set: "Set",
    weakmap: "Weak Map",
    weakset: "Weak Set",
    // iterators (note: toString tag can be "Map Iterator" etc.)
    mapiterator: "Map Iterator",
    weakmapiterator: "Weak Map Iterator",
    setiterator: "Set Iterator",
    weaksetiterator: "Weak Set Iterator",
    arrayiterator: "Array Iterator",
    stringiterator: "String Iterator",
    asynciterator: "Async Iterator",
    iteratorresult: "Iterator Result",
    arrayiteratorresult: "Array Iterator Result",
    // streams / fetch / web
    readablestream: "Readable Stream",
    writablestream: "Writable Stream",
    transformstream: "Transform Stream",
    readablestreamdefaultreader: "Readable Stream Default Reader",
    writablestreamdefaultwriter: "Writable Stream Default Writer",
    readablestreamdefaultcontroller: "Readable Stream Default Controller",
    transformstreamdefaultcontroller: "Transform Stream Default Controller",
    abortcontroller: "Abort Controller",
    abortsignal: "Abort Signal",
    fetch: "fetch",
    request: "Request",
    response: "Response",
    headers: "Headers",
    formdata: "FormData",
    blob: "Blob",
    file: "File",
    filelist: "FileList",
    filereader: "FileReader",
    // intl
    intl: "Intl",
    collator: "Intl. Collator",
    datetimeformat: "Intl. Date Time Format",
    displaynames: "Intl. Display Names",
    listformat: "Intl. List Format",
    locale: "Intl. Locale",
    numberformat: "Intl. Number Format",
    pluralrules: "Intl. Plural Rules",
    relativetimeformat: "Intl. Relative Time Format",
    segmenter: "Intl. Segmenter",
    // es2021+
    weakref: "Weak Ref",
    urlpattern: "URLPattern",
    structuredclone: "structured Clone",
    finalizationregistry: "Finalization Registry",
    // performance / observers
    performance: "Performance",
    performanceobserver: "Performance Observer",
    performanceentry: "Performance Entry",
    performancemark: "Performance Mark",
    performancemeasure: "Performance Measure",
    // webassembly
    webassembly: "Web Assembly",
    wasmmodule: "WebAssembly. Module",
    wasminstance: "WebAssembly. Instance",
    wasmmemory: "WebAssembly. Memory",
    wasmtable: "WebAssembly. Table",
    // node-ish / common hosts
    buffer: "Buffer",
    process: "Process",
    eventemitter: "Event Emitter",
    stream: "Stream",
    fs: "fs",
    path: "path",
    url: "URL",
    urlsearchparams: "URL Search Params",
    // DOM basics
    node: "Node",
    element: "Element",
    htmlelement: "HTML Element",
    svgelement: "SVG Element",
    document: "Document",
    documentfragment: "Document Fragment",
    shadowroot: "Shadow Root",
    nodelist: "Node List",
    htmlcollection: "HTML Collection",
    // observers / misc DOM
    resizeobserver: "Resize Observer",
    mutationobserver: "Mutation Observer",
    intersectionobserver: "Intersection Observer",
    // Reflection / Symbolic
    symboliterator: "Symbol. Iterator",
    symbolasynciterator: "Symbol. Async Iterator",
    symboltostringtag: "Symbol. To String Tag",
    symbolspecies: "Symbol. Species",
    symbolhasinstance: "Symbol. Has Instance",
    symbolisconcatspreadable: "Symbol. Is Concat Spreadable",
    symbolunscopables: "Symbol. Unscopables",
    symbolmatch: "Symbol. Match",
    symbolreplace: "Symbol. Replace",
    symbolsearch: "Symbol. Search",
    symbolsplit: "Symbol. Split",
    symboltoprimitive: "Symbol. To Primitive",
    symbolmatchall: "Symbol. Match All",
    symbolarguments: "Symbol. Arguments",
    // deprecated
    // Numbers & Math
    math: "Math",
    bigintconstructor: "Bigint Constructor",
    numberconstructor: "Number Constructor",
    stringconstructor: "String Constructor",
    booleanconstructor: "Boolean Constructor",
    // URL / Networking (modern web)
    formdataevent: "Form Data Event",
    customevent: "Custom Event",
    messagechannel: "Message Channel",
    messageport: "Message Port",
    messageevent: "Message Event",
    websocket: "Web Socket",
    eventsource: "Event Source",
    // Storage APIs
    indexeddb: "IndexedDB",
    idbrequest: "IDB Request",
    idbtransaction: "IDB Transaction",
    idbobjectstore: "IDB Object Store",
    idbcursor: "IDB Cursor",
    localstorage: "Local Storage",
    sessionstorage: "Session Storage",
    // Navigator / Browser APIs
    navigator: "Navigator",
    geolocation: "Geolocation",
    clipboard: "Clipboard",
    notification: "Notification",
    // Canvas / Graphics
    canvas: "Canvas",
    canvasrenderingcontext2d: "Canvas Rendering Context 2D",
    offscreencanvas: "Offscreen Canvas",
    webglrenderingcontext: "WebGL Rendering Context",
    imagedata: "Image Data",
    imagebitmap: "Image Bitmap",
    // Media
    mediastream: "Media Stream",
    mediarecorder: "Media Recorder",
    mediastreamtrack: "Media Stream Track",
    audiocontext: "Audio Context",
    audiobuffer: "Audio Buffer",
    audioworklet: "Audio Worklet",
    // Workers
    worker: "Worker",
    sharedworker: "Shared Worker",
    serviceworker: "Service Worker",
    workerglobalscope: "Worker Global Scope",
    // Structured Clone / Transferable
    structuredcloneerror: "Structured Clone Error",
    transferable: "Transferable",
    // Testing / Diagnostics
    report: "Report",
    console: "Console",
    diagnosticreport: "Diagnostic Report",
    // Misc
    domrect: "DOM Rect",
    dompoint: "DOM Point",
    dommatrix: "DOM Matrix",
    domparser: "DOM Parser",
    xmlhttprequest: "XML HTTP Request",
    customelementregistry: "Custom Element Registry",
    // additions-ons
    text: "Text",
    comment: "Comment",
    animation: "Animation",
    documenttype: "Document Type",
    characterdata: "Character Data",
    animationevent: "Animation Event",
    customemmetregistry: "Custom Emmet Registry",
    websocketmessageevent: "WebSocket Message Event"
  });
  /** ----------------------------------------------------------
   * * ***List of JavaScript special numeric values.***
   * ----------------------------------------------------------
   *
   * - Contains special values recognized by {@link getPreciseType | `getPreciseType`},
   *   such as `"Infinity"`, `"-Infinity"`, and `"NaN"`.
   *
   * - **⚠️ Internal:**
   *    - Used by {@link getPreciseType | `getPreciseType`} for numeric edge-case detection.
   *
   * @internal
   */
  static SPECIAL_TYPE = Object.freeze([
    "-Infinity",
    "Infinity",
    "NaN"
  ]);
  /** ----------------------------------------------------------
   * * ***List of acronyms to keep uppercase in formatted output.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Prevents transformations (like camelCase or kebab-case) from altering
   *      known acronyms such as `HTML`, `URL`, `API`, etc.
   *    - Extend this list if you want more acronyms to remain uppercase.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`} and related formatters.
   *
   * @internal
   */
  static ACRONYMS = Object.freeze([
    // Web & Protocols
    "URI",
    "URL",
    "URN",
    "HTTP",
    "HTTPS",
    "FTP",
    "FTPS",
    "SFTP",
    "SSH",
    "SMTP",
    "POP3",
    "IMAP",
    "WS",
    "WSS",
    "TCP",
    "UDP",
    "IP",
    "ICMP",
    "ARP",
    "RTP",
    "RTSP",
    "SIP",
    // Web APIs & Standards
    "HTML",
    "XHTML",
    "XML",
    "WBR",
    "CSS",
    "SVG",
    "JSON",
    "JSONP",
    "DOM",
    "IDB",
    "DB",
    "RTC",
    "ICE",
    "TLS",
    "SSL",
    "CORS",
    "WASM",
    "CSR",
    "SSR",
    "PWA",
    "DPI",
    "CDN",
    // Programming / JS Ecosystem
    "JS",
    "TS",
    "JSX",
    "TSX",
    "CLI",
    "API",
    "SDK",
    "UI",
    "UX",
    "OS",
    "ID",
    "UUID",
    "PID",
    "NPM",
    "YARN",
    "ESM",
    "CJS",
    "BOM",
    "MVC",
    "MVVM",
    "ORM",
    "DAO",
    "CRUD",
    "FIFO",
    "LIFO",
    "OOP",
    "FP",
    "REPL",
    // Data Formats & Types
    "CSV",
    "TSV",
    "SQL",
    "YAML",
    "JSON",
    "MD",
    "INI",
    "PDF",
    "XLS",
    "XLSX",
    "RTF",
    "XML",
    "BMP",
    "GIF",
    "PNG",
    "JPEG",
    "WEBP",
    "MP3",
    "MP4",
    "AVI",
    "MOV",
    "FLAC",
    "MKV",
    "WAV",
    // Common Abbreviations
    "URLSearchParams",
    "XHR",
    "2D",
    "3D",
    "GL",
    "WebGL",
    "TTL",
    "UID",
    "GID",
    "MAC",
    "IP",
    "DNS",
    "DHCP",
    "VPN",
    "LAN",
    "WAN",
    "SSID",
    "IoT",
    "API",
    "SDK",
    "CLI",
    "LTS",
    "EOL",
    // Hardware & Infrastructure
    "CPU",
    "GPU",
    "RAM",
    "ROM",
    "SSD",
    "HDD",
    "BIOS",
    "USB",
    "PCI",
    "SATA",
    "DIMM",
    "DDR",
    "VGA",
    "HDMI",
    "KVM",
    "ASIC",
    "FPGA",
    "SoC",
    "NAS",
    "SAN",
    // Networking
    "TCP",
    "UDP",
    "IP",
    "MAC",
    "DNS",
    "DHCP",
    "VPN",
    "LAN",
    "WAN",
    "SSID",
    "NAT",
    "QoS",
    "MPLS",
    "BGP",
    "OSPF",
    "ICMP",
    "IGMP",
    "LLDP",
    "ARP",
    "RARP",
    // Security
    "AES",
    "RSA",
    "OTP",
    "MFA",
    "PKI",
    "VPN",
    "IAM",
    "ACL",
    "CSP",
    "XSS",
    "CSRF",
    "HSTS",
    "WAF",
    "DDoS",
    "IDS",
    "IPS",
    "SOC",
    "SIEM",
    // Cloud / DevOps / Infrastructure
    "AWS",
    "GCP",
    "AZURE",
    "CI",
    "CD",
    "K8S",
    "IaC",
    "PaaS",
    "SaaS",
    "IaaS",
    "API",
    "CLI",
    "SDK",
    "REST",
    "SOAP",
    "JSON-RPC",
    "gRPC",
    "ELB",
    "EKS",
    "AKS",
    "FaaS",
    "CaaS",
    // User Interface & Tools
    "GUI",
    "IDE",
    "FAQ",
    "UX",
    "UI",
    "CLI",
    "API",
    "SDK",
    "LTS",
    "EOL",
    "WYSIWYG",
    "CMS",
    "CRM",
    // Miscellaneous
    "GPS",
    "LED",
    "OLED",
    "LCD",
    "RFID",
    "NFC",
    "CPU",
    "GPU",
    "AI",
    "ML",
    "DL",
    "DB",
    "SQL",
    "NoSQL",
    "ORM",
    "JSON",
    "XML",
    "CSV",
    "HTTP",
    "HTTPS",
    // Testing & QA
    "TDD",
    "BDD",
    "CI",
    "CD",
    "QA",
    "SLA",
    "SLO",
    "MTTR",
    "MTBF",
    "UAT",
    "RPA",
    // Business & Project Management
    "KPI",
    "OKR",
    "ROI",
    "RFP",
    "SLA",
    "CRM",
    "ERP",
    "PMO",
    "SCRUM",
    "KANBAN",
    // Multimedia & Graphics
    "FPS",
    "HDR",
    "VR",
    "AR",
    "3D",
    "2D",
    "MP3",
    "MP4",
    "GIF",
    "PNG",
    "JPEG",
    "SVG",
    "BMP",
    "TIFF",
    // Operating Systems & File Systems
    "POSIX",
    "NTFS",
    "FAT",
    "EXT",
    "EXT4",
    "APFS",
    "HFS",
    "ISO",
    // Programming Languages & Tools
    "HTML",
    "CSS",
    "JS",
    "TS",
    "PHP",
    "SQL",
    "JSON",
    "XML",
    "YAML",
    "BASH",
    "ZSH",
    "JSON",
    "YAML",
    "INI",
    "DOTENV",
    // Containers & Virtualization
    "VM",
    "VMM",
    "VPC",
    "OCI",
    "LXC",
    "Docker",
    "K8S",
    "CRI",
    "CNI"
  ]);
  /** ----------------------------------------------------------
   * * ***Normalized lookup table for type mapping.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Converts all keys from {@link FIXES_RAW | `FIXES_RAW`} into normalized form
   *      (lowercased and stripped of separators) for consistent lookup.
   *    - Values remain the formatted human-readable type names.
   *
   * - **⚠️ Internal:**
   *    - Helper table for {@link getPreciseType | `getPreciseType`} and related matchers.
   *
   * @internal
   */
  static FIXES_CASTABLE_TABLE = Object.freeze(
    Object.entries(_PreciseType.FIXES_RAW).reduce((acc, [k, v]) => {
      acc[_PreciseType.normalizeKeyForCase(k)] = v;
      return acc;
    }, {})
  );
  /** @internal */
  formatCase = "toKebabCase";
  /** @internal */
  useAcronyms = false;
  constructor(params) {
    this.formatCase = params?.formatCase;
    this.useAcronyms = params?.useAcronyms;
  }
  /** @internal */
  determineOptions(options) {
    return {
      formatCase: options?.formatCase || this.formatCase,
      useAcronyms: options?.useAcronyms ?? this.useAcronyms
    };
  }
  // ------------------------
  // Helpers for DOM detection
  // ------------------------
  /** @internal */
  getHtmlElementType(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    if (typeof HTMLElement === "undefined" || !(value instanceof HTMLElement))
      return null;
    const tagName = value.tagName;
    const DEFAULTS = {
      a: "Anchor",
      abbr: "Abbreviation",
      address: "Address",
      area: "Area",
      article: "Article",
      aside: "Aside",
      audio: "Audio",
      b: "Bold",
      base: "Base",
      bdi: "BDI",
      bdo: "BDO",
      blockquote: "Blockquote",
      body: "Body",
      br: "Break",
      button: "Button",
      canvas: "Canvas",
      caption: "Caption",
      cite: "Cite",
      code: "Code",
      col: "Column",
      colgroup: "Column Group",
      data: "Data",
      datalist: "Datalist",
      dd: "Definition Description",
      del: "Deleted Text",
      details: "Details",
      dfn: "Definition",
      dialog: "Dialog",
      div: "Div",
      dl: "Definition List",
      dt: "Definition Term",
      em: "Emphasis",
      embed: "Embed",
      fieldset: "Fieldset",
      figcaption: "Figcaption",
      figure: "Figure",
      footer: "Footer",
      form: "Form",
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      h4: "Heading 4",
      h5: "Heading 5",
      h6: "Heading 6",
      head: "Head",
      header: "Header",
      hr: "Horizontal Rule",
      html: "HTML",
      i: "Italic",
      iframe: "IFrame",
      img: "Image",
      input: "Input",
      ins: "Inserted Text",
      kbd: "Keyboard",
      label: "Label",
      legend: "Legend",
      li: "List Item",
      link: "Link",
      main: "Main",
      map: "Map",
      mark: "Mark",
      meta: "Meta",
      meter: "Meter",
      nav: "Nav",
      noscript: "NoScript",
      object: "Object",
      ol: "Ordered List",
      optgroup: "Option Group",
      option: "Option",
      output: "Output",
      p: "Paragraph",
      param: "Param",
      picture: "Picture",
      pre: "Preformatted",
      progress: "Progress",
      q: "Quote",
      rp: "RP",
      rt: "RT",
      ruby: "Ruby",
      s: "Strikethrough",
      samp: "Sample",
      script: "Script",
      section: "Section",
      select: "Select",
      small: "Small",
      source: "Source",
      span: "Span",
      strong: "Strong",
      style: "Style",
      sub: "Subscript",
      summary: "Summary",
      sup: "Superscript",
      table: "Table",
      tbody: "Table Body",
      td: "Table Data",
      template: "Template",
      textarea: "Textarea",
      tfoot: "Table Footer",
      th: "Table Header",
      thead: "Table Head",
      time: "Time",
      title: "Title",
      tr: "Table Row",
      track: "Track",
      u: "Underline",
      ul: "Unordered List",
      var: "Variable",
      video: "Video",
      wbr: "WBR"
    };
    const displayName = _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase(tagName)] ?? (DEFAULTS[tagName] ? `HTML ${DEFAULTS[tagName]} Element` : "HTML Element");
    return this.converter(displayName, { formatCase, useAcronyms });
  }
  /** @internal */
  getCommentNodeType(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    if (value instanceof Comment) {
      return this.converter(
        _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase("comment")] ?? "Comment",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }
  /** @internal */
  getTextNodeType(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    if (value instanceof Text) {
      return this.converter(
        _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase("text")] ?? "Text",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }
  /** @internal */
  getOtherNodeType(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    if (typeof Node !== "undefined" && value instanceof Node) {
      return this.converter(
        _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase("node")] ?? "Node",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }
  /** ----------------------------------------------------------
   * * ***Retrieves the canonical string representation of a given `Symbol`.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Converts a JavaScript `Symbol` (including well-known symbols) into a standardized,
   *      human-readable name string.
   *    - Maps **well-known symbols** (e.g., `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toStringTag`)
   *      to their corresponding normalized key in {@link PreciseType.castableTable | `castableTable`}.
   *    - Supports formatted output according to the given `formatCase` and `useAcronyms` options.
   *    - Falls back to the general `"Symbol"` type name if the provided symbol is not recognized.
   *
   * - **Example:**
   *    ```ts
   *    const precise = new PreciseType();
   *
   *    precise.getSymbolName(Symbol.iterator);
   *    // ➜ "symbol-iterator"
   *
   *    precise.getSymbolName(Symbol.toStringTag, { formatCase: "toPascalCase" });
   *    // ➜ "SymbolToStringTag"
   *
   *    precise.getSymbolName(Symbol("custom"));
   *    // ➜ "symbol"
   *    ```
   *
   * - **Options:**
   *    - `formatCase` → Determines the string case style for the resulting symbol name.
   *    - `useAcronyms` → Preserves known acronyms (like `URL`, `DOM`, `HTML`) if set to `true`.
   *
   * - **⚠️ Internal:**
   *    - Helper for {@link getPreciseType | `getPreciseType`} that normalizes `Symbol` detection.
   *    - Not recommended for direct external use.
   *
   * @param value - The `Symbol` instance to analyze.
   * @param options - Optional settings for case formatting and acronym preservation.
   * @returns The formatted symbol name string.
   *
   * @internal
   */
  getSymbolName(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    const symbolMap = /* @__PURE__ */ new Map([
      [Symbol.iterator, "symboliterator"],
      [Symbol.asyncIterator, "symbolasynciterator"],
      [Symbol.toStringTag, "symboltostringtag"],
      [Symbol.species, "symbolspecies"],
      [Symbol.hasInstance, "symbolhasinstance"],
      [Symbol.isConcatSpreadable, "symbolisconcatspreadable"],
      [Symbol.unscopables, "symbolunscopables"],
      [Symbol.match, "symbolmatch"],
      [Symbol.replace, "symbolreplace"],
      [Symbol.search, "symbolsearch"],
      [Symbol.split, "symbolsplit"],
      [Symbol.toPrimitive, "symboltoprimitive"],
      [Symbol.matchAll, "symbolmatchall"]
    ]);
    const key = symbolMap.get(value);
    if (key) {
      return this.converter(
        _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase(key)] ?? key,
        {
          formatCase,
          useAcronyms
        }
      );
    }
    return this.converter(
      _PreciseType.FIXES_CASTABLE_TABLE[_PreciseType.normalizeKeyForCase("symbol")] ?? "Symbol",
      { formatCase, useAcronyms }
    );
  }
  /** ----------------------------------------------------------
   * * ***Detects the precise DOM node type of a given value.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Determines the specific **DOM Node subtype** (e.g., `HTMLDivElement`, `Comment`, `Text`, etc.)
   *      based on the given input `value`.
   *    - This method sequentially checks various DOM-related helpers:
   *      - {@link PreciseType.getHtmlElementType | `getHtmlElementType`}
   *      - {@link PreciseType.getCommentNodeType | `getCommentNodeType`}
   *      - {@link PreciseType.getTextNodeType | `getTextNodeType`}
   *      - {@link PreciseType.getOtherNodeType | `getOtherNodeType`}
   *    - Returns the first non-null type result found.
   *    - If no valid DOM node type is detected or an error occurs, it gracefully returns `null`.
   *
   * - **Example:**
   *    ```ts
   *    const detector = new PreciseType();
   *    detector.detectDomNodeType(document.createElement("div"));
   *    // ➜ "HTMLDivElement"
   *
   *    detector.detectDomNodeType(document.createComment("test"));
   *    // ➜ "Comment"
   *
   *    detector.detectDomNodeType("not a node");
   *    // ➜ null
   *    ```
   *
   * - **Options:**
   *    - `formatCase` → Controls the output formatting (e.g., `"toKebabCase"`, `"toPascalCase"`, etc.).
   *    - `useAcronyms` → Determines if acronyms like `"HTML"` or `"SVG"` remain uppercase.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`} to refine DOM-related type detection.
   *    - Not intended for direct external use.
   *
   * @param value - The value to be inspected for a DOM node type.
   * @param options - Optional configuration to adjust case formatting and acronym behavior.
   * @returns The detected DOM node type string, or `null` if not applicable.
   *
   * @internal
   */
  detectDomNodeType(value, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    try {
      return this.getHtmlElementType(value, { formatCase, useAcronyms }) || this.getCommentNodeType(value, { formatCase, useAcronyms }) || this.getTextNodeType(value, { formatCase, useAcronyms }) || this.getOtherNodeType(value, { formatCase, useAcronyms });
    } catch {
      return null;
    }
  }
  /** ----------------------------------------------------------
   * * ***Detects whether a given value is a Proxy instance.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Attempts to define and delete a temporary property to trigger potential Proxy traps.
   *    - Works because most Proxy handlers will throw or behave differently during these operations.
   *    - Transparent Proxies (without traps) will **not** be detected.
   *
   * @description
   * This method performs a heuristic check — it’s **not foolproof**, but reliably distinguishes
   * most Proxy-wrapped objects from ordinary ones without using non-standard APIs.
   *
   * @param value - The value to inspect.
   * @returns `true` if the value behaves like a Proxy (throws on property mutation),
   *          otherwise `false`.
   *
   * @example
   * ```ts
   * const target = {};
   * const proxy = new Proxy(target, {});
   *
   * console.log(preciseType.isProxy(target)); // false
   * console.log(preciseType.isProxy(proxy));  // false (transparent proxy)
   *
   * const proxyWithTrap = new Proxy(target, {
   *   set() { throw new Error("trap!"); }
   * });
   *
   * console.log(preciseType.isProxy(proxyWithTrap)); // true
   * ```
   *
   * @note
   * - Skips built-in native types (like `Array`, `Date`, `Map`, etc.) to prevent false positives.
   * - This is an **internal heuristic**, not a guaranteed Proxy detector.
   *
   * @internal
   */
  isProxy(value) {
    if (isNull(value) || !isObjectOrArray(value)) return false;
    const tag = Object.prototype.toString.call(value);
    const skipTags = [
      "[object Array]",
      "[object Date]",
      "[object RegExp]",
      "[object Map]",
      "[object Set]",
      "[object WeakMap]",
      "[object WeakSet]",
      "[object Function]",
      "[object Error]",
      "[object Promise]",
      "[object Generator]",
      "[object GeneratorFunction]",
      "[object AsyncFunction]"
    ];
    if (skipTags.includes(tag)) return false;
    try {
      Reflect.defineProperty(value, "__proxy_detect__", {
        configurable: true,
        value: 1
      });
      Reflect.deleteProperty(value, "__proxy_detect__");
      return false;
    } catch {
      return true;
    }
  }
  /** ----------------------------------------------------------
   * * ***Helper function to convert an input string to a specific casing/format.***
   * ----------------------------------------------------------
   *
   * @description
   * - Chooses the conversion function based on the `formatCase` option.
   * - Supports multiple casing/formatting functions:
   *   - `toPascalCaseSpace`.
   *   - `toPascalCase`.
   *   - `toCamelCase`.
   *   - `toKebabCase`.
   *   - `toSnakeCase`.
   *   - `toDotCase`.
   *   - `slugify`.
   * - Uses `ACRONYMS` as ignored words for certain conversion functions.
   *
   * @param {string} input - The string to convert.
   * @param {GetPreciseTypeOptions["formatCase"]} formatCase - The conversion method to apply.
   * @returns {string} The converted string according to the selected format.
   *
   * @example
   * converterHelper("hello world", "toCamelCase");
   * // ➔ "helloWorld"
   *
   * @example
   * converterHelper("my URL path", "slugify");
   * // ➔ "my-URL-path"
   *
   * @internal
   */
  converter(input, options) {
    const { formatCase, useAcronyms } = this.determineOptions(options);
    const ignoreWord = useAcronyms ? _PreciseType.ACRONYMS : [];
    switch (formatCase) {
      case "slugify":
        return slugify(input, ignoreWord);
      case "toDotCase":
        return toDotCase(input, ignoreWord);
      case "toCamelCase":
        return toCamelCase(input, ignoreWord);
      case "toSnakeCase":
        return toSnakeCase(input, ignoreWord);
      case "toLowerCase":
        return toLowerCase(input, ignoreWord);
      case "toPascalCase":
        return toPascalCase(input, ignoreWord);
      case "toPascalCaseSpace":
        return toPascalCaseSpace(input, ignoreWord);
      default:
        return toKebabCase(input, ignoreWord);
    }
  }
  /** ----------------------------------------------------------
   * * ***Normalizes a string key for consistent case-insensitive matching.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - This method removes all **spaces**, **underscores**, and **hyphens** from the given string,
   *      then converts the result to **lowercase**.
   *    - Used internally to ensure uniformity in key lookups and matching logic across
   *      type mapping tables like {@link PreciseType.fixesRaw | `fixesRaw`} and
   *      {@link PreciseType.castableTable | `castableTable`}.
   *
   * - **Example:**
   *    ```ts
   *    PreciseType.normalizeKeyForCase("Map.Type");   // ➔ "maptype"
   *    PreciseType.normalizeKeyForCase("Map-Type");   // ➔ "maptype"
   *    PreciseType.normalizeKeyForCase("Set Type");   // ➔ "settype"
   *    PreciseType.normalizeKeyForCase("Array_Type"); // ➔ "arraytype"
   *    ```
   *
   * - **⚠️ Internal:**
   *    - Helper method used by {@link getPreciseType | `getPreciseType`} and internal mapping constants.
   *    - Not intended for direct use in user code.
   *
   * @param k - The input string key to normalize.
   * @returns The normalized lowercase key with all separators removed.
   *
   * @internal
   */
  static normalizeKeyForCase(k) {
    return k.replace(/[\s_\-\.]+/g, "").toLowerCase();
  }
  /** ----------------------------------------------------------
   * * ***Getting the internal map of type castable relationships used by {@link getPreciseType | `getPreciseType`}.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Returns an internal static mapping table that defines which primitive or structural types
   *      can be cast or interpreted as another related type within the internal logic of
   *      {@link getPreciseType | `getPreciseType`}.
   *
   * - **⚠️ Internal:**
   *    - This is an internal helper of {@link getPreciseType | `getPreciseType`}.
   *    - Do not modify or rely on this table directly — it is **readonly** and may change without notice.
   *
   * @readonly
   */
  static get castableTable() {
    return _PreciseType.FIXES_CASTABLE_TABLE;
  }
  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of special type cases handled by {@link getPreciseType | `getPreciseType`}.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Returns an internal readonly list of specific type identifiers that require
   *      *custom handling* during type detection.
   *    - These are **exceptional values** or **edge cases** that don’t follow the normal
   *      JavaScript type resolution flow.
   *
   * - **Example Values:**
   *    - `"Infinity"`, `"-Infinity"`, `"NaN"`, `"undefined"`, etc.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - This property is **readonly** and should not be modified directly.
   *
   * @readonly
   */
  static get specialType() {
    return this.SPECIAL_TYPE;
  }
  /** ----------------------------------------------------------
   * * ***Retrieves the internal mapping of JavaScript built-in and environment-specific
   * type identifiers to their canonical PascalCase names.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Provides a mapping table where **keys** represent normalized raw type names
   *      (as obtained from `Object.prototype.toString.call(value)` or environment checks),
   *      and **values** represent their **canonical PascalCase equivalents**.
   *    - This table ensures consistent, human-readable type strings across different environments.
   *
   * - **Example Mapping:**
   *    ```ts
   *      {
   *        "[object Map]": "Map",
   *        "[object WeakMap]": "WeakMap",
   *        "[object AsyncFunction]": "AsyncFunction",
   *        "[object GeneratorFunction]": "GeneratorFunction",
   *        "[object BigInt]": "BigInt",
   *      }
   *    ```
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - This property is **readonly** and should not be modified directly.
   *
   * @readonly
   */
  static get fixesRaw() {
    return this.FIXES_RAW;
  }
  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of common acronyms that should remain fully uppercase during string formatting.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - This list defines acronyms (e.g., `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, `"DOM"`)
   *      that will be **preserved in uppercase** when applying case transformations through
   *      {@link getPreciseType | `getPreciseType`} or any formatting utility using it.
   *    - Ensures consistency in output for technical identifiers that are conventionally capitalized.
   *
   * - **Example:**
   *    ```ts
   *      ["URL", "HTTP", "HTML", "SVG", "XML", "DOM"]
   *    ```
   *
   * - **⚠️ Internal:**
   *     - Used internally by {@link getPreciseType | `getPreciseType`}.
   *     - This property is **readonly** and not intended for modification.
   *
   * @readonly
   */
  static get acronymsList() {
    return this.ACRONYMS;
  }
};
var getPreciseType = /* @__PURE__ */ (() => {
  const cache = /* @__PURE__ */ new Map();
  const MAX_CACHE_SIZE = 25;
  return (value, options = {}) => {
    if (!isPlainObject(options)) options = {};
    const key = JSON.stringify({
      formatCase: options.formatCase || "toKebabCase",
      useAcronyms: options.useAcronyms ?? false
    });
    let ClassPrecise = cache.get(key);
    if (!ClassPrecise) {
      if (cache.size >= MAX_CACHE_SIZE) cache.clear();
      ClassPrecise = new PreciseType(options);
      cache.set(key, ClassPrecise);
    }
    if (isNull(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("null")] ?? "Null"
      );
    }
    if (isNaN2(value)) return "NaN";
    if (isInfinityNumber(value)) return String(value);
    if (typeof BigInt !== "undefined" && value === BigInt) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("bigint constructor")]
      );
    }
    if (isNumberObject(value) || value === Number) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("number constructor")]
      );
    }
    if (isStringObject(value) || value === String) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("string constructor")]
      );
    }
    if (isBooleanObject(value) || value === Boolean) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("boolean constructor")]
      );
    }
    const prim = typeof value;
    if (!isObjectOrArray(value) && !isFunction(value) && prim !== "symbol") {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(prim)] ?? prim
      );
    }
    if (prim === "symbol") {
      return ClassPrecise.getSymbolName(value);
    }
    if (isObjectOrArray(value) && value.constructor?.name === "EventEmitter") {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("event emitter")] ?? "Event Emitter"
      );
    }
    const domType = ClassPrecise.detectDomNodeType(value);
    if (domType) return domType;
    if (isBuffer(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("buffer")] ?? "Buffer"
      );
    }
    if (ClassPrecise.isProxy(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("proxy")] ?? "Proxy"
      );
    }
    if (isObject(value) && isFunction(value?.next) && isFunction(value?.throw)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("generator")] ?? "Generator"
      );
    }
    if (isError(value)) {
      const ctorName2 = value.constructor?.name ?? "Error";
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(ctorName2)] ?? PreciseType.castableTable[PreciseType.normalizeKeyForCase(ctorName2.replace(/\s+/g, ""))] ?? ctorName2
      );
    }
    if (isObjectOrArray(value) && "done" in value && "value" in value && Object.keys(value).length === 2) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("iterator result")]
      );
    }
    if (isNull(Object.getPrototypeOf(value))) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("object")] ?? "Object"
      );
    }
    const tag = Object.prototype.toString.call(value).slice(8, -1) || "Object";
    const mapped = PreciseType.castableTable[PreciseType.normalizeKeyForCase(tag)];
    if (mapped) return ClassPrecise.converter(mapped);
    const ctorName = value?.constructor?.name;
    if (ctorName && ctorName !== "Object") {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(ctorName)] ?? ctorName
      );
    }
    return ClassPrecise.converter(tag);
  };
})();
var determineErrorTypeAssertion = (type, message) => {
  switch (type) {
    case "Error":
      throw new Error(message);
    case "EvalError":
      throw new EvalError(message);
    case "RangeError":
      throw new RangeError(message);
    case "ReferenceError":
      throw new ReferenceError(message);
    case "SyntaxError":
      throw new SyntaxError(message);
    case "URIError":
      throw new URIError(message);
    case "TypeError":
      throw new TypeError(message);
    default:
      throw new TypeError(message);
  }
};
function resolveErrorMessageAssertions(params) {
  const { requiredValidType, value, options } = params || {};
  const {
    message,
    formatCase,
    useAcronyms,
    errorType = "TypeError"
  } = isPlainObject(options) ? options : {};
  const validType = toKebabCase(requiredValidType);
  const currentType = getPreciseType(value, { formatCase, useAcronyms });
  const messageFnOptions = { currentType, validType };
  const defaultMessage = `Parameter input (\`value\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`;
  const errorMessage = isFunction(message) ? isNonEmptyString(message(messageFnOptions)) ? message(messageFnOptions).trim() : defaultMessage : isNonEmptyString(message) ? message.trim() : defaultMessage;
  return determineErrorTypeAssertion(errorType, errorMessage);
}
function assertIsPlainObject(value, options = {}) {
  if (isPlainObject(value)) return;
  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "plain object"
  });
}

var assertIsString = (value, options = {}) => {
  if (isString(value)) return;
  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "string"
  });
};

function isInteger(value) {
  return typeof value === "number" && Number.isInteger(value);
}

var isEmptyString = (value, options = {}) => {
  return !isNonEmptyString(value, options);
};

var isEmptyArray = (value) => {
  if (!isArray(value)) return true;
  return value.length === 0;
};
function isEmptyObject(value, options = {}) {
  if (!isObject(value)) {
    return true;
  }
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const checkSymbols = hasOwnProp(options, "checkSymbols") ? options.checkSymbols : false;
  assertIsBoolean(checkSymbols, {
    message: ({ currentType, validType }) => `Parameter \`checkSymbols\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const hasNoKeys = Object.keys(value).length === 0;
  if (checkSymbols) {
    return hasNoKeys && Object.getOwnPropertySymbols(value).length === 0;
  }
  return hasNoKeys;
}

var isBigInt = (value) => {
  return typeof value === "bigint";
};

function isMap(value) {
  return Object.prototype.toString.call(value) === "[object Map]" || value instanceof Map;
}
var isDate = (value, options = {}) => {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const skipInvalidDate = isPlainObject(options) && isBoolean(options.skipInvalidDate) ? options.skipInvalidDate : false;
  const instanceDate = value instanceof Date;
  if (skipInvalidDate) return instanceDate;
  return instanceDate && !isNaN2(value.getTime());
};
var safeStableStringify = (value, options = {}) => {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const pretty = hasOwnProp(options, "pretty") ? options.pretty : false;
  const sortKeys = hasOwnProp(options, "sortKeys") ? options.sortKeys : true;
  const sortArray = hasOwnProp(options, "sortArray") ? options.sortArray : false;
  const keepUndefined = hasOwnProp(options, "keepUndefined") ? options.keepUndefined : false;
  if (!isBoolean(sortKeys) || !isBoolean(sortArray) || !isBoolean(pretty) || !isBoolean(keepUndefined)) {
    throw new TypeError(
      `Parameters \`sortKeys\`, \`sortArray\`, \`keepUndefined\` and \`pretty\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: "['sortKeys': \`${getPreciseType(
        sortKeys
      )}\`, 'sortArray': \`${getPreciseType(
        sortArray
      )}\`, 'keepUndefined': \`${getPreciseType(
        keepUndefined
      )}\`, 'pretty': \`${getPreciseType(pretty)}\`]".`
    );
  }
  if (isUndefined(value)) {
    return keepUndefined ? "undefined" : "null";
  }
  const seen = /* @__PURE__ */ new WeakSet();
  const isPrimitive = (val) => isNull(val) || !isObjectOrArray(val) && !isFunction(val);
  const deepProcess = (val) => {
    if (isNumberObject(val)) {
      const valOf = val.valueOf();
      return isNaN2(valOf) || isInfinityNumber(valOf) ? null : valOf;
    }
    if (isStringObject(val)) return val.valueOf();
    if (isBooleanObject(val)) return val.valueOf();
    if (isFunction(val) || isSymbol(val)) return void 0;
    if (isBigInt(val)) return val.toString();
    if (isNaN2(val) || isInfinityNumber(val)) return null;
    if (isUndefined(val)) {
      return keepUndefined ? void 0 : null;
    }
    if (isObjectOrArray(val)) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
      if (isDate(val)) return val.toISOString();
      if (isMap(val)) {
        return {
          map: Array.from(val.entries()).map(([k, v]) => [k, deepProcess(v)])
        };
      }
      if (isSet(val)) return { set: Array.from(val.values()).map(deepProcess) };
      if (isArray(val)) {
        const processedArr = val.map(deepProcess);
        if (sortArray) {
          const primitives = [];
          const nonPrimitives = [];
          for (const item of processedArr) {
            if (isPrimitive(item)) primitives.push(item);
            else nonPrimitives.push(item);
          }
          primitives.sort((a, b) => {
            if (isNumber(a) && isNumber(b)) return a - b;
            return String(a).localeCompare(String(b));
          });
          return [...primitives, ...nonPrimitives];
        }
        return processedArr;
      }
      const keys = Object.keys(val);
      if (sortKeys) {
        keys.sort((a, b) => {
          const na = Number(a);
          const nb = Number(b);
          if (!isNaN2(na) && !isNaN2(nb)) return na - nb;
          return a.localeCompare(b);
        });
      }
      const result = {};
      if (isObject(val)) {
        for (const k of keys) {
          const v = deepProcess(val[k]);
          if (!isUndefined(v)) result[k] = v;
        }
      }
      return result;
    }
    return val;
  };
  try {
    return JSON.stringify(deepProcess(value), null, pretty ? 2 : 0);
  } catch (err) {
    console.warn("Error in safeStableStringify:", err);
    return "{}";
  }
};

var isServer = () => {
  return typeof window === "undefined" || typeof document === "undefined";
};

function assertIsArray(value, options) {
  if (isArray(value)) return;
  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "array"
  });
}

var noop = () => {
};

var parseCustomDate = (dateString, format) => {
  if (!isNonEmptyString(dateString) || !isNonEmptyString(format)) {
    throw new TypeError(
      `Parameter \`dateString\` and \`format\` must be of type \`string\` and not empty-string, but received: "['dateString': \`${getPreciseType(
        dateString
      )}\` - (current value: \`${safeStableStringify(dateString, {
        keepUndefined: true
      })}\`), 'format': \`${getPreciseType(
        format
      )}\` - (current value: \`${safeStableStringify(format, {
        keepUndefined: true
      })}\`)]".`
    );
  }
  const dateParts = dateString.split(/[-/]/).map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) return null;
  let day, month, year;
  if (format === "DD/MM/YYYY") {
    [day, month, year] = dateParts;
  } else if (format === "MM/DD/YYYY") {
    [month, day, year] = dateParts;
  } else {
    return null;
  }
  month -= 1;
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  return date;
};
var validateJsonParsingOptions = (optionsValue = {}) => {
  assertIsPlainObject(optionsValue, {
    message: ({ currentType, validType }) => `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });
  const convertBooleans = hasOwnProp(optionsValue, "convertBooleans") ? optionsValue.convertBooleans : false;
  const convertDates = hasOwnProp(optionsValue, "convertDates") ? optionsValue.convertDates : false;
  const convertNumbers = hasOwnProp(optionsValue, "convertNumbers") ? optionsValue.convertNumbers : false;
  const loggingOnFail = hasOwnProp(optionsValue, "loggingOnFail") ? optionsValue.loggingOnFail : false;
  const removeEmptyArrays = hasOwnProp(optionsValue, "removeEmptyArrays") ? optionsValue.removeEmptyArrays : false;
  const removeEmptyObjects = hasOwnProp(optionsValue, "removeEmptyObjects") ? optionsValue.removeEmptyObjects : false;
  const removeNulls = hasOwnProp(optionsValue, "removeNulls") ? optionsValue.removeNulls : false;
  const removeUndefined = hasOwnProp(optionsValue, "removeUndefined") ? optionsValue.removeUndefined : false;
  const strictMode = hasOwnProp(optionsValue, "strictMode") ? optionsValue.strictMode : false;
  const checkSymbols = hasOwnProp(optionsValue, "checkSymbols") ? optionsValue.checkSymbols : false;
  const convertNaN = hasOwnProp(optionsValue, "convertNaN") ? optionsValue.convertNaN : false;
  const customDateFormats = hasOwnProp(optionsValue, "customDateFormats") ? optionsValue.customDateFormats : [];
  const onError = hasOwnProp(optionsValue, "onError") ? optionsValue.onError : noop;
  if (!(isBoolean(convertBooleans) && isBoolean(convertDates) && isBoolean(convertNumbers) && isBoolean(convertNaN) && isBoolean(checkSymbols) && isBoolean(loggingOnFail) && isBoolean(removeEmptyArrays) && isBoolean(removeEmptyObjects) && isBoolean(removeNulls) && isBoolean(removeUndefined) && isBoolean(strictMode) && isArray(customDateFormats) && isFunction(onError))) {
    throw new TypeError(
      `Invalid \`options\` parameter (second argument): \`convertBooleans\`, \`convertDates\`, \`convertNumbers\`, \`loggingOnFail\`, \`removeEmptyArrays\`, \`removeEmptyObjects\`, \`removeNulls\`, \`removeUndefined\`, \`strictMode\` expected to be a \`boolean\` type, \`customDateFormats\` expected to be a \`array\` type and \`onError\` expected to be a \`void function\` type. But received: ['convertBooleans': \`${getPreciseType(
        convertBooleans
      )}\`, 'convertDates': \`${getPreciseType(
        convertDates
      )}\`, 'convertNumbers': \`${getPreciseType(
        convertNumbers
      )}\`, 'loggingOnFail': \`${getPreciseType(
        loggingOnFail
      )}\`, 'removeEmptyArrays': \`${getPreciseType(
        removeEmptyArrays
      )}\`, 'removeEmptyObjects': \`${getPreciseType(
        removeEmptyObjects
      )}\`, 'removeNulls': \`${getPreciseType(
        removeNulls
      )}\`, 'removeUndefined': \`${getPreciseType(
        removeUndefined
      )}\`, 'strictMode': \`${getPreciseType(
        strictMode
      )}\`, 'customDateFormats': \`${getPreciseType(
        customDateFormats
      )}\`, 'onError': \`${getPreciseType(onError)}\`].`
    );
  }
  return {
    convertBooleans,
    convertDates,
    convertNumbers,
    convertNaN,
    loggingOnFail,
    removeEmptyArrays,
    removeEmptyObjects,
    removeNulls,
    removeUndefined,
    strictMode,
    customDateFormats,
    onError,
    checkSymbols
  };
};
var cleanParsedData = (data, options = {}) => {
  const validOptions = validateJsonParsingOptions(options);
  if (isNull(data)) return validOptions.removeNulls ? void 0 : null;
  if (isUndefined(data)) return validOptions.removeUndefined ? void 0 : void 0;
  if (isString(data)) {
    const trimmed = data.trim();
    if (validOptions.convertNaN && trimmed === "NaN") return NaN;
    if (validOptions.convertNumbers && !isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
    if (validOptions.convertBooleans) {
      if (trimmed === "true") return true;
      if (trimmed === "false") return false;
    }
    if (validOptions.convertDates) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
        return new Date(trimmed);
      }
      if (validOptions.customDateFormats?.length) {
        for (const format of validOptions.customDateFormats) {
          const date = parseCustomDate(trimmed, format);
          if (date) return date;
        }
      }
    }
    return validOptions.strictMode ? void 0 : trimmed;
  }
  if (isArray(data)) {
    const cleanedArray = data.map((item) => cleanParsedData(item, validOptions)).filter((item) => !isUndefined(item));
    return validOptions.removeEmptyArrays && isEmptyArray(cleanedArray) ? void 0 : cleanedArray;
  }
  if (isObject(data)) {
    const cleanedObject = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const cleanedValue = cleanParsedData(data[key], validOptions);
        if (!isUndefined(cleanedValue)) {
          cleanedObject[key] = cleanedValue;
        }
      }
    }
    return validOptions.removeEmptyObjects && isEmptyObject(cleanedObject, { checkSymbols: validOptions.checkSymbols }) ? void 0 : cleanedObject;
  }
  return validOptions.strictMode ? void 0 : data;
};
var extractDigits = (value) => {
  if (!isString(value) && !isNumber(value)) return 0;
  const cleaned = String(value).trim().replace(/[^0-9]/g, "");
  return Number(cleaned) || 0;
};
function fixSingleQuotesEscapeBackslash(input) {
  const validEscapes = /* @__PURE__ */ new Set(["\\", '"', "/", "b", "f", "n", "r", "t", "u"]);
  let output = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escapeNext = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (escapeNext) {
      if (inSingleQuote) {
        if (c === "'") {
          output += "'";
        } else if (validEscapes.has(c)) {
          if (c === "\\") {
            output += "\\\\";
          } else if (c === '"') {
            output += '\\"';
          } else {
            output += "\\" + c;
          }
        } else {
          output += "\\\\" + c;
        }
      } else if (inDoubleQuote) {
        if (c === '"') {
          output += '\\"';
        } else if (validEscapes.has(c)) {
          output += "\\" + c;
        } else {
          output += "\\\\" + c;
        }
      } else {
        output += "\\" + c;
      }
      escapeNext = false;
      continue;
    }
    if (c === "\\") {
      escapeNext = true;
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = true;
        continue;
      }
      if (c === '"') {
        output += '"';
        inDoubleQuote = true;
        continue;
      }
    } else if (inSingleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = false;
        continue;
      }
    } else if (inDoubleQuote) {
      if (c === '"') {
        output += '"';
        inDoubleQuote = false;
        continue;
      }
    }
    output += c;
  }
  return output;
}
function safeJsonParse(value, options = {}) {
  if (isNull(value)) return null;
  const validOptions = validateJsonParsingOptions(options);
  if (validOptions.convertNaN && (isNaN2(value) || isNonEmptyString(value) && value === "NaN")) {
    return NaN;
  }
  if (validOptions.convertNumbers && !isNaN2(Number(value)) && isNumber(extractDigits(value))) {
    return Number(value);
  }
  if (!isString(value)) return void 0;
  try {
    let normalized = fixSingleQuotesEscapeBackslash(value);
    if (validOptions.removeUndefined) {
      normalized = normalized.replace(/,\s*"[^"]*"\s*:\s*undefined(?=\s*[},])/g, "").replace(/"[^"]*"\s*:\s*undefined\s*(,)?/g, "");
    } else {
      normalized = normalized.replace(/:\s*undefined(?=\s*[,}])/g, ":null");
    }
    if (validOptions.convertNaN) {
      normalized = normalized.replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"');
    } else {
      normalized = normalized.replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"').replace(/,\s*"[^"]*"\s*:\s*NaN(?=\s*[},])/g, "").replace(/"[^"]*"\s*:\s*NaN\s*(,)?/g, "");
    }
    normalized = normalized.replace(/,(\s*[}\]])/g, "$1");
    const parsed = JSON.parse(normalized);
    return cleanParsedData(parsed, validOptions);
  } catch (error) {
    if (validOptions.loggingOnFail) {
      console.error("Failed to parsing at `safeJsonParse`:", error);
    }
    validOptions.onError(
      isError(error) ? new Error(error.message.replace(/^JSON\.parse:/, "Failed to parsing")) : new Error(String(error))
    );
    return void 0;
  }
}

var realValue = (value) => {
  return safeStableStringify(value, { keepUndefined: true });
};
/*! Bundled license information:

@rzl-zone/utils-js/dist/chunk-MSUW5VHZ.js:
@rzl-zone/utils-js/dist/chunk-3T6VSWYX.js:
@rzl-zone/utils-js/dist/chunk-WVSPXFTY.js:
@rzl-zone/utils-js/dist/chunk-ULQPCIA2.js:
@rzl-zone/utils-js/dist/chunk-GOFINGT6.js:
@rzl-zone/utils-js/dist/chunk-QNKGP5DY.js:
@rzl-zone/utils-js/dist/chunk-AXDYWO67.js:
@rzl-zone/utils-js/dist/chunk-L5RDAVVH.js:
@rzl-zone/utils-js/dist/predicates/index.js:
@rzl-zone/utils-js/dist/chunk-RZOGBYIS.js:
@rzl-zone/utils-js/dist/chunk-YWHHVDT4.js:
@rzl-zone/utils-js/dist/chunk-BOYP3ARU.js:
@rzl-zone/utils-js/dist/conversions/index.js:
  (*!
   * ====================================================
   * Rzl Utils-JS.
   * ----------------------------------------------------
   * Version: 3.11.0.
   * Author: Rizalvin Dwiky.
   * Repository: https://github.com/rzl-zone/utils-js.
   * ====================================================
   *)
*/

export { CONFIG, assertIsArray, assertIsBoolean, assertIsString, getPreciseType, hasOwnProp, isArray, isBoolean, isEmptyString, isError, isInteger, isNil, isNonEmptyString, isNull, isNumber, isObject, isPlainObject, isServer, isString, isUndefined, realValue, safeJsonParse, safeStableStringify };
