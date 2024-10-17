// utils/toastUtils.ts

import { toast } from 'sonner';

type ToastType = 'loading' | 'success' | 'error';

interface ActionNotificationProps {
  type: ToastType;
  message: string;
  duration?: number;
  toastId?: string | number | undefined;
}

export const showToast = ({ type, message, duration = 3000, toastId }: ActionNotificationProps) => {
  switch (type) {
    case 'loading':
      return toast.loading(message, { duration });
    case 'success':
      return toast.success(message, { duration, id: toastId });
    case 'error':
      return toast.error(message, { duration, id: toastId });
    default:
      break;
  }
};
