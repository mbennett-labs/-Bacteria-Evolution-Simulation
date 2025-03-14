// Bacteria Evolution Simulation Model
// This file contains the core simulation logic for bacterial evolution

class BacteriaSimulation {
  constructor(config = {}) {
    // Default configuration
    this.config = {
      // Environment parameters
      width: 100,
      height: 100,
      temperature: 37, // in Celsius
      pH: 7.0,
      nutrients: 100, // initial nutrient level
      flowRate: 0, // rate of environmental flow
      flowDirection: 0, // direction in radians
      
      // Bacteria parameters
      initialPopulation: 10,
      growthRate: 0.1,
      mutationRate: 0.001,
      chemotaxisStrength: 0.5,
      
      // Simulation parameters
      timeStep: 1, // time step in arbitrary units
      maxIterations: 1000,
      
      // Custom overrides
      ...config
    };
    
    // Initialize simulation state
    this.reset();
  }
  
  reset() {
    this.iteration = 0;
    this.bacteria = [];
    this.nutrients = this.createNutrientGrid();
    this.temperature = this.createUniformGrid(this.config.temperature);
    this.pH = this.createUniformGrid(this.config.pH);
    
    // Create initial bacteria population
    this.initializeBacteria();
    
    // Statistics tracking
    this.stats = {
      populationHistory: [],
      diversityHistory: [],
      averageFitness: []
    };
  }
  
  createNutrientGrid() {
    const grid = [];
    for (let y = 0; y < this.config.height; y++) {
      const row = [];
      for (let x = 0; x < this.config.width; x++) {
        // Can be modified to create gradients or patterns
        row.push(this.config.nutrients);
      }
      grid.push(row);
    }
    return grid;
  }
  
  createUniformGrid(value) {
    const grid = [];
    for (let y = 0; y < this.config.height; y++) {
      const row = [];
      for (let x = 0; x < this.config.width; x++) {
        row.push(value);
      }
      grid.push(row);
    }
    return grid;
  }
  
  initializeBacteria() {
    for (let i = 0; i < this.config.initialPopulation; i++) {
      const bacterium = {
        id: i,
        x: Math.floor(Math.random() * this.config.width),
        y: Math.floor(Math.random() * this.config.height),
        genes: {
          optimalTemperature: this.config.temperature,
          optimalPH: this.config.pH,
          metabolicEfficiency: 0.5 + (Math.random() * 0.5), // 0.5-1.0
          reproductionThreshold: 10 + (Math.random() * 10), // 10-20
          chemotaxisSensitivity: this.config.chemotaxisStrength * (0.5 + Math.random())
        },
        energy: 10,
        age: 0,
        generation: 1
      };
      this.bacteria.push(bacterium);
    }
  }
  
  calculateFitness(bacterium) {
    const x = Math.floor(bacterium.x);
    const y = Math.floor(bacterium.y);
    
    // Get local environmental conditions
    const localTemp = this.temperature[y][x];
    const localPH = this.pH[y][x];
    
    // Calculate fitness components
    const tempFitness = 1 - Math.abs(localTemp - bacterium.genes.optimalTemperature) / 20;
    const phFitness = 1 - Math.abs(localPH - bacterium.genes.optimalPH) / 3;
    
    // Combined fitness (0-1 scale)
    return Math.max(0, Math.min(1, 
      0.4 * tempFitness + 
      0.4 * phFitness + 
      0.2 * bacterium.genes.metabolicEfficiency
    ));
  }
  
  moveBacteria() {
    for (const bacterium of this.bacteria) {
      // Simple random movement
      const moveX = (Math.random() - 0.5) * 2;
      const moveY = (Math.random() - 0.5) * 2;
      
      // Apply chemotaxis - movement toward nutrients
      let chemotaxisX = 0;
      let chemotaxisY = 0;
      
      // Check surrounding nutrient levels to determine gradient
      if (bacterium.genes.chemotaxisSensitivity > 0) {
        const x = Math.floor(bacterium.x);
        const y = Math.floor(bacterium.y);
        
        // Sample nutrients in cardinal directions
        const leftNutrient = x > 0 ? this.nutrients[y][x-1] : 0;
        const rightNutrient = x < this.config.width-1 ? this.nutrients[y][x+1] : 0;
        const upNutrient = y > 0 ? this.nutrients[y-1][x] : 0;
        const downNutrient = y < this.config.height-1 ? this.nutrients[y+1][x] : 0;
        
        // Calculate gradient
        chemotaxisX = (rightNutrient - leftNutrient) * bacterium.genes.chemotaxisSensitivity;
        chemotaxisY = (downNutrient - upNutrient) * bacterium.genes.chemotaxisSensitivity;
      }
      
      // Apply environmental flow
      const flowX = Math.cos(this.config.flowDirection) * this.config.flowRate;
      const flowY = Math.sin(this.config.flowDirection) * this.config.flowRate;
      
      // Update position with boundaries
      bacterium.x += moveX + chemotaxisX + flowX;
      bacterium.y += moveY + chemotaxisY + flowY;
      
      // Ensure bacteria stay within bounds
      bacterium.x = Math.max(0, Math.min(this.config.width - 1, bacterium.x));
      bacterium.y = Math.max(0, Math.min(this.config.height - 1, bacterium.y));
    }
  }
  
