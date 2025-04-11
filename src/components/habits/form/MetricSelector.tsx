
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { METRIC_OPTIONS } from '../constants/habit-constants';

interface MetricSelectorProps {
  metric: string;
  setMetric: (metric: string) => void;
  metricValue: string;
  setMetricValue: (value: string) => void;
  customMetric: string;
  setCustomMetric: (metric: string) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({
  metric,
  setMetric,
  metricValue,
  setMetricValue,
  customMetric,
  setCustomMetric
}) => {
  return (
    <div className="space-y-2">      
      <div className="flex gap-3 items-center">
        <div className="w-1/3">
          <Input
            placeholder="Amount"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            type="number"
            min="0"
            className="border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            aria-label="Target amount"
          />
        </div>
        <div className="flex-1">
          <Select value={metric} onValueChange={(value) => setMetric(value)}>
            <SelectTrigger className="border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus:ring-0 focus:border-primary transition-colors">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'custom' ? 'Custom unit...' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {metric === 'custom' && (
        <div className="mt-2">
          <Input
            placeholder="e.g. chapters, lessons, etc."
            value={customMetric}
            onChange={(e) => setCustomMetric(e.target.value)}
            required
            className="border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors"
          />
        </div>
      )}
    </div>
  );
};

export default MetricSelector;
