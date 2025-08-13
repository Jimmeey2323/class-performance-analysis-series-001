import React from 'react';
import { ProcessedData } from '@/types/data';
import MetricCard from '@/components/MetricCard';
import { Users, DollarSign, Calendar, TrendingUp, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsPanelProps {
  data: ProcessedData[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalCheckins = data.reduce((sum, item) => sum + item.totalCheckins, 0);
  const uniqueClasses = new Set(data.map(item => item.cleanedClass)).size;
  const uniqueLocations = new Set(data.map(item => item.location)).size;

  const avgRevenuePerClass = totalRevenue / uniqueClasses || 0;
  const avgCheckinsPerClass = totalCheckins / uniqueClasses || 0;

  const metrics = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      trend: {
        value: 12.5,
        label: "vs last month"
      }
    },
    {
      title: "Total Check-ins",
      value: totalCheckins.toLocaleString(),
      icon: <Users className="h-6 w-6" />,
      trend: {
        value: 8.2,
        label: "vs last month"
      }
    },
    {
      title: "Classes",
      value: uniqueClasses.toLocaleString(),
      icon: <Calendar className="h-6 w-6" />,
      trend: {
        value: 5.1,
        label: "vs last month"
      }
    },
    {
      title: "Avg Revenue/Class",
      value: `$${avgRevenuePerClass.toFixed(0)}`,
      icon: <TrendingUp className="h-6 w-6" />,
      trend: {
        value: 15.3,
        label: "vs last month"
      }
    },
    {
      title: "Locations",
      value: uniqueLocations.toLocaleString(),
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      title: "Avg Check-ins/Class",
      value: avgCheckinsPerClass.toFixed(1),
      icon: <Clock className="h-6 w-6" />,
      trend: {
        value: -2.1,
        label: "vs last month"
      }
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Analytics Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Key performance metrics for your classes
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MetricsPanel;
