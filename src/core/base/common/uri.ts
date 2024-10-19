import { CharCode } from "./charCode.js";
import { MarshalledId } from "./marshallingIds";
import { isWindows } from "./platform.js";

// ----- Variables
const _schemePattern = /^\w[\w\d+.-]*$/;
const _singleSlashStart = /^\//;
const _doubleSlashStart = /^\/\//;
const _empty = "";
const _slash = "/";
const _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
const _pathSepMarker = isWindows ? 1 : undefined;
const _rEncodedAsHex = /(%[0-9A-Za-z][0-9A-Za-z])+/g;

const encodeTable: { [ch: number]: string } = {
  [CharCode.Colon]: "%3A", // gen-delims
  [CharCode.Slash]: "%2F",
  [CharCode.QuestionMark]: "%3F",
  [CharCode.Hash]: "%23",
  [CharCode.OpenSquareBracket]: "%5B",
  [CharCode.CloseSquareBracket]: "%5D",
  [CharCode.AtSign]: "%40",

  [CharCode.ExclamationMark]: "%21", // sub-delims
  [CharCode.DollarSign]: "%24",
  [CharCode.Ampersand]: "%26",
  [CharCode.SingleQuote]: "%27",
  [CharCode.OpenParen]: "%28",
  [CharCode.CloseParen]: "%29",
  [CharCode.Asterisk]: "%2A",
  [CharCode.Plus]: "%2B",
  [CharCode.Comma]: "%2C",
  [CharCode.Semicolon]: "%3B",
  [CharCode.Equals]: "%3D",

  [CharCode.Space]: "%20",
};

// ----- Interface
export interface IUriComponents {
  scheme: string;
  authority?: string;
  path?: string;
  query?: string;
  fragment?: string;
}

interface IUriState extends IUriComponents {
  $mid: MarshalledId.Uri;
  external?: string;
  fsPath?: string;
  _sep?: 1;
}

/**
 * Mapped-type that replaces all occurrences of URI with UriComponents
 */
export type IUriDto<T> = {
  [K in keyof T]: T[K] extends URI ? IUriComponents : IUriDto<T[K]>;
};

// ----- Internal Functions

/**
 * Formats a URI object as a string, with optional encoding of URI components.
 *
 * @param uri - The URI object to format.
 * @param skipEncoding - A flag to skip encoding for specific components.
 * @returns The formatted URI string.
 */
function _formatUri(uri: URI, skipEncoding: boolean): string {
  const encode = skipEncoding
    ? _minimalEncodeURIComponent
    : _fastEncodeURIComponent;
  let result = "";

  let { scheme, authority, path, query, fragment } = uri;

  if (scheme) {
    result += `${scheme}:`;
  }

  // Add slashes for authority or "file" scheme
  if (authority || scheme === "file") {
    result += "//";
  }

  if (authority) {
    let userInfoIndex = authority.indexOf("@");
    if (userInfoIndex !== -1) {
      // Extract userinfo (username:password)
      const userinfo = authority.slice(0, userInfoIndex);
      authority = authority.slice(userInfoIndex + 1);

      const passwordIndex = userinfo.lastIndexOf(":");
      if (passwordIndex === -1) {
        result += encode(userinfo, false, false); // username
      } else {
        result += `${encode(
          userinfo.slice(0, passwordIndex),
          false,
          false
        )}:${encode(userinfo.slice(passwordIndex + 1), false, true)}`; // username:password
      }
      result += "@";
    }

    // Convert authority to lowercase and process ports if any
    authority = authority.toLowerCase();
    const portIndex = authority.lastIndexOf(":");
    if (portIndex === -1) {
      result += encode(authority, false, true); // authority
    } else {
      result += `${encode(
        authority.slice(0, portIndex),
        false,
        true
      )}${authority.slice(portIndex)}`; // authority:port
    }
  }

  if (path) {
    // Handle lowercase Windows drive letters (e.g., /C:/ -> /c:/)
    if (
      path.length >= 3 &&
      path.charCodeAt(0) === CharCode.Slash &&
      path.charCodeAt(2) === CharCode.Colon
    ) {
      const driveLetter = path.charCodeAt(1);
      if (driveLetter >= CharCode.A && driveLetter <= CharCode.Z) {
        path = `/${String.fromCharCode(driveLetter + 32)}:${path.slice(3)}`;
      }
    } else if (path.length >= 2 && path.charCodeAt(1) === CharCode.Colon) {
      const driveLetter = path.charCodeAt(0);
      if (driveLetter >= CharCode.A && driveLetter <= CharCode.Z) {
        path = `${String.fromCharCode(driveLetter + 32)}:${path.slice(2)}`;
      }
    }

    // Encode and append the path
    result += encode(path, true, false);
  }

  if (query) {
    result += `?${encode(query, false, false)}`;
  }

  if (fragment) {
    result += `#${
      skipEncoding ? fragment : _fastEncodeURIComponent(fragment, false, false)
    }`;
  }

  return result;
}

