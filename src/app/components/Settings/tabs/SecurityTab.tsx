import React, { useState, useEffect, useRef } from "react";
import { Info, RefreshCw, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@components/ui/switch";
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

const SecurityTab: React.FC = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      device: "Chrominum (P0)",
      location: "MI, US",
      ip: "127.0.0.1",
      date: "Current session",
    },
    {
      device: "Chrominum (P0)",
      location: "MI, US",
      ip: "127.0.0.1",
      date: "3h",
    },
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-white">
          TWO-FACTOR AUTHENTICATION
        </h3>
        <p className="text-gray-400">
          Set up 2FA to add an additional layer of security when logging into
          your Clydent account.
        </p>
        <motion.div
          className="bg-[#2a2a2a] p-4 rounded flex items-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Info className="w-5 h-5 text-[#c75d38] mr-2 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-[#c75d38] font-bold">EMAIL ADDRESS REQUIRED</h4>
            <p className="text-gray-400">
              You need to have a verified email address linked to your account
              to begin the 2FA setup.
            </p>
          </div>
        </motion.div>
        <div className="flex items-center justify-between">
          <span className="text-white">Enable Two-Factor Authentication</span>
          <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">ACTIVE SESSIONS</h3>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <p className="text-gray-400">
          If you don't recognize one of these logins, you should log out of all
          devices and change your Steam password immediately. Your Steam and
          Clydent account may be compromised.
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell>{session.device}</TableCell>
                  <TableCell>
                    {session.location}
                    <br />
                    <span className="text-gray-500">{session.ip}</span>
                  </TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="sm">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center">
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
          <div className="text-gray-400">1-2 of 2</div>
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full bg-[#c75d38] hover:bg-[#d76d48] text-white">
          LOG OUT EVERYWHERE
        </Button>
      </motion.div>
    </div>
  );
};

export default SecurityTab;