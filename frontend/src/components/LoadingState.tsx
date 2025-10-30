interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading experiences...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-slate-500">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" aria-hidden />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md space-y-3 rounded-3xl bg-white p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}
