import { Component, type ErrorInfo, type ReactNode } from "react";

interface AdminMapBoundaryProps {
  children: ReactNode;
  resetKey?: string;
}

interface AdminMapBoundaryState {
  hasError: boolean;
}

class AdminMapBoundary extends Component<AdminMapBoundaryProps, AdminMapBoundaryState> {
  state: AdminMapBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin map crashed", error, errorInfo);
  }

  componentDidUpdate(prevProps: AdminMapBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
          <h2 className="text-lg font-bold italic mb-2 text-white">Activity Map</h2>
          <p className="text-sm text-gray-400">The map couldn't load, but the rest of the dashboard is still available.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminMapBoundary;
