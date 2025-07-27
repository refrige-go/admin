function FilterBar({ filters, onFilterChange }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {filters.map(filter => (
        <div key={filter.name}>
          <label>{filter.label}</label>
          <select
            value={filter.selectedValue || ''}
            onChange={(e) => onFilterChange(filter.name, e.target.value)}
          >
            <option value="">전체</option>  {/* 전체 선택 */}
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default FilterBar;
