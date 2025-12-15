import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * SVG-based neural network visualizer
 * Displays nodes colored by activation, edges sized by weight
 */
export function NetworkVisualizer({ 
  architecture = [2, 4, 4, 1], 
  weights = [], 
  activations = [],
  width = 600,
  height = 400,
}) {
  const padding = { x: 60, y: 40 };
  const nodeRadius = 16;

  // Calculate node positions
  const nodes = useMemo(() => {
    const layers = [];
    const numLayers = architecture.length;
    const layerSpacing = (width - padding.x * 2) / (numLayers - 1);

    for (let l = 0; l < numLayers; l++) {
      const numNodes = architecture[l];
      const layerHeight = height - padding.y * 2;
      const nodeSpacing = layerHeight / (numNodes + 1);
      
      const layerNodes = [];
      for (let n = 0; n < numNodes; n++) {
        layerNodes.push({
          x: padding.x + l * layerSpacing,
          y: padding.y + (n + 1) * nodeSpacing,
          layer: l,
          index: n,
        });
      }
      layers.push(layerNodes);
    }

    return layers;
  }, [architecture, width, height]);

  // Calculate edges with weights
  const edges = useMemo(() => {
    const allEdges = [];
    
    for (let l = 0; l < nodes.length - 1; l++) {
      const fromLayer = nodes[l];
      const toLayer = nodes[l + 1];
      const layerWeights = weights[l]?.kernel || null;

      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          const weight = layerWeights ? layerWeights[i][j] : 0;
          allEdges.push({
            from: fromLayer[i],
            to: toLayer[j],
            weight: weight,
            layerIndex: l,
          });
        }
      }
    }

    return allEdges;
  }, [nodes, weights]);

  // Get color for activation value
  const getActivationColor = (value) => {
    if (value === undefined || value === null) return '#64748b';
    const normalized = Math.max(-1, Math.min(1, value));
    if (normalized > 0) {
      const intensity = Math.min(1, normalized);
      return `rgb(${34 + intensity * 100}, ${197 - intensity * 50}, ${94 - intensity * 40})`;
    } else {
      const intensity = Math.min(1, Math.abs(normalized));
      return `rgb(${239 - intensity * 50}, ${68 + intensity * 50}, ${68 + intensity * 50})`;
    }
  };

  // Get color and width for edge based on weight
  const getEdgeStyle = (weight) => {
    const absWeight = Math.abs(weight);
    const opacity = Math.min(0.9, 0.1 + absWeight * 0.4);
    const strokeWidth = Math.min(4, 0.5 + absWeight * 1.5);
    const color = weight > 0 ? `rgba(34, 197, 94, ${opacity})` : `rgba(239, 68, 68, ${opacity})`;
    return { color, strokeWidth };
  };

  // Get activation value for a node
  const getNodeActivation = (layer, index) => {
    if (!activations || !activations[layer]) return null;
    const layerActivations = activations[layer];
    if (Array.isArray(layerActivations)) {
      return layerActivations[index];
    }
    return null;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        width={width} 
        height={height} 
        className="overflow-visible"
        style={{ background: 'transparent' }}
      >
        {/* Background glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="positiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="negativeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3"/>
          </linearGradient>
        </defs>

        {/* Edges */}
        <g className="edges">
          {edges.map((edge, idx) => {
            const style = getEdgeStyle(edge.weight);
            return (
              <motion.line
                key={`edge-${idx}`}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke={style.color}
                strokeWidth={style.strokeWidth}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  strokeWidth: style.strokeWidth,
                  stroke: style.color,
                }}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((layer, layerIdx) => 
            layer.map((node, nodeIdx) => {
              const activation = getNodeActivation(layerIdx, nodeIdx);
              const color = getActivationColor(activation);
              const isInput = layerIdx === 0;
              const isOutput = layerIdx === nodes.length - 1;
              
              return (
                <g key={`node-${layerIdx}-${nodeIdx}`}>
                  {/* Glow effect */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 4}
                    fill={color}
                    opacity={0.3}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: layerIdx * 0.1 + nodeIdx * 0.02 }}
                    filter="url(#glow)"
                  />
                  {/* Main node */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={color}
                    stroke={isInput ? '#6366f1' : isOutput ? '#f59e0b' : '#374151'}
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      fill: color,
                    }}
                    transition={{ 
                      scale: { delay: layerIdx * 0.1 + nodeIdx * 0.02, duration: 0.3 },
                      fill: { duration: 0.15 }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Activation value text */}
                  {activation !== null && (
                    <motion.text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fill="#fff"
                      fontWeight="500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ pointerEvents: 'none' }}
                    >
                      {activation.toFixed(2)}
                    </motion.text>
                  )}
                </g>
              );
            })
          )}
        </g>

        {/* Layer labels */}
        <g className="labels">
          {nodes.map((layer, idx) => (
            <text
              key={`label-${idx}`}
              x={layer[0]?.x || 0}
              y={height - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
              fontWeight="500"
            >
              {idx === 0 ? 'Input' : idx === nodes.length - 1 ? 'Output' : `H${idx}`}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default NetworkVisualizer;

