import {
    LogIn,
    Ban,
    Megaphone,
    Gift,
    Trophy,
    ArrowRight,
    Maximize2,
    Search,
    Bell,
    Star,
    ChevronRight,
    BookOpen,
    ThumbsUp,
    Heart,
    Laugh,
    Home,
    X as LucideX,
    Menu,
    User,
    Clock,
    Flame,
    AlertCircle,
    Flag,
    ShoppingCart,
    Users,
    BarChart2,
    Headphones,
  } from 'lucide-react';
  
  // Custom SVG Icon Components for CheckIcon, CookieIcon, and XIcon
  const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
  
  const CookieIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
  
  const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
  
  const Icons = {
    LogIn,
    Ban,
    Megaphone,
    Gift,
    Trophy,
    ArrowRight,
    Maximize2,
    Search,
    Bell,
    Star,
    ChevronRight,
    BookOpen,
    ThumbsUp,
    Heart,
    Laugh,
    Home,
    X: LucideX,
    Menu,
    User,
    Clock,
    Flame,
    AlertCircle,
    Flag,
    ShoppingCart,
    Users,
    BarChart2,
    Headphones,
    CheckIcon,
    CookieIcon,
    XIcon,
  };
  
  export default Icons;
  