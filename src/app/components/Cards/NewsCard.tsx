import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'

interface Reaction {
  emoji: JSX.Element
  count: number
}

interface NewsItem {
  title: string
  date: string
  content: string
  reactions: Reaction[]
}

interface NewsCardProps {
  newsItems: NewsItem[]
  onReact: (index: number, reactionIndex: number) => void
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItems, onReact }) => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white">News</CardTitle>
        <Button variant="link" className="text-red-400">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-zinc-400 mb-2">{item.date}</p>
              <p className="text-zinc-300">{item.content}</p>
              <div className="flex space-x-2 mt-2">
                {item.reactions.map((reaction, reactionIndex) => (
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

export default NewsCard
