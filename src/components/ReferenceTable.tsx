import { memo } from 'react';
import { COMMON_SIZES } from '../constants/conversion';
import { convertPyeongToSqm, formatNumber } from '../utils/converter';

interface ReferenceTableProps {
  onSelect: (pyeong: number) => void;
}

// T015: M3 table styling
export default memo(function ReferenceTable({ onSelect }: ReferenceTableProps) {
  return (
    <div className="bg-m3-surface rounded-m3-md shadow-m3-1 p-m3-6 max-w-md w-full transition-colors">
      <h2 className="text-title-medium text-m3-on-surface mb-m3-4">일반적인 평형 참고</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-m3-outline-variant">
            <th className="text-left py-m3-2 text-label-medium text-m3-on-surface-variant">평형</th>
            <th className="text-left py-m3-2 text-label-medium text-m3-on-surface-variant">면적</th>
            <th className="text-left py-m3-2 text-label-medium text-m3-on-surface-variant">타입</th>
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
              className="border-b border-m3-outline-variant hover:bg-m3-surface-variant cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-m3-primary"
            >
              <td className="py-m3-3 text-body-medium text-m3-on-surface">{item.label}</td>
              <td className="py-m3-3 text-body-medium text-m3-on-surface-variant">
                {formatNumber(convertPyeongToSqm(item.pyeong))}㎡
              </td>
              <td className="py-m3-3 text-body-small text-m3-on-surface-variant">{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