/**
 * Validates a URI object, ensuring that the scheme, authority, and path conform to RFC 3986.
 *
 * @param uri - The URI object to validate.
 * @param strictMode - If true, enforces strict validation rules.
 * @throws Will throw an error if validation fails.
 */
function _validateUri(uri: URI, strictMode?: boolean): void {
  // Ensure that the scheme is present if strict mode is enabled
  if (!uri.scheme && strictMode) {
    throw new Error(
      `[UriError]: Scheme is missing: {scheme: "", authority: "${uri.authority}", path: "${uri.path}", query: "${uri.query}", fragment: "${uri.fragment}"}`
    );
  }

  // Validate scheme against the allowed characters
  if (uri.scheme && !_schemePattern.test(uri.scheme)) {
    throw new Error("[UriError]: Scheme contains illegal characters.");
  }

  // Validate the path depending on the presence of authority
  if (uri.path) {
    if (uri.authority) {
      if (!_singleSlashStart.test(uri.path)) {
        throw new Error(
          '[UriError]: If a URI contains an authority component, the path must either be empty or begin with a slash ("/")'
        );
      }
    } else if (_doubleSlashStart.test(uri.path)) {
      throw new Error(
        '[UriError]: If a URI does not contain an authority component, the path cannot begin with two slashes ("//")'
      );
    }
  }
}

/**
 * Validates the URI scheme, defaulting to "file" if strict mode is disabled and no scheme is provided.
 *
 * @param scheme - The scheme string to validate.
 * @param strictMode - If true, enforces strict validation rules for the scheme.
 * @returns The validated scheme, or "file" if not provided in non-strict mode.
 */
function _validateScheme(scheme: string, strictMode: boolean): string {
  return !scheme && !strictMode ? "file" : scheme;
}

function _normalizePath(scheme: string, path: string): string {
  switch (scheme) {
    case "https":
    case "http":
    case "file":
      if (!path) {
        path = _slash;
      } else if (path[0] !== _slash) {
        path = _slash + path;
      }
      break;
  }
  return path;
}

// ----- Encode
// ----- Encode URI Component with Fast Path
/**
 * Encodes a URI component efficiently by selectively encoding characters
 * that require encoding while leaving unreserved characters as is.
 *
 * @param uriComponent - The URI component to encode.
 * @param isPath - A flag indicating whether the component is a path (preserves `/`).
 * @param isAuthority - A flag indicating whether the component is an authority (preserves `[]` and `:`).
 * @returns The encoded URI component string.
 */
function _fastEncodeURIComponent(
  uriComponent: string,
  preservePath: boolean,
  preserveAuthority: boolean
): string {
  let result: string | undefined = undefined;
  let startNativeEncodeAt = -1;

  for (let index = 0; index < uriComponent.length; index++) {
    const charCode = uriComponent.charCodeAt(index);

    // Unreserved characters (RFC 3986): https://tools.ietf.org/html/rfc3986#section-2.3
    if (
      (charCode >= CharCode.a && charCode <= CharCode.z) || // Lowercase letters
      (charCode >= CharCode.A && charCode <= CharCode.Z) || // Uppercase letters
      (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9) || // Digits 0-9
      charCode === CharCode.Dash || // -
      charCode === CharCode.Period || // .
      charCode === CharCode.Underline || // _
      charCode === CharCode.Tilde || // ~
      (preservePath && charCode === CharCode.Slash) || // / (for paths)
      (preserveAuthority && charCode === CharCode.OpenSquareBracket) || // [ (for authority)
      (preserveAuthority && charCode === CharCode.CloseSquareBracket) || // ] (for authority)
      (preserveAuthority && charCode === CharCode.Colon) // : (for authority)
    ) {
      // Flush native encoding if there was a delay
      if (startNativeEncodeAt !== -1) {
        result += encodeURIComponent(
          uriComponent.substring(startNativeEncodeAt, index)
        );
        startNativeEncodeAt = -1;
      }
      // Build the result string
      if (result !== undefined) {
        result += uriComponent.charAt(index);
      }
    } else {
      // Encoding is needed
      if (result === undefined) {
        result = uriComponent.substring(0, index);
      }

      // Use pre-defined escape table if possible
      const escapedChar = encodeTable[charCode];
      if (escapedChar !== undefined) {
        // Flush any delayed native encoding
        if (startNativeEncodeAt !== -1) {
          result += encodeURIComponent(
            uriComponent.substring(startNativeEncodeAt, index)
          );
          startNativeEncodeAt = -1;
        }
        // Append escaped variant
        result += escapedChar;
      } else if (startNativeEncodeAt === -1) {
        // Delay native encoding until necessary
        startNativeEncodeAt = index;
      }
    }
  }

  // If any native encoding was delayed, flush it now
  if (startNativeEncodeAt !== -1) {
    result += encodeURIComponent(uriComponent.substring(startNativeEncodeAt));
  }

  return result !== undefined ? result : uriComponent;
}

