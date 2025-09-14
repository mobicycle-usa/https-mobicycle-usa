// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      const existingVary = c.req.header("Vary");
      if (existingVary) {
        set("Vary", existingVary);
      } else {
        set("Vary", "Origin");
      }
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
  };
};

// src/layouts/layout.ts
function renderLayout(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link href="/output.css" rel="stylesheet">
    <title>${title}</title>
    <style>
      body { margin: 0; padding: 0; background: #000; }
      .layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
      .layer img { width: 100%; height: 100%; object-fit: cover; }
      .layer::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }
    </style>
  </head>
  <body>
    
    <!-- Fixed Background Layers (negative z-index to stay behind content) -->
    
    <!-- z-50: Sky (furthest back) -->
    <div class="layer" style="z-index: -50;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/fde8716c-ca6a-4614-03a6-a9922d36d100/2000" alt="Sky" />
    </div>
    
    <!-- z-40: Mountains -->
    <div class="layer" style="z-index: -40;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/95897b23-c845-4ca9-932a-4fac7dcb6c00/2000" alt="Mountains" />
    </div>
    
    <!-- z-30: Hills -->
    <div class="layer" style="z-index: -30;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/9bc17223-ec67-491d-948a-0e1f908fa600/2000" alt="Hills" />
    </div>
    
    <!-- z-20: Forest (front) -->
    <div class="layer" style="z-index: -20;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/0844a762-d277-481d-5dbc-f2c69820bf00/2000" alt="Forest" />
    </div>
    
    <!-- Scrollable Content Container -->
    <div class="">
      ${content}
    </div>
    
  </body>
</html>`;
}

// src/components/Header.ts
function renderHeader() {
  return `
    <div class="inline-block p-20 xl:ml-64 space-y-6 bg-gradient-to-l from-slate-500 border-r rounded-md">
      <div class="flex justify-end md:text-left pr-8 md:pr-0">
        <h2 class="inline-block leading-relaxed font-light text-purple-650 dark:text-purple-650 text-sm">
          Tech to save the planet.
        </h2>
      </div>
      <div class="flex text-right md:text-left pr-8 md:pr-0">
        <h5 class="tracking-widest font-extralight w-fit rounded-md text-xs p-1 sm:text-slate-200 text-slate-50">
        </h5>
      </div>
      <div class="flex-nowrap text-right md:text-left pr-8 md:pr-0">
        <h2 class="flex leading-relaxed font-light text-orange-650 text-3xl md:text-5xl lg:text-6xl">
          Scope 3 management
        </h2>
          <h2 class="flex leading-relaxed font-light italic text-slate-50 text-3xl md:text-5xl lg:text-6xl">
          of electronics & electricals
        </h2>
      </div>
    </div>
  `;
}

// src/components/SectionOne.ts
function renderSectionOne() {
  return `
    <section class="border-transparent rounded-lg md:text-slate-50">
      <div class="container mx-auto lg:mt-10 border-transparent rounded-lg lg:hover:bg-slate-900">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20 h-full mx-auto rounded-3xl py-8 md:py-28 md:px-8">
          <!-- LEFT -->
          <div class="w-full h-full dark:bg-transparent-650">
            <section class="relative">
              <div class="container px-4 mx-auto">
                <div class="flex flex-wrap items-center -mx-4">
                  <div class="w-full px-4">
                    <div class="max-w-lg text-center lg:mr-auto text-inherit dark:text-white-650">
                      
                      <!-- QUOTES -->
                      <span class="inline-block mb-10">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M26 29.45C26 19.3858 33.4577 8.86747 45.2297 6.16443C45.6793 6.0612 46.1364 6.29467 46.3301 6.71327L47.5161 9.27572C47.7602 9.80299 47.5031 10.4238 46.9877 10.692C43.3044 12.608 40.1644 17.1966 39.3647 20.8059C39.2493 21.3268 39.6241 21.8042 40.1413 21.9351C44.6581 23.0784 48 27.1681 48 32.042C48 38.406 42.832 42 37.602 42C31.572 42 26 37.39 26 29.45ZM0 29.45C0 19.3858 7.45772 8.86747 19.2297 6.16443C19.6793 6.0612 20.1364 6.29467 20.3301 6.71327L21.5161 9.27572C21.7602 9.80299 21.5031 10.4238 20.9877 10.692C17.3044 12.608 14.1644 17.1966 13.3647 20.8059C13.2493 21.3268 13.6241 21.8042 14.1413 21.9351C18.6581 23.0784 22 27.1681 22 32.042C22 38.406 16.832 42 11.602 42C5.572 42 0 37.39 0 29.45Z" fill="#dfab82"></path>
                        </svg>
                      </span>
                      
                      <h2 class="mb-10 text-xl italic font-extralight leading-none font-heading text-orange-650">
                        Super greenhouse gases
                      </h2>
                      
                      <p class="flex mx-auto mb-10 text-inherit">
                        We release super greenhouse gases into the atmosphere, pollute the planet and destroy habitats when we
                      </p>
                      
                      <ul class="flex flex-wrap justify-center max-w-md space-y-4">
                        <li class="ml-4 font-bold list-none text-inherit">mine for minerals;</li>
                        <li class="ml-4 font-bold list-none text-inherit">manufacture, purchase, or sell electronics and electricals; and</li>
                        <li class="ml-4 font-bold list-none text-inherit">discard electronic waste.</li>
                      </ul>
                      
                      <p class="mt-10 text-inherit">
                        Better management of electronics and electricals can minimize our contribution to greenhouse gas emissions (Scope 3), biodiversity loss and pollution.
                      </p>
                      
                      <p class="mt-10 text-inherit">
                        Whether you work for a company, government, non-profit, manufacturer, retailer or in waste management, MobiCycle can help you lessen the damage your electronic and electrical equipment has on the environment at each point in your supply chain; from source to disposal.
                      </p>
                      
                      <!-- CONTACT SALES AND PLATFORM BUTTONS -->
                      <div class="mt-10 space-y-4">
                        <a href="/contact" class="inline-block px-8 py-3 text-white bg-orange-650 rounded hover:bg-orange-700">Contact Sales</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          <!-- RIGHT -->
          <div class="w-full pr-8 space-y-10 border-l-2 border-purple-650 xl:pr-0 dark:text-slate-50">
            <!-- TITLE -->
            <div class="mx-auto ml-8 space-y-10">
              <div class="space-y-6">
                <p class="flex mx-auto text-center leading-relaxed text-inherit text-2xl max-w-xl justify-center">
                  Did you know your supply chain generates as much as 80% of your
                  total greenhouse gas emissions?
                </p>
                <p class="flex mx-auto text-center justify-center max-w-md font-light text-inherit text-lg">
                  Or that electronic waste is the world's fastest growing waste
                  stream?
                </p>
              </div>

              <p class="text-inherit">
                Greenhouse emissions from your supply chain are known as "Scope 3".
                Our platform helps you manage the Scope 3 emissions, biodiversity
                loss and pollution created by your electronics and electricals.
              </p>

              <p class="text-inherit">
                <b>It's important to note that we do not physically handle waste.</b>
              </p>
            </div>

            <div class="container mx-auto ml-8">
              <h1 class="text-lg font-extralight">I. EE Management</h1>
            </div>

            <!-- PARAGRAPHS -->
            <div class="ml-8">
              <p class="text-inherit">
                <i><b>Mining.</b></i> Renewables are the accepted cure to curb global
                warming, however, they power just 3% of the world's energy. To meet the
                increasing global demand, experts estimate that we will need to collect
                and refine minerals at a rate that is 7000% higher than current levels.
                Where will we obtain the necessary quantities? How will refining these
                quantities affect the planet? Unless we reclaim the minerals via urban
                mining, we will mine for virgin metals. Mining at this scale will encourage
                destructive mining practices. For example, refineries poison groundwater
                systems and devastate local ecosystems. If these issues resonate with
                you, we can help motivate your upstream suppliers to adopt best practices.
                We envision a future in which the mining sector invests in desalination
                plants to reduce groundwater use, tracks super greenhouse gases released
                during the refining process and funds urban mining programs.
              </p>
            </div>

            <div class="ml-8">
              <p class="text-inherit">
                <i><b>Manufacturing.</b></i>The manufacturing processes for
                electronics and electricals release extremely potent greenhouse
                gases. Sulfur hexafluoride (SF<sub>6</sub>) has a global warming
                potential 24,000 times greater than that of carbon dioxide (CO<sub>2</sub>) when measured over a 100-year period. Nitrogen trifluoride (NF<sub>3</sub>) is 17 thousand times greater. Get meaningful, actionable data
                about the environmental impact of your microelectronics or
                semiconductor devices - from your flat-panel displays and
                photovoltaics to cell phones or computers, to batteries for your
                corporate electric vehicles.
              </p>
            </div>

            <div class="ml-8">
              <p class="text-inherit">
                <i><b>Purchases and Sales.</b></i>As intermediaries between manufacturers and consumers, electronics retailers exert considerable influence throughout the product lifecycle, impacting both its creation and post-consumer phases. Retailers are uniquely positioned to mitigate environmental issues by initiating take-back schemes or recycling programs. Retailers can play a crucial role in managing the electronics waste stream, facilitating the identification of primary contributors to eWaste. Furthermore, retailers bear the responsibility of fostering sustainability within their product selections. Retailers should prioritize products characterized by energy efficiency, the use of recycled materials, or those that are readily recyclable upon reaching the end of their lifecycle. Through the promotion of refurbished goods and supporting electronics repair services, retailers contribute to prolonging product lifespans, thereby diminishing the environmental footprint associated with electronic goods.
              </p>
            </div>

            <div class="container mx-auto ml-8">
              <h1 class="text-lg font-extralight">II. eWaste Management</h1>
            </div>

            <div class="ml-8">
              <p class="text-inherit">
                <i><b>Disposals.</b></i>Broken or outdated electronics are subject
                to hazardous waste disposal laws, anti-dumping regulations, and
                more. Yet, just 10% of electronic waste is recycled globally. eWaste
                degrades the natural defenses within our environment. When
                improperly treated, eWaste pollutes our air, soil and waterways. A
                weakened ecosystem has a negative impact on biodiversity. We need
                these defenses to fight climate change. Our digital solutions
                provide insight into where your eWaste really goes. Use our
                specialty eWaste containers to protect your abandoned electronics from
                erosion and damage, making reuse more likely.<br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// src/components/SectionTwo.ts
function renderSectionTwo() {
  return `
    <section class="">
      <div class="container mx-auto w-full">
        <h2 class="font-heading mb-10 text-4xl text-slate-500 dark:text-slate-50 md:text-slate-50 tracking-tight">
          <span>What sets us</span>
          <span class="text-orange-650 italic"> apart?</span>
        </h2>

        <!-- Grid for platform -->
        <div class="border-transparent rounded-lg dark:hover:bg-slate-900 grid grid-cols-1 lg:grid-cols-4 gap-y-10 md:gap-8 text-slate-500 dark:text-slate-50 md:text-slate-50">
          
          <!-- LEFT -->
          <div class="p col-span-2 w-full h-full">
            <div class="h-full border-transparent rounded lg:bg-slate-950">
              <div class="flex flex-col justify-between h-full md:p-10 space-y-8 min-w-full">
                <!-- Item ONE -->
                <div class="w-full">
                  <div class="flex gap-3">
                    <!-- NUMBER -->
                    <div class="w-12 h-12 bg-gradient-to-b from-orange-650 rounded flex items-center justify-center">01</div>
                    <!-- CONTENT -->
                    <div>
                      <h3 class="font-heading mb-2 text-xl text-orange-650">
                        Shifting priorities away from profit-driven approaches
                      </h3>
                      <p class="max-w-xl">
                        Unlike waste brokers, our primary concern is finding effective ways to minimize your greenhouse gas emissions, address biodiversity loss, and mitigate pollution.
                      </p>
                    </div>
                  </div>
                </div>
                <!-- Item TWO -->
                <div class="w-full">
                  <div class="flex gap-3">
                    <!-- NUMBER -->
                    <div class="w-12 h-12 bg-gradient-to-b from-orange-650 rounded flex items-center justify-center">02</div>
                    <!-- CONTENT -->
                    <div>
                      <h3 class="font-heading mb-2 text-xl text-orange-650">
                        Providing a nuanced perspective
                      </h3>
                      <p class="max-w-xl">
                        We act as intermediaries between you and your suppliers, ensuring objectivity in our recommendations and solutions. It's important to note that we do not handle waste directly.
                      </p>
                    </div>
                  </div>
                </div>
                <!-- Item THREE -->
                <div class="w-full">
                  <div class="flex gap-3">
                    <!-- NUMBER -->
                    <div class="w-12 h-12 bg-gradient-to-b from-orange-650 rounded flex items-center justify-center">03</div>
                    <!-- CONTENT -->
                    <div>
                      <h3 class="font-heading mb-2 text-xl text-orange-650">
                        Specializing in emissions from electronics and electricals
                      </h3>
                      <p class="max-w-xl">
                        While large consultancies may have a broad focus, we concentrate specifically on Scope 3 emissions generated by electronics and electricals.
                      </p>
                    </div>
                  </div>
                </div>
               </div>
            </div>    
          </div>

          <!-- RIGHT - VIDEO Section -->
          <div class="relative col-span-2 overflow-hidden rounded-lg min-w-full" style="position: relative; padding-top: 56.25%;">
            <iframe
              src="https://customer-zyqhqr3nriw4xbsg.cloudflarestream.com/094a245b68e882d3242c936785611862/iframe?preload=true&poster=https%3A%2F%2Fcustomer-zyqhqr3nriw4xbsg.cloudflarestream.com%2F094a245b68e882d3242c936785611862%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
              loading="lazy"
              style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowfullscreen="true"
              title="Explanation of MobiCycle Consulting">
            </iframe>
          </div>

        </div>

      </div>
    </section>
  `;
}

// src/components/SectionThree.ts
function renderSectionThree() {
  return `
    <!-- OUR PLATFORM -->
    <section class="">
      <div class="container mx-auto px-0 py-0">
        <h2 class="font-heading mb-0 text-4xl text-slate-500 dark:text-slate-50 md:text-slate-50 tracking-tight">
          <span>Our</span>
          <span class="text-orange-650"> Platform</span>
        </h2>

        <!-- Grid for platform -->
        <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-2 pt-10 rounded text-slate-500 dark:text-slate-50 md:text-slate-50">
          
          <!-- MOBICYCLE CONSULTING -->
          <div class="w-full transition-all ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 z-10">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-bl from-slate-950 ">
              <div class="flex flex-col justify-between h-full">

                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase tracking-widest">MobiCycle Consulting</span>
                    <h1>Start with an independent evaluation of your electronics and
                      electricals supply chain through our independent review
                      process.
                    </h1>
                </div>

                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://mobicycle.consulting"
                        >Visit MobiCycle Consulting</a>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <!-- MOBICYCLE TECHNOLOGIES -->
          <div class="w-full transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none z-10">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-tl from-slate-950 via-slate-800">
              <div class="flex flex-col justify-between h-full">

                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase"
                    >MobiCycle Technologies</span>
                    <h1>We leverage AI to understand emissions from your suppliers.
                      Our comprehensive suite of digital tools supports efficient
                      eWaste operations. To facilitate proper waste management, we
                      offer specialized waste bins.</h1>
                </div>

                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://mobicycle.tech"
                        >Visit MobiCycle Technologies</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- MOBICYCLE GAMES -->
          <div class="w-full transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none z-10">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-tr from-slate-950 via-slate-800">
              <div class="flex flex-col justify-between h-full">

                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase tracking-widest">MobiCycle Games</span>
                    <h1>Embark on immersive journeys through virtual worlds centered
                      around the challenges of climate change, pollution, and
                      eWaste. Envision a more sustainable future and explore ways to
                      create a better planet.</h1>
                </div>

                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://mobicycle.games">Visit MobiCycle Games</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- MOBICYCLE MARKETING -->
          <div class="w-full box transition-all ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 z-10" id="delay">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-b from-slate-950 via-slate-800">
              <div class="flex flex-col justify-between h-full">

                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase"
                    >MobiCycle Marketing</span>
                    <h1>
                      Promote your environmental progress to your customers by
                      showcasing your best practices and technological innovations
                      that have contributed to sustainable outcomes. Share your
                      success stories and inspire others to follow suit.
                    </h1>
                </div>

                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://mobicycle.marketing"
                        >Visit MobiCycle Marketing</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// src/components/SectionFour.ts
function renderSectionFour() {
  return `
    <!-- GET STARTED -->
    <section class="pb-20">
      <div class="container mx-auto px-0 py-0">
        <h2 class="font-heading mb-0 text-4xl text-slate-500 dark:text-slate-50 md:text-slate-50 tracking-tight">
          <span>Get</span>
          <span class="text-orange-650"> Started</span>
        </h2>

        <!-- Grid for platform -->
        <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-2 pt-10 bg-gradient-to-t from-transparent-650 rounded text-slate-500 dark:text-slate-50 md:text-slate-50">
          
          <!-- LEARN -->
          <div class="w-full transition-all ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 z-10">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-slate-950">
              <div class="flex flex-col justify-between h-full">
                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase tracking-widest">LEARN</span>
                    <h1>
                      Dive into the world of our innovative solutions by exploring detailed resources designed to enhance your understanding and appreciation of our products. 
                      Access our comprehensive library of <b>white papers</b>, <b>blog posts</b> and <b>videos</b> that provide valuable insights into how our technology can streamline your operations and drive sustainability.
                    </h1>
               </div>
                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://about.mobicycle.group">About Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TRY -->
          <div class="w-full transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-tl from-slate-950 via-slate-800">
              <div class="flex flex-col justify-between h-full">
                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase">TRY</span>
                    <h1>
                      Put our platform to the test with a free trial that gives you full access to our platform's capabilities. Experiment with our tools and features in real-world scenarios to see firsthand how they can resolve your specific challenges. No commitments, just a straightforward opportunity to evaluate our solutions at your pace.
                    </h1>
                </div>

                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://demos.mobicycle.group">Demos</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BUY -->
          <div class="w-full transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-gradient-to-bl from-slate-950 via-slate-800">
              <div class="flex flex-col justify-between h-full">
                
                <!-- BUY  -->
                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase tracking-widest">BUY</span>
                    <h1>
                      Ready to take the next step? Purchasing our solution is simple and straightforward. Choose the package that best suits your needs, and gain full access to our suite of tools and customer support. Our sales team is ready to assist with personalized options and special offers that align with your business requirements. 
                    </h1>
                </div>

                <!-- PRICING BUTTON -->
                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a
                        class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://pricing.mobicycle.group">Pricing</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- GET SUPPORT -->
          <div class="w-full box transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 z-10" id="delay">
            <div class="py-16 px-8 text-center h-full border-transparent rounded lg:bg-slate-950">
              <div class="flex flex-col justify-between h-full">
                
                <!-- GET SUPPORT -->
                <div class="flex-initial mb-10">
                  <span class="inline-block mb-6 text-sm text-inherit uppercase">GET SUPPORT</span>
                    <h1>
                      Our commitment to you extends beyond the sale. Once you're part of our community, you gain access to our dedicated support team available 24/7 to ensure your experience is smooth and beneficial. Whether you need help troubleshooting, want to expand your usage, or have any questions, we're here to assist.
                    </h1>
                </div>
                <!-- SUPPORT BUTTON -->
                <div class="flex-initial">
                  <div class="flex flex-wrap justify-center -m-2">
                    <div class="w-full md:w-auto p-2">
                      <a class="block w-full px-8 py-3.5 text-lg text-center text-inherit focus:ring-0 focus:ring-blue-200 border rounded"
                        href="https://mobicycle.support">Support</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// src/components/Footer.ts
function renderFooter() {
  return `
    <!-- FOOTER -->
    <footer class="relative w-full pt-20 text-white-650 border-t rounded-3xl shadow bg-slate-900/40" style="backdrop-filter: blur(8px) saturate(110%) contrast(105%); -webkit-backdrop-filter: blur(8px) saturate(150%) contrast(120%);">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-orange-600/10"></div>
      <div class="relative container mx-auto max-w-7xl px-8">
        <div class="flex gap-12 w-full justify-between">
          <div class="flex-1">
            ${renderFooterMenu()}
          </div>
          <div class="flex-shrink-0">
            ${renderNewsletter()}
          </div>
        </div>
      </div>
      ${renderAddress()}
    </footer>
  `;
}
function renderFooterMenu() {
  return `
    <div class="text-md">
      <!-- LOGO -->
      <div class="mb-8 -ml-4">
        <a href="https://mobicycle.tech">
          <img
            src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/e6682ad4-09cd-48b3-eb0e-530252e29d00/150"
            alt="MobiCycle Logo"
            class="h-12 w-auto"
          />
        </a>
      </div>
      <!-- Footer Links Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        <!-- CORE OFFER -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">CORE OFFER</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-orange-650">EE Management</a></li>
            <li><a href="#" class="hover:text-orange-650">eWaste Management</a></li>
          </ul>
        </div>
        <!-- OUR PLATFORM -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">OUR PLATFORM</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="https://mobicycle.consulting" class="hover:text-orange-650">Consulting</a></li>
            <li><a href="https://mobicycle.tech" class="hover:text-orange-650">Technologies</a></li>
            <li><a href="https://mobicycle.games" class="hover:text-orange-650">Games</a></li>
            <li><a href="https://mobicycle.marketing" class="hover:text-orange-650">Marketing</a></li>
          </ul>
        </div>
        <!-- CREDITS -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">CREDITS</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-orange-650">Tax</a></li>
            <li><a href="#" class="hover:text-orange-650">Carbon (Scope&nbsp;3)</a></li>
            <li><a href="#" class="hover:text-orange-650">Biodiversity</a></li>
            <li><a href="#" class="hover:text-orange-650">Pollution</a></li>
          </ul>
        </div>
        <!-- COMPANY -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">COMPANY</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/about" class="hover:text-orange-650">About us</a></li>
            <li><a href="#" class="hover:text-orange-650">Case studies</a></li>
            <li><a href="#" class="hover:text-orange-650">Capabilities</a></li>
            <li><a href="#" class="hover:text-orange-650">Careers</a></li>
          </ul>
        </div>
        <!-- LEGAL -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">LEGAL</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-orange-650">Disclaimer</a></li>
            <li><a href="#" class="hover:text-orange-650">Cookies</a></li>
            <li><a href="#" class="hover:text-orange-650">Privacy</a></li>
            <li><a href="#" class="hover:text-orange-650">Terms</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
function renderNewsletter() {
  return `
    <div class="bg-slate-800 rounded-lg p-8 max-w-lg">
      <h3 class="text-2xl font-semibold mb-4 text-orange-650">Stay Updated</h3>
      <p class="mb-6">Get the latest news about our environmental impact solutions and electronic waste management.</p>
      <form class="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-md text-white-650 placeholder-gray-400 focus:outline-none focus:border-orange-650"
          required
        />
        <button
          type="submit"
          class="w-full px-4 py-3 bg-orange-650 text-slate-950 font-semibold rounded-md hover:bg-orange-700 transition-colors"
        >
          Subscribe to Newsletter
        </button>
      </form>
      <p class="mt-4 text-sm text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
    </div>
  `;
}
function renderAddress() {
  return `
    <div class="w-full px-8 py-20 text-center bg-transparent-650">
      <p class="text-sm text-gray-400 mb-2">
        1606 Headway Circle, Austin, TX 78754 | Rue de la Presse, 4 - 1000 Bruxelles Belgium
      </p>
      <p class="text-sm">&copy; Copyright 2025. All rights reserved by MobiCycle LLC.</p>
      <p class="text-xs mt-2 text-orange-650">Tech to save the planet.</p>
    </div>
`;
}

// src/components/TopNavigation.ts
function renderNavigation() {
  return `
    <nav class="min-w-full p-10 lg:px-16">
      <div class="mx-auto">
        <div class="flex justify-between h-16 mt-20 items-center">
          <div class="flex-shrink-0">
            <a 
              href="https://mobicycle.group" 
              class="block z-50"
            >
              <div> 
                <img 
                  src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/e6682ad4-09cd-48b3-eb0e-530252e29d00/200"
                  alt="MobiCycle USA"
                  class="h-12"
                />
              </div>
            </a>
          </div>
          <button class="navbar-burger relative z-40">
            <div id="menuToggle" class="flex items-center justify-center border-4 border-orange-650 cursor-pointer bg-gradient-to-r from-orange-650 to-purple-650 hover:bg-purple-650 w-12 h-12">
              <!-- THE THREE LINES (initially visible) -->
              <svg id="openIcon" class="w-10 h-10 text-yellow-650 hover:text-slate-100" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <!-- THE 'X' (initially hidden) -->
              <svg id="closeIcon" class="w-10 h-10 text-slate-100 hover:text-slate-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </button>
          <!-- Hidden menu that will toggle visibility -->
          <div class="navbar-menu fixed inset-0 transition-opacity duration-1000 opacity-0 invisible">
            <div class="navbar-backdrop fixed inset-0"></div>
            <nav class="relative flex flex-col w-full h-full overflow-y-auto items-center justify-center">
              <div>
                <div class="w-screen">
                  <div class="flex flex-col px-4 pt-10 space-y-8 text-white-650 container mx-auto items-start justify-center">
                    <a href="https://about.mobicycle.us" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650 md:text-right">About MobiCycle USA</a>
                    <a href="https://mobicycle.consulting" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Consulting</a>
                    <a href="https://mobicycle.tech" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Technologies</a>
                    <a href="https://mobicycle.marketing" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Games</a>
                    <a href="https://mobicycle.marketing" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Marketing</a>
                  </div>
                </div>
              </div>
              <!-- DEMO BUTTON -->
              <div class="flex flex-row items-end font-semibold bg-gradient-to-l from-orange-650 tracking-widest">
                <a href="https://demos.mobicycle.group/" 
                class="text-white-650 px-4 py-2 uppercase hover:text-white-650">
                DEMOS</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>

    <script>
      (function() {
        function initMenu() {
          const burgerButton = document.querySelector('.navbar-burger');
          const menu = document.querySelector('.navbar-menu');
          const openIcon = document.getElementById('openIcon');
          const closeIcon = document.getElementById('closeIcon');

          if (!burgerButton || !menu || !openIcon || !closeIcon) {
            console.error('One or more navigation elements are missing!');
            return;
          }

          burgerButton.addEventListener('click', function() {
            if (menu.classList.contains('invisible')) {
              // Open the menu
              menu.classList.remove('invisible', 'opacity-0');
              openIcon.classList.add('hidden');
              closeIcon.classList.remove('hidden');
            } else {
              // Close the menu
              menu.classList.add('opacity-0');
              setTimeout(() => {
                menu.classList.add('invisible');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
              }, 300);
            }
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initMenu);
        } else {
          initMenu();
        }
      })();
    <\/script>
  `;
}

// src/pages/home.ts
function renderHomePage() {
  const content = `
    <!-- Main Content -->
    <div class="relative">
      <!-- TITLE SECTION (Above Navigation) -->
      <div class="" >
        ${renderTitle()}
      </div>
      
      <!-- Navigation (z+20) -->
      <div class="fixed top-0 left-0 right-0" style="z-index: 20;">
        ${renderNavigation()}
      </div>
      
      
      <!-- CONTENT SECTIONS -->
      <div class="space-y-40 w-full">
        ${renderSectionOne()}
        ${renderSectionTwo()}
        ${renderSectionThree()}
        ${renderSectionFour()}
      </div>
      
      <!-- FOOTER -->
      <div class="grid grid-flow-row mt-20 pt-2">
          ${renderFooter()}
      </div>
    </div>
  `;
  return renderLayout("MobiCycle USA | Home", content);
}
function renderTitle() {
  return `
    <div class="container mx-auto px-4 h-screen flex items-center justify-center">
        ${renderHeader()}
    </div>
  `;
}

// _worker.js
var app = new Hono2();
app.use("/*", cors());
app.get("/", (c) => {
  const html = renderHomePage();
  return c.html(html);
});
app.all("*", (c) => {
  return c.text("Not Found", 404);
});
var worker_default = {
  async fetch(request, env, ctx) {
    if (env.ASSETS) {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      } catch (e) {
      }
    }
    return app.fetch(request, env, ctx);
  }
};
export {
  worker_default as default
};
