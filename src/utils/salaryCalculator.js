/**
 * Salary Calculator for Full Stack Marketing Program ROI
 * 
 * This module calculates salary ranges based on:
 * - User experience level (fresher vs experienced)
 * - Current skills and background
 * - Five Pillars of the program:
 *   1. Strategy & Launch (+20-30%)
 *   2. Analytics & Data (+30-40%)
 *   3. Project Management (+25-35%)
 *   4. AI for Marketing (+40-60%)
 *   5. MarTech exposure (+10-20%)
 */

/**
 * Base salary ranges by experience level
 */
const BASE_SALARIES = {
  fresher: {
    min: 3,
    max: 6,
  },
  experienced: {
    '1-2': { min: 4, max: 6 },
    '3-5': { min: 6, max: 12 },
    '6+': { min: 10, max: 15 },
  },
};

/**
 * Skill to Pillar mapping
 * Maps user's current skills to the Five Pillars
 * Now supports free-form skill names with keyword matching
 */
const SKILL_KEYWORDS = {
  // Strategy & Launch keywords
  strategy: ['strategy', 'marketing', 'campaign', 'content', 'social media', 'seo', 'sem', 'ppc', 'ads', 'advertising', 'brand', 'communication', 'copywriting', 'email marketing'],
  // Analytics & Data keywords
  analytics: ['analytics', 'ga4', 'google analytics', 'data', 'reporting', 'dashboard', 'metrics', 'kpi', 'attribution', 'tracking', 'measurement'],
  // Project Management keywords
  'project-management': ['project', 'pm', 'coordination', 'management', 'planning', 'agile', 'scrum', 'kanban', 'jira', 'asana', 'trello'],
  // AI for Marketing keywords
  ai: ['ai', 'artificial intelligence', 'chatgpt', 'gpt', 'claude', 'midjourney', 'dalle', 'automation', 'machine learning', 'ml', 'prompt'],
  // MarTech keywords
  martech: ['martech', 'marketing technology', 'crm', 'salesforce', 'hubspot', 'marketo', 'pardot', 'automation', 'zapier', 'integrations'],
};

/**
 * Map free-form skill name to pillars using keyword matching
 */
function mapSkillToPillars(skillName) {
  const skillLower = skillName.toLowerCase().trim()
  const matchedPillars = new Set()
  
  // Check each pillar's keywords
  Object.entries(SKILL_KEYWORDS).forEach(([pillar, keywords]) => {
    keywords.forEach(keyword => {
      if (skillLower.includes(keyword) || keyword.includes(skillLower)) {
        matchedPillars.add(pillar)
      }
    })
  })
  
  // If no match found, default to strategy (basic marketing skill)
  if (matchedPillars.size === 0) {
    matchedPillars.add('strategy')
  }
  
  return Array.from(matchedPillars)
}

/**
 * Pillar uplift percentages
 * Each pillar adds a percentage range to base salary
 */
const PILLAR_UPLIFTS = {
  'strategy': { min: 0.20, max: 0.30 }, // 20-30%
  'analytics': { min: 0.30, max: 0.40 }, // 30-40%
  'project-management': { min: 0.25, max: 0.35 }, // 25-35%
  'ai': { min: 0.40, max: 0.60 }, // 40-60%
  'martech': { min: 0.10, max: 0.20 }, // 10-20%
};

/**
 * Background adjustments for freshers
 */
const BACKGROUND_ADJUSTMENTS = {
  engineering: { min: 0.10, max: 0.15 }, // +10-15%
  mba: { min: 0.15, max: 0.20 }, // +15-20%
  'non-tech': { min: 0, max: 0.05 }, // +0-5%
};

/**
 * Role-based adjustments for experienced professionals
 */
const ROLE_ADJUSTMENTS = {
  'social-media': { min: -0.05, max: 0 }, // -5% to 0%
  'seo': { min: 0, max: 0.05 }, // 0-5%
  'performance': { min: 0.05, max: 0.10 }, // +5-10%
  'product-growth': { min: 0.10, max: 0.15 }, // +10-15%
  'founder': { min: 0.15, max: 0.25 }, // +15-25%
};

/**
 * Role keywords mapping for free-form role text
 */
const ROLE_KEYWORDS = {
  'social-media': ['social media', 'social', 'community', 'content creator', 'influencer'],
  'seo': ['seo', 'search engine', 'organic', 'search optimization'],
  'performance': ['performance', 'paid ads', 'ppc', 'advertising', 'media buying', 'digital ads'],
  'product-growth': ['product', 'growth', 'growth marketing', 'product marketing', 'pm', 'product manager'],
  'founder': ['founder', 'entrepreneur', 'ceo', 'co-founder', 'startup'],
};

/**
 * Map free-form role text to role adjustment key
 */
function mapRoleToAdjustment(roleText) {
  if (!roleText) return null
  
  const roleLower = roleText.toLowerCase().trim()
  
  // Check each role's keywords
  for (const [roleKey, keywords] of Object.entries(ROLE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (roleLower.includes(keyword) || keyword.includes(roleLower)) {
        return roleKey
      }
    }
  }
  
  // Default to performance marketing if no match (most common)
  return 'performance'
}

/**
 * Get base salary range based on user type and experience
 */
