// components/Settings/tabs/TransactionsTab.tsx

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { motion } from "framer-motion";
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from "@utils/featureFlags";

const TransactionsTab: React.FC = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2023-07-05",
      type: "Subscription",
      description: "Premium Membership",
      amount: 12.0,
      status: "Active",
      nextRenewal: "2023-08-05",
    },
    {
      id: 2,
      date: "2023-07-04",
      type: "Withdrawal",
      description: "Withdrawal to PayPal",
      amount: 50.0,
      status: "Pending",
    },
    {
      id: 3,
      date: "2023-07-03",
      type: "Deposit",
      description: "Deposit from Bank",
      amount: 75.0,
      status: "Completed",
    },
  ]);

  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <div className="space-y-4">
      {/* Transactions Table Section */}
      {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS_VIEW_TABLE) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS_PAGINATION) && (
                    <TableHead>Next Renewal</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          transaction.status === "Active"
                            ? "bg-green-500/50"
                            : transaction.status === "Pending"
                            ? "bg-yellow-500/50"
                            : "bg-red-500/50"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS_PAGINATION) && (
                      <TableCell>
                        {transaction.type === "Subscription" &&
                        transaction.status === "Active" ? (
                          transaction.nextRenewal
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS_PAGINATION) && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Select defaultValue="10">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="20">20 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TransactionsTab;
