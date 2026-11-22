import React, { useState, useId } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Phone, Lock, LogIn, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Regex exacte pour le Cameroun : 9 chiffres débutant entre 640 et 699
const PHONE_REGEX = /^6[4-9]\d{7}$/;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const phoneErrorId = useId();
  const passwordErrorId = useId();

  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({
    telephone: false,
    password: false,
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Validation en temps réel du téléphone
  const validatePhone = (val: string): string | null => {
    if (!val) return 'Le numéro de téléphone est requis.';
    if (!val.startsWith('6')) return 'Le numéro doit débuter par un 6 (de 640 à 699).';
    if (val.length >= 2 && !/^6[4-9]/.test(val)) return 'Le préfixe doit être compris entre 640 et 699.';
    if (val.length < 9) return `Numéro incomplet (${val.length}/9 chiffres).`;
    if (!PHONE_REGEX.test(val)) return 'Le numéro doit comporter 9 chiffres et être compris entre 640 et 699.';
    return null;
  };

  // Validation en temps réel du mot de passe
  const validatePassword = (val: string): string | null => {
    if (!val) return 'Le mot de passe est requis.';
    if (val.length < 6) return `Le mot de passe doit contenir au moins 6 caractères (${val.length}/6).`;
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filtrage strict : seuls les chiffres sont autorisés, max 9
    const cleanVal = e.target.value.replace(/\D/g, '').slice(0, 9);
    setTelephone(cleanVal);
    setTouched((prev) => ({ ...prev, telephone: true }));
    setPhoneError(validatePhone(cleanVal));
    setFormError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setTouched((prev) => ({ ...prev, password: true }));
    setPasswordError(validatePassword(val));
    setFormError(null);
  };

  const isPhoneValid = PHONE_REGEX.test(telephone);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isPhoneValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errPhone = validatePhone(telephone);
    const errPass = validatePassword(password);

    if (errPhone || errPass) {
      setPhoneError(errPhone);
      setPasswordError(errPass);
      setTouched({ telephone: true, password: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({ telephone, password });
      if (response.status === 'success') {
        navigate(from, { replace: true });
      } else {
        setFormError(response.message || 'Numéro de téléphone ou mot de passe incorrect.');
      }
    } catch (err: unknown) {
      if ((err as Error)?.message === 'ACCES_ADMIN_REFUSE') {
        return;
      }
      const apiErr = err as { response?: { data?: { message?: string } } };
      setFormError(apiErr?.response?.data?.message || 'Identifiants invalides ou serveur indisponible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Détermination des styles de bordure en fonction de l'état
  const getPhoneBorder = () => {
    if (!touched.telephone) return 'border-[#EBEBEB] focus:border-[#FF6B35]';
    if (phoneError) return 'border-[#E74C3C] focus:border-[#E74C3C]';
    if (isPhoneValid) return 'border-[#27AE60] focus:border-[#27AE60]';
    return 'border-[#EBEBEB]';
  };

  const getPasswordBorder = () => {
    if (!touched.password) return 'border-[#EBEBEB] focus:border-[#FF6B35]';
    if (passwordError) return 'border-[#E74C3C] focus:border-[#E74C3C]';
    if (isPasswordValid) return 'border-[#27AE60] focus:border-[#27AE60]';
    return 'border-[#EBEBEB]';
  };

  return (
    <div className="p-6 min-h-[75vh] flex flex-col justify-center">
      <div className="text-center mb-6">
        <img
          src="/logo.png"
          alt="Logo LaTchop"
          className="w-16 h-16 mx-auto mb-3 object-contain"
        />
        <span className="text-xs font-black tracking-widest text-[#FF6B35] uppercase">
          Espace Client
        </span>
        <h1 className="text-2xl font-black text-[#1A1A2E] mt-1">Connexion</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Accédez à votre compte pour suivre et valider vos commandes
        </p>
      </div>

      {formError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-[#E74C3C] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Champ Téléphone */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
            Numéro de téléphone (9 chiffres)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="Ex: 6XXXXXXXX"
              value={telephone}
              onChange={handlePhoneChange}
              onBlur={() => setTouched((p) => ({ ...p, telephone: true }))}
              aria-invalid={touched.telephone && Boolean(phoneError)}
              aria-describedby={touched.telephone && phoneError ? phoneErrorId : undefined}
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl border bg-white text-sm text-[#1A1A2E] focus:outline-none transition-all ${getPhoneBorder()}`}
              required
            />
            {touched.telephone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {phoneError ? (
                  <AlertCircle className="w-4 h-4 text-[#E74C3C]" />
                ) : isPhoneValid ? (
                  <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                ) : null}
              </div>
            )}
          </div>
          {touched.telephone && phoneError && (
            <p id={phoneErrorId} className="mt-1 text-[11px] font-semibold text-[#E74C3C] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{phoneError}</span>
            </p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              minLength={6}
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              aria-invalid={touched.password && Boolean(passwordError)}
              aria-describedby={touched.password && passwordError ? passwordErrorId : undefined}
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl border bg-white text-sm text-[#1A1A2E] focus:outline-none transition-all ${getPasswordBorder()}`}
              required
            />
            {touched.password && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {passwordError ? (
                  <AlertCircle className="w-4 h-4 text-[#E74C3C]" />
                ) : isPasswordValid ? (
                  <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                ) : null}
              </div>
            )}
          </div>
          {touched.password && passwordError && (
            <p id={passwordErrorId} className="mt-1 text-[11px] font-semibold text-[#E74C3C] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{passwordError}</span>
            </p>
          )}
        </div>

        {/* Bouton de soumission avec état désactivé */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full py-3.5 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-light disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-[#6B7280]">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-[#FF6B35] hover:underline">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
};
