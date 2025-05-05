import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 py-10 bg-[#0A1128] border-t border-[#D4AF37]/20">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-8 md:mb-0">
          <Link href="/">
            <h2 className="text-2xl font-bold mb-4 cursor-pointer">
              <span className="text-[#D4AF37]">Cine</span>Lux
            </h2>
          </Link>
          <p className="text-[#E5E5E5] max-w-xs">Experience premium cinema in the comfort of your home with our exclusive collection of films and series.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#D4AF37] font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/browse?type=movie" className="text-[#E5E5E5] hover:text-white transition-colors">Movies</Link></li>
              <li><Link href="/browse?type=series" className="text-[#E5E5E5] hover:text-white transition-colors">Series</Link></li>
              <li><Link href="/browse?exclusive=true" className="text-[#E5E5E5] hover:text-white transition-colors">Exclusives</Link></li>
              <li><Link href="/browse?sort=release_date" className="text-[#E5E5E5] hover:text-white transition-colors">New Releases</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#D4AF37] font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-[#E5E5E5] hover:text-white transition-colors">Profile</Link></li>
              <li><Link href="/subscription" className="text-[#E5E5E5] hover:text-white transition-colors">Subscription</Link></li>
              <li><Link href="/rewards" className="text-[#E5E5E5] hover:text-white transition-colors">Rewards</Link></li>
              <li><Link href="/settings" className="text-[#E5E5E5] hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#D4AF37] font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-[#E5E5E5] hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-[#E5E5E5] hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="text-[#E5E5E5] hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-[#E5E5E5] hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-[#D4AF37]/10 flex flex-col md:flex-row justify-between items-center">
        <p className="text-[#E5E5E5] text-sm">© {new Date().getFullYear()} CineLux. All rights reserved.</p>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a href="#" className="text-[#E5E5E5] hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
