import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "../../ui/button";

const AffiliatesTab: React.FC = () => {
    const [referralCode, setReferralCode] = useState("COOLGUY2025");
    const [copied, setCopied] = useState(false);
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <div className="space-y-4">
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-grow bg-[#2a2a2a] border-none text-white"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-[#3d3d3d] hover:bg-[#4a4a4a]"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
          <p className="text-sm text-gray-400">
            Share this code with your friends to earn rewards!
          </p>
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-white">Affiliate Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-white">23</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">$156.75</p>
            </motion.div>
          </div>
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-white">Recent Referrals</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <TableCell>User123</TableCell>
                  <TableCell>2023-07-01</TableCell>
                  <TableCell>$5.25</TableCell>
                </motion.tr>
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <TableCell>GamerPro</TableCell>
                  <TableCell>2023-06-28</TableCell>
                  <TableCell>$3.50</TableCell>
                </motion.tr>
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <TableCell>CoolDude99</TableCell>
                  <TableCell>2023-06-25</TableCell>
                  <TableCell>$7.80</TableCell>
                </motion.tr>
              </TableBody>
            </Table>
          </div>
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-white">Affiliate Terms</h3>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              You earn 5% of your referrals' subscription for the first year.
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              You earn 2.5% if they used your referral to register an account
              (without subscription).
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Maximum earnings per user: 7.5% (5% + 2.5%) if they subscribe.
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Minimum payout is $10.
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Payouts are processed weekly
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Do not spam your referral code or use it in misleading ways
            </motion.li>
          </ul>
        </motion.div>
      </div>
    );
  };

export default AffiliatesTab;