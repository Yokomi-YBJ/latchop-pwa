import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, Lock, UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Regex exacte pour le Cameroun : 9 chiffres débutant entre 640 et 699
const PHONE_REGEX = /^6[4-9]\d{7}$/;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const phoneErrorId = useId();
  const passwordErrorId = useId();
  const copasswordErrorId = useId();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    password: '',
    copassword: '',
  });

  const [touched, setTouched] = useState({
    nom: false,
    prenom: false,
    adresse: false,
    telephone: false,
    password: false,
    copassword: false,
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [copasswordError, setCopasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation du téléphone
  const validatePhone = (val: string): string | null => {
    if (!val) return 'Le numéro de téléphone est obligatoire.';
    if (!val.startsWith('6')) return 'Le numéro doit débuter par un 6 (de 640 à 699).';
    if (val.length >= 2 && !/^6[4-9]/.test(val)) return 'Le préfixe doit être compris entre 640 et 699.';
    if (val.length < 9) return `Numéro incomplet (${val.length}/9 chiffres).`;
    if (!PHONE_REGEX.test(val)) return 'Le numéro doit comporter 9 chiffres et être compris entre 640 et 699.';
    return null;
  };

  // Validation du mot de passe
  const validatePassword = (val: string): string | null => {
    if (!val) return 'Le mot de passe est obligatoire.';
    if (val.length < 6) return `Au moins 6 caractères requis (${val.length}/6).`;
    return null;
  };

  // Validation de la confirmation
  const validateCopassword = (val: string, pass: string): string | null => {
    if (!val) return 'La confirmation du mot de passe est requise.';
    if (val !== pass) return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/\D/g, '').slice(0, 9);
    setForm((prev) => ({ ...prev, telephone: cleanVal }));
    setTouched((prev) => ({ ...prev, telephone: true }));
    setPhoneError(validatePhone(cleanVal));
    setFormError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, password: val }));
    setTouched((prev) => ({ ...prev, password: true }));
    setPasswordError(validatePassword(val));
    if (touched.copassword) {
      setCopasswordError(validateCopassword(form.copassword, val));
    }
    setFormError(null);
  };

  const handleCopasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, copassword: val }));
    setTouched((prev) => ({ ...prev, copassword: true }));
    setCopasswordError(validateCopassword(val, form.password));
    setFormError(null);
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormError(null);
  };

  const isNomValid = form.nom.trim().length > 0;
  const isPrenomValid = form.prenom.trim().length > 0;
  const isAdresseValid = form.adresse.trim().length > 0;
  const isPhoneValid = PHONE_REGEX.test(form.telephone);
  const isPasswordValid = form.password.length >= 6;
  const isCopasswordValid = form.copassword === form.password && isPasswordValid;

  const isFormValid =
    isNomValid &&
    isPrenomValid &&
    isAdresseValid &&
    isPhoneValid &&
    isPasswordValid &&
    isCopasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errPhone = validatePhone(form.telephone);
    const errPass = validatePassword(form.password);
    const errCo = validateCopassword(form.copassword, form.password);

    if (errPhone || errPass || errCo || !isNomValid || !isPrenomValid || !isAdresseValid) {
      setPhoneError(errPhone);
      setPasswordError(errPass);
      setCopasswordError(errCo);
      setTouched({
        nom: true,
        prenom: true,
        adresse: true,
        telephone: true,
        password: true,
        copassword: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register(form);
      if (response.status === 'success') {
        navigate('/cart');
      } else {
        setFormError(response.message || "Erreur lors de l'inscription.");
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setFormError(apiErr?.response?.data?.message || 'Ce numéro de téléphone est peut-être déjà utilisé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBorder = (isTouched: boolean, hasError: boolean, isValid: boolean) => {
    if (!isTouched) return 'border-[#EBEBEB] focus:border-[#FF6B35]';
    if (hasError) return 'border-[#E74C3C] focus:border-[#E74C3C]';
    if (isValid) return 'border-[#27AE60] focus:border-[#27AE60]';
    return 'border-[#EBEBEB]';
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <img
          src="/logo.png"
          alt="Logo LaTchop"
          className="w-16 h-16 mx-auto mb-3 object-contain"
        />
        <span className="text-xs font-black tracking-widest text-[#FF6B35] uppercase">
          Nouveau Client
        </span>
        <h1 className="text-2xl font-black text-[#1A1A2E] mt-1">Créer un compte</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Commandez plus vite et suivez vos livraisons en temps réel
        </p>
      </div>

      {formError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-[#E74C3C] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Nom & Prénom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Nom</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                name="nom"
                placeholder="Ex: Dupont"
                value={form.nom}
                onChange={handleGeneralChange}
                onBlur={() => setTouched((p) => ({ ...p, nom: true }))}
                className={`w-full pl-8 pr-2.5 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                  touched.nom,
                  touched.nom && !isNomValid,
                  isNomValid
                )}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              placeholder="Ex: Jean"
              value={form.prenom}
              onChange={handleGeneralChange}
              onBlur={() => setTouched((p) => ({ ...p, prenom: true }))}
              className={`w-full px-3 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                touched.prenom,
                touched.prenom && !isPrenomValid,
                isPrenomValid
              )}`}
              required
            />
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
            Téléphone (9 chiffres, 640 à 699)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="6XXXXXXXX"
              value={form.telephone}
              onChange={handlePhoneChange}
              onBlur={() => setTouched((p) => ({ ...p, telephone: true }))}
              aria-invalid={touched.telephone && Boolean(phoneError)}
              aria-describedby={touched.telephone && phoneError ? phoneErrorId : undefined}
              className={`w-full pl-8 pr-8 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                touched.telephone,
                Boolean(phoneError),
                isPhoneValid
              )}`}
              required
            />
            {touched.telephone && (
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                {phoneError ? (
                  <AlertCircle className="w-3.5 h-3.5 text-[#E74C3C]" />
                ) : isPhoneValid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                ) : null}
              </div>
            )}
          </div>
          {touched.telephone && phoneError && (
            <p id={phoneErrorId} className="mt-1 text-[10px] font-semibold text-[#E74C3C] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{phoneError}</span>
            </p>
          )}
        </div>

        {/* Adresse de livraison */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Adresse de livraison</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              name="adresse"
              placeholder="Quartier, repère, ville"
              value={form.adresse}
              onChange={handleGeneralChange}
              onBlur={() => setTouched((p) => ({ ...p, adresse: true }))}
              className={`w-full pl-8 pr-2.5 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                touched.adresse,
                touched.adresse && !isAdresseValid,
                isAdresseValid
              )}`}
              required
            />
          </div>
        </div>

        {/* Mots de passe */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B7280]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type="password"
                minLength={6}
                name="password"
                placeholder="≥ 6 car."
                value={form.password}
                onChange={handlePasswordChange}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                aria-invalid={touched.password && Boolean(passwordError)}
                aria-describedby={touched.password && passwordError ? passwordErrorId : undefined}
                className={`w-full pl-8 pr-7 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                  touched.password,
                  Boolean(passwordError),
                  isPasswordValid
                )}`}
                required
              />
              {touched.password && (
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  {passwordError ? (
                    <AlertCircle className="w-3.5 h-3.5 text-[#E74C3C]" />
                  ) : isPasswordValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                  ) : null}
                </div>
              )}
            </div>
            {touched.password && passwordError && (
              <p id={passwordErrorId} className="mt-1 text-[10px] font-semibold text-[#E74C3C] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Confirmation</label>
            <div className="relative">
              <input
                type="password"
                name="copassword"
                placeholder="Confirmer"
                value={form.copassword}
                onChange={handleCopasswordChange}
                onBlur={() => setTouched((p) => ({ ...p, copassword: true }))}
                aria-invalid={touched.copassword && Boolean(copasswordError)}
                aria-describedby={touched.copassword && copasswordError ? copasswordErrorId : undefined}
                className={`w-full px-3 pr-7 py-2 rounded-xl border bg-white text-xs text-[#1A1A2E] focus:outline-none transition-all ${getBorder(
                  touched.copassword,
                  Boolean(copasswordError),
                  isCopasswordValid
                )}`}
                required
              />
              {touched.copassword && (
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  {copasswordError ? (
                    <AlertCircle className="w-3.5 h-3.5 text-[#E74C3C]" />
                  ) : isCopasswordValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                  ) : null}
                </div>
              )}
            </div>
            {touched.copassword && copasswordError && (
              <p id={copasswordErrorId} className="mt-1 text-[10px] font-semibold text-[#E74C3C] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{copasswordError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bouton Inscription désactivé si formulaire non valide */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full mt-2 py-3 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-light disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Créer mon compte</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-[#6B7280]">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-[#FF6B35] hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};
