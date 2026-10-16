import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertIcon, RefreshIcon } from '@/components/icons';

interface Props { children: ReactNode; name?: string }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-xl p-10 text-center" role="alert">
          <div className="glass card-hover mx-auto max-w-md p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <AlertIcon size={28} />
            </div>
            <h2 className="heading text-xl">Something went wrong{this.props.name ? ` in ${this.props.name}` : ''}</h2>
            <p className="mt-2 text-sm text-ink-400 break-words">{this.state.error.message}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="btn-secondary" onClick={() => this.setState({ error: null })}>
                <RefreshIcon size={16} /> Try again
              </button>
              <a className="btn-primary" href="#/">Back to home</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
