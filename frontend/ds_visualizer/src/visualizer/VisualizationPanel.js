import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VisualizationPanel = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings
    
    // Set up dimensions
    const width = 600;
    const height = 400;
    
    // Set SVG dimensions
    svg.attr("width", "100%")
       .attr("height", "100%")
       .attr("viewBox", [0, 0, width, height]);
    
    // Draw a simple visualization as a placeholder
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Data Structure Visualization");
    
    // Draw a simple array visualization as an example
    const arrayData = [3, 1, 4, 1, 5];
    const rectWidth = 50;
    const rectHeight = 30;
    const spacing = 10;
    const startX = (width - (arrayData.length * (rectWidth + spacing) - spacing)) / 2;
    const startY = height / 2;
    
    // Draw array elements
    arrayData.forEach((value, index) => {
      const x = startX + index * (rectWidth + spacing);
      
      // Draw rectangle
      svg.append("rect")
         .attr("x", x)
         .attr("y", startY)
         .attr("width", rectWidth)
         .attr("height", rectHeight)
         .attr("fill", "#4CAF50")
         .attr("stroke", "#333")
         .attr("stroke-width", 1);
      
      // Draw value inside rectangle
      svg.append("text")
         .attr("x", x + rectWidth / 2)
         .attr("y", startY + rectHeight / 2)
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .text(value);
      
      // Draw index
      svg.append("text")
         .attr("x", x + rectWidth / 2)
         .attr("y", startY + rectHeight + 20)
         .attr("text-anchor", "middle")
         .attr("font-size", "12px")
         .text(`[${index}]`);
    });
    
    // Add a simple linked list visualization below the array
    const linkedListY = startY + 100;
    const nodeRadius = 25;
    
    // Draw three nodes
    for (let i = 0; i < 3; i++) {
      const cx = startX + i * (nodeRadius * 2 + 30);
      
      // Draw circle for node
      svg.append("circle")
         .attr("cx", cx)
         .attr("cy", linkedListY)
         .attr("r", nodeRadius)
         .attr("fill", "#2196F3")
         .attr("stroke", "#333")
         .attr("stroke-width", 1);
      
      // Draw value inside circle
      svg.append("text")
         .attr("x", cx)
         .attr("y", linkedListY)
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .text(i + 1);
      
      // Draw arrow if not the last node
      if (i < 2) {
        const arrowX = cx + nodeRadius;
        const arrowY = linkedListY;
        
        svg.append("line")
           .attr("x1", arrowX)
           .attr("y1", arrowY)
           .attr("x2", arrowX + 30)
           .attr("y2", arrowY)
           .attr("stroke", "#333")
           .attr("stroke-width", 2)
           .attr("marker-end", "url(#arrowhead)");
      }
    }
    
    // Define arrowhead marker
    const defs = svg.append("defs");
    defs.append("marker")
       .attr("id", "arrowhead")
       .attr("viewBox", "-0 -5 10 10")
       .attr("refX", 5)
       .attr("refY", 0)
       .attr("orient", "auto")
       .attr("markerWidth", 8)
       .attr("markerHeight", 8)
       .append("svg:path")
       .attr("d", "M0,-5L10,0L0,5")
       .attr("fill", "#333");
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <h3>Visualization Panel</h3>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default VisualizationPanel;