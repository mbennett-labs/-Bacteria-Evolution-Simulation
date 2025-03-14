import React, { useRef, useEffect, useState } from 'react';
import { getGradientColor } from '../utils/simulationUtils';

const SimulationCanvas = ({ simulationState, width, height, viewMode = 'bacteria', onSelectBacterium }) => {
  const canvasRef = useRef(null);
  const [hoveredBacterium, setHoveredBacterium] = useState(null);
  
  useEffect(() => {
    if (!simulationState || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { bacteria, nutrients, temperature, pH } = simulationState;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background based on view mode
    if (viewMode === 'nutrients') {
      drawGrid(ctx, nutrients, 'nutrient');
    } else if (viewMode === 'temperature') {
      drawGrid(ctx, temperature, 'temperature');
    } else if (viewMode === 'pH') {
      drawGrid(ctx, pH, 'pH');
    } else {
      // Default background for bacteria view
      drawGrid(ctx, nutrients, 'nutrient', 0.3); // Faded nutrient background
    }
    
    // Draw bacteria
    if (bacteria && bacteria.length > 0) {
      drawBacteria(ctx, bacteria);
    }
    
    // Draw tooltip for hovered bacterium
    if (hoveredBacterium) {
      drawTooltip(ctx, hoveredBacterium);
    }
    
  }, [simulationState, viewMode, width, height, hoveredBacterium]);
  
  const drawGrid = (ctx, grid, colorType, opacity = 1) => {
    if (!grid || grid.length === 0 || !grid[0]) return;
    
    const cellWidth = width / grid[0].length;
    const cellHeight = height / grid.length;
    
    // Find min and max values for normalization
    let minVal = Infinity;
    let maxVal = -Infinity;
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        minVal = Math.min(minVal, grid[y][x]);
        maxVal = Math.max(maxVal, grid[y][x]);
      }
    }
    
    // Draw cells
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        // Normalize value between 0 and 1
        const normalizedValue = maxVal > minVal 
          ? (grid[y][x] - minVal) / (maxVal - minVal)
          : 0.5;
        
        ctx.fillStyle = getGradientColor(normalizedValue, colorType);
        
        // Apply opacity
        if (opacity < 1) {
          ctx.globalAlpha = opacity;
        }
        
        ctx.fillRect(
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight
        );
        
        // Reset opacity
        if (opacity < 1) {
          ctx.globalAlpha = 1;
        }
      }
    }
  };
  
  const drawBacteria = (ctx, bacteria) => {
    bacteria.forEach(bacterium => {
      // Calculate fitness to determine color
      const fitness = calculateFitness(bacterium);
      
      // Size based on energy
      const size = Math.max(2, Math.min(8, 2 + bacterium.energy / 5));
      
      ctx.beginPath();
      ctx.arc(
        bacterium.x * (width / 100),
        bacterium.y * (height / 100),
        size,
        0,
        2 * Math.PI
      );
      
      // Color based on fitness
      ctx.fillStyle = getGradientColor(fitness, 'fitness');
      ctx.fill();
      
      // Add a border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // Highlight hovered bacterium
      if (hoveredBacterium && bacterium.id === hoveredBacterium.id) {
        ctx.beginPath();
        ctx.arc(
          bacterium.x * (width / 100),
          bacterium.y * (height / 100),
          size + 2,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };
  
  const drawTooltip = (ctx, bacterium) => {
    const x = bacterium.x * (width / 100);
    const y = bacterium.y * (height / 100);
    
    // Tooltip text
    const text = `ID: ${bacterium.id} | Energy: ${bacterium.energy.toFixed(1)} | Gen: ${bacterium.generation}`;
    
    // Tooltip style
    ctx.font = '12px Arial';
    const textWidth = ctx.measureText(text).width;
    const padding = 5;
    const tooltipWidth = textWidth + padding * 2;
    const tooltipHeight = 20;
    
    // Position tooltip to stay within canvas
    let tooltipX = x + 10;
    let tooltipY = y - 20;
    
    if (tooltipX + tooltipWidth > width) {
      tooltipX = width - tooltipWidth - 5;
    }
    
    if (tooltipY - tooltipHeight < 0) {
      tooltipY = y + 20;
    }
    
    // Draw tooltip background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(tooltipX, tooltipY - tooltipHeight, tooltipWidth, tooltipHeight);
    
    // Draw tooltip text
    ctx.fillStyle = 'white';
    ctx.fillText(text, tooltipX + padding, tooltipY - padding);
  };
  
  // Simple fitness calculation for visualization
  const calculateFitness = (bacterium) => {
    // This is a simplified version - the actual calculation is in the simulation model
    return Math.min(1, Math.max(0, bacterium.energy / 20));
  };
  
  // Handle mouse move to detect hovering over bacteria
  const handleMouseMove = (e) => {
    if (!simulationState || !simulationState.bacteria) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert mouse coordinates to simulation coordinates
    const simX = (mouseX / width) * 100;
    const simY = (mouseY / height) * 100;
    
    // Find closest bacterium within a certain radius
    const hoverRadius = 5;
    let closestBacterium = null;
    let closestDistance = hoverRadius;
    
    for (const bacterium of simulationState.bacteria) {
      const dx = bacterium.x - simX;
      const dy = bacterium.y - simY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestBacterium = bacterium;
      }
    }
    
    setHoveredBacterium(closestBacterium);
  };
  
  // Handle click to select a bacterium
  const handleClick = () => {
    if (hoveredBacterium && onSelectBacterium) {
      onSelectBacterium(hoveredBacterium);
    }
  };
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
};

export default SimulationCanvas;
