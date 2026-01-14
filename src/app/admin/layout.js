"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, LogOut, Layers, ShoppingBag, Tag, BookOpen, Megaphone, Users } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Popup Promo', href: '/admin/popup', icon: Megaphone },
    { name: 'Hero Slides', href: '/admin/hero', icon: ImageIcon },
    { name: 'Sections', href: '/admin/sections', icon: Layers },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Articles', href: '/admin/articles', icon: BookOpen },
  ];

  const handleLogout = () => {
    // Simple cookie clear and reload
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b flex justify-center">
          <Link href="/admin" className="flex flex-col items-center">
            <span className="text-xl font-serif tracking-[0.15em] text-[#4a4042] whitespace-nowrap">
              DHINDA HIJAB
            </span>
            <span className="text-[8px] tracking-[0.4em] text-[#dca5ad] font-medium mt-1 uppercase">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-[#dca5ad] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
