import React, { useState, useEffect, useRef } from 'react'
import { calculateSalary } from '../utils/salaryEngine'
import { animateCountUp } from '../utils/countUp'
import CareerPath from './CareerPath'
import TagInput from './TagInput'
import LeadCaptureModal from './LeadCaptureModal'
import './ROICalculator.css'

const ROICalculator = () => {
  // Step 1: Experience Gate
  const [userType, setUserType] = useState(null)
  
  // Step 2A: Fresher Data
  const [background, setBackground] = useState('')
  const [fresherSkills, setFresherSkills] = useState([])
  
  // Step 2B: Experienced Data
  const [yearsOfExp, setYearsOfExp] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [currentSalary, setCurrentSalary] = useState('')
  const [experiencedSkills, setExperiencedSkills] = useState([])
  
  // Step 4: Program Toggle
  const [programCompleted, setProgramCompleted] = useState(false)
  
  // Results
  const [results, setResults] = useState(null)
  const [showHints, setShowHints] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  // Lead Capture Modal
  const [showLeadModal, setShowLeadModal] = useState(false)
  
  // Refs for count-up animation
  const beforeAvgRef = useRef(null)
  const afterAvgRef = useRef(null)
  const upliftRef = useRef(null)

  // Calculate results only when Calculate ROI is clicked
  const handleCalculateROI = () => {
    if (!userType) return

    // Get skills based on user type
    const skills = userType === 'fresher' ? fresherSkills : experiencedSkills
    
    // For experienced users, we need current salary from input
    let salaryValue = 0
    if (userType === 'experienced') {
      salaryValue = parseFloat(currentSalary) || 0
    }

    const calculation = calculateSalary({
      userType,
      skills,
      hasFullStack: programCompleted,
      currentSalary: salaryValue
    })

    setResults(calculation)
    setShowResults(true)
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('.results-card')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Show hints if user has filled some data but not all (but don't calculate)
  useEffect(() => {
    if (!userType) {
      setShowHints(false)
      return
    }

    const hasPartialData = 
      (userType === 'fresher' && (background || fresherSkills.length > 0)) ||
      (userType === 'experienced' && (yearsOfExp || currentRole || experiencedSkills.length > 0))
    
    setShowHints(hasPartialData && !programCompleted && !showResults)
  }, [
    userType,
    background,
    fresherSkills,
    yearsOfExp,
    currentRole,
    experiencedSkills,
    programCompleted,
    showResults,
  ])

  // Recalculate when Full Stack toggle changes (if results are already shown)
  useEffect(() => {
    // Only recalculate if results are already shown (user has clicked Calculate ROI)
    if (showResults && userType) {
      // Get skills based on user type
      const skills = userType === 'fresher' ? fresherSkills : experiencedSkills
      
      // For experienced users, we need current salary from input
      let salaryValue = 0
      if (userType === 'experienced') {
        salaryValue = parseFloat(currentSalary) || 0
      }

      const calculation = calculateSalary({
        userType,
        skills,
        hasFullStack: programCompleted,
        currentSalary: salaryValue
      })

      setResults(calculation)
    }
    // Only recalculate when toggle changes, not when skills change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programCompleted])

  // Count-up animation when results change
  useEffect(() => {
    if (results && results.after > 0) {
      setTimeout(() => {
        if (beforeAvgRef.current) {
          animateCountUp(beforeAvgRef.current, 0, results.before, 1500)
        }
        if (afterAvgRef.current) {
          setTimeout(() => {
            animateCountUp(afterAvgRef.current, results.before, results.after, 1500)
          }, 200)
        }
        if (upliftRef.current) {
          setTimeout(() => {
            animateCountUp(upliftRef.current, 0, results.uplift, 1500)
          }, 400)
        }
      }, 300)
    }
  }, [results])

  // TagInput handles skill management directly, so this function is no longer needed
  // Keeping it for backward compatibility but it won't be used
  const handleSkillToggle = (skill, isFresher) => {
    // This function is deprecated - TagInput handles skill management
  }

  const resetCalculator = () => {
    setUserType(null)
    setBackground('')
    setFresherSkills([])
    setYearsOfExp('')
    setCurrentRole('')
    setCurrentSalary('')
    setExperiencedSkills([])
    setProgramCompleted(false)
    setResults(null)
    setShowHints(false)
    setShowResults(false)
  }

  // Check if form is ready to calculate
  const isFormReady = () => {
    if (!userType) return false
    
    // Full Stack checkbox must be checked
    if (!programCompleted) return false
    
    if (userType === 'fresher') {
      return background !== '' // At least background selected
    } else {
      return yearsOfExp !== '' && currentRole !== '' && currentSalary !== '' && parseFloat(currentSalary) > 0 // All required fields including salary
    }
  }

  const getCurrentCeiling = () => {
    if (!results) return null
    return {
      min: results.before.min,
      max: results.before.max,
      avg: results.before.avg,
    }
  }

  return (
    <div className="roi-calculator">
      <div className="calculator-container">
        {/* Step 1: Experience Gate - Glass Card */}
        {!userType && (
          <div className="glass-card step-card">
            <div className="step-header">
              <div className="step-number">01</div>
              <h2 className="step-title">About You</h2>
            </div>
            <p className="step-description">
              Your career journey starts here. Choose one to begin.
            </p>
            <div className="option-cards">
              <div
                className={`option-card ${userType === 'fresher' ? 'selected' : ''}`}
                onClick={() => setUserType('fresher')}
              >
                <div className="option-icon">🚀</div>
                <div className="option-title">Fresher / Career Switcher</div>
                <div className="option-subtitle">Starting your marketing journey</div>
              </div>
              <div
                className={`option-card ${userType === 'experienced' ? 'selected' : ''}`}
                onClick={() => setUserType('experienced')}
              >
                <div className="option-icon">💼</div>
                <div className="option-title">Experienced Professional</div>
                <div className="option-subtitle">Level up your existing skills</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2A: Fresher Path */}
        {userType === 'fresher' && (
          <div className="glass-card step-card">
            <div className="step-header">
              <div className="step-number">02</div>
              <h2 className="step-title">Your Background & Skills</h2>
            </div>
            
            <div className="form-section">
              <label className="form-label">What is your background?</label>
              <div className="chip-group">
                {[
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'mba', label: 'MBA / Business' },
                  { value: 'non-tech', label: 'Non-Marketing' },
                ].map((bg) => (
                  <button
                    key={bg.value}
                    className={`skill-chip ${background === bg.value ? 'selected' : ''}`}
                    onClick={() => setBackground(bg.value)}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">Which skills do you already have?</label>
              <p className="form-hint">Type your skills and press Enter</p>
              <TagInput
                tags={fresherSkills}
                onTagsChange={setFresherSkills}
                placeholder="e.g. SEO, Google Analytics, Paid Ads, Excel, ChatGPT"
                maxTags={15}
              />
            </div>

            {/* Full Stack Program Toggle - Inside Form */}
            <div className="form-section">
              <div className="toggle-container-inline">
                <label className="toggle-label-inline">
                  <input
                    type="checkbox"
                    checked={programCompleted}
                    onChange={(e) => setProgramCompleted(e.target.checked)}
                    className="toggle-input"
                  />
                  <div className="toggle-content-inline">
                    <span className="toggle-text-inline">
                      Assume I complete the Full Stack Marketing Program
                    </span>
                    <span className="toggle-subtext-inline">
                      Automatically adds all Five Pillars: Strategy & Launch, Analytics & Data, 
                      Project Management, AI for Marketing, and MarTech exposure
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="step-actions">
              <button 
                className={`btn-calculate ${!isFormReady() ? 'disabled' : ''}`}
                onClick={handleCalculateROI}
                disabled={!isFormReady()}
              >
                Calculate ROI
              </button>
            </div>
          </div>
        )}

        {/* Step 2B: Experienced Path */}
        {userType === 'experienced' && (
          <div className="glass-card step-card">
            <div className="step-header">
              <div className="step-number">02</div>
              <h2 className="step-title">Your Experience & Current Skills</h2>
            </div>
            
            <div className="form-section">
              <label className="form-label">Years of Marketing Experience</label>
              <div className="chip-group">
                {['1-2', '3-5', '6+'].map((years) => (
                  <button
                    key={years}
                    className={`skill-chip ${yearsOfExp === years ? 'selected' : ''}`}
                    onClick={() => setYearsOfExp(years)}
                  >
                    {years === '6+' ? '6+ years' : `${years} years`}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">Current Role / Focus Area</label>
              <p className="form-hint">e.g. Social Media Manager, SEO Specialist, Performance Marketing</p>
              <input
                type="text"
                className="text-input"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Type your current role"
                maxLength={100}
              />
            </div>

            <div className="form-section">
              <label className="form-label">Current Salary (₹ LPA)</label>
              <p className="form-hint">Enter your current annual salary in Lakhs Per Annum</p>
              <input
                type="number"
                className="text-input"
                value={currentSalary}
                onChange={(e) => {
                  const value = e.target.value
                  // Allow only numbers and one decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setCurrentSalary(value)
                  }
                }}
                placeholder="e.g. 8.5"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Current Skills</label>
              <p className="form-hint">Type your skills and press Enter</p>
              <TagInput
                tags={experiencedSkills}
                onTagsChange={setExperiencedSkills}
                placeholder="e.g. SEO, Google Analytics, Paid Ads, Excel, ChatGPT"
                maxTags={15}
              />
            </div>

            {/* Full Stack Program Toggle - Inside Form */}
            <div className="form-section">
              <div className="toggle-container-inline">
                <label className="toggle-label-inline">
                  <input
                    type="checkbox"
                    checked={programCompleted}
                    onChange={(e) => setProgramCompleted(e.target.checked)}
                    className="toggle-input"
                  />
                  <div className="toggle-content-inline">
                    <span className="toggle-text-inline">
                      Assume I complete the Full Stack Marketing Program
                    </span>
                    <span className="toggle-subtext-inline">
                      Automatically adds all Five Pillars: Strategy & Launch, Analytics & Data, 
                      Project Management, AI for Marketing, and MarTech exposure
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="step-actions">
              <button 
                className={`btn-calculate ${!isFormReady() ? 'disabled' : ''}`}
                onClick={handleCalculateROI}
                disabled={!isFormReady()}
              >
                Calculate ROI
              </button>
            </div>
          </div>
        )}

        {/* Progressive Hint Bar */}
        {showHints && !showResults && (
          <div className="glass-card hint-card">
            <div className="hint-content">
              <div className="hint-icon">🎯</div>
              <div className="hint-text">
                <strong>Fill in your details and click "Calculate ROI" to see your potential salary range.</strong>
              </div>
              <div className="hint-cta">
                Keep going to see your Full Stack potential!
              </div>
            </div>
          </div>
        )}

        {/* Step 3: ROI Output - The Reveal */}
        {showResults && results && results.after > 0 && (
          <div className="glass-card results-card">
            <div className="results-header">
              <h2 className="results-title">Your Career ROI Summary</h2>
              <p className="results-subtitle">Skills → Salary intelligence</p>
            </div>
            
            <div className="salary-comparison">
              <div className="salary-card before">
                <div className="salary-label">Before Program</div>
                <div className="salary-amount">
                  ₹<span ref={beforeAvgRef}>{results.before}</span> LPA
                </div>
              </div>

              <div className="comparison-arrow">
                <div className="arrow-line"></div>
                <div className="arrow-head">→</div>
              </div>

              <div className="salary-card after">
                <div className="salary-glow"></div>
                <div className="salary-label">After Full Stack Marketing</div>
                <div className="salary-amount">
                  ₹<span ref={afterAvgRef}>{results.after}</span> LPA
                </div>
              </div>
            </div>

            <div className="roi-uplift">
              <div className="uplift-card">
                <div className="uplift-label">Projected Growth</div>
                <div className="uplift-amount">
                  ▲₹<span ref={upliftRef}>{results.uplift}</span> LPA
                </div>
                <div className="uplift-percentage">
                  {results.before > 0 ? Math.round((results.uplift / results.before) * 100) : 0}% increase
                </div>
              </div>
            </div>

            {results.skillsAdded && results.skillsAdded.length > 0 && (
              <div className="skill-breakdown">
                <h3 className="breakdown-title">Skills Added After Program:</h3>
                <div className="breakdown-list">
                  {results.skillsAdded.map((skill, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-skill">{skill.name}</div>
                      <div className="breakdown-uplift">+₹{skill.contribution} LPA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.explanation && (
              <div className="explanation-box">
                <p className="explanation-text">{results.explanation}</p>
              </div>
            )}

            <CareerPath
              currentSalary={results.before}
              targetSalary={results.after}
              userType={userType}
              yearsOfExp={yearsOfExp}
            />

            <div className="time-to-impact">
              <div className="impact-icon">⏱️</div>
              <div className="impact-text">
                <strong>Time to Impact:</strong> 6-12 months after program completion
              </div>
            </div>

            <div className="results-cta">
              <button 
                className="cta-button"
                onClick={() => setShowLeadModal(true)}
              >
                See How to Achieve This Growth →
              </button>
            </div>

            <div className="step-actions results-actions">
              <button className="btn-secondary" onClick={resetCalculator}>
                Start Over
              </button>
            </div>

            <div className="disclaimer">
              <p>
                <strong>Note:</strong> These projections are based on industry standards and skill demand. 
                Actual salary depends on company, location, negotiation, and individual performance.
              </p>
            </div>
          </div>
        )}

        {/* Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          careerProfile={{
            experience_level: userType,
            current_role: currentRole || '',
            current_salary: userType === 'experienced' ? parseFloat(currentSalary) || null : null,
            skills: userType === 'fresher' ? fresherSkills : experiencedSkills,
            detected_pillars: results?.detectedPillars || [],
            is_full_stack: programCompleted,
            estimated_salary_before: results?.before || 0,
            estimated_salary_after: results?.after || 0,
          }}
        />
      </div>
    </div>
  )
}

export default ROICalculator
