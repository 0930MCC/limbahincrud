import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {/* Toast (toast.jsx) is a plain <div>, not an actual Radix primitive that reacts to an
          `open` prop — so a toast being "closed" (dismiss() sets open: false) never hid it on its
          own; it only disappeared once REMOVE_TOAST later dropped it from this array entirely,
          which is what made the close button look like it did nothing. Filtering it out here the
          moment open turns false is what makes clicking close (or the 10s auto-dismiss) actually
          remove it from the screen right away. */}
      {toasts
        .filter(({ open }) => open !== false)
        .map(function ({ id, title, description, action, open, onOpenChange, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {/* ToastClose (toast.jsx) is a plain <button> with no built-in behavior — the real
                Radix Toast.Close wires its click to onOpenChange automatically, but these
                components don't use Radix, so that click handler has to be given explicitly here.
                Without it, clicking the X did nothing at all. */}
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
} 