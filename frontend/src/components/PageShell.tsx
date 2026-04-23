import { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
  narrow?: boolean;
};

export default function PageShell({ children, narrow = false }: PageShellProps) {
  return <main className={`page-shell ${narrow ? 'page-shell-narrow' : ''}`.trim()}>{children}</main>;
}
