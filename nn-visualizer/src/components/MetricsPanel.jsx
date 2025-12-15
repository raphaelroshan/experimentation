import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

/**
 * Metrics panel with loss curve and accuracy charts
 */
export function MetricsPanel({ 
  history = { loss: [], accuracy: [] }, 
  epoch = 0,
  currentLoss = null,
  currentAccuracy = null,
  problemType = 'classification',
}) {
  const maxPoints = 100;

  // Downsample history for visualization
  const chartData = useMemo(() => {
    const downsample = (arr) => {
      if (arr.length <= maxPoints) return arr;
      const step = Math.ceil(arr.length / maxPoints);
      return arr.filter((_, i) => i % step === 0);
    };

    return {
      loss: downsample(history.loss),
      accuracy: downsample(history.accuracy),
    };
  }, [history]);

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Metrics</h2>
          <InfoTooltip title="Training Metrics">
            These metrics show how well your network is learning. Watch them change as training progresses!
          </InfoTooltip>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-[var(--text-muted)]">Epoch</span>
          <span className="text-sm font-mono text-[var(--accent-secondary)]">{epoch}</span>
          <InfoTooltip title="What is an Epoch?">
            An <strong>epoch</strong> is one complete pass through all training data. 
            Training typically requires many epochs for the network to learn patterns effectively.
          </InfoTooltip>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          label="Loss" 
          value={currentLoss !== null ? currentLoss.toFixed(4) : '—'}
          color="var(--negative)"
          trend={history.loss.length > 1 ? 
            (history.loss[history.loss.length - 1] < history.loss[history.loss.length - 2] ? 'down' : 'up') 
            : null}
          tooltip={
            <span>
              <strong>Loss</strong> measures how wrong the network's predictions are. 
              Lower is better! Watch this decrease during training.
              <br/><br/>
              <strong>Goal:</strong> Get as close to 0 as possible.
            </span>
          }
        />
        {problemType === 'classification' && (
          <StatCard 
            label="Accuracy" 
            value={currentAccuracy !== null ? `${(currentAccuracy * 100).toFixed(1)}%` : '—'}
            color="var(--positive)"
            trend={history.accuracy.length > 1 ? 
              (history.accuracy[history.accuracy.length - 1] > history.accuracy[history.accuracy.length - 2] ? 'up' : 'down') 
              : null}
            tooltip={
              <span>
                <strong>Accuracy</strong> is the percentage of correct predictions.
                Higher is better!
                <br/><br/>
                <strong>Goal:</strong> Get as close to 100% as possible.
              </span>
            }
          />
        )}
        {problemType === 'regression' && (
          <StatCard 
            label="MSE" 
            value={currentLoss !== null ? currentLoss.toFixed(4) : '—'}
            color="var(--warning)"
            tooltip={
              <span>
                <strong>MSE (Mean Squared Error)</strong> measures the average squared 
                difference between predictions and actual values.
                <br/><br/>
                <strong>Formula:</strong> Σ(predicted - actual)² / n
              </span>
            }
          />
        )}
      </div>

      {/* Loss Chart */}
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-xs text-[var(--text-muted)]">Loss over time</span>
          <InfoTooltip title="Loss Curve">
            A healthy training curve should show loss decreasing over time. 
            If loss increases or stays flat, try adjusting learning rate or architecture.
          </InfoTooltip>
        </div>
        <div className="h-24 bg-[var(--bg-tertiary)] rounded-lg p-2 relative overflow-hidden">
          {chartData.loss.length > 1 ? (
            <LineChart data={chartData.loss} color="var(--negative)" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)]">
              Start training to see loss curve
            </div>
          )}
        </div>
      </div>

      {/* Accuracy Chart (for classification) */}
      {problemType === 'classification' && (
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-xs text-[var(--text-muted)]">Accuracy over time</span>
            <InfoTooltip title="Accuracy Curve">
              Shows the percentage of correct predictions over training. 
              Should increase and eventually plateau near the maximum achievable accuracy.
            </InfoTooltip>
          </div>
          <div className="h-24 bg-[var(--bg-tertiary)] rounded-lg p-2 relative overflow-hidden">
            {chartData.accuracy.length > 1 ? (
              <LineChart data={chartData.accuracy} color="var(--positive)" normalize />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)]">
                Start training to see accuracy
              </div>
            )}
          </div>
        </div>
      )}

      {/* Training Tips */}
      {epoch > 0 && epoch < 50 && currentLoss !== null && (
        <TrainingTip loss={currentLoss} epoch={epoch} accuracy={currentAccuracy} problemType={problemType} />
      )}
    </div>
  );
}

function TrainingTip({ loss, epoch, accuracy, problemType }) {
  let tip = null;
  
  if (epoch > 20 && loss > 0.5) {
    tip = "💡 Loss is still high. Try increasing hidden layers or neurons.";
  } else if (epoch > 30 && problemType === 'classification' && accuracy !== null && accuracy < 0.6) {
    tip = "💡 Accuracy is low. Try a lower learning rate or different activation.";
  } else if (loss < 0.1 && epoch < 20) {
    tip = "🎉 Great! Your network is learning quickly!";
  }

  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg p-2.5"
    >
      {tip}
    </motion.div>
  );
}

function StatCard({ label, value, color, trend, tooltip }) {
  return (
    <motion.div 
      className="bg-[var(--bg-tertiary)] rounded-lg p-3 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">{label}</div>
            {tooltip && <InfoTooltip title={label}>{tooltip}</InfoTooltip>}
          </div>
          <div className="text-xl font-semibold font-mono" style={{ color }}>{value}</div>
        </div>
        {trend && (
          <div className={`text-sm ${trend === 'down' ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
            {trend === 'down' ? '↓' : '↑'}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LineChart({ data, color, normalize = false }) {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    
    let normalizedData = data;
    if (!normalize) {
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      normalizedData = data.map(v => (v - min) / range);
    }

    const width = 100;
    const height = 100;
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const pathPoints = normalizedData.map((value, index) => {
      const x = padding + (index / (normalizedData.length - 1)) * chartWidth;
      const y = padding + (1 - value) * chartHeight;
      return `${x},${y}`;
    });

    return `M${pathPoints.join(' L')}`;
  }, [data, normalize]);

  // Gradient area under curve
  const areaPath = useMemo(() => {
    if (data.length < 2) return '';
    
    let normalizedData = data;
    if (!normalize) {
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      normalizedData = data.map(v => (v - min) / range);
    }

    const width = 100;
    const height = 100;
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const pathPoints = normalizedData.map((value, index) => {
      const x = padding + (index / (normalizedData.length - 1)) * chartWidth;
      const y = padding + (1 - value) * chartHeight;
      return `${x},${y}`;
    });

    return `M${padding},${height - padding} L${pathPoints.join(' L')} L${width - padding},${height - padding} Z`;
  }, [data, normalize]);

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      {/* Area under curve */}
      <motion.path
        d={areaPath}
        fill={`url(#gradient-${color.replace(/[^a-z0-9]/gi, '')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {/* Line */}
      <motion.path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

export default MetricsPanel;
