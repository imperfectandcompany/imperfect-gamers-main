import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Instagram, Github, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Us</h3>
            <p className="text-sm">
              Imperfect Gamers is a community-driven platform dedicated to bringing gamers together for unforgettable surfing experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/imperfectgamers" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com/imperfectgamers" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://imperfectgamers.org" className="hover:text-red-500 transition flex items-center">
                  Home
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a href="https://imperfectgamers.org/stats" className="hover:text-red-500 transition flex items-center">
                  Stats
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a href="https://imperfectgamers.org/infractions" className="hover:text-red-500 transition flex items-center">
                  Infractions
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a href="https://store.imperfectgamers.org" className="hover:text-red-500 transition flex items-center">
                  Store
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a href="https://blog.imperfectgamers.org" className="hover:text-red-500 transition flex items-center">
                  Blog
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a href="https://support.imperfectgamers.org" className="hover:text-red-500 transition flex items-center">
                  Support
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="hover:text-red-500 transition">Community Home</Link></li>
              <li><Link href="/profile" className="hover:text-red-500 transition">My Profile</Link></li>
              <li><Link href="/achievements" className="hover:text-red-500 transition">Achievements</Link></li>
              <li><Link href="/posts" className="hover:text-red-500 transition">Recent Posts</Link></li>
              <li><Link href="/news" className="hover:text-red-500 transition">News</Link></li>
              <li><Link href="/changelog" className="hover:text-red-500 transition">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal & Feedback</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-red-500 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-red-500 transition">Cookie Policy</Link></li>
              <li><Link href="/ccpa" className="hover:text-red-500 transition">CCPA</Link></li>
              <li><Link href="/gdpr" className="hover:text-red-500 transition">GDPR</Link></li>
              <li><Link href="/server-status" className="hover:text-red-500 transition">Server Status</Link></li>
              <li><Link href="/reviews" className="hover:text-red-500 transition">Leave a Review</Link></li>
              <li><Link href="/suggestions" className="hover:text-red-500 transition">Make a Suggestion</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p>&copy; {new Date().getFullYear()} Imperfect Gamers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}