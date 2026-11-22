import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const BottomNav: React.FC = () => {
  const totalArticles = useCartStore((state) => state.totalArticles());

  const navItems = [
    { to: '/', label: 'Accueil', icon: Home, exact: true },
    { to: '/cart', label: 'Panier', icon: ShoppingBag, badge: totalArticles },
    { to: '/orders', label: 'Commandes', icon: ClipboardList },
    { to: '/login', label: 'Compte', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] px-3 py-1 shadow-tabbar"
      aria-label="Navigation principale"
    >
      <div className="grid grid-cols-4 items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full transition-colors relative py-1 ${
                  isActive ? 'text-[#FF6B35]' : 'text-[#B0B0B0] hover:text-[#6B7280]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-0.5 bg-[#FF6B35] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-bold tracking-tight ${isActive ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
