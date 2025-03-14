import React from 'react';
import { getGradientColor } from '../utils/simulationUtils';

const ColorLegend = ({ type = 'bacteria', className = '' }) => {
  const gradientSteps = 10;
  const legendItems = [];
  
  // Generate gradient steps
  for (let i = 0; i < gradientSteps; i++) {
    const value = i / (gradientSteps - 1);
    const color = getGradientColor(value, type);
    legendItems.push({ value, color });
  }
  
  // Get labels based on type
  const getLabels = () => {
    switch (type) {
      case 'temperature':
        return { low: 'Cold', high: 'Hot' };
      case 'pH':
        return { low: 'Acidic', high: 'Alkaline' };
      case 'nutrient':
        return { low: 'Low', high: 'High' };
      case 'fitness':
        return { low: 'Low Fitness', high: 'High Fitness' };
      default:
        return { low: 'Low', high: 'High' };
    }
  };
  
  const labels = getLabels();
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="text-sm font-medium mb-1 capitalize">{type} Legend</div>
      <div className="flex items-center">
        <span className="text-xs mr-2">{labels.low}</span>
        <div className="flex h-4 flex-grow">
          {legendItems.map((item, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: item.color,
                width: `${100 / gradientSteps}%`
              }}
              className="h-full"
            />
          ))}
        </div>
        <span className="text-xs ml-2">{labels.high}</span>
      </div>
    </div>
  );
};

export default ColorLegend;
