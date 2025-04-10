
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { METRIC_OPTIONS } from '../constants/habit-constants';
import { BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="border-border/20 shadow-sm bg-background rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
          <BarChart2 className="h-4 w-4 text-primary" />
          <span>Measurement</span>
        </div>
        
        <div className="flex gap-3 items-end">
          <div className="w-24">
            <Label htmlFor="metricValue" className="text-xs text-muted-foreground block mb-1.5">
              Target
            </Label>
            <Input
              id="metricValue"
              placeholder="Amount"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              type="number"
              min="0"
              className="border-input/40 focus-visible:ring-primary"
              aria-label="Target amount"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="metricType" className="text-xs text-muted-foreground block mb-1.5">
              Unit
            </Label>
            <Select value={metric} onValueChange={(value) => setMetric(value)}>
              <SelectTrigger id="metricType" className="w-full border-input/40">
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
          <div className="mt-3">
            <Label htmlFor="customMetric" className="text-xs text-muted-foreground block mb-1.5">
              Custom unit name
            </Label>
            <Input
              id="customMetric"
              placeholder="e.g. chapters, lessons, etc."
              value={customMetric}
              onChange={(e) => setCustomMetric(e.target.value)}
              required
              className="border-input/40 focus-visible:ring-primary"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricSelector;