/**
 * Encodes a minimal subset of URI components, only encoding `#` and `?` characters.
 *
 * @param path - The URI path to minimally encode.
 * @returns The minimally encoded URI path.
 */
function _minimalEncodeURIComponent(path: string): string {
  let result: string | undefined = undefined;

  for (let index = 0; index < path.length; index++) {
    const charCode = path.charCodeAt(index);

    // Only encode `#` and `?` characters
    if (charCode === CharCode.Hash || charCode === CharCode.QuestionMark) {
      if (result === undefined) {
        result = path.substring(0, index);
      }
      result += encodeTable[charCode];
    } else {
      if (result !== undefined) {
        result += path[index];
      }
    }
  }

  return result !== undefined ? result : path;
}

// ----- Decode
function _decodeURIComponentGraceful(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    if (str.length > 3) {
      return str.substr(0, 3) + _decodeURIComponentGraceful(str.substr(3));
    } else {
      return str;
    }
  }
}

function _decodeURIComponent(str: string): string {
  if (!str.match(_rEncodedAsHex)) {
    return str;
  }
  return str.replace(_rEncodedAsHex, (match) =>
    _decodeURIComponentGraceful(match)
  );
}

// ----- Type Guard for IUriComponents

/**
 * Type guard to check if an object is a valid IUriComponents instance.
 *
 * @param obj - The object to check.
 * @returns `true` if the object conforms to IUriComponents, otherwise `false`.
 */
export function isUriComponents(obj: any): obj is IUriComponents {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const uri = obj as IUriComponents;

  return (
    typeof uri.scheme === "string" &&
    (typeof uri.authority === "string" ||
      typeof uri.authority === "undefined") &&
    (typeof uri.path === "string" || typeof uri.path === "undefined") &&
    (typeof uri.query === "string" || typeof uri.query === "undefined") &&
    (typeof uri.fragment === "string" || typeof uri.fragment === "undefined")
  );
}

// ----- Convert URI to File System Path

/**
 * Converts a URI object to a file system path, handling special cases
 * for UNC paths and Windows drive letters.
 *
 * @param uri - The URI to convert.
 * @param preserveDriveLetterCasing - Whether to preserve the original case of the drive letter on Windows.
 * @returns The file system path as a string.
 */
export function uriToFsPath(
  uri: URI,
  preserveDriveLetterCasing: boolean
): string {
  let fsPath: string;

  // Handle UNC paths (e.g., file://share/c$/folder)
  if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
    fsPath = `//${uri.authority}${uri.path}`;
  }
  // Handle Windows drive letters (e.g., file:///C:/folder)
  else if (
    uri.path.charCodeAt(0) === CharCode.Slash &&
    ((uri.path.charCodeAt(1) >= CharCode.A &&
      uri.path.charCodeAt(1) <= CharCode.Z) ||
      (uri.path.charCodeAt(1) >= CharCode.a &&
        uri.path.charCodeAt(1) <= CharCode.z)) &&
    uri.path.charCodeAt(2) === CharCode.Colon
  ) {
    if (!preserveDriveLetterCasing) {
      // Convert drive letter to lowercase if flag is set to false
      fsPath = uri.path[1].toLowerCase() + uri.path.substring(2);
    } else {
      fsPath = uri.path.substring(1);
    }
  }
  // For other file system paths
  else {
    fsPath = uri.path;
  }

  // Convert forward slashes to backslashes for Windows
  if (isWindows) {
    fsPath = fsPath.replace(/\//g, "\\");
  }

  return fsPath;
}

