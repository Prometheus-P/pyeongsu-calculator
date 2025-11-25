import { COMMON_SIZES } from '../constants/conversion';
import { convertPyeongToSqm, formatNumber } from '../utils/converter';

interface ReferenceTableProps {
  onSelect: (pyeong: number) => void;
}

export default function ReferenceTable({ onSelect }: ReferenceTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">일반적인 평형 참고</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-sm font-medium text-gray-600">평형</th>
            <th className="text-left py-2 text-sm font-medium text-gray-600">면적</th>
            <th className="text-left py-2 text-sm font-medium text-gray-600">타입</th>
          </tr>
        </thead>
        <tbody>
          {COMMON_SIZES.map((item) => (
            <tr
              key={item.pyeong}
              onClick={() => onSelect(item.pyeong)}
              className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
            >
              <td className="py-3 text-gray-800 font-medium">{item.label}</td>
              <td className="py-3 text-gray-600">{formatNumber(convertPyeongToSqm(item.pyeong))}㎡</td>
              <td className="py-3 text-gray-500 text-sm">{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
