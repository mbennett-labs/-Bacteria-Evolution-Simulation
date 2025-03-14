import React from 'react';

const EnvironmentInfo = ({ simulationState, viewMode }) => {
  if (!simulationState) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Environment Information</h2>
        <p className="text-gray-500">No data available. Start the simulation to see environment details.</p>
      </div>
    );
  }

  // Calculate environment statistics
  const calculateStats = (grid) => {
    if (!grid || grid.length === 0 || !grid[0]) {
      return { min: 0, max: 0, avg: 0 };
    }
    
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const value = grid[y][x];
        min = Math.min(min, value);
        max = Math.max(max, value);
        sum += value;
        count++;
      }
    }
    
    return {
      min: min,
      max: max,
      avg: count > 0 ? sum / count : 0
    };
  };

  const nutrientStats = calculateStats(simulationState.nutrients);
  const temperatureStats = calculateStats(simulationState.temperature);
  const pHStats = calculateStats(simulationState.pH);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Environment Information</h2>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-md ${viewMode === 'nutrients' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
          <h3 className="text-md font-medium mb-2">Nutrients</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-xs text-gray-500">Min</span>
              <p className="font-medium">{nutrientStats.min.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Average</span>
              <p className="font-medium">{nutrientStats.avg.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Max</span>
              <p className="font-medium">{nutrientStats.max.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-md ${viewMode === 'temperature' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
          <h3 className="text-md font-medium mb-2">Temperature (°C)</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-xs text-gray-500">Min</span>
              <p className="font-medium">{temperatureStats.min.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Average</span>
              <p className="font-medium">{temperatureStats.avg.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Max</span>
              <p className="font-medium">{temperatureStats.max.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-md ${viewMode === 'pH' ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
          <h3 className="text-md font-medium mb-2">pH Level</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-xs text-gray-500">Min</span>
              <p className="font-medium">{pHStats.min.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Average</span>
              <p className="font-medium">{pHStats.avg.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Max</span>
              <p className="font-medium">{pHStats.max.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentInfo;
