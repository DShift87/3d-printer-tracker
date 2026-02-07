import { createContext, useContext, useRef, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router";

interface AddActionContextType {
  registerAddHandler: (handler: () => void) => void;
  unregisterAddHandler: () => void;
  triggerAdd: () => void;
}

const AddActionContext = createContext<AddActionContextType | undefined>(undefined);

export function AddActionProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<(() => void) | null>(null);
  const navigate = useNavigate();

  const registerAddHandler = useCallback((handler: () => void) => {
    handlerRef.current = handler;
  }, []);

  const unregisterAddHandler = useCallback(() => {
    handlerRef.current = null;
  }, []);

  const triggerAdd = useCallback(() => {
    if (handlerRef.current) {
      handlerRef.current();
    } else {
      navigate("/parts");
    }
  }, [navigate]);

  return (
    <AddActionContext.Provider
      value={{ registerAddHandler, unregisterAddHandler, triggerAdd }}
    >
      {children}
    </AddActionContext.Provider>
  );
}

export function useAddAction() {
  const context = useContext(AddActionContext);
  if (!context) {
    throw new Error("useAddAction must be used within AddActionProvider");
  }
  return context;
}
