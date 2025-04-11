
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { METRIC_OPTIONS } from '../constants/habit-constants';
import { BarChart2 } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="flex items-center text-sm font-medium text-muted-foreground">
        <BarChart2 className="h-4 w-4 text-primary mr-2" />
        <span>Measurement</span>
      </div>
      
      <div className="flex gap-3 items-center">
        <div className="w-1/3">
          <Input
            placeholder="Amount"
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            type="number"
            min="0"
            className="bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            aria-label="Target amount"
          />
        </div>
        <div className="flex-1">
          <Select value={metric} onValueChange={(value) => setMetric(value)}>
            <SelectTrigger className="bg-muted/30 border-0 focus:ring-1 focus:ring-primary">
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
        <div>
          <Input
            placeholder="e.g. chapters, lessons, etc."
            value={customMetric}
            onChange={(e) => setCustomMetric(e.target.value)}
            required
            className="bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      )}
    </div>
  );
};

export default MetricSelector;
