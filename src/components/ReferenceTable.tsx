import { COMMON_SIZES } from '../constants/conversion';
import { convertPyeongToSqm, formatNumber } from '../utils/converter';

interface ReferenceTableProps {
  onSelect: (pyeong: number) => void;
}

export default function ReferenceTable({ onSelect }: ReferenceTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>평형</th>
          <th>면적</th>
          <th>타입</th>
        </tr>
      </thead>
      <tbody>
        {COMMON_SIZES.map((item) => (
          <tr key={item.pyeong}>
            <td>{item.label}</td>
            <td>{formatNumber(convertPyeongToSqm(item.pyeong))}㎡</td>
            <td>{item.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
