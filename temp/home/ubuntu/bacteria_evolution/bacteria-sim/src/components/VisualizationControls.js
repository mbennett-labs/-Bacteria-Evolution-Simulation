import React, { useState } from 'react';
import ColorLegend from './ColorLegend';

const VisualizationControls = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Visualization Controls</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">View Mode</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'bacteria' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewModeChange('bacteria')}
          >
            Bacteria
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'nutrients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewModeChange('nutrients')}
          >
            Nutrients
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewModeChange('temperature')}
          >
            Temperature
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${viewMode === 'pH' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onViewModeChange('pH')}
          >
            pH
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {viewMode === 'bacteria' && (
          <ColorLegend type="fitness" className="mb-2" />
        )}
        
        {viewMode === 'nutrients' && (
          <ColorLegend type="nutrient" className="mb-2" />
        )}
        
        {viewMode === 'temperature' && (
          <ColorLegend type="temperature" className="mb-2" />
        )}
        
        {viewMode === 'pH' && (
          <ColorLegend type="pH" className="mb-2" />
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Tip:</strong> Hover over bacteria to see details. Click on a bacterium to select it and view its genetic information.</p>
        </div>
      </div>
    </div>
  );
};

export default VisualizationControls;
