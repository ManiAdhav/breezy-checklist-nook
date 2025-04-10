
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Predefined metric options
export const METRIC_OPTIONS = [
  'steps',
  'minutes',
  'hours',
  'times',
  'pages',
  'glasses',
  'repetitions',
  'sessions',
  'kilometers',
  'miles',
  'custom'
];

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
    <div className="bg-muted/50 p-4 rounded-lg border border-border">
      <div className="space-y-3">
        <Label htmlFor="metric" className="text-muted-foreground text-xs font-normal">
          How will you measure this?
        </Label>
        
        <div className="flex gap-3 items-center">
          <div className="w-20">
            <Input
              placeholder="Amount"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              type="number"
              min="0"
              className="border-primary/20 focus-visible:ring-primary"
            />
          </div>
          <div className="flex-1">
            <Select value={metric} onValueChange={(value) => setMetric(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {METRIC_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === 'custom' ? 'Custom metric...' : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {metric === 'custom' && (
          <Input
            placeholder="Enter custom metric"
            value={customMetric}
            onChange={(e) => setCustomMetric(e.target.value)}
            required
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default MetricSelector;
