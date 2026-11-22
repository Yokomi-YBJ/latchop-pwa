import React, { useState } from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types/product';

const CATEGORIES = ['Tout', 'Plat', 'Boisson', 'Dessert', 'Entrée', 'Snack'];

export const HomePage: React.FC = () => {
  const { data, isLoading, isError } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);

  const [activeCategory, setActiveCategory] = useState('Tout');
  const [feedbackMap, setFeedbackMap] = useState<Record<number, { success: boolean; message?: string }>>({});

  const produits = data?.produits || [];

  const produitsFiltres = activeCategory === 'Tout'
    ? produits
    : produits.filter((p) => p.categorie?.toLowerCase() === activeCategory.toLowerCase());

  const handleAdd = (produit: Product) => {
    const res = addToCart(produit);
    setFeedbackMap((prev) => ({ ...prev, [produit.id_produit]: res }));

    setTimeout(() => {
      setFeedbackMap((prev) => {
        const copy = { ...prev };
        delete copy[produit.id_produit];
        return copy;
      });
    }, 2000);
  };

  return (
    <div className="p-4 space-y-5">
      {/* Bannière de Bienvenue */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#E5531E] rounded-2xl p-4 text-white shadow-medium relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-extrabold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md">
            Livraison Rapide
          </span>
          <h2 className="text-xl font-black mt-2 leading-tight">
            Envie d'un bon repas chaud ?
          </h2>
          <p className="text-xs text-white/90 mt-1">
            Commandez vos spécialités favorites en quelques clics.
          </p>
        </div>
      </div>

      {/* Sélecteur de Catégories horizontal */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-light scale-105'
                  : 'bg-white text-[#6B7280] hover:bg-gray-100 border border-[#EBEBEB]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grille de Produits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-[#1A1A2E]">
            {activeCategory === 'Tout' ? 'Notre Menu' : activeCategory}
          </h3>
          <span className="text-xs font-bold text-[#6B7280]">
            {produitsFiltres.length} plat(s)
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-[#EBEBEB] animate-pulse">
                <div className="w-full h-28 bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError && produitsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#EBEBEB] shadow-sm">
            <AlertCircle className="w-8 h-8 text-[#E74C3C] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1A1A2E]">Impossible de charger le catalogue</p>
            <p className="text-xs text-[#6B7280] mt-1">Vérifiez votre connexion internet.</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#EBEBEB]">
            <p className="text-sm font-bold text-[#6B7280]">Aucun plat dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {produitsFiltres.map((produit) => {
              const feedback = feedbackMap[produit.id_produit];
              const isAdded = feedback?.success;
              const hasError = feedback && !feedback.success;
              const isStockOut = produit.stock !== undefined && produit.stock !== null && produit.stock <= 0;

              return (
                <div
                  key={produit.id_produit}
                  className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-medium"
                >
                  <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                    <img
                      src={produit.img_url || produit.img_produit || '/placeholder.png'}
                      alt={produit.nom_produit}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                      }}
                      loading="lazy"
                    />
                    {isStockOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase text-white bg-[#E74C3C] px-2 py-0.5 rounded-md">
                          Épuisé
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A2E] line-clamp-1">
                        {produit.nom_produit}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-0.5 leading-snug">
                        {produit.description || 'Préparé avec des ingrédients frais du jour.'}
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm font-extrabold text-[#FF6B35]">
                          {produit.Prix.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                        </span>
                        {produit.stock !== undefined && produit.stock !== null && produit.stock > 0 && produit.stock <= 5 && (
                          <span className="text-[9px] font-bold text-[#E74C3C]">
                            Reste {produit.stock}
                          </span>
                        )}
                      </div>

                      {hasError && (
                        <p className="text-[10px] text-[#E74C3C] font-semibold mb-1 line-clamp-1">
                          {feedback.message}
                        </p>
                      )}

                      <button
                        onClick={() => handleAdd(produit)}
                        disabled={isStockOut}
                        className={`w-full py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                          isStockOut
                            ? 'bg-gray-100 text-[#BDBDBD] cursor-not-allowed'
                            : isAdded
                            ? 'bg-[#27AE60] text-white'
                            : 'bg-[#FF6B35] text-white hover:bg-[#E5531E]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
