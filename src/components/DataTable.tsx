import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Layers,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ProcessedData, Column } from '@/types/data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { utils, writeFile } from 'xlsx';
import SearchBar from './SearchBar';
import EnhancedTableHeader from '@/components/EnhancedTableHeader';

interface DataTableProps {
  data: ProcessedData[];
  availableColumns: Column[];
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  availableColumns,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState(availableColumns.map(col => col.key));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isGrouped, setIsGrouped] = useState(false);

  const filteredColumns = useMemo(() => {
    return availableColumns.filter(column => visibleColumns.includes(column.key));
  }, [availableColumns, visibleColumns]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    if (!isGrouped) return filteredData;

    const grouped: { [key: string]: ProcessedData[] } = {};
    filteredData.forEach(item => {
      const key = item.cleanedClass;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    const result: (ProcessedData & { isGroup?: boolean, isChild?: boolean })[] = [];
    Object.entries(grouped).forEach(([key, items]) => {
      result.push({ ...items[0], isGroup: true, uniqueID: `group-${key}` }); // Add group header
      items.forEach(item => {
        result.push({ ...item, isChild: true }); // Add child items
      });
    });

    return result;
  }, [filteredData, isGrouped]);

  const sortedData = useMemo(() => {
    if (!sortField) return groupedData;

    const sorted = [...groupedData];
    sorted.sort((a, b) => {
      const aValue = a[sortField as keyof ProcessedData];
      const bValue = b[sortField as keyof ProcessedData];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [groupedData, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayData = sortedData.slice(startIndex, endIndex);

  const exportToCSV = () => {
    const visibleKeys = filteredColumns.map(col => col.key);
    const dataToExport = data.map(item => {
      const newItem: { [key: string]: any } = {};
      visibleKeys.forEach(key => {
        newItem[key] = item[key as keyof ProcessedData];
      });
      return newItem;
    });

    const wb = utils.book_new();
    const ws = utils.json_to_sheet(dataToExport);
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, "class_data.xlsx");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("relative overflow-hidden bg-white dark:bg-gray-900 rounded-lg", className)}
    >
      {/* Enhanced Search and Controls */}
      <motion.div 
        className="p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search classes, trainers, locations..."
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGrouped(!isGrouped)}
              className={cn(
                "transition-all duration-200",
                isGrouped 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <Layers className="h-4 w-4 mr-2" />
              {isGrouped ? 'Ungroup' : 'Group'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {availableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setVisibleColumns([...visibleColumns, column.key]);
                      } else {
                        setVisibleColumns(visibleColumns.filter(col => col !== column.key));
                      }
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Table */}
      <div className="overflow-auto max-h-[70vh] bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50">
        <Table className="relative">
          <EnhancedTableHeader
            columns={filteredColumns}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            isGrouped={isGrouped}
          />
          
          <TableBody className="relative">
            {/* Enhanced Loading State */}
            {displayData.length === 0 && searchTerm && (
              <TableRow>
                <TableCell 
                  colSpan={filteredColumns.length + (isGrouped ? 1 : 0)} 
                  className="h-24 text-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <Search className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</span>
                  </motion.div>
                </TableCell>
              </TableRow>
            )}

            {/* Enhanced Table Rows */}
            {displayData.map((row, index) => (
              <motion.tr
                key={row.uniqueID}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "border-b border-gray-100 dark:border-gray-800 transition-all duration-200",
                  "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50",
                  "dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30",
                  row.isGroup && "bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50",
                  row.isChild && "bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20"
                )}
              >
                {isGrouped && (
                  <TableCell className="w-12 relative overflow-hidden">
                    {row.isGroup && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10" />
                    )}
                    <div className="relative z-10" />
                  </TableCell>
                )}
                {filteredColumns.map(column => {
                  const value = row[column.key as keyof ProcessedData];
                  let formattedValue: React.ReactNode;

                  if (column.currency && typeof value === 'number') {
                    formattedValue = value.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    });
                  } else {
                    formattedValue = String(value);
                  }

                  return (
                    <TableCell
                      key={`${row.uniqueID}-${column.key}`}
                      className={cn(
                        column.numeric ? "text-right" : "text-left",
                        row.isGroup && "font-semibold",
                        row.isChild && "pl-8"
                      )}
                    >
                      {formattedValue}
                    </TableCell>
                  );
                })}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <motion.div 
        className="px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, displayData.length)}</span> of{' '}
              <span className="font-medium">{displayData.length}</span> results
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 dark:border-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-9 h-9 p-0",
                      currentPage === pageNum 
                        ? "bg-primary text-primary-foreground" 
                        : "border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-300 dark:border-gray-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DataTable;
