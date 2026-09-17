import { useMemo, useState } from 'react'
import './Combobox.css'

interface ComboboxProps {
  label: string
  options: string[]
}

function filterOptions(options: string[], query: string): string[] {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') return options
  return options.filter((option) => option.toLowerCase().includes(normalized))
}

export function Combobox({ label, options }: ComboboxProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredOptions = useMemo(
    () => filterOptions(options, inputValue),
    [options, inputValue],
  )

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    setIsOpen(true)
  }

  function handleSelect(option: string) {
    setInputValue(option)
    setIsOpen(false)
  }

  return (
    <div className="combobox">
      <label className="combobox__label" htmlFor="fruit-combobox-input">
        {label}
      </label>
      <input
        id="fruit-combobox-input"
        className="combobox__input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="combobox__listbox">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="combobox__option"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <div className="combobox__empty">No results</div>
      )}
    </div>
  )
}
