import { useState, useCallback } from 'react';
import Calculator from './components/Calculator';
import ReferenceTable from './components/ReferenceTable';
import History from './components/History';

function App() {
  const [selectedPyeong, setSelectedPyeong] = useState<number | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  const handleHistoryUpdate = useCallback(() => {
    setHistoryVersion((v) => v + 1);
  }, []);

  const handleSelectPyeong = useCallback((pyeong: number) => {
    setSelectedPyeong(pyeong);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 gap-6">
      <Calculator initialPyeong={selectedPyeong} onHistoryUpdate={handleHistoryUpdate} />
      <History onSelect={handleSelectPyeong} historyVersion={historyVersion} />
      <ReferenceTable onSelect={handleSelectPyeong} />
    </div>
  );
}

export default App;
