import React, { Component, ErrorInfo, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';

interface ErrorState {
  hasError: boolean;
  errorInfo?: string;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorState> {
  state: ErrorState = { hasError: false };

  static getDerivedStateFromError(): ErrorState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo: errorInfo.componentStack });
    WebApp.showAlert(`Kritik Hata: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>⚠️ Sistem Hatası ⚠️</h3>
          <p>Lütfen uygulamayı yeniden yükleyin</p>
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            Yeniden Yükle
          </button>
          {this.state.errorInfo && (
            <details className="error-details">
              <summary>Teknik Detaylar</summary>
              <pre>{this.state.errorInfo}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;