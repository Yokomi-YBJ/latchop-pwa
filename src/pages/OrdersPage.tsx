import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Clock, CheckCircle2, XCircle, AlertCircle, LogOut } from 'lucide-react';
import { ordersApi } from '../api/ordersApi';
import { useAuth } from '../hooks/useAuth';

export const OrdersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', 'myOrders'],
    queryFn: ordersApi.getMyOrders,
    refetchInterval: 15000, // actualise toutes les 15s pour suivre le statut
  });

  const commandes = data?.commandes || [];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-[#FF6B35]">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case 'en_cours':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-[#2196F3]">
            <Clock className="w-3 h-3 animate-spin" />
            En préparation
          </span>
        );
      case 'livree':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-[#27AE60]">
            <CheckCircle2 className="w-3 h-3" />
            Prête / Livrée
          </span>
        );
      case 'annulee':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-[#E74C3C]">
            <XCircle className="w-3 h-3" />
            Annulée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-[#6B7280]">
            {statut}
          </span>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1A1A2E]">Mes Commandes</h2>
          <p className="text-xs text-[#6B7280]">
            Connecté en tant que <span className="font-bold text-[#1A1A2E]">{user?.nom_user}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold text-[#6B7280] hover:text-[#E74C3C] flex items-center gap-1 p-2 rounded-lg hover:bg-white"
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#EBEBEB] animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-[#EBEBEB]">
          <AlertCircle className="w-8 h-8 text-[#E74C3C] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#1A1A2E]">Erreur de chargement</p>
          <button
            onClick={() => refetch()}
            className="mt-3 text-xs font-bold text-[#FF6B35] hover:underline"
          >
            Réessayer
          </button>
        </div>
      ) : commandes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#EBEBEB] shadow-sm">
          <ClipboardList className="w-12 h-12 text-[#BDBDBD] mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-sm font-black text-[#1A1A2E]">Aucune commande pour le moment</h3>
          <p className="text-xs text-[#6B7280] mt-1">
            Vos commandes validées apparaîtront ici avec leur état de préparation en temps réel.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {commandes.map((cmd) => (
            <div
              key={cmd.id_commande}
              className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#1A1A2E]">
                  Commande #{cmd.id_commande}
                </span>
                {getStatusBadge(cmd.statut)}
              </div>

              <div className="text-xs text-[#6B7280]">
                {cmd.date_commande
                  ? new Date(cmd.date_commande).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Date inconnue'}
              </div>

              {cmd.lignes && cmd.lignes.length > 0 && (
                <div className="border-t border-[#EBEBEB] pt-2 space-y-1">
                  {cmd.lignes.map((l, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-[#1A1A2E]">
                        {l.quantite}x {l.nom_produit}
                      </span>
                      <span className="font-bold text-[#6B7280]">
                        {(l.prix_unitaire * l.quantite).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[#EBEBEB] pt-2 flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">
                  {cmd.avec_livraison ? 'Avec livraison' : 'Retrait sur place'}
                </span>
                {cmd.total && (
                  <span className="font-black text-[#FF6B35] text-sm">
                    {cmd.total.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
