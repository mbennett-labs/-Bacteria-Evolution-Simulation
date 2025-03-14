import React, { useState, useEffect, useRef } from 'react';
import SimulationControls from './components/SimulationControls.jsx';
import SimulationCanvas from './components/SimulationCanvas.jsx';
import StatisticsPanel from './components/StatisticsPanel.jsx';
import BacteriaDetails from './components/BacteriaDetails.jsx';
import EnvironmentInfo from './components/EnvironmentInfo.jsx';
import VisualizationControls from './components/VisualizationControls.jsx';
import BacteriaSimulation from './models/BacteriaSimulation';

function App() {
  // Default configuration
  const defaultConfig = {
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
  };

  // State
  const [config, setConfig] = useState(defaultConfig);
  const [simulationState, setSimulationState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [viewMode, setViewMode] = useState('bacteria'); // 'bacteria', 'nutrients', 'temperature', 'pH'
  const [iteration, setIteration] = useState(0);
  const [selectedBacterium, setSelectedBacterium] = useState(null);
  
  // Refs
  const simulationRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Initialize simulation
  useEffect(() => {
    simulationRef.current = new BacteriaSimulation(config);
    setSimulationState(simulationRef.current.getState());
    setIteration(0);
  }, []);
  
  // Handle config changes
  const handleConfigChange = (newConfigValues) => {
    setConfig(prevConfig => {
      const updatedConfig = { ...prevConfig, ...newConfigValues };
      
      // Update simulation config if it exists
      if (simulationRef.current) {
        simulationRef.current.updateConfig(updatedConfig);
      }
      
      return updatedConfig;
    });
  };
  
  // Animation loop
  useEffect(() => {
    const runSimulation = () => {
      if (simulationRef.current && isRunning) {
        // Run a single step
        simulationRef.current.step();
        
        // Update state
        setSimulationState(simulationRef.current.getState());
        setIteration(simulationRef.current.iteration);
        
        // Update selected bacterium if it exists
        if (selectedBacterium) {
          const updatedBacterium = simulationRef.current.bacteria?.find(b => b.id === selectedBacterium.id);
          if (updatedBacterium) {
            setSelectedBacterium(updatedBacterium);
          } else {
            setSelectedBacterium(null); // Bacterium died
          }
        }
        
        // Schedule next frame
        animationFrameRef.current = requestAnimationFrame(runSimulation);
      }
    };
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(runSimulation);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, selectedBacterium]);
  
  // Start simulation
  const handleStart = () => {
    setIsRunning(true);
  };
  
  // Pause simulation
  const handlePause = () => {
    setIsRunning(false);
  };
  
  // Reset simulation
  const handleReset = () => {
    setIsRunning(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    simulationRef.current = new BacteriaSimulation(config);
    setSimulationState(simulationRef.current.getState());
    setIteration(0);
    setSelectedBacterium(null);
  };
  
  // Handle bacterium selection
  const handleSelectBacterium = (bacterium) => {
    setSelectedBacterium(bacterium);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bacteria Evolution Simulation</h1>
        <p className="text-gray-600">
          Interactive simulation of bacterial colonies evolving under different environmental conditions
        </p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Controls */}
          <div className="lg:col-span-3">
            <SimulationControls 
              config={config}
              onConfigChange={handleConfigChange}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              isRunning={isRunning}
            />
            
            <div className="mt-6">
              <VisualizationControls 
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
            
            <div className="mt-6">
              <BacteriaDetails selectedBacterium={selectedBacterium} />
            </div>
          </div>
          
          {/* Middle and right columns - Simulation and Stats */}
          <div className="lg:col-span-9">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Simulation</h2>
                <div className="text-gray-600">
                  Iteration: <span className="font-medium">{iteration}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                {simulationState ? (
                  <SimulationCanvas 
                    simulationState={simulationState}
                    width={800}
                    height={500}
                    viewMode={viewMode}
                    onSelectBacterium={handleSelectBacterium}
                  />
                ) : (
                  <div className="w-[800px] h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
                    Loading simulation...
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatisticsPanel stats={simulationState?.stats} />
              <EnvironmentInfo simulationState={simulationState} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Bacteria Evolution Simulation &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
