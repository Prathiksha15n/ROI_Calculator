import React, { useState, useRef } from 'react'
import './TagInput.css'

const TagInput = ({ tags, onTagsChange, placeholder, maxTags = 15 }) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const addTag = (value) => {
    const trimmedValue = value.trim()
    
    // Validation rules
    if (!trimmedValue) return // No empty tags
    if (tags.length >= maxTags) return // Max tags limit
    if (tags.some(tag => tag.toLowerCase() === trimmedValue.toLowerCase())) {
      return // Prevent duplicates (case-insensitive)
    }

    onTagsChange([...tags, trimmedValue])
    setInputValue('')
  }

  const removeTag = (indexToRemove) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(tags.length - 1)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="tag-input-container">
      <div className="tag-input-wrapper">
        <div className="tags-list">
          {tags.map((tag, index) => (
            <div key={index} className="skill-tag">
              <span className="tag-text">{tag}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="tag-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            maxLength={50}
          />
        </div>
      </div>
      {tags.length >= maxTags && (
        <p className="tag-limit-message">Maximum {maxTags} skills reached</p>
      )}
    </div>
  )
}

export default TagInput

