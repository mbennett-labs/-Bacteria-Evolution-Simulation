import React from 'react';

const BacteriaDetails = ({ selectedBacterium }) => {
  if (!selectedBacterium) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Bacteria Details</h2>
        <p className="text-gray-500">Click on a bacterium to view its details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Bacteria Details</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">ID:</span>
          <span className="font-medium">{selectedBacterium.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Position:</span>
          <span className="font-medium">
            ({selectedBacterium.x.toFixed(2)}, {selectedBacterium.y.toFixed(2)})
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Energy:</span>
          <span className="font-medium">{selectedBacterium.energy.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Age:</span>
          <span className="font-medium">{selectedBacterium.age}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Generation:</span>
          <span className="font-medium">{selectedBacterium.generation}</span>
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Genes</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            {Object.entries(selectedBacterium.genes).map(([gene, value]) => (
              <div key={gene} className="flex justify-between mb-1">
                <span className="text-gray-600">{formatGeneName(gene)}:</span>
                <span className="font-medium">{value.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format gene names for display
const formatGeneName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};

export default BacteriaDetails;
