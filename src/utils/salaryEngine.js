/**
 * Salary Calculation Engine
 * 
 * Deterministic, skill-based salary calculation for Career ROI Calculator
 * Based on market readiness and skill coverage across Five Pillars
 */

import { processUserSkills } from './skillNormalization'
import { detectPillars, getAllPillarKeys, getPillarNames } from './pillarDetection'

/**
 * Base salary for freshers (₹ LPA)
 */
const BASE_FRESHER_SALARY = 3.0;

/**
 * Pillar contribution values for freshers (₹ LPA)
 */
const FRESHER_PILLAR_VALUES = {
  'foundations': 0.3,
  'strategy': 0.6,
  'analytics': 0.8,
  'project-management': 0.5,
  'ai': 1.0
};

/**
 * Full Stack Program multiplier range for freshers
 */
const FULL_STACK_MULTIPLIER_MIN = 1.25;
const FULL_STACK_MULTIPLIER_MAX = 1.4;

/**
 * Pillar uplift percentages for experienced users
 */
const EXPERIENCED_PILLAR_UPLIFTS = {
  'analytics': 0.25,      // +25%
  'ai': 0.30,             // +30%
  'project-management': 0.20, // +20%
  'strategy': 0.18,       // +18%
  'foundations': 0.15     // +15% (added for completeness)
};

/**
 * Calculate salary for freshers/career switchers
 * 
 * @param {string[]} userSkills - Raw user skills
 * @param {boolean} hasFullStack - Whether user completed Full Stack Program
 * @returns {object} Salary calculation result
 */
export function calculateFresherSalary(userSkills, hasFullStack = false) {
  // Normalize and process user skills
  const processedSkills = processUserSkills(userSkills);
  
  // Detect pillars from skills
  const detectedPillars = detectPillars(processedSkills);
  
  // Calculate base salary with pillar contributions
  let baseSalary = BASE_FRESHER_SALARY;
  let pillarContributions = 0;
  
  for (const pillar of detectedPillars) {
    if (FRESHER_PILLAR_VALUES[pillar]) {
      pillarContributions += FRESHER_PILLAR_VALUES[pillar];
    }
  }
  
  const salaryBeforeFullStack = baseSalary + pillarContributions;
  
  // Apply Full Stack multiplier if checked
  let salaryAfterFullStack = salaryBeforeFullStack;
  let explanation = '';
  let skillsAdded = [];
  
  if (hasFullStack) {
    // Force all 5 pillars as present
    const allPillars = getAllPillarKeys();
    let fullStackContributions = 0;
    
    // Find which pillars were added (not in detectedPillars)
    const addedPillars = allPillars.filter(p => !detectedPillars.has(p));
    
    // Calculate contributions for all pillars
    for (const pillar of allPillars) {
      if (FRESHER_PILLAR_VALUES[pillar]) {
        fullStackContributions += FRESHER_PILLAR_VALUES[pillar];
      }
    }
    
    const fullStackBase = BASE_FRESHER_SALARY + fullStackContributions;
    
    // Apply market-readiness multiplier (use average of range)
    const multiplier = (FULL_STACK_MULTIPLIER_MIN + FULL_STACK_MULTIPLIER_MAX) / 2;
    salaryAfterFullStack = fullStackBase * multiplier;
    
    // Calculate skill additions with their contributions
    // Show all 5 pillars as skills added by the program (with their individual contributions)
    for (const pillar of allPillars) {
      if (FRESHER_PILLAR_VALUES[pillar]) {
        const pillarValue = FRESHER_PILLAR_VALUES[pillar];
        // Calculate contribution: each pillar's base value gets multiplied
        // The multiplier applies to the entire base, so we calculate each pillar's proportional contribution
        const contribution = pillarValue * multiplier;
        
        skillsAdded.push({
          name: getPillarNames([pillar])[0],
          contribution: Math.round(contribution * 10) / 10
        });
      }
    }
    
    explanation = `Salary calculated with all five pillars and market-readiness multiplier, reflecting full-stack marketing engineer capabilities.`;
  } else {
    const pillarNames = getPillarNames(detectedPillars);
    if (pillarNames.length > 0) {
      explanation = `Salary calculated based on skill coverage across ${pillarNames.join(', ').toLowerCase()}, reflecting current market readiness.`;
    } else {
      explanation = `Base salary for entry-level position. Complete Full Stack Program to unlock growth potential.`;
    }
  }
  
  return {
    before: Math.round(salaryBeforeFullStack * 10) / 10, // Round to 1 decimal
    after: Math.round(salaryAfterFullStack * 10) / 10,
    uplift: Math.round((salaryAfterFullStack - salaryBeforeFullStack) * 10) / 10,
    detectedPillars: Array.from(detectedPillars),
    skillsAdded,
    explanation
  };
}

