import { useState, useCallback, useEffect } from 'react';
import Calculator from './components/Calculator';
import ReferenceTable from './components/ReferenceTable';
import History from './components/History';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { useQueryParams } from './hooks/useQueryParams';

function AppContent() {
  const { pyeongFromUrl, updateUrl } = useQueryParams();
  const [selectedPyeong, setSelectedPyeong] = useState<number | null>(pyeongFromUrl);
  const [historyVersion, setHistoryVersion] = useState(0);

  // URL 파라미터가 있으면 초기값으로 설정
  useEffect(() => {
    if (pyeongFromUrl !== null) {
      setSelectedPyeong(pyeongFromUrl);
    }
  }, [pyeongFromUrl]);

  const handleHistoryUpdate = useCallback(() => {
    setHistoryVersion((v) => v + 1);
  }, []);

  const handleSelectPyeong = useCallback(
    (pyeong: number) => {
      setSelectedPyeong(pyeong);
      updateUrl(pyeong);
    },
    [updateUrl]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4 gap-6 transition-colors">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Calculator
        initialPyeong={selectedPyeong}
        onHistoryUpdate={handleHistoryUpdate}
        onValueChange={updateUrl}
      />
      <History onSelect={handleSelectPyeong} historyVersion={historyVersion} />
      <ReferenceTable onSelect={handleSelectPyeong} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
