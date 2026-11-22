import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Save,
  LogOut,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

const PHONE_REGEX = /^6[4-9]\d{7}$/;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom_user || '',
        prenom: user.prenom_user || '',
        telephone: String(user.telephone || ''),
        adresse: user.adresse_user || '',
      });
    }
  }, [user]);

  const validatePhone = (val: string): string | null => {
    if (!val) return 'Le numéro de téléphone est obligatoire.';
    if (!val.startsWith('6')) return 'Le numéro doit commencer par un 6 (de 640 à 699).';
    if (val.length >= 2 && !/^6[4-9]/.test(val)) return 'Le préfixe doit être compris entre 640 et 699.';
    if (val.length < 9) return `Numéro incomplet (${val.length}/9 chiffres).`;
    if (!PHONE_REGEX.test(val)) return 'Numéro invalide (doit comporter 9 chiffres de 640 à 699).';
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/\D/g, '').slice(0, 9);
    setForm((prev) => ({ ...prev, telephone: cleanVal }));
    setPhoneError(validatePhone(cleanVal));
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const isFormValid =
    form.nom.trim().length > 0 &&
    form.prenom.trim().length > 0 &&
    form.adresse.trim().length > 0 &&
    PHONE_REGEX.test(form.telephone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    const errP = validatePhone(form.telephone);
    if (errP) {
      setPhoneError(errP);
      return;
    }

    if (!form.nom.trim() || !form.prenom.trim() || !form.adresse.trim()) {
      setGeneralError('Tous les champs sont obligatoires.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await authApi.updateProfile({
        nom_user: form.nom.trim(),
        prenom_user: form.prenom.trim(),
        telephone: form.telephone.trim(),
        adresse_user: form.adresse.trim(),
      });

      if (response.status === 'success') {
        setSuccessMessage('Vos informations ont été mises à jour avec succès.');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setGeneralError('Impossible de mettre à jour le profil.');
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setGeneralError(apiErr?.response?.data?.message || 'Erreur lors de la mise à jour de vos informations.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-4">
      {/* En-tête profil */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center flex-shrink-0">
          <User className="w-7 h-7 stroke-[2]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-[#1A1A2E] truncate">
            {user?.nom_user} {user?.prenom_user}
          </h2>
          <p className="text-xs text-[#6B7280] font-medium truncate mt-0.5">
            {user?.telephone}
          </p>
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-green-50 text-[#27AE60] text-[10px] font-extrabold">
            <ShieldCheck className="w-3 h-3" />
            <span>Compte Client Actif</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-[#E74C3C] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-[#27AE60] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-[#EBEBEB] shadow-sm space-y-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
          Modifier mes coordonnées
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Votre nom"
              className="w-full px-3 py-2 rounded-xl border border-[#EBEBEB] bg-[#F7F7F8] text-xs text-[#1A1A2E] focus:outline-none focus:bg-white focus:border-[#FF6B35]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              className="w-full px-3 py-2 rounded-xl border border-[#EBEBEB] bg-[#F7F7F8] text-xs text-[#1A1A2E] focus:outline-none focus:bg-white focus:border-[#FF6B35]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
            Numéro de téléphone (640 à 699)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={9}
              value={form.telephone}
              onChange={handlePhoneChange}
              placeholder="6XXXXXXXX"
              className={`w-full pl-8 pr-3 py-2 rounded-xl border bg-[#F7F7F8] text-xs text-[#1A1A2E] focus:outline-none focus:bg-white transition-all ${
                phoneError ? 'border-[#E74C3C]' : 'border-[#EBEBEB] focus:border-[#FF6B35]'
              }`}
              required
            />
          </div>
          {phoneError && (
            <p className="mt-1 text-[10px] font-semibold text-[#E74C3C] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{phoneError}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
            Adresse de livraison habituelle
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Quartier, repère, ville"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#EBEBEB] bg-[#F7F7F8] text-xs text-[#1A1A2E] focus:outline-none focus:bg-white focus:border-[#FF6B35]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSaving}
          className="w-full mt-2 py-3 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </>
          )}
        </button>
      </form>

      {/* Menu d'options & Liens */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm divide-y divide-[#EBEBEB] overflow-hidden">
        <Link
          to="/cgu"
          className="p-4 flex items-center justify-between text-xs font-bold text-[#1A1A2E] hover:bg-[#F7F7F8] active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#6B7280] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Conditions Générales d'Utilisation (CGU)</span>
          </div>
          <span className="text-gray-400 font-bold">&gt;</span>
        </Link>
      </div>

      {/* Bouton de déconnexion */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 px-4 bg-white border border-red-200 hover:bg-red-50 text-[#E74C3C] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Se déconnecter</span>
      </button>
    </div>
  );
};
