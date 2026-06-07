import { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 border border-red-200 rounded-xl shadow-xl max-w-md w-full">
            <h1 className="text-2xl font-extrabold text-red-600 mb-4">Oops! Something went wrong.</h1>
            <p className="text-sm text-slate-600 mb-6 font-medium">
              We encountered an unexpected error. Try reloading the application.
            </p>
            <div className="bg-slate-100 p-4 rounded text-left overflow-auto text-xs font-mono text-slate-800 mb-6 max-h-48 border border-slate-200">
              {this.state.error?.toString()}
            </div>
            <button
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition shadow"
              onClick={() => window.location.reload()}
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
