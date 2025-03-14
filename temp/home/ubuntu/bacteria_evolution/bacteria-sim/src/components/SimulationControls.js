import React, { useState } from 'react';

const SimulationControls = ({ config, onConfigChange, onStart, onPause, onReset, isRunning }) => {
  const [activeTab, setActiveTab] = useState('environment');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    onConfigChange({ [name]: parsedValue });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
      
      <div className="flex mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'environment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('environment')}
        >
          Environment
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'bacteria' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('bacteria')}
        >
          Bacteria
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'simulation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('simulation')}
        >
          Simulation
        </button>
      </div>
      
      <div className="space-y-4">
        {activeTab === 'environment' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={config.temperature}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">pH Level</label>
                <input
                  type="number"
                  name="pH"
                  value={config.pH}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="14"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Nutrients</label>
                <input
                  type="number"
                  name="nutrients"
                  value={config.nutrients}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Flow Rate</label>
                <input
                  type="number"
                  name="flowRate"
                  value={config.flowRate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Flow Direction (degrees)</label>
              <input
                type="range"
                name="flowDirection"
                value={config.flowDirection * (180/Math.PI)}
                onChange={(e) => {
                  const degrees = parseFloat(e.target.value);
                  const radians = degrees * (Math.PI/180);
                  onConfigChange({ flowDirection: radians });
                }}
                className="mt-1 block w-full"
                min="0"
                max="360"
              />
              <div className="text-center text-sm text-gray-500">
                {Math.round(config.flowDirection * (180/Math.PI))}°
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'bacteria' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Population</label>
                <input
                  type="number"
                  name="initialPopulation"
                  value={config.initialPopulation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Growth Rate</label>
                <input
                  type="number"
                  name="growthRate"
                  value={config.growthRate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="1"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mutation Rate</label>
                <input
                  type="number"
                  name="mutationRate"
                  value={config.mutationRate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="1"
                  step="0.001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Chemotaxis Strength</label>
                <input
                  type="number"
                  name="chemotaxisStrength"
                  value={config.chemotaxisStrength}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'simulation' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grid Width</label>
                <input
                  type="number"
                  name="width"
                  value={config.width}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="10"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Grid Height</label>
                <input
                  type="number"
                  name="height"
                  value={config.height}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="10"
                  max="200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Step</label>
                <input
                  type="number"
                  name="timeStep"
                  value={config.timeStep}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Iterations</label>
                <input
                  type="number"
                  name="maxIterations"
                  value={config.maxIterations}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 flex space-x-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className={`px-4 py-2 rounded-md ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SimulationControls;