/**
 * Uniform Resource Identifier (URI) based on RFC 3986.
 * This class parses and provides access to the URI components with minimal validation.
 *
 * Example format:
 * ```txt
 *    foo://example.com:8042/over/there?name=ferret#nose
 *    \_/   \______________/\_________/ \_________/ \__/
 *     |          |            |            |        |
 *  scheme    authority       path        query   fragment
 * ```
 *
 * ```ts
 * const uri = URI.parse('http://example.com/path?query#fragment');
 * console.log(uri.scheme); // 'http'
 * ```
 */
export class URI implements IUriComponents {
  /**
   * Validates whether the given object is a URI instance.
   */
  static isUri(object: any): object is URI {
    return (
      object instanceof URI ||
      (object &&
        typeof object.authority === "string" &&
        typeof object.fragment === "string" &&
        typeof object.path === "string" &&
        typeof object.query === "string" &&
        typeof object.scheme === "string" &&
        typeof object.fsPath === "string" &&
        typeof object.with === "function" &&
        typeof object.toString === "function")
    );
  }

  /** The scheme part of the URI, such as 'http', 'file', etc. */
  readonly scheme: string;

  /** The authority part of the URI, e.g., 'www.example.com'. */
  readonly authority: string;

  /** The path part of the URI, such as '/some/path'. */
  readonly path: string;

  /** The query part of the URI, such as 'query' in '?query'. */
  readonly query: string;

  /** The fragment part of the URI, such as 'fragment' in '#fragment'. */
  readonly fragment: string;

  /**
   * Constructor to initialize URI components.
   *
   * @param scheme The URI scheme (e.g., 'http').
   * @param authority The URI authority (optional).
   * @param path The URI path (optional).
   * @param query The URI query (optional).
   * @param fragment The URI fragment (optional).
   * @param strict Whether to apply strict validation rules.
   */
  protected constructor(
    scheme: string,
    authority?: string,
    path?: string,
    query?: string,
    fragment?: string,
    strict?: boolean
  );

  /**
   * Constructor to initialize URI from components.
   *
   * @param components URI components.
   */
  protected constructor(components: IUriComponents);

  /**
   * Constructor overload to support either string-based or object-based initialization.
   *
   * @param schemeOrComponents The scheme string or URI components object.
   * @param authority URI authority (optional).
   * @param path URI path (optional).
   * @param query URI query (optional).
   * @param fragment URI fragment (optional).
   * @param strict Whether to enforce strict validation.
   */
  protected constructor(
    schemeOrComponents: string | IUriComponents,
    authority?: string,
    path?: string,
    query?: string,
    fragment?: string,
    strict: boolean = false
  ) {
    if (typeof schemeOrComponents === "object") {
      this.scheme = schemeOrComponents.scheme || "";
      this.authority = schemeOrComponents.authority || "";
      this.path = schemeOrComponents.path || "";
      this.query = schemeOrComponents.query || "";
      this.fragment = schemeOrComponents.fragment || "";
    } else {
      this.scheme = _validateScheme(schemeOrComponents, strict);
      this.authority = authority || "";
      this.path = _normalizePath(this.scheme, path || "");
      this.query = query || "";
      this.fragment = fragment || "";

      _validateUri(this, strict);
    }
  }

  /**
   * Returns the corresponding file system path of this URI as a string.
   *
   * - Handles UNC (Universal Naming Convention) paths and normalizes Windows drive letters to lower-case.
   * - Uses the platform-specific path separator.
   * - Does not validate the path for invalid characters or semantics.
   * - Does not inspect the URI's scheme for specific rules, but is mainly intended for `file` scheme URIs.
   *
   * The difference between `URI#path` and `URI#fsPath` lies in how they handle platform-specific path separators
   * and UNC paths. For example, using `fsPath` ensures that UNC paths retain their authority part, which may be lost
   * when using `path`.
   *
   * Example:
   * ```ts
   * const uri = URI.parse('file://server/c$/folder/file.txt');
   * uri.authority === 'server';
   * uri.path === '/c$/folder/file.txt';
   * uri.fsPath === '\\server\\c$\\folder\\file.txt';
   * ```
   *
   * This method should be used for accessing files on disk (i.e., using file system APIs) and not for display purposes.
   */
  get fsPath(): string {
    // Only convert to file system path if the scheme is 'file'.
    if (this.scheme !== "file") {
      console.warn(
        `[URI Error]: Calling fsPath for non-file scheme '${this.scheme}'`
      );
      return "";
    }

    return uriToFsPath(this, false);
  }

