import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SearchDialog } from '@/components/ui/search-dialog';
import { 
  User, 
  Search, 
  Star, 
  Menu, 
  X 
} from 'lucide-react';

interface PointsData {
  total: number;
  transactions: Array<{
    id: number;
    userId: number;
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

const Navbar = () => {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { data: pointsData } = useQuery<PointsData>({
    queryKey: ['/api/users/points'],
    enabled: true,
  });
  
  const points = pointsData?.total || 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/browse?type=movie' },
    { name: 'Series', path: '/browse?type=series' },
    { name: 'Rewards', path: '/rewards' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0A1128]' : 'glass-effect'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl md:text-2xl font-bold cursor-pointer">
                  <span className="text-[#D4AF37]">Cine</span>Lux
                </h1>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex ml-10 space-x-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`relative text-sm font-medium py-2 ${
                      location === item.path 
                        ? 'text-[#D4AF37]' 
                        : 'text-[#E5E5E5] hover:text-white transition-colors duration-200'
                    }`}
                  >
                    {item.name}
                    {location === item.path && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Navigation Items */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>
              
              {/* Points */}
              <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-[#1C2541] border border-[#D4AF37]/30">
                <Star size={16} className="text-[#D4AF37]" />
                <span className="ml-2 text-sm font-medium">{points.toLocaleString()} points</span>
              </div>
              
              {/* Profile */}
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer">
                  <User size={16} className="text-[#0A1128]" />
                </div>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#E5E5E5] hover:text-[#D4AF37] transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 glass-effect pt-16">
          <div className="p-4 space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path} 
                className={`block py-2 ${location === item.path ? 'text-[#D4AF37]' : 'text-[#E5E5E5] hover:text-white transition-colors'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="py-2 flex items-center">
              <Star size={16} className="text-[#D4AF37] mr-2" />
              <span className="font-medium">{points.toLocaleString()} points</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