function getBaseSalary(userType, yearsOfExp, background, currentRole) {
  if (userType === 'fresher') {
    let base = { ...BASE_SALARIES.fresher };
    
    // Apply background adjustment
    if (background && BACKGROUND_ADJUSTMENTS[background]) {
      const adj = BACKGROUND_ADJUSTMENTS[background];
      base.min = Math.round(base.min * (1 + adj.min));
      base.max = Math.round(base.max * (1 + adj.max));
    }
    
    return base;
  } else {
    // Experienced professional
    if (!yearsOfExp || !BASE_SALARIES.experienced[yearsOfExp]) {
      return { min: 6, max: 10 }; // Default fallback
    }
    
    let base = { ...BASE_SALARIES.experienced[yearsOfExp] };
    
    // Apply role adjustment (handle free-form role text)
    if (currentRole) {
      const roleKey = mapRoleToAdjustment(currentRole);
      if (roleKey && ROLE_ADJUSTMENTS[roleKey]) {
        const adj = ROLE_ADJUSTMENTS[roleKey];
        base.min = Math.round(base.min * (1 + adj.min));
        base.max = Math.round(base.max * (1 + adj.max));
      }
    }
    
    return base;
  }
}

/**
 * Map user skills to pillars
 * Now handles free-form skill names
 */
function mapSkillsToPillars(skills, userType) {
  const pillars = new Set();
  
  skills.forEach((skill) => {
    // Map free-form skill names to pillars using keyword matching
    const matchedPillars = mapSkillToPillars(skill);
    matchedPillars.forEach((pillar) => pillars.add(pillar));
  });
  
  return Array.from(pillars);
}

/**
 * Calculate salary uplift from pillars
 */
function calculatePillarUplift(baseSalary, activePillars, programCompleted) {
  // If program is completed, add all pillars
  const pillars = programCompleted
    ? ['strategy', 'analytics', 'project-management', 'ai', 'martech']
    : activePillars;
  
  let totalMinUplift = 0;
  let totalMaxUplift = 0;
  const breakdown = [];
  
  pillars.forEach((pillar) => {
    if (PILLAR_UPLIFTS[pillar]) {
      const uplift = PILLAR_UPLIFTS[pillar];
      const avgBase = (baseSalary.min + baseSalary.max) / 2;
      
      const minUplift = avgBase * uplift.min;
      const maxUplift = avgBase * uplift.max;
      
      totalMinUplift += minUplift;
      totalMaxUplift += maxUplift;
      
      breakdown.push({
        skill: getPillarName(pillar),
        uplift: Math.round((minUplift + maxUplift) / 2),
      });
    }
  });
  
  // If multiple pillars, apply compounding effect (slightly reduced)
  if (pillars.length > 1) {
    const reductionFactor = 0.9; // 10% reduction for compounding
    totalMinUplift *= reductionFactor;
    totalMaxUplift *= reductionFactor;
  }
  
  return {
    min: Math.round(totalMinUplift),
    max: Math.round(totalMaxUplift),
    breakdown,
  };
}

/**
 * Get human-readable pillar name
 */
function getPillarName(pillar) {
  const names = {
    'strategy': 'Strategy & Launch',
    'analytics': 'Analytics & Data',
    'project-management': 'Project Management',
    'ai': 'AI for Marketing',
    'martech': 'MarTech Exposure',
  };
  return names[pillar] || pillar;
}

/**
 * Main calculation function
 */
export function calculateSalary(inputs) {
  const {
    userType,
    background,
    fresherSkills,
    yearsOfExp,
    currentRole,
    experiencedSkills,
    programCompleted,
  } = inputs;
  
  // Get base salary
  const baseSalary = getBaseSalary(
    userType,
    yearsOfExp,
    background,
    currentRole
  );
  
  // Map skills to pillars
  const skills = userType === 'fresher' ? fresherSkills : experiencedSkills;
  const activePillars = mapSkillsToPillars(skills, userType);
  
  // Calculate pillar uplift
  const uplift = calculatePillarUplift(
    baseSalary,
    activePillars,
    programCompleted
  );
  
  // Calculate before salary (base + existing skills)
  const beforeMin = baseSalary.min;
  const beforeMax = baseSalary.max;
  const beforeAvg = Math.round((beforeMin + beforeMax) / 2);
  
  // Calculate after salary (base + all skills/pillars)
  const afterMin = baseSalary.min + uplift.min;
  const afterMax = baseSalary.max + uplift.max;
  const afterAvg = Math.round((afterMin + afterMax) / 2);
  
  // Calculate total uplift
  const totalUplift = afterAvg - beforeAvg;
  const upliftPercentage = Math.round((totalUplift / beforeAvg) * 100);
  
  // Format breakdown
  const breakdown = uplift.breakdown.map((item) => ({
    skill: item.skill,
    uplift: item.uplift,
  }));
  
  // If no skills selected and program not completed, show base only
  if (activePillars.length === 0 && !programCompleted) {
    return {
      before: {
        min: beforeMin,
        max: beforeMax,
        avg: beforeAvg,
      },
      after: {
        min: beforeMin,
        max: beforeMax,
        avg: beforeAvg,
      },
      uplift: 0,
      upliftPercentage: 0,
      breakdown: [],
    };
  }
  
  return {
    before: {
      min: beforeMin,
      max: beforeMax,
      avg: beforeAvg,
    },
    after: {
      min: afterMin,
      max: afterMax,
      avg: afterAvg,
    },
    uplift: totalUplift,
    upliftPercentage,
    breakdown,
  };
}

/**
 * Get skill breakdown for display
 */
export function getSkillBreakdown(inputs) {
  const calculation = calculateSalary(inputs);
  return calculation.breakdown;
}