/**
 * Calculate salary for experienced professionals
 * 
 * @param {number} currentSalary - User's current salary (₹ LPA)
 * @param {string[]} userSkills - Raw user skills
 * @param {boolean} hasFullStack - Whether user completed Full Stack Program
 * @returns {object} Salary calculation result
 */
export function calculateExperiencedSalary(currentSalary, userSkills, hasFullStack = false) {
  if (!currentSalary || currentSalary <= 0) {
    return {
      before: 0,
      after: 0,
      uplift: 0,
      detectedPillars: [],
      skillsAdded: [],
      explanation: 'Please enter your current salary to calculate growth potential.'
    };
  }
  
  // Normalize and process user skills
  const processedSkills = processUserSkills(userSkills);
  
  // Detect pillars from skills
  const detectedPillars = detectPillars(processedSkills);
  
  const salaryBeforeFullStack = currentSalary;
  
  // Calculate uplift based on missing pillars
  let salaryAfterFullStack = currentSalary;
  let explanation = '';
  let skillsAdded = []; // Initialize skillsAdded array
  
  if (hasFullStack) {
    // Identify missing pillars
    const allPillars = getAllPillarKeys();
    const missingPillars = allPillars.filter(p => !detectedPillars.has(p));
    
    if (missingPillars.length > 0) {
      // Calculate total uplift from missing pillars
      let totalUplift = 0;
      const compoundFactor = 0.9; // 10% reduction for compounding
      
      // Calculate individual pillar contributions
      for (const pillar of missingPillars) {
        if (EXPERIENCED_PILLAR_UPLIFTS[pillar]) {
          const pillarUplift = EXPERIENCED_PILLAR_UPLIFTS[pillar] * compoundFactor;
          const contribution = currentSalary * pillarUplift;
          
          skillsAdded.push({
            name: getPillarNames([pillar])[0],
            contribution: Math.round(contribution * 10) / 10
          });
          
          totalUplift += EXPERIENCED_PILLAR_UPLIFTS[pillar];
        }
      }
      
      totalUplift *= compoundFactor;
      salaryAfterFullStack = currentSalary * (1 + totalUplift);
      
      const pillarNames = getPillarNames(missingPillars);
      explanation = `Salary uplift calculated based on adding missing pillars: ${pillarNames.join(', ').toLowerCase()}. These skills are in high demand and command premium salaries.`;
    } else {
      // All pillars already present - show all pillars as added with certification premium
      for (const pillar of allPillars) {
        if (EXPERIENCED_PILLAR_UPLIFTS[pillar]) {
          // Distribute the 15% premium across all pillars proportionally
          const pillarUplift = EXPERIENCED_PILLAR_UPLIFTS[pillar];
          const totalUplift = allPillars.reduce((sum, p) => sum + (EXPERIENCED_PILLAR_UPLIFTS[p] || 0), 0);
          const proportion = pillarUplift / totalUplift;
          const contribution = currentSalary * 0.15 * proportion;
          
          skillsAdded.push({
            name: getPillarNames([pillar])[0],
            contribution: Math.round(contribution * 10) / 10
          });
        }
      }
      
      salaryAfterFullStack = currentSalary * 1.15; // 15% premium for full-stack certification
      explanation = `You already have strong skill coverage. Full Stack Program certification adds 15% premium for verified expertise.`;
    }
  } else {
    const pillarNames = getPillarNames(detectedPillars);
    if (pillarNames.length > 0) {
      explanation = `Current salary reflects your existing skills in ${pillarNames.join(', ').toLowerCase()}. Complete Full Stack Program to unlock additional growth.`;
    } else {
      explanation = `Current salary baseline. Add skills and complete Full Stack Program to see significant growth potential.`;
    }
  }
  
  return {
    before: Math.round(salaryBeforeFullStack * 10) / 10,
    after: Math.round(salaryAfterFullStack * 10) / 10,
    uplift: Math.round((salaryAfterFullStack - salaryBeforeFullStack) * 10) / 10,
    detectedPillars: Array.from(detectedPillars),
    skillsAdded,
    explanation
  };
}

/**
 * Main salary calculation function
 * Routes to fresher or experienced calculation based on user type
 * 
 * @param {object} params - Calculation parameters
 * @param {string} params.userType - 'fresher' or 'experienced'
 * @param {string[]} params.skills - User skills array
 * @param {boolean} params.hasFullStack - Full Stack Program completion
 * @param {number} params.currentSalary - Current salary (for experienced only)
 * @returns {object} Salary calculation result
 */
export function calculateSalary(params) {
  const { userType, skills = [], hasFullStack = false, currentSalary = 0 } = params;
  
  if (userType === 'fresher') {
    return calculateFresherSalary(skills, hasFullStack);
  } else if (userType === 'experienced') {
    return calculateExperiencedSalary(currentSalary, skills, hasFullStack);
  }
  
  return {
    before: 0,
    after: 0,
    uplift: 0,
    detectedPillars: [],
    explanation: 'Please select your experience level to calculate salary.'
  };
}

