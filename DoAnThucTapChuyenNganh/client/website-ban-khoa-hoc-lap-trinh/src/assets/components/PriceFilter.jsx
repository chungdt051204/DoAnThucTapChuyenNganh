export default function PriceFilter({ onPriceChange, selectedValue }) {
  return (
    <>
      <select
        className="product-filter-select"
        value={selectedValue}
        onChange={(e) => onPriceChange(e.target.value)}
        name="price_range"
        id="price-filter"
      >
        <option value="">Chọn giá</option>
        <option value="low">Dưới 200.000 VND</option>
        <option value="medium">Từ 200.000 - 400.000 VND</option>
        <option value="high">Trên 400.000 VND</option>
      </select>
    </>
  );
}
