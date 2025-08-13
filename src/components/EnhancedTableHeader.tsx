
import React from 'react';
import { motion } from 'framer-motion';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  numeric?: boolean;
  currency?: boolean;
  sortable?: boolean;
}

interface EnhancedTableHeaderProps {
  columns: Column[];
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  isGrouped?: boolean;
}

const EnhancedTableHeader: React.FC<EnhancedTableHeaderProps> = ({
  columns,
  sortField,
  sortDirection,
  onSort,
  isGrouped = false
}) => {
  return (
    <TableHeader>
      <TableRow className="border-0 hover:bg-transparent">
        {isGrouped && (
          <TableHead className={cn(
            "w-12 relative overflow-hidden",
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            "dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
            "border-r border-gray-700/50"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10" />
            <div className="relative z-10" />
          </TableHead>
        )}
        
        {columns.map((column, index) => {
          const isSorted = sortField === column.key;
          const canSort = column.sortable !== false;
          
          return (
            <TableHead
              key={column.key}
              className={cn(
                "relative overflow-hidden border-r border-gray-700/30 last:border-r-0",
                "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
                "dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
                column.numeric ? "text-right" : "text-left",
                canSort && "cursor-pointer select-none group",
                "transition-all duration-300"
              )}
              onClick={() => canSort && onSort(column.key)}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isSorted ? 1 : 0 }}
                whileHover={{ opacity: canSort ? 0.7 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
                animate={{ translateX: ['100%', '100%', '-100%', '-100%'] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
              
              <div className="relative z-10 flex items-center space-x-2 py-4 px-4">
                <motion.span
                  className={cn(
                    "font-semibold text-sm tracking-wide uppercase",
                    "text-gray-100 dark:text-gray-200",
                    "group-hover:text-primary-foreground transition-colors duration-200"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {column.label}
                </motion.span>
                
                {canSort && (
                  <motion.div
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isSorted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-primary-foreground" />
                        )}
                      </motion.div>
                    ) : (
                      <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isSorted ? 1 : 0 }}
                whileHover={{ scaleX: canSort ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};

export default EnhancedTableHeader;
