import { useState } from 'react';
import Calculator from './components/Calculator';
import ReferenceTable from './components/ReferenceTable';

function App() {
  const [selectedPyeong, setSelectedPyeong] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 gap-6">
      <Calculator initialPyeong={selectedPyeong} />
      <ReferenceTable onSelect={setSelectedPyeong} />
    </div>
  );
}

export default App;
