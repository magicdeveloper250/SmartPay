'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { File, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AnimatedHistoryItemProps {
  history: any; // Replace with proper type
  index: number;
}

export function AnimatedHistoryItem({ history, index }: AnimatedHistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={history.id}
      className="flex gap-4 relative group"
    >
      {/* ... rest of the item JSX ... */}
    </motion.div>
  );
} 