export default function Calculator() {
  return (
    <div>
      <h1>평수 계산기</h1>
      <div>
        <label htmlFor="sqm">제곱미터 (㎡)</label>
        <input id="sqm" type="text" />
      </div>
      <div>
        <label htmlFor="pyeong">평</label>
        <input id="pyeong" type="text" />
      </div>
    </div>
  );
}
