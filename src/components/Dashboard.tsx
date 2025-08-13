
import React, { useState, useMemo } from 'react';
import { ProcessedData, ViewMode } from '@/types/data';
import MetricsPanel from '@/components/MetricsPanel';
import DataFilters from '@/components/DataFilters';
import DataTable from '@/components/DataTable';
import ChartPanel from '@/components/ChartPanel';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import TopBottomClasses from '@/components/TopBottomClasses';
import TrainerComparisonView from '@/components/TrainerComparisonView';
import GridView from '@/components/views/GridView';
import KanbanView from '@/components/views/KanbanView';
import TimelineView from '@/components/views/TimelineView';
import PivotView from '@/components/views/PivotView';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import AnimatedLogo from '@/components/AnimatedLogo';
import { TooltipProvider } from '@/components/ui/tooltip';

interface DashboardProps {
  data: ProcessedData[];
  loading: boolean;
  progress: number;
  onReset: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  loading,
  progress,
  onReset,
  viewMode,
  setViewMode,
  onLogout
}) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  
  const availableColumns = useMemo(() => {
    if (data.length === 0) return [];

    const firstItem = data[0];
    return Object.keys(firstItem).map(key => ({
      key,
      label: key,
      sortable: true
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;
    
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        const itemValue = item[key as keyof ProcessedData];
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  // Create mock trainer avatars for view components
  const trainerAvatars = useMemo(() => {
    const avatars: Record<string, string> = {};
    const uniqueTrainers = new Set(data.map(item => item.teacherName));
    uniqueTrainers.forEach(trainer => {
      avatars[trainer] = `https://api.dicebear.com/7.x/avataaars/svg?seed=${trainer}`;
    });
    return avatars;
  }, [data]);

  // Handle filter changes from DataFilters component
  const handleFilterChange = (filterOptions: any[]) => {
    const newFilters: { [key: string]: string } = {};
    filterOptions.forEach(option => {
      if (option.value && option.value !== 'all') {
        newFilters[option.key] = option.value;
      }
    });
    setFilters(newFilters);
  };

  return (
    <TooltipProvider>
      <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
        {/* Enhanced Header */}
        <motion.header 
          className="bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AnimatedLogo />
                <motion.div 
                  className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                />
                <motion.p 
                  className="hidden md:block text-sm text-gray-600 dark:text-gray-300 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <span className="text-primary font-semibold">{data.length}</span> records loaded
                </motion.p>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Metrics Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MetricsPanel data={filteredData} />
          </motion.div>

          {/* Enhanced Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3"></span>
              Filters & Views
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataFilters
                data={data}
                onFilterChange={handleFilterChange}
                onSortChange={() => {}}
                activeFilters={Object.keys(filters).length}
              />
              <ViewSwitcher 
                viewMode={viewMode} 
                setViewMode={setViewMode}
              />
            </div>
          </motion.div>

          {/* Enhanced Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden"
          >
            {viewMode === 'table' && (
              <DataTable 
                data={filteredData} 
                availableColumns={availableColumns}
                className="border-0"
              />
            )}
            {viewMode === 'grid' && <GridView data={filteredData} trainerAvatars={trainerAvatars} />}
            {viewMode === 'kanban' && <KanbanView data={filteredData} trainerAvatars={trainerAvatars} />}
            {viewMode === 'timeline' && <TimelineView data={filteredData} trainerAvatars={trainerAvatars} />}
            {viewMode === 'pivot' && <PivotView data={filteredData} trainerAvatars={trainerAvatars} />}
          </motion.div>

          {/* Enhanced Charts and Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="xl:col-span-2"
            >
              <ChartPanel data={filteredData} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-8"
            >
              <TopBottomClasses data={filteredData} />
              <TrainerComparisonView data={filteredData} trainerAvatars={trainerAvatars} />
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
