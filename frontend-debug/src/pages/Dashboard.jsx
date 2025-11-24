import React from 'react';
import { Helmet } from 'react-helmet';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - Photoadmin Panel</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
    </>
  );
};

export default Dashboard;