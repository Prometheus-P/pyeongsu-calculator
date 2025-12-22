import Calculator from './components/Calculator';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { DynamicColorProvider } from './contexts/DynamicColorContext';

function AppContent() {
  return (
    <div className="min-h-screen bg-m3-surface flex flex-col items-center justify-center p-m3-4 gap-m3-6 transition-colors duration-300">
      <div className="fixed top-m3-4 right-m3-4">
        <ThemeToggle />
      </div>
      <Calculator />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DynamicColorProvider>
        <AppContent />
      </DynamicColorProvider>
    </ThemeProvider>
  );
}