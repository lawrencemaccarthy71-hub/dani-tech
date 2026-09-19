import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, MessageSquare } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_FORMATTED } from '../utils/format';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Dani Tech ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const supportUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
        `Hello Dani Tech Support, I encountered a temporary display issue on the website. Please assist.`
      )}`;

      return (
        <div className="min-h-screen bg-[#131315] text-[#e5e1e4] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#1c1b1d] border border-[#424656]/40 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-[#ffb77d]/10 border border-[#ffb77d]/30 text-[#ffb77d] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h2 className="font-['Geist',sans-serif] text-xl font-bold text-[#e5e1e4] mb-2">
              Temporary Connection Hiccup
            </h2>

            <p className="text-xs sm:text-sm text-[#8c90a1] leading-relaxed mb-6">
              A brief network interruption interrupted loading. Refresh the page or reach our WhatsApp team directly for immediate assistance.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0066ff]/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-2.5 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-[#424656]/30"
              >
                Return to Storefront
              </button>

              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#1f2e26] hover:bg-[#263c30] text-[#4ade80] border border-[#22c55e]/30 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp ({WHATSAPP_PHONE_FORMATTED})</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
