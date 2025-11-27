import { COMMON_SIZES } from '../constants/conversion';
import { convertPyeongToSqm, formatNumber } from '../utils/converter';

interface ReferenceTableProps {
  onSelect: (pyeong: number) => void;
}

export default function ReferenceTable({ onSelect }: ReferenceTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full transition-colors">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">일반적인 평형 참고</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">평형</th>
            <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">면적</th>
            <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">타입</th>
          </tr>
        </thead>
        <tbody>
          {COMMON_SIZES.map((item) => (
            <tr
              key={item.pyeong}
              onClick={() => onSelect(item.pyeong)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(item.pyeong);
                }
              }}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <td className="py-3 text-gray-800 dark:text-white font-medium">{item.label}</td>
              <td className="py-3 text-gray-600 dark:text-gray-300">
                {formatNumber(convertPyeongToSqm(item.pyeong))}㎡
              </td>
              <td className="py-3 text-gray-500 dark:text-gray-400 text-sm">{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
