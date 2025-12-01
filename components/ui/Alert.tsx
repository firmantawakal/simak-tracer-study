import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'default', className, children, ...props }: AlertProps) {
  const variants = {
    default: 'bg-gray-50 border-gray-200 text-gray-900',
    destructive: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  };

  const icons = {
    default: Info,
    destructive: XCircle,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <div
      className={cn('text-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}