import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md text-[13px] font-medium min-w-[300px]
                ${t.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : 
                  t.type === 'error' ? 'bg-rose-50/90 border-rose-200 text-rose-800' : 
                  'bg-blue-50/90 border-blue-200 text-blue-800'
                }`}
            >
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              
              <span className="flex-1">{t.message}</span>
              
              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-md hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4 opacity-50" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
