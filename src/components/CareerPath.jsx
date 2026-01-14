import React from 'react'
import './CareerPath.css'

const CareerPath = ({ currentSalary, targetSalary, userType, yearsOfExp }) => {
  const steps = [
    {
      title: 'Current Role',
      salary: currentSalary,
      skills: userType === 'fresher' ? 'Basic Skills' : 'Specialized Skills',
      time: 'Now',
    },
    {
      title: 'Mid Level',
      salary: Math.round(currentSalary * 1.3),
      skills: 'Strategy + Analytics',
      time: '3-6 months',
    },
    {
      title: 'Senior / Specialist',
      salary: Math.round(currentSalary * 1.6),
      skills: 'Full Stack Foundation',
      time: '6-9 months',
    },
    {
      title: 'Marketing Engineer',
      salary: targetSalary,
      skills: 'All Five Pillars',
      time: '6-12 months',
    },
  ]

  return (
    <div className="career-path">
      <h3 className="career-path-title">Your Career Path</h3>
      <div className="path-ladder">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`path-step ${index === steps.length - 1 ? 'path-step-final' : ''}`}
          >
            <div className="path-step-content">
              <div className="path-step-title">{step.title}</div>
              <div className="path-step-salary">₹{step.salary} LPA</div>
              <div className="path-step-skills">{step.skills}</div>
              <div className="path-step-time">{step.time}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="path-connector">
                <div className="path-line"></div>
                <div className="path-arrow">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CareerPath









