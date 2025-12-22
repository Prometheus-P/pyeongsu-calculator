/**
 * Snackbar Context
 * 전역에서 스낵바를 쉽게 호출할 수 있도록 하는 Context Provider
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Snackbar } from '../components/m3/Snackbar';

interface SnackbarOptions {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  showCloseIcon?: boolean;
}

interface SnackbarContextType {
  /** 스낵바 표시 */
  showSnackbar: (options: SnackbarOptions) => void;
  /** 스낵바 숨기기 */
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions>({
    message: '',
  });

  const showSnackbar = useCallback((newOptions: SnackbarOptions) => {
    setOptions(newOptions);
    setOpen(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={open}
        onClose={hideSnackbar}
        message={options.message}
        action={options.action}
        autoHideDuration={options.duration ?? 4000}
        showCloseIcon={options.showCloseIcon}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
