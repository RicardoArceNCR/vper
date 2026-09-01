"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { error: boolean };

export class LabErrorBoundary extends Component<Props, State> {
  state: State = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
