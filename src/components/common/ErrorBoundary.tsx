import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[Typlix Error]:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-neutral-900 dark:text-neutral-100">
          <div className="max-w-md w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {this.props.fallbackTitle || 'Session Paused'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              An unexpected display glitch occurred. Your typing progress and records are completely safe.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-left overflow-x-auto text-red-500 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
