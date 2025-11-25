import { useState } from 'react';
import Calculator from './components/Calculator';
import ReferenceTable from './components/ReferenceTable';

function App() {
  const [selectedPyeong, setSelectedPyeong] = useState<number | null>(null);

  return (
    <div>
      <Calculator initialPyeong={selectedPyeong} />
      <ReferenceTable onSelect={setSelectedPyeong} />
    </div>
  );
}

export default App;
