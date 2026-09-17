import { useId, useMemo, useRef, useState } from 'react'
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

function optionId(baseId: string, option: string): string {
  return `${baseId}-option-${option.replace(/\s+/g, '-').toLowerCase()}`
}

export function Combobox({ label, options }: ComboboxProps) {
  const baseId = useId()
  const inputId = `${baseId}-input`
  const listboxId = `${baseId}-listbox`

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listboxRef = useRef<HTMLUListElement>(null)

  const filteredOptions = useMemo(
    () => filterOptions(options, inputValue),
    [options, inputValue],
  )

  const activeOption = activeIndex >= 0 ? filteredOptions[activeIndex] : undefined
  const activeDescendant = activeOption ? optionId(baseId, activeOption) : undefined

  function openWithOptions() {
    setIsOpen(true)
    setActiveIndex(-1)
  }

  function closeListbox() {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    openWithOptions()
  }

  function handleSelect(option: string) {
    setInputValue(option)
    closeListbox()
  }

  function scrollOptionIntoView(index: number) {
    const list = listboxRef.current
    if (!list) return
    const el = list.children[index] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }

  function moveActiveIndex(delta: number) {
    if (filteredOptions.length === 0) return
    setActiveIndex((current) => {
      const next = current === -1
        ? (delta > 0 ? 0 : filteredOptions.length - 1)
        : Math.min(Math.max(current + delta, 0), filteredOptions.length - 1)
      scrollOptionIntoView(next)
      return next
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          openWithOptions()
        } else {
          moveActiveIndex(1)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          openWithOptions()
        } else {
          moveActiveIndex(-1)
        }
        break
      case 'Home':
        if (isOpen && filteredOptions.length > 0) {
          event.preventDefault()
          setActiveIndex(0)
          scrollOptionIntoView(0)
        }
        break
      case 'End':
        if (isOpen && filteredOptions.length > 0) {
          event.preventDefault()
          const last = filteredOptions.length - 1
          setActiveIndex(last)
          scrollOptionIntoView(last)
        }
        break
      case 'Enter':
        if (isOpen && activeOption) {
          event.preventDefault()
          handleSelect(activeOption)
        }
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          closeListbox()
        }
        break
      default:
        break
    }
  }

  const resultStatus = !isOpen
    ? ''
    : filteredOptions.length === 0
      ? 'No results'
      : `${filteredOptions.length} result${filteredOptions.length === 1 ? '' : 's'} available`

  return (
    <div className="combobox">
      <label className="combobox__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="combobox__input"
        type="text"
        role="combobox"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={openWithOptions}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          id={listboxId}
          className="combobox__listbox"
          role="listbox"
          ref={listboxRef}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              id={optionId(baseId, option)}
              className={
                index === activeIndex
                  ? 'combobox__option combobox__option--active'
                  : 'combobox__option'
              }
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => {
                // Prevent the input from losing focus before the click registers.
                event.preventDefault()
              }}
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
      <div className="combobox__status" role="status" aria-live="polite">
        {resultStatus}
      </div>
    </div>
  )
}
