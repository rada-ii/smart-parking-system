"use client";

// ============================================
// MODAL - Dialog/Popup
// ============================================
//
// FEATURES:
// - Animacija otvaranja (fade + scale)
// - Klik na pozadinu zatvara
// - ESC tipka zatvara
// - Veličine: sm, md, lg, xl
// - ModalFooter za akcije
//
// PRIMER:
// <Modal isOpen={show} onClose={() => setShow(false)} title="Dodaj vozilo">
//   <form>...</form>
//   <ModalFooter>
//     <Button onClick={close}>Otkaži</Button>
//     <Button type="submit">Sačuvaj</Button>
//   </ModalFooter>
// </Modal>
// ============================================

import { Fragment, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  // ESC zatvara modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                   animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={cn(
            "w-full bg-white dark:bg-slate-700 rounded-2xl shadow-2xl",
            "animate-in fade-in zoom-in-95 duration-200",
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-slate-600">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 -m-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl 
                         hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                aria-label="Zatvori"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

// Modal Footer - za akcije
export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-slate-600",
        className
      )}
    >
      {children}
    </div>
  );
}