  /**
   * Returns a new URI with changes applied to its components.
   *
   * @param change The components to modify.
   * @returns A new URI instance with modified components.
   */
  with(change: Partial<IUriComponents>): URI {
    if (!change) {
      return this;
    }

    const applyChange = (currentValue: string, newValue?: string | null) =>
      newValue === undefined ? currentValue : newValue ?? _empty;

    const scheme = applyChange(this.scheme, change.scheme);
    const authority = applyChange(this.authority, change.authority);
    const path = applyChange(this.path, change.path);
    const query = applyChange(this.query, change.query);
    const fragment = applyChange(this.fragment, change.fragment);

    // If all components are unchanged, return the current instance
    if (
      scheme === this.scheme &&
      authority === this.authority &&
      path === this.path &&
      query === this.query &&
      fragment === this.fragment
    ) {
      return this;
    }

    // Return a new URI instance with the modified components
    return new Uri(scheme, authority, path, query, fragment);
  }

  /**
   * Parses a URI string and returns a URI instance.
   *
   * @param value The URI string to parse.
   * @param strict Whether to apply strict validation rules.
   */
  static parse(value: string, strict: boolean = false): URI {
    const match = _regexp.exec(value);
    if (!match) {
      return new URI("", "", "", "", "");
    }
    return new URI(
      match[2] || "",
      _decodeURIComponent(match[4] || ""),
      _decodeURIComponent(match[5] || ""),
      _decodeURIComponent(match[7] || ""),
      _decodeURIComponent(match[9] || ""),
      strict
    );
  }

  /**
   * Creates a new URI from a file system path.
   *
   * @param path The file system path.
   */
  static file(path: string): URI {
    let authority = "";
    if (isWindows && path[0] === "/" && path[1] === "/") {
      const idx = path.indexOf("/", 2);
      authority = idx === -1 ? path.slice(2) : path.slice(2, idx);
      path = idx === -1 ? "/" : path.slice(idx);
    }

    return new URI("file", authority, _normalizePath("file", path), "", "");
  }

  /**
   * Creates a string representation of the URI.
   *
   * @param skipEncoding Whether to skip encoding of special characters.
   */

  toString(skipEncoding: boolean = false): string {
    return _formatUri(this, skipEncoding);
  }
  /**
   * Converts the URI to a JSON-compatible format.
   */
  toJSON(): IUriComponents {
    return this;
  }

  /**
   * Revives a URI from its JSON representation.
   *
   * @param data The JSON representation of a URI.
   * @returns A URI instance.
   */
  static revive(data: IUriComponents | URI | null): URI | null {
    if (!data) {
      return null;
    }
    return data instanceof URI ? data : new URI(data);
  }

  /**
   * Debug description for the URI.
   */
  [Symbol.for("debug.description")](): string {
    return `URI(${this.toString()})`;
  }
}

// This class ensures URI compatibility with vscode.Uri (API).
class Uri extends URI {
  private _formatted: string | null = null;
  private _fsPath: string | null = null;

  // Lazily compute and cache the filesystem path
  override get fsPath(): string {
    if (!this._fsPath) {
      this._fsPath = uriToFsPath(this, false);
    }
    return this._fsPath;
  }

  // Convert the URI to a string, with optional encoding.
  override toString(skipEncoding: boolean = false): string {
    if (!skipEncoding) {
      if (!this._formatted) {
        this._formatted = _formatUri(this, false);
      }
      return this._formatted;
    }
    // Return without caching for encoding-skipped string
    return _formatUri(this, true);
  }

  /**
   * Serialize the URI into a JSON-friendly format.
   */
  override toJSON(): IUriComponents {
    const result: IUriState = {
      $mid: MarshalledId.Uri,
      scheme: this.scheme || "",
    };

    /**
     * Cache the filesystem path if already computed
     */
    if (this._fsPath) {
      result.fsPath = this._fsPath;
      result._sep = _pathSepMarker;
    }

    /**
     *  Cache the external (formatted) URI string if already computed
     */
    if (this._formatted) {
      result.external = this._formatted;
    }

    /**
     * Include other URI components if they exist
     */
    if (this.path) {
      result.path = this.path;
    }
    if (this.authority) {
      result.authority = this.authority;
    }
    if (this.query) {
      result.query = this.query;
    }
    if (this.fragment) {
      result.fragment = this.fragment;
    }

    return result;
  }
}
