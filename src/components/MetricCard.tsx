
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const MetricCard = ({ title, value, icon, trend, className }: MetricCardProps) => {
  const isPositiveTrend = trend ? trend.value >= 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="relative group"
    >
      <Card className={cn(
        "overflow-hidden relative h-full",
        "bg-gradient-to-br from-white/95 via-white/90 to-white/80",
        "dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-800/80",
        "border border-gray-200/50 dark:border-gray-700/50",
        "hover:border-primary/30 dark:hover:border-primary/40",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "backdrop-blur-sm",
        className
      )}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6 h-full flex flex-col">
          {/* Header with icon and trend */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={cn(
                  "p-3 rounded-xl",
                  "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5",
                  "dark:from-primary/25 dark:via-primary/15 dark:to-primary/10",
                  "shadow-sm group-hover:shadow-md",
                  "transition-all duration-300"
                )}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-primary">
                  {icon}
                </div>
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide uppercase">
                  {title}
                </h3>
              </div>
            </div>
            
            {trend && (
              <motion.div 
                className={cn(
                  "flex items-center space-x-1 text-sm px-2 py-1 rounded-lg",
                  "backdrop-blur-sm",
                  isPositiveTrend 
                    ? "text-emerald-600 bg-emerald-50/80 dark:text-emerald-400 dark:bg-emerald-950/50" 
                    : "text-red-600 bg-red-50/80 dark:text-red-400 dark:bg-red-950/50"
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isPositiveTrend ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-semibold">{Math.abs(trend.value)}%</span>
                <span className="text-xs opacity-75">{trend.label}</span>
              </motion.div>
            )}
          </div>

          {/* Value display */}
          <div className="flex-1 flex items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <span className={cn(
                "text-3xl font-bold tracking-tight",
                "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
                "dark:from-gray-100 dark:via-gray-200 dark:to-gray-300",
                "bg-clip-text text-transparent",
                "group-hover:from-primary group-hover:to-secondary",
                "transition-all duration-300"
              )}>
                {value}
              </span>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
};

export default MetricCard;
