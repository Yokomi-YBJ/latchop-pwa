import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const Header: React.FC = () => {
  const totalArticles = useCartStore((state) => state.totalArticles());

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 group">
        <img
          src="/logo.png"
          alt="Logo LaTchop"
          className="w-9 h-9 object-contain rounded-xl group-active:scale-95 transition-transform"
        />
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-[#1A1A2E] leading-none">
            LaTchop
          </span>
          <span className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
            Saveurs d'ici
          </span>
        </div>
      </Link>

      <Link
        to="/cart"
        className="relative p-2 rounded-xl text-[#1A1A2E] hover:bg-[#F7F7F8] active:scale-95 transition-all"
        aria-label={`Panier avec ${totalArticles} article(s)`}
      >
        <ShoppingBag className="w-6 h-6 text-[#1A1A2E]" />
        {totalArticles > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-[#FF6B35] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
            {totalArticles > 99 ? '99+' : totalArticles}
          </span>
        )}
      </Link>
    </header>
  );
};