  metabolizeAndReproduce() {
    const newBacteria = [];
    const deadIndices = [];
    
    for (let i = 0; i < this.bacteria.length; i++) {
      const bacterium = this.bacteria[i];
      const x = Math.floor(bacterium.x);
      const y = Math.floor(bacterium.y);
      
      // Consume nutrients
      const availableNutrients = this.nutrients[y][x];
      const consumptionRate = bacterium.genes.metabolicEfficiency;
      const consumed = Math.min(availableNutrients, consumptionRate);
      
      this.nutrients[y][x] -= consumed;
      bacterium.energy += consumed;
      bacterium.age += 1;
      
      // Check for reproduction
      if (bacterium.energy >= bacterium.genes.reproductionThreshold) {
        // Create offspring with possible mutations
        const offspring = this.reproduceBacterium(bacterium);
        newBacteria.push(offspring);
        
        // Parent loses energy after reproduction
        bacterium.energy *= 0.5;
      }
      
      // Natural energy loss
      bacterium.energy -= 0.2;
      
      // Death check
      if (bacterium.energy <= 0) {
        deadIndices.push(i);
        // Return some nutrients to environment upon death
        this.nutrients[y][x] += 2;
      }
    }
    
    // Remove dead bacteria (in reverse order to avoid index issues)
    for (let i = deadIndices.length - 1; i >= 0; i--) {
      this.bacteria.splice(deadIndices[i], 1);
    }
    
    // Add new bacteria
    this.bacteria = this.bacteria.concat(newBacteria);
  }
  
  reproduceBacterium(parent) {
    // Create offspring with inherited genes
    const offspring = {
      id: this.bacteria.length + Math.floor(Math.random() * 1000),
      x: parent.x + (Math.random() - 0.5),
      y: parent.y + (Math.random() - 0.5),
      genes: { ...parent.genes },
      energy: parent.energy * 0.5,
      age: 0,
      generation: parent.generation + 1
    };
    
    // Apply mutations
    if (Math.random() < this.config.mutationRate) {
      const geneToMutate = Object.keys(offspring.genes)[Math.floor(Math.random() * Object.keys(offspring.genes).length)];
      const mutationAmount = (Math.random() - 0.5) * 0.2; // -10% to +10% change
      offspring.genes[geneToMutate] *= (1 + mutationAmount);
    }
    
    return offspring;
  }
  
  diffuseNutrients() {
    const diffusionRate = 0.1;
    const newNutrients = JSON.parse(JSON.stringify(this.nutrients));
    
    for (let y = 0; y < this.config.height; y++) {
      for (let x = 0; x < this.config.width; x++) {
        let diffusionAmount = 0;
        let neighborCount = 0;
        
        // Check each neighbor
        const neighbors = [
          { x: x-1, y: y },
          { x: x+1, y: y },
          { x: x, y: y-1 },
          { x: x, y: y+1 }
        ];
        
        for (const neighbor of neighbors) {
          if (neighbor.x >= 0 && neighbor.x < this.config.width && 
              neighbor.y >= 0 && neighbor.y < this.config.height) {
            diffusionAmount += this.nutrients[neighbor.y][neighbor.x];
            neighborCount++;
          }
        }
        
        if (neighborCount > 0) {
          const avgNeighborNutrient = diffusionAmount / neighborCount;
          const currentNutrient = this.nutrients[y][x];
          newNutrients[y][x] = currentNutrient + (avgNeighborNutrient - currentNutrient) * diffusionRate;
        }
      }
    }
    
    this.nutrients = newNutrients;
  }
  
  updateEnvironment() {
    // Replenish nutrients slightly
    for (let y = 0; y < this.config.height; y++) {
      for (let x = 0; x < this.config.width; x++) {
        this.nutrients[y][x] += 0.01;
      }
    }
    
    // Diffuse nutrients
    this.diffuseNutrients();
    
    // Could add other environmental changes here
    // e.g., temperature fluctuations, pH changes, etc.
  }
  
  calculateStatistics() {
    // Population count
    const populationCount = this.bacteria.length;
    this.stats.populationHistory.push(populationCount);
    
    // Calculate average fitness
    let totalFitness = 0;
    for (const bacterium of this.bacteria) {
      totalFitness += this.calculateFitness(bacterium);
    }
    const avgFitness = populationCount > 0 ? totalFitness / populationCount : 0;
    this.stats.averageFitness.push(avgFitness);
    
    // Calculate genetic diversity (simple measure based on standard deviation of genes)
    if (populationCount > 1) {
      let geneVariance = 0;
      const geneKeys = Object.keys(this.bacteria[0].genes);
      
      for (const key of geneKeys) {
        const values = this.bacteria.map(b => b.genes[key]);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        geneVariance += variance;
      }
      
      const diversity = Math.sqrt(geneVariance / geneKeys.length);
      this.stats.diversityHistory.push(diversity);
    } else {
      this.stats.diversityHistory.push(0);
    }
  }
  
  step() {
    if (this.iteration >= this.config.maxIterations) {
      return false;
    }
    
    // Main simulation steps
    this.moveBacteria();
    this.metabolizeAndReproduce();
    this.updateEnvironment();
    this.calculateStatistics();
    
    this.iteration++;
    return true;
  }
  
  run() {
    while (this.step()) {
      // Continue until max iterations or other stopping condition
    }
    return this.stats;
  }
  
  getState() {
    return {
      iteration: this.iteration,
      bacteria: this.bacteria,
      nutrients: this.nutrients,
      temperature: this.temperature,
      pH: this.pH,
      stats: this.stats
    };
  }
  
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }
}

export default BacteriaSimulation;
