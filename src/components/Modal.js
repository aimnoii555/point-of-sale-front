import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal box */}
            <div className="relative z-10 w-[900px] max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-300 dark:border-neutral-700">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 px-5 py-3">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 text-neutral-800 dark:text-neutral-200">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
