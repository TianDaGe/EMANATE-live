// Basic unique ID generator
export class uniqueIdGenerator {
  constructor(base) {
    if (!base) {
      base = 'uniq';
    }

    this.base = base;
    this.id = 0;
  }

  next() {
    return `${this.base}${++this.id}`;
  }
}

// Tabindexing ID generator
export class tabindexGenerator {
  constructor() {
    this.currentIndex = 0;
  }

  next() {
    return `${++this.currentIndex}`;
  }
}

// dec2hex :: Integer -> String
function dec2hex (dec) {
  return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
export function generateId (pre, len) {
  let arr = new Uint8Array((len || 40) / 2, 1),
      str;

      console.log('genid', arr);

  window.crypto.getRandomValues(arr);

  return pre + Array.from(arr, dec2hex).join('')
}

export function generateRandString (pre, len) {
  let possible = "abcdefghijklmnopqrstuvwxyz01234";

  for (var i = 0; i < len; i++) {
    pre += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return pre;
}

// Color map
export const colorMap = (hex) => ({
  "white": "#fff",
  "blue": "#65f9f6",
  "green": "#5aff75"
})[hex]