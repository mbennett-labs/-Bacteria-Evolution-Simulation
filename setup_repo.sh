#!/bin/bash
# Script to create a bacteria evolution simulation repository structure

# Create directories
mkdir -p src/{components,models,utils,styles}
mkdir -p public/assets
mkdir -p docs
mkdir -p tests/{unit,integration}

# Create base files
touch README.md
touch LICENSE
touch .gitignore
touch src/index.js
touch src/components/{App.js,SimulationView.js,ControlPanel.js,StatisticsPanel.js}
touch src/models/{Bacterium.js,Environment.js,Simulation.js}
touch src/utils/{genetics.js,physics.js,visualization.js}
touch src/styles/main.css
touch public/index.html
touch public/favicon.ico
touch docs/{api.md,development.md}
touch package.json

# Copy the existing user guide to docs directory
if [ -f user_guide.md ]; then
    cp user_guide.md docs/
fi

echo "Repository structure created successfully!"
