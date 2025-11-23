import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useAppContext } from '../context/AppContext';

const VisualizationPanel = () => {
  const svgRef = useRef();
  const { state } = useAppContext();

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

    // Check if we have visualization data from the backend
    if (state.visualizationData && state.visualizationData.type) {
      // Draw based on the type of data structure
      switch (state.visualizationData.type) {
        case 'array':
          drawArrayVisualization(svg, state.visualizationData.data, width, height);
          break;
        case 'linkedlist':
          drawLinkedListVisualization(svg, state.visualizationData.data, width, height);
          break;
        case 'tree':
          drawTreeVisualization(svg, state.visualizationData.data, width, height);
          break;
        case 'stack':
          drawStackVisualization(svg, state.visualizationData.data, width, height);
          break;
        case 'queue':
          drawQueueVisualization(svg, state.visualizationData.data, width, height);
          break;
        case 'graph':
          drawGraphVisualization(svg, state.visualizationData.data, width, height);
          break;
        default:
          drawDefaultVisualization(svg, width, height);
      }
    } else {
      // Draw default visualization if no data is available
      drawDefaultVisualization(svg, width, height);
    }
  }, [state.visualizationData]); // Redraw when visualization data changes

  // Function to draw array visualization
  const drawArrayVisualization = (svg, arrayData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Array Visualization");

    if (!arrayData || !Array.isArray(arrayData)) return;

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
  };

  // Function to draw linked list visualization
  const drawLinkedListVisualization = (svg, linkedListData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Linked List Visualization");

    if (!linkedListData || !Array.isArray(linkedListData)) return;

    const nodeRadius = 25;
    const startX = 100;
    const startY = height / 2;
    const spacing = 120;

    // Draw linked list nodes
    linkedListData.forEach((node, index) => {
      const cx = startX + index * spacing;

      // Draw circle for node
      svg.append("circle")
         .attr("cx", cx)
         .attr("cy", startY)
         .attr("r", nodeRadius)
         .attr("fill", "#2196F3")
         .attr("stroke", "#333")
         .attr("stroke-width", 1);

      // Draw value inside circle
      svg.append("text")
         .attr("x", cx)
         .attr("y", startY)
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .text(node.value);

      // Draw arrow if there's a next node
      if (node.next !== null && node.next !== undefined && index < linkedListData.length - 1) {
        const arrowX1 = cx + nodeRadius - 5;
        const arrowY = startY;
        const arrowX2 = cx + spacing - nodeRadius + 5;

        svg.append("line")
           .attr("x1", arrowX1)
           .attr("y1", arrowY)
           .attr("x2", arrowX2)
           .attr("y2", arrowY)
           .attr("stroke", "#333")
           .attr("stroke-width", 2)
           .attr("marker-end", "url(#arrowhead)");
      }
    });

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
  };

  // Function to draw tree visualization (simple version)
  const drawTreeVisualization = (svg, treeData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Tree Visualization");

    // For now, draw a simple binary tree representation
    if (treeData) {
      drawBinaryTree(svg, treeData, width / 2, 80, width / 4, height);
    }
  };

  // Helper function to recursively draw a binary tree
  const drawBinaryTree = (svg, node, x, y, xOffset, height, level = 0) => {
    if (!node) return;

    const nodeRadius = 20;
    const verticalSpacing = 60;

    // Draw the node
    svg.append("circle")
       .attr("cx", x)
       .attr("cy", y)
       .attr("r", nodeRadius)
       .attr("fill", "#FF9800")
       .attr("stroke", "#333")
       .attr("stroke-width", 1);

    // Draw the value inside the node
    svg.append("text")
       .attr("x", x)
       .attr("y", y)
       .attr("text-anchor", "middle")
       .attr("dy", "0.35em")
       .attr("fill", "white")
       .text(node.value);

    // Draw left subtree if it exists
    if (node.left) {
      const leftX = x - xOffset;
      const leftY = y + verticalSpacing;

      // Draw line to left child
      svg.append("line")
         .attr("x1", x)
         .attr("y1", y)
         .attr("x2", leftX)
         .attr("y2", leftY)
         .attr("stroke", "#333")
         .attr("stroke-width", 1);

      // Recursively draw left subtree
      drawBinaryTree(svg, node.left, leftX, leftY, xOffset / 2, height, level + 1);
    }

    // Draw right subtree if it exists
    if (node.right) {
      const rightX = x + xOffset;
      const rightY = y + verticalSpacing;

      // Draw line to right child
      svg.append("line")
         .attr("x1", x)
         .attr("y1", y)
         .attr("x2", rightX)
         .attr("y2", rightY)
         .attr("stroke", "#333")
         .attr("stroke-width", 1);

      // Recursively draw right subtree
      drawBinaryTree(svg, node.right, rightX, rightY, xOffset / 2, height, level + 1);
    }
  };

  // Function to draw stack visualization
  const drawStackVisualization = (svg, stackData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Stack Visualization");

    if (!stackData || !Array.isArray(stackData)) return;

    const rectWidth = 80;
    const rectHeight = 40;
    const spacing = 10;
    const startX = (width - rectWidth) / 2; // Stack is vertical, so center horizontally

    // Draw stack elements from bottom to top (bottom of stack at the bottom)
    stackData.forEach((value, index) => {
      const y = height - 100 - index * (rectHeight + spacing);

      // Draw rectangle
      svg.append("rect")
         .attr("x", startX)
         .attr("y", y)
         .attr("width", rectWidth)
         .attr("height", rectHeight)
         .attr("fill", "#9C27B0")
         .attr("stroke", "#333")
         .attr("stroke-width", 1);

      // Draw value inside rectangle
      svg.append("text")
         .attr("x", startX + rectWidth / 2)
         .attr("y", y + rectHeight / 2)
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .text(value);

      // Draw index
      svg.append("text")
         .attr("x", startX + rectWidth + 10)
         .attr("y", y + rectHeight / 2)
         .attr("text-anchor", "start")
         .attr("dy", "0.35em")
         .attr("font-size", "12px")
         .attr("fill", "#333")
         .text(`top-${index}`);
    });

    // Draw "top" indicator
    if (stackData.length > 0) {
      const topY = height - 100 - (stackData.length - 1) * (rectHeight + spacing) - 20;
      svg.append("text")
         .attr("x", startX - 20)
         .attr("y", topY)
         .attr("text-anchor", "end")
         .attr("font-size", "14px")
         .attr("fill", "#f44336")
         .text("TOP");
    }
  };

  // Function to draw queue visualization
  const drawQueueVisualization = (svg, queueData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Queue Visualization");

    if (!queueData || !Array.isArray(queueData)) return;

    const rectWidth = 60;
    const rectHeight = 35;
    const spacing = 8;
    const startY = height / 2;

    // Draw queue elements from left to right (front to back)
    queueData.forEach((value, index) => {
      const x = (width - queueData.length * (rectWidth + spacing)) / 2 + index * (rectWidth + spacing);

      // Draw rectangle
      svg.append("rect")
         .attr("x", x)
         .attr("y", startY)
         .attr("width", rectWidth)
         .attr("height", rectHeight)
         .attr("fill", "#FF9800")
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
         .attr("y", startY + rectHeight + 15)
         .attr("text-anchor", "middle")
         .attr("font-size", "10px")
         .attr("fill", "#333")
         .text(index === 0 ? "Front" : (index === queueData.length - 1 ? "Back" : ""));
    });

    // Draw arrows showing direction
    if (queueData.length > 1) {
      const arrowStartX = (width - queueData.length * (rectWidth + spacing)) / 2 + rectWidth + spacing / 2;
      const arrowEndX = (width - queueData.length * (rectWidth + spacing)) / 2 + queueData.length * (rectWidth + spacing) - rectWidth - spacing / 2;

      svg.append("line")
         .attr("x1", arrowStartX)
         .attr("y1", startY + rectHeight + 30)
         .attr("x2", arrowEndX)
         .attr("y2", startY + rectHeight + 30)
         .attr("stroke", "#333")
         .attr("stroke-width", 2)
         .attr("marker-end", "url(#arrowhead)");

      svg.append("text")
         .attr("x", (arrowStartX + arrowEndX) / 2)
         .attr("y", startY + rectHeight + 25)
         .attr("text-anchor", "middle")
         .attr("font-size", "12px")
         .attr("fill", "#333")
         .text("Dequeue ← → Enqueue");
    }
  };

  // Function to draw graph visualization
  const drawGraphVisualization = (svg, graphData, width, height) => {
    // Draw a title
    svg.append("text")
       .attr("x", width / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .text("Graph Visualization");

    if (!graphData || (!Array.isArray(graphData.nodes) && !Array.isArray(graphData.edges))) return;

    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];

    // Default positions for nodes if no positions are provided
    const nodeRadius = 20;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3; // Radius for circular layout

    // Draw edges first (so they appear behind nodes)
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        // Calculate positions based on circular layout if no positions provided
        const sourceX = sourceNode.x !== undefined ? sourceNode.x : (centerX + radius * Math.cos(2 * Math.PI * sourceNode.id / nodes.length));
        const sourceY = sourceNode.y !== undefined ? sourceNode.y : (centerY + radius * Math.sin(2 * Math.PI * sourceNode.id / nodes.length));
        const targetX = targetNode.x !== undefined ? targetNode.x : (centerX + radius * Math.cos(2 * Math.PI * targetNode.id / nodes.length));
        const targetY = targetNode.y !== undefined ? targetNode.y : (centerY + radius * Math.sin(2 * Math.PI * targetNode.id / nodes.length));

        // Draw edge line
        svg.append("line")
           .attr("x1", sourceX)
           .attr("y1", sourceY)
           .attr("x2", targetX)
           .attr("y2", targetY)
           .attr("stroke", "#333")
           .attr("stroke-width", 1.5);
      }
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      // Calculate position based on circular layout if no positions provided
      const x = node.x !== undefined ? node.x : (centerX + radius * Math.cos(2 * Math.PI * index / nodes.length));
      const y = node.y !== undefined ? node.y : (centerY + radius * Math.sin(2 * Math.PI * index / nodes.length));

      // Draw node
      svg.append("circle")
         .attr("cx", x)
         .attr("cy", y)
         .attr("r", nodeRadius)
         .attr("fill", "#4CAF50")
         .attr("stroke", "#333")
         .attr("stroke-width", 1);

      // Draw value inside node
      svg.append("text")
         .attr("x", x)
         .attr("y", y)
         .attr("text-anchor", "middle")
         .attr("dy", "0.35em")
         .attr("fill", "white")
         .text(node.value || node.id);
    });
  };

  // Function to draw default visualization (when no data is available)
  const drawDefaultVisualization = (svg, width, height) => {
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
  };

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