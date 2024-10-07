import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { PlusCircle } from 'lucide-react';

interface Reaction {
  emoji: string;
  count: number;
}

interface NewsItem {
  title: string;
  date: string;
  content: string;
  reactions: Reaction[];
}

interface NewsCardProps {
  newsItems: NewsItem[];
  onReact: (index: number, reactionIndex: number, emoji: string) => void;
  reactionEmojis: string[];
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItems, onReact, reactionEmojis }) => {
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
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
                    onClick={() => onReact(index, reactionIndex, reaction.emoji)}
                  >
                    {reaction.emoji} {reaction.count}
                  </Button>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-zinc-800 border-none">
                    <div className="grid grid-cols-5 gap-2">
                      {reactionEmojis.map((emoji, emojiIndex) => (
                        <Button
                          key={emojiIndex}
                          variant="ghost"
                          size="sm"
                          className="text-2xl"
                          onClick={() => onReact(index, -1, emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;