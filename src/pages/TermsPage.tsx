import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Truck, Clock } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/compte')}
          className="p-2 rounded-xl bg-white border border-[#EBEBEB] text-[#1A1A2E] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          aria-label="Retour au profil"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-[#1A1A2E] leading-tight">
            Conditions Générales d'Utilisation
          </h2>
          <p className="text-[11px] text-[#6B7280]">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </div>

      {/* Contenu statique structuré */}
      <div className="bg-white rounded-2xl p-5 border border-[#EBEBEB] shadow-sm space-y-5 text-xs text-[#6B7280] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <FileText className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              1. Objet du Service
            </h3>
          </div>
          <p>
            LaTchop est une plateforme numérique de commande et de livraison de repas préparés par nos restaurants partenaires. L'utilisation de notre application implique l'acceptation pleine et entière des présentes conditions générales.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <Clock className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              2. Commandes & Disponibilités
            </h3>
          </div>
          <p>
            Les plats sont proposés dans la limite des stocks disponibles du jour. Chaque commande est limitée à un maximum strict de 4 unités par référence de plat et 3 commandes en attente simultanées afin d'assurer une fraîcheur et une rapidité de service optimales.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <Truck className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              3. Modalités de Livraison et Retrait
            </h3>
          </div>
          <p>
            L'utilisateur peut choisir entre le <strong>Retrait sur place (gratuit)</strong> ou la <strong>Livraison à domicile (+1 000 FCFA)</strong>. Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la météo et le trafic.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              4. Données Personnelles et Sécurité
            </h3>
          </div>
          <p>
            Les données collectées (nom, prénom, numéro de téléphone, adresse de livraison) sont exclusivement réservées au traitement et au suivi de vos commandes. Elles ne font l'objet d'aucune revente à des tiers.
          </p>
        </section>
      </div>

      {/* Bouton retour */}
      <button
        onClick={() => navigate('/compte')}
        className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-light"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à mon compte</span>
      </button>
    </div>
  );
};
