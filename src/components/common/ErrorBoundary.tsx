import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Erreur non gérée interceptée:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-medium p-6 text-center border border-[#EBEBEB]">
            <div className="w-16 h-16 bg-red-50 text-[#E74C3C] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Une erreur inattendue est survenue
            </h1>

            <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
              Nous n'avons pas pu charger cette page correctement. L'application reste stable, vous pouvez actualiser pour réessayer.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E5531E] active:scale-[0.98] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-light"
            >
              <RotateCcw className="w-4 h-4" />
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
