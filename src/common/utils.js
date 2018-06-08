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

// Color map
export const colorMap = (hex) => ({
  "white": "#fff",
  "blue": "#65f9f6",
  "green": "#5aff75"
})[hex]