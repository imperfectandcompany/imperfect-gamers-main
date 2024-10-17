// components/Reusable/ConfirmActionModal.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { showToast } from '../../utils/toastUtils'; // Adjust the path as needed
import { Loader2 } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  successResponse?: string;
  pendingResponse?: string;
  failResponse?: string;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  successResponse = 'Action completed successfully!',
  pendingResponse = 'Action is in progress...',
  failResponse = 'Action failed. Please try again.',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true); // Start processing
    // Show loading toast and store its ID
    const toastId = showToast({ type: 'loading', message: pendingResponse, duration: 3000 });

    try {
      await onConfirm();
      // Update the existing toast to success
      showToast({ type: 'success', message: successResponse, toastId });
    } catch (error: any) {
      console.error("Action Error:", error);
      // Update the existing toast to error
      showToast({ type: 'error', message: error.message || failResponse, toastId });
    } finally {
      setIsProcessing(false); // End processing
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border border-zinc-800 shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
            className={`${
              isProcessing ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {cancelText}
          </Button>
          <Button
            className={`bg-red-600 hover:bg-red-700 flex items-center ${
              isProcessing ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;
