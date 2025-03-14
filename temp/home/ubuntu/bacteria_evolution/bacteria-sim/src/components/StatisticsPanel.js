import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPanel = ({ stats }) => {
  if (!stats || !stats.populationHistory || stats.populationHistory.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Statistics</h2>
        <p className="text-gray-500">No data available. Start the simulation to see statistics.</p>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = stats.populationHistory.map((population, index) => ({
    iteration: index,
    population,
    diversity: stats.diversityHistory[index] || 0,
    fitness: stats.averageFitness[index] || 0
  }));

  // Get current values
  const currentPopulation = stats.populationHistory[stats.populationHistory.length - 1];
  const currentDiversity = stats.diversityHistory[stats.diversityHistory.length - 1];
  const currentFitness = stats.averageFitness[stats.averageFitness.length - 1];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Population</h3>
          <p className="text-2xl font-bold text-blue-600">{currentPopulation}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Genetic Diversity</h3>
          <p className="text-2xl font-bold text-green-600">{currentDiversity.toFixed(4)}</p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Avg. Fitness</h3>
          <p className="text-2xl font-bold text-purple-600">{currentFitness.toFixed(4)}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-2">Population History</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="population" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Population"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Genetic Diversity & Fitness</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="diversity" 
                  stroke="#10b981" 
                  name="Genetic Diversity"
                />
                <Line 
                  type="monotone" 
                  dataKey="fitness" 
                  stroke="#8b5cf6" 
                  name="Average Fitness"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
