import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, Truck, Store, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useCartStore, MAX_QUANTITE_PAR_PRODUIT } from '../store/useCartStore';
import { useAuth } from '../hooks/useAuth';
import { ordersApi } from '../api/ordersApi';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, totalPrix, viderPanier } = useCartStore();

  const [avecLivraison, setAvecLivraison] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const FRAIS_LIVRAISON = 1000;
  const sousTotal = totalPrix();
  const prixTotal = avecLivraison ? sousTotal + FRAIS_LIVRAISON : sousTotal;

  // Contrôle de la limite anti-spam côté client (max 3 commandes en attente)
  const waitingQuery = useQuery({
    queryKey: ['orders', 'waitingCount'],
    queryFn: ordersApi.getWaitingCount,
    staleTime: 30 * 1000,
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (data) => {
      viderPanier();
      const ajustementsMsg = data.ajustements && data.ajustements.length > 0
        ? `\n${data.ajustements.join(' ')}`
        : '';
      setSuccessInfo(`Votre commande a été confirmée avec succès !${ajustementsMsg}`);
      setTimeout(() => {
        navigate('/orders');
      }, 2500);
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (apiErr.response?.status === 429) {
        setError("Limite atteinte : vous avez déjà 3 commandes en attente de traitement.");
      } else {
        setError(apiErr?.response?.data?.message || "Échec de l'enregistrement de la commande.");
      }
    },
  });

  const handleConfirmOrder = () => {
    setError(null);

    if (cart.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    if (waitingQuery.data && waitingQuery.data.nb_en_attente >= 3) {
      setError("Vous avez déjà 3 commandes en attente. Veuillez patienter avant d'en passer une nouvelle.");
      return;
    }

    createOrderMutation.mutate({
      produits: cart.map((item) => ({
        id: item.id_produit,
        quantite: Math.min(item.quantite, MAX_QUANTITE_PAR_PRODUIT),
      })),
      avec_livraison: avecLivraison,
    });
  };

  if (successInfo) {
    return (
      <div className="p-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-100 text-[#27AE60] rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A2E] mb-2">Commande validée !</h2>
        <p className="text-xs text-[#6B7280] max-w-xs mb-6 whitespace-pre-line">
          {successInfo}
        </p>
        <span className="text-[11px] text-[#FF6B35] font-bold animate-pulse">
          Redirection vers vos commandes en cours...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-black text-[#1A1A2E]">Validation de la commande</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#E74C3C] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sélection Mode de réception avec Radio buttons stylisés */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] space-y-3 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
          Mode de réception
        </h3>

        <div className="space-y-2.5">
          {/* Option 1 : Retrait sur place */}
          <label
            onClick={() => setAvecLivraison(false)}
            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              !avecLivraison
                ? 'border-[#FF6B35] bg-orange-50/40 ring-1 ring-[#FF6B35]'
                : 'border-[#EBEBEB] bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  !avecLivraison ? 'border-[#FF6B35]' : 'border-gray-300'
                }`}
              >
                {!avecLivraison && <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />}
              </div>
              <div className="flex items-center gap-2">
                <Store className={`w-4 h-4 ${!avecLivraison ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`} />
                <div>
                  <span className="block text-xs font-bold text-[#1A1A2E]">Retrait sur place</span>
                  <span className="block text-[10px] text-[#6B7280]">À récupérer au restaurant</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#27AE60]">Gratuit</span>
          </label>

          {/* Option 2 : Livraison à domicile */}
          <label
            onClick={() => setAvecLivraison(true)}
            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              avecLivraison
                ? 'border-[#FF6B35] bg-orange-50/40 ring-1 ring-[#FF6B35]'
                : 'border-[#EBEBEB] bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  avecLivraison ? 'border-[#FF6B35]' : 'border-gray-300'
                }`}
              >
                {avecLivraison && <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />}
              </div>
              <div className="flex items-center gap-2">
                <Truck className={`w-4 h-4 ${avecLivraison ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`} />
                <div>
                  <span className="block text-xs font-bold text-[#1A1A2E]">Livraison à domicile</span>
                  <span className="block text-[10px] text-[#6B7280]">Livreur dédié jusqu'à votre porte</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#FF6B35]">+1 000 FCFA</span>
          </label>
        </div>
      </div>

      {/* Adresse client */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] space-y-2 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
          {avecLivraison ? 'Adresse de livraison' : 'Coordonnées de retrait'}
        </h3>
        <div className="flex items-start gap-2.5 text-xs text-[#1A1A2E]">
          <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{user?.nom_user} {user?.prenom_user}</p>
            <p className="text-[#6B7280]">{user?.adresse_user}</p>
            <p className="text-[#6B7280]">{user?.telephone}</p>
          </div>
        </div>
      </div>

      {/* Récapitulatif commande & Total dynamique */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] space-y-2.5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
          Articles commandés ({cart.length})
        </h3>
        <div className="divide-y divide-[#EBEBEB]">
          {cart.map((item) => (
            <div key={item.id_produit} className="py-2 flex justify-between items-center text-xs">
              <span className="text-[#1A1A2E]">
                {item.quantite}x {item.nom_produit}
              </span>
              <span className="font-bold text-[#1A1A2E]">
                {(item.Prix * item.quantite).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EBEBEB] pt-3 space-y-1.5">
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>Sous-total plats</span>
            <span className="font-bold text-[#1A1A2E]">{sousTotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>Frais de livraison</span>
            <span className={`font-bold ${avecLivraison ? 'text-[#FF6B35]' : 'text-[#27AE60]'}`}>
              {avecLivraison ? `+${FRAIS_LIVRAISON.toLocaleString('fr-FR')} FCFA` : 'Gratuit (Retrait sur place)'}
            </span>
          </div>
          <div className="border-t border-[#EBEBEB] pt-2.5 flex justify-between items-baseline">
            <span className="text-sm font-black text-[#1A1A2E]">Total à régler</span>
            <span className="text-xl font-black text-[#FF6B35]">
              {prixTotal.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Bouton de confirmation */}
      <button
        onClick={handleConfirmOrder}
        disabled={createOrderMutation.isPending}
        className="w-full py-4 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-medium transition-all disabled:opacity-50"
      >
        {createOrderMutation.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span>Confirmer et commander ({prixTotal.toLocaleString('fr-FR')} FCFA)</span>
        )}
      </button>
    </div>
  );
};
