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
  let arr = new Uint8Array((len || 40) / 2),
      str;

  window.crypto.getRandomValues(arr);

  return pre + Array.from(arr, dec2hex).join('')
}

// Color map
export const colorMap = (hex) => ({
  "white": "#fff",
  "blue": "#65f9f6",
  "green": "#5aff75"
})[hex]