import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Data preview component - shows input data and predictions
 */
export function DataPreview({ 
  problemType, 
  data, 
  predictions,
  network,
  curveType = 'sine',
}) {
  if (!data) {
    return (
      <div className="glass rounded-xl p-5">
        <p className="text-sm text-[var(--text-muted)]">Loading data...</p>
      </div>
    );
  }

  if (problemType === 'xor') {
    return <XORPreview data={data} predictions={predictions} network={network} />;
  }
  
  if (problemType === 'regression') {
    return <RegressionPreview data={data} predictions={predictions} curveType={curveType} />;
  }
  
  if (problemType === 'digits') {
    return <DigitsPreview data={data} predictions={predictions} />;
  }

  return null;
}

function XORPreview({ data, predictions, network }) {
  const gridResolution = 30;
  
  // Generate decision boundary grid
  const boundaryData = useMemo(() => {
    if (!network) return null;
    
    const points = [];
    for (let i = 0; i <= gridResolution; i++) {
      for (let j = 0; j <= gridResolution; j++) {
        points.push([i / gridResolution, j / gridResolution]);
      }
    }
    
    try {
      const preds = network.predict(points);
      if (!preds || preds.length === 0) return null;
      return points.map((p, idx) => ({
        x: p[0],
        y: p[1],
        prediction: preds[idx]?.[0] ?? 0.5,
      }));
    } catch {
      return null;
    }
  }, [network, predictions]);

  const size = 200;
  const padding = 20;
  const plotSize = size - padding * 2;

  if (!data || !data.inputs) {
    return (
      <div className="glass rounded-xl p-5">
        <p className="text-sm text-[var(--text-muted)]">Loading XOR data...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Decision Boundary</h3>
      <div className="flex justify-center">
        <svg width={size} height={size} className="bg-[var(--bg-tertiary)] rounded-lg">
          {/* Decision boundary heatmap */}
          {boundaryData && boundaryData.map((point, idx) => {
            const x = padding + point.x * plotSize;
            const y = padding + (1 - point.y) * plotSize;
            const cellSize = plotSize / gridResolution;
            const color = point.prediction > 0.5 
              ? `rgba(34, 197, 94, ${point.prediction * 0.6})` 
              : `rgba(239, 68, 68, ${(1 - point.prediction) * 0.6})`;
            
            return (
              <rect
                key={idx}
                x={x - cellSize / 2}
                y={y - cellSize / 2}
                width={cellSize}
                height={cellSize}
                fill={color}
              />
            );
          })}
          
          {/* Data points */}
          {data.inputs.map((input, idx) => {
            const x = padding + input[0] * plotSize;
            const y = padding + (1 - input[1]) * plotSize;
            const label = data.outputs[idx];
            
            return (
              <motion.circle
                key={`point-${idx}`}
                cx={x}
                cy={y}
                r={8}
                fill={label === 1 ? '#22c55e' : '#ef4444'}
                stroke="#fff"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              />
            );
          })}
          
          {/* Axes labels */}
          <text x={size / 2} y={size - 4} textAnchor="middle" fontSize="10" fill="#64748b">X₁</text>
          <text x={6} y={size / 2} textAnchor="middle" fontSize="10" fill="#64748b" transform={`rotate(-90, 6, ${size/2})`}>X₂</text>
        </svg>
      </div>
      <div className="flex justify-center gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Output: 1
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> Output: 0
        </span>
      </div>
    </div>
  );
}

function RegressionPreview({ data, predictions, curveType }) {
  const size = { width: 280, height: 180 };
  const padding = { x: 30, y: 20 };
  const plotSize = { width: size.width - padding.x * 2, height: size.height - padding.y * 2 };

  // Generate true curve
  const trueCurve = useMemo(() => {
    const curves = {
      sine: (x) => Math.sin(x * Math.PI * 2) * 0.5 + 0.5,
      quadratic: (x) => Math.pow(x - 0.5, 2) * 4,
      cubic: (x) => Math.pow(x - 0.5, 3) * 8 + 0.5,
      step: (x) => x < 0.5 ? 0.2 : 0.8,
      gaussian: (x) => Math.exp(-Math.pow((x - 0.5) * 4, 2)),
    };
    
    const fn = curves[curveType] || curves.sine;
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      points.push({ x, y: fn(x) });
    }
    return points;
  }, [curveType]);

  const trueCurvePath = useMemo(() => {
    return trueCurve.map((p, i) => {
      const x = padding.x + p.x * plotSize.width;
      const y = padding.y + (1 - p.y) * plotSize.height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [trueCurve, plotSize]);

  // Prediction curve
  const predCurvePath = useMemo(() => {
    if (!predictions || predictions.length === 0) return '';
    
    return predictions.map((p, i) => {
      const x = padding.x + (i / (predictions.length - 1)) * plotSize.width;
      const y = padding.y + (1 - (p?.[0] ?? 0.5)) * plotSize.height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [predictions, plotSize]);

  if (!data || !data.inputs) {
    return (
      <div className="glass rounded-xl p-5">
        <p className="text-sm text-[var(--text-muted)]">Loading regression data...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Curve Fitting</h3>
      <div className="flex justify-center">
        <svg width={size.width} height={size.height} className="bg-[var(--bg-tertiary)] rounded-lg">
          {/* Grid */}
          {[0.25, 0.5, 0.75].map(v => (
            <line
              key={`h-${v}`}
              x1={padding.x}
              y1={padding.y + v * plotSize.height}
              x2={size.width - padding.x}
              y2={padding.y + v * plotSize.height}
              stroke="rgba(100, 116, 139, 0.2)"
              strokeDasharray="2"
            />
          ))}
          
          {/* True curve */}
          <path
            d={trueCurvePath}
            fill="none"
            stroke="#64748b"
            strokeWidth={2}
            strokeDasharray="4"
          />
          
          {/* Predicted curve */}
          {predCurvePath && (
            <motion.path
              d={predCurvePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          {/* Data points */}
          {data.inputs.map((input, idx) => {
            const x = padding.x + input[0] * plotSize.width;
            const y = padding.y + (1 - data.outputs[idx]) * plotSize.height;
            
            return (
              <circle
                key={`data-${idx}`}
                cx={x}
                cy={y}
                r={3}
                fill="#f59e0b"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-center gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <span className="w-6 h-0.5 bg-[#64748b]" style={{ borderTop: '2px dashed #64748b' }}></span> Target
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-0.5 bg-[#6366f1]"></span> Prediction
        </span>
      </div>
    </div>
  );
}

function DigitsPreview({ data, predictions }) {
  // Show a few sample digits with predictions
  const samples = useMemo(() => {
    if (!data || !data.inputs || !data.labels) return [];
    
    const numSamples = Math.min(6, data.inputs.length);
    if (numSamples === 0) return [];
    
    const sampleIndices = [];
    const step = Math.max(1, Math.floor(data.inputs.length / numSamples));
    
    for (let i = 0; i < numSamples; i++) {
      const idx = i * step;
      if (idx < data.inputs.length) {
        sampleIndices.push(idx);
      }
    }
    
    return sampleIndices.map(idx => ({
      input: data.inputs[idx] || [],
      label: data.labels[idx] ?? 0,
      prediction: predictions?.[idx] || null,
    }));
  }, [data, predictions]);

  if (!data || !data.inputs || !data.labels) {
    return (
      <div className="glass rounded-xl p-5">
        <p className="text-sm text-[var(--text-muted)]">Loading digit data...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Sample Predictions</h3>
      <div className="grid grid-cols-6 gap-2">
        {samples.map((sample, idx) => (
          <DigitSample key={idx} {...sample} />
        ))}
      </div>
      
      {/* Confusion matrix hint */}
      {predictions && predictions.length > 0 && data.labels && (
        <ConfusionMatrixMini data={data} predictions={predictions} />
      )}
    </div>
  );
}

function DigitSample({ input, label, prediction }) {
  if (!input || input.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded"></div>
        <div className="text-xs text-[var(--text-muted)]">—</div>
      </div>
    );
  }

  const predictedDigit = prediction ? prediction.indexOf(Math.max(...prediction)) : null;
  const isCorrect = predictedDigit === label;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className="w-10 h-10 relative"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          gap: 0,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {input.map((pixel, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `rgba(99, 102, 241, ${pixel})`,
            }}
          />
        ))}
      </div>
      <div className="text-xs text-center">
        <span className="text-[var(--text-muted)]">{label}</span>
        {predictedDigit !== null && (
          <span className={`ml-1 ${isCorrect ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
            →{predictedDigit}
          </span>
        )}
      </div>
    </div>
  );
}

function ConfusionMatrixMini({ data, predictions }) {
  const accuracy = useMemo(() => {
    if (!predictions || !data || !data.labels) return 0;
    
    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (!predictions[i] || !data.labels[i] === undefined) continue;
      const predicted = predictions[i].indexOf(Math.max(...predictions[i]));
      if (predicted === data.labels[i]) correct++;
    }
    return predictions.length > 0 ? correct / predictions.length : 0;
  }, [predictions, data]);

  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
      <span className="text-xs text-[var(--text-muted)]">Overall Accuracy</span>
      <span className={`text-sm font-medium ${accuracy > 0.7 ? 'text-[var(--positive)]' : accuracy > 0.4 ? 'text-[var(--warning)]' : 'text-[var(--negative)]'}`}>
        {(accuracy * 100).toFixed(1)}%
      </span>
    </div>
  );
}

export default DataPreview;
