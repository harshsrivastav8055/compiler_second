export enum TokenType {
  // Literal Types
  Number,
  Identifier,

  // Keywords
  const,
  var,
  Let,
  if,
  elif,
  else,
  while,
  for,
  SunBhai,
  BolBhai,
  bool,

  // Grouping * Operators
  greaterThen,
  lessThen,
  BinaryOperator,
  Equals,
  OpenParen,
  CloseParen,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  while: TokenType.while,
  for: TokenType.for,
  var: TokenType.var,
  const: TokenType.const,
  if: TokenType.if,
  elif: TokenType.elif,
  else: TokenType.else,
  SunBhai: TokenType.SunBhai,
  BolBhai: TokenType.BolBhai,
  bool: TokenType.bool,
};

// Reoresents a single token from the source-code.
export interface Token {
  value: string;
  type: TokenType;
  l: string;
}

// Returns a token of a given type and value
function token(value = "", type: TokenType, l = ""): Token {
  return { value, type, l };
}

// Returns whether the character passed in alphabetic -> [a-zA-Z]
function isalpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

// Returns true if the character is whitespace like -> [\s, \t, \n]
function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == ";";
}

//  Return whether the character is a valid integer -> [0-9]
function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  // produce tokens until the EOF is reached.
  while (src.length > 0) {
    // BEGIN PARSING ONE CHARACTER TOKENS
    if (src[0] == "(" || src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenParen, "OpenParen"));
    } else if (src[0] == ")" || src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseParen, "CloseParen"));
    } // HANDLE BINARY OPERATORS
    else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") {
      tokens.push(
        token(src.shift(), TokenType.BinaryOperator, "BinaryOperator"),
      );
    } // Handle Conditional & Assignment Tokens
    else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals, "EqualOperator"));
    } // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC..
    else if (src[0] == ">") {
      tokens.push(token(src.shift(), TokenType.greaterThen, "greaterThen"));
    } else if (src[0] == "<") {
      tokens.push(token(src.shift(), TokenType.lessThen, "lessThen"));
    } else {
      // Handle numeric literals -> Integers
      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }

        // append new numeric token.
        tokens.push(token(num, TokenType.Number, "integer"));
      } // Handle Identifier & Keyword Tokens.
    else if (isalpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }
        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[ident];
        // If value is not undefined then the identifier is
        // reconized keyword
        if (reserved) {
          tokens.push(token(ident, reserved, "reserved"));
        } 
		else {
          // Unreconized name must mean user defined symbol.
          tokens.push(token(ident, TokenType.Identifier, "variable"));
        }
    } 
	else if (isskippable(src[0])) {
    	// Skip uneeded chars.
        src.shift();
      } 
	  // Handle unreconized characters.
      // TODO: Impliment better errors and error recovery.
      else {
        console.error(
          "Unreconized character found in source: ",
          src[0].charCodeAt(0),
          src[0],
        );
        Deno.exit(1);
        // break;
      }
    }
  }

  return tokens;
}

const source = await Deno.readTextFile("./test.txt");
for (const token of tokenize(source)) {
  console.log(token);
}
