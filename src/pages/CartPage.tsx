import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../hooks/useAuth';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, incrementQuantite, decrementQuantite, viderPanier, totalPrix, totalArticles } = useCartStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIncrement = (id_produit: number) => {
    setErrorMessage(null);
    const res = incrementQuantite(id_produit);
    if (!res.success && res.message) {
      setErrorMessage(res.message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;

    // Règle du prompt : si non connecté, redirection vers /login avec state { from: '/checkout' }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 text-[#FF6B35] rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A2E] mb-1">Votre panier est vide</h2>
        <p className="text-xs text-[#6B7280] max-w-xs mb-6">
          Découvrez notre carte gourmande et ajoutez vos plats préférés.
        </p>
        <Link
          to="/"
          className="py-3 px-6 bg-[#FF6B35] text-white text-xs font-bold rounded-xl shadow-light hover:bg-[#E5531E] active:scale-95 transition-all"
        >
          Découvrir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1A1A2E]">Mon Panier</h2>
          <span className="text-xs font-bold text-[#6B7280]">
            {totalArticles()} article(s)
          </span>
        </div>
        <button
          onClick={viderPanier}
          className="text-xs font-bold text-[#E74C3C] hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Vider
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-[#E74C3C] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Liste des articles */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item.id_produit}
            className="bg-white rounded-2xl p-3 border border-[#EBEBEB] shadow-sm flex items-center gap-3"
          >
            <img
              src={item.img_url || item.img_produit || '/placeholder.png'}
              alt={item.nom_produit}
              className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
              }}
            />

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#1A1A2E] truncate">
                {item.nom_produit}
              </h4>
              <p className="text-xs font-extrabold text-[#FF6B35] mt-0.5">
                {(item.Prix * item.quantite).toLocaleString('fr-FR')} FCFA
              </p>
              <p className="text-[10px] text-[#6B7280]">
                {item.Prix.toLocaleString('fr-FR')} FCFA / unité
              </p>
            </div>

            {/* Contrôleur de quantité */}
            <div className="flex items-center gap-2 bg-[#F7F7F8] p-1 rounded-xl border border-[#EBEBEB]">
              <button
                onClick={() => decrementQuantite(item.id_produit)}
                className="w-7 h-7 rounded-lg bg-white text-[#1A1A2E] flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                aria-label="Diminuer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-black min-w-[16px] text-center text-[#1A1A2E]">
                {item.quantite}
              </span>

              <button
                onClick={() => handleIncrement(item.id_produit)}
                className="w-7 h-7 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                aria-label="Augmenter"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id_produit)}
              className="p-1.5 text-[#BDBDBD] hover:text-[#E74C3C] transition-colors"
              aria-label="Supprimer du panier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Résumé de facture */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] space-y-2 mt-4">
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Sous-total plats</span>
          <span className="font-bold text-[#1A1A2E]">{totalPrix().toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Retrait sur place</span>
          <span className="font-bold text-[#27AE60]">Gratuit</span>
        </div>
        <div className="border-t border-[#EBEBEB] pt-2 flex justify-between items-baseline">
          <span className="text-sm font-black text-[#1A1A2E]">Total estimé</span>
          <span className="text-lg font-black text-[#FF6B35]">
            {totalPrix().toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      {/* Bouton Payer / Commander */}
      <button
        onClick={handleProceedToCheckout}
        className="w-full py-3.5 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-medium transition-all"
      >
        <span>Passer la commande</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>

      {!isAuthenticated && (
        <p className="text-[11px] text-[#6B7280] text-center">
          Vous devrez vous connecter ou créer un compte pour finaliser votre commande.
        </p>
      )}
    </div>
  );
};
