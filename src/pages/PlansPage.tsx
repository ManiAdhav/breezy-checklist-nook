
import React from 'react';
import { useGoal } from '@/contexts/GoalContext';
import PlanList from '@/components/weekly/PlanList';
import Layout from '../components/layout/Layout';

const PlansPage: React.FC = () => {
  const { plans, isLoading } = useGoal();

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekly Plans</h1>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading plans...</div>
        ) : (
          <PlanList plans={plans} />
        )}
      </div>
    </Layout>
  );
};

export default PlansPage;
