
import React from 'react';
import Layout from '@/components/layout/Layout';

const WeeklyPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Weekly Plans</h1>
        <div className="p-8 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground mb-2">The Plans feature has been removed</p>
          <p className="text-sm text-muted-foreground">Please use Actions and Tasks instead to track your progress.</p>
        </div>
      </div>
    </Layout>
  );
};

export default WeeklyPage;
