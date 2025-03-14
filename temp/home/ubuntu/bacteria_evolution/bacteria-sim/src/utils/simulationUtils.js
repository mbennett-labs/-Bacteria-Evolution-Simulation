// Utility functions for the bacteria evolution simulation

/**
 * Generate a random number between min and max (inclusive)
 */
export const randomBetween = (min, max) => {
  return min + Math.random() * (max - min);
};

/**
 * Generate a random integer between min and max (inclusive)
 */
export const randomIntBetween = (min, max) => {
  return Math.floor(randomBetween(min, max + 1));
};

/**
 * Create a color gradient for visualization
 * @param {number} value - Value between 0 and 1
 * @param {string} type - Type of gradient ('temperature', 'pH', 'nutrient', 'fitness')
 * @returns {string} - CSS color string
 */
export const getGradientColor = (value, type = 'temperature') => {
  // Ensure value is between 0 and 1
  const v = Math.max(0, Math.min(1, value));
  
  // Different color schemes for different types
  switch (type) {
    case 'temperature':
      // Blue (cold) to red (hot)
      return `rgb(${Math.floor(v * 255)}, ${Math.floor((1 - Math.abs(v - 0.5) * 2) * 150)}, ${Math.floor((1 - v) * 255)})`;
    
    case 'pH':
      // Red (acidic) to purple (neutral) to blue (alkaline)
      if (v < 0.5) {
        // Red to purple (acidic to neutral)
        const t = v * 2;
        return `rgb(${Math.floor(255 - t * 128)}, ${Math.floor(t * 50)}, ${Math.floor(t * 255)})`;
      } else {
        // Purple to blue (neutral to alkaline)
        const t = (v - 0.5) * 2;
        return `rgb(${Math.floor(127 - t * 127)}, ${Math.floor(50 + t * 100)}, ${Math.floor(255)})`;
      }
    
    case 'nutrient':
      // Yellow (low) to green (high)
      return `rgb(${Math.floor(255 - v * 200)}, ${Math.floor(100 + v * 155)}, ${Math.floor(50 + v * 50)})`;
    
    case 'fitness':
      // Red (low fitness) to green (high fitness)
      return `rgb(${Math.floor(255 - v * 255)}, ${Math.floor(v * 255)}, ${Math.floor(50)})`;
    
    default:
      // Grayscale
      const intensity = Math.floor(v * 255);
      return `rgb(${intensity}, ${intensity}, ${intensity})`;
  }
};

/**
 * Calculate the distance between two points
 */
export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Format a number with specified precision
 */
export const formatNumber = (num, precision = 2) => {
  return Number(num).toFixed(precision);
};

/**
 * Create a 2D grid with specified dimensions and initial value
 */
export const create2DGrid = (width, height, initialValue = 0) => {
  return Array(height).fill().map(() => Array(width).fill(initialValue));
};

/**
 * Create a gradient grid (for environmental factors)
 */
export const createGradientGrid = (width, height, minValue, maxValue, gradientType = 'horizontal') => {
  const grid = [];
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let value;
      
      switch (gradientType) {
        case 'horizontal':
          value = minValue + (maxValue - minValue) * (x / (width - 1));
          break;
        case 'vertical':
          value = minValue + (maxValue - minValue) * (y / (height - 1));
          break;
        case 'radial':
          const centerX = width / 2;
          const centerY = height / 2;
          const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
          const dist = distance(x, y, centerX, centerY);
          value = minValue + (maxValue - minValue) * (1 - dist / maxDistance);
          break;
        case 'random':
          value = minValue + Math.random() * (maxValue - minValue);
          break;
        default:
          value = minValue;
      }
      
      row.push(value);
    }
    grid.push(row);
  }
  
  return grid;
};

/**
 * Calculate statistics for an array of values
 */
export const calculateStats = (values) => {
  if (!values || values.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0 };
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / sorted.length;
  
  let median;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }
  
  return { min, max, mean, median };
};

/**
 * Smooth a 2D grid using a simple blur algorithm
 */
export const smoothGrid = (grid, iterations = 1) => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return grid;
  }
  
  const height = grid.length;
  const width = grid[0].length;
  let result = JSON.parse(JSON.stringify(grid));
  
  for (let iter = 0; iter < iterations; iter++) {
    const temp = JSON.parse(JSON.stringify(result));
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = result[y][x];
        let count = 1;
        
        // Check neighbors
        const neighbors = [
          { x: x-1, y: y },
          { x: x+1, y: y },
          { x: x, y: y-1 },
          { x: x, y: y+1 }
        ];
        
        for (const neighbor of neighbors) {
          if (neighbor.x >= 0 && neighbor.x < width && 
              neighbor.y >= 0 && neighbor.y < height) {
            sum += result[neighbor.y][neighbor.x];
            count++;
          }
        }
        
        temp[y][x] = sum / count;
      }
    }
    
    result = temp;
  }
  
  return result;
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
