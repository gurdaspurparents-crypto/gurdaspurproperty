import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-rose-50 border-2 border-rose-300 rounded-3xl text-center space-y-3 m-4 shadow-xl">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900 font-['Outfit']">
            Something went wrong in this view
          </h3>
          <p className="text-xs text-rose-700 max-w-sm mx-auto leading-relaxed">
            {this.state.error?.message || 'An unexpected display error occurred.'}
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload &amp; Recover</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
