import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Flag, MessageSquare, ShoppingCart, Users, BarChart2, Gift, Megaphone, Trophy, Headphones, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickAction {
  icon: JSX.Element
  label: string
  color: string
}

const actions: QuickAction[] = [
  { icon: <Flag className="h-6 w-6" />, label: "Report", color: "bg-red-500" },
  { icon: <MessageSquare className="h-6 w-6" />, label: "Appeal", color: "bg-blue-500" },
  { icon: <ShoppingCart className="h-6 w-6" />, label: "Shop", color: "bg-green-500" },
  { icon: <Users className="h-6 w-6" />, label: "Community", color: "bg-purple-500" },
  { icon: <BarChart2 className="h-6 w-6" />, label: "Leaderboard", color: "bg-yellow-500" },
  { icon: <Gift className="h-6 w-6" />, label: "Rewards", color: "bg-pink-500" },
  { icon: <Megaphone className="h-6 w-6" />, label: "Announce", color: "bg-indigo-500" },
  { icon: <Trophy className="h-6 w-6" />, label: "Tournaments", color: "bg-orange-500" },
  { icon: <Headphones className="h-6 w-6" />, label: "Support", color: "bg-teal-500" },
]

const QuickActionsCard: React.FC = () => {
  const [activeQuickAction, setActiveQuickAction] = useState<number | null>(null)

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-2 h-20 bg-black text-white border border-zinc-700 rounded-md hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 relative overflow-hidden"
              onHoverStart={() => setActiveQuickAction(index)}
              onHoverEnd={() => setActiveQuickAction(null)}
            >
              {action.icon}
              <span className="mt-1 text-xs">{action.label}</span>
              <AnimatePresence>
                {activeQuickAction === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`absolute inset-0 ${action.color} bg-opacity-20 flex items-center justify-center`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActionsCard
