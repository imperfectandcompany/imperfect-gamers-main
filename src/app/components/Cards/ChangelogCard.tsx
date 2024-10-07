import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'

interface Reaction {
  emoji: JSX.Element
  count: number
}

interface Changelog {
  version: string
  date: string
  changes: string[]
  reactions: Reaction[]
}

interface ChangelogCardProps {
  changelog: Changelog[]
  onReact: (index: number, reactionIndex: number) => void
}

const ChangelogCard: React.FC<ChangelogCardProps> = ({ changelog, onReact }) => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white">Changelog</CardTitle>
        <Button variant="link" className="text-red-400">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {changelog.map((versionItem, index) => (
            <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
              <h4 className="text-lg font-semibold text-white">Version {versionItem.version} - {versionItem.date}</h4>
              <ul className="list-disc list-inside mt-2 text-zinc-300">
                {versionItem.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
              <div className="flex space-x-2 mt-2">
                {versionItem.reactions.map((reaction, reactionIndex) => (
                  <Button
                    key={reactionIndex}
                    variant="outline"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => onReact(index, reactionIndex)}
                  >
                    {reaction.emoji} {reaction.count}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ChangelogCard
