'use client';
import { Button } from './Button';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-panel border border-border rounded shadow-xl">
        <h3 className="text-lg text-ink font-semibold mb-2">{title}</h3>
        <p className="text-ink-dim mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Dispatching...' : 'Confirm Action'}
          </Button>
        </div>
      </div>
    </div>
  );
}