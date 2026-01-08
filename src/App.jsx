import React, { useState } from 'react'
import ROICalculator from './components/ROICalculator'
import './App.css'

function App() {
  const [showCalculator, setShowCalculator] = useState(false)

  return (
    <div className="app">
      {!showCalculator ? (
        <div className="hero-section">
          {/* Background depth elements */}
          <div className="background-vignette"></div>
          <div className="background-grain"></div>
          <div className="background-shape"></div>
          
          <div className="hero-content">
            <div className="hero-badge trust-badge">
              <span>Powered by Digital Maven × MIT SDE</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line-1">ROI</span>
              <span className="title-line-2">CALCULATOR</span>
            </h1>
            
            <p className="hero-subtitle">
              See your earning potential
            </p>
            <p className="hero-subtitle-accent">
              and how it changes when you go Full Stack.
            </p>

            {/* Career Signal Strip */}
            <div className="signal-strip skill-strip">
              <div className="signal-items">
                <div className="signal-row">
                  <span className="signal-item">Strategy</span>
                  <span className="signal-divider">•</span>
                  <span className="signal-item">Analytics</span>
                  <span className="signal-divider">•</span>
                  <span className="signal-item">AI</span>
                </div>
                <div className="signal-row">
                  <span className="signal-item">MarTech</span>
                  <span className="signal-divider">•</span>
                  <span className="signal-item">Project Management</span>
                </div>
              </div>
              <p className="signal-microcopy">
                Mapped to real market roles and salary bands
              </p>
            </div>

            {/* Primary CTA */}
            <div className="cta-container">
              <button 
                className="hero-cta cta-button"
                onClick={() => setShowCalculator(true)}
              >
                See My Career ROI →
              </button>
              <p className="cta-hint">Takes less than 2 minutes</p>
            </div>

            {/* Preview Glass Card */}
            <div className="preview-card salary-preview">
              <div className="preview-content">
                <div className="preview-values">
                  <div className="preview-before">
                    <div className="preview-amount">₹6–8 LPA</div>
                    <div className="preview-label">Current</div>
                  </div>
                  <div className="preview-arrow">→</div>
                  <div className="preview-after">
                    <div className="preview-amount">₹18–22 LPA</div>
                    <div className="preview-label">Full Stack</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Works */}
            <div className="why-works why-this-works">
              <div className="why-title">Why this works:</div>
              <div className="why-bullets">
                <div className="why-bullet">• Real hiring data</div>
                <div className="why-bullet">• Skill-based ceilings</div>
                <div className="why-bullet">• Clear growth paths</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="calculator-wrapper">
          <button 
            className="back-to-hero"
            onClick={() => setShowCalculator(false)}
          >
            ← Back
          </button>
          <ROICalculator />
        </div>
      )}
    </div>
  )
}

export default App
