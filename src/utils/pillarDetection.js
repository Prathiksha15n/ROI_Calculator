/**
 * Pillar Detection Engine
 * 
 * Maps user skills to the Five Master Pillars of Full Stack Marketing
 */

/**
 * Foundation & Narratives Skills
 */
const FOUNDATION_SKILLS = [
  "marketing fundamentals", "digital marketing basics", "consumer psychology",
  "buyer behavior", "brand positioning", "brand strategy", "storytelling",
  "copywriting", "content writing", "content strategy", "messaging",
  "value proposition", "brand voice", "market research", "user research",
  "customer personas", "communication skills", "narrative building"
];

/**
 * Strategy & Growth Execution Skills
 */
const STRATEGY_SKILLS = [
  "digital marketing strategy", "growth strategy", "campaign strategy",
  "go to market strategy", "growth marketing", "performance marketing",
  "paid ads", "google ads", "meta ads", "facebook ads", "instagram ads",
  "linkedin ads", "seo", "on page seo", "off page seo", "technical seo", "sem",
  "email marketing", "lifecycle marketing", "funnel building", "cro",
  "landing page optimization", "lead generation", "demand generation"
];

/**
 * Analytics & Data Skills
 */
const ANALYTICS_SKILLS = [
  "google analytics", "ga", "ga4", "web analytics", "marketing analytics",
  "data analysis", "excel", "advanced excel", "google sheets", "dashboards",
  "reporting", "data visualization", "attribution modeling",
  "conversion tracking", "google tag manager", "gtm", "sql", "kpis", "roi analysis"
];

/**
 * Project & Marketing Operations Skills
 */
const PROJECT_MANAGEMENT_SKILLS = [
  "project management", "marketing project management", "campaign planning",
  "campaign execution", "roadmap planning", "marketing operations",
  "resource planning", "stakeholder management", "timeline management",
  "agile marketing", "scrum", "kanban", "workflow management", "budget management"
];

/**
 * AI & Automation for Marketing Skills
 */
const AI_MARKETING_SKILLS = [
  "chatgpt", "gpt", "prompt engineering", "ai prompting", "generative ai",
  "ai content creation", "ai copywriting", "claude ai", "jasper ai", "midjourney",
  "dalle", "adobe firefly", "canva ai", "runway", "pictory", "synthesia",
  "marketing automation", "zapier", "make", "generative engine optimization", "geo"
];

/**
 * Pillar definitions with their skill lists
 */
const PILLAR_DEFINITIONS = {
  'foundations': {
    name: 'Foundations & Narratives',
    skills: FOUNDATION_SKILLS
  },
  'strategy': {
    name: 'Strategy & Growth Execution',
    skills: STRATEGY_SKILLS
  },
  'analytics': {
    name: 'Analytics & Data',
    skills: ANALYTICS_SKILLS
  },
  'project-management': {
    name: 'Project & Marketing Operations',
    skills: PROJECT_MANAGEMENT_SKILLS
  },
  'ai': {
    name: 'AI & Automation for Marketing',
    skills: AI_MARKETING_SKILLS
  }
};

/**
 * Match a single user skill to a pillar
 * Returns the pillar key if match found, null otherwise
 * 
 * @param {string} userSkill - Normalized user skill
 * @param {string[]} pillarSkills - Array of known skills for a pillar
 * @returns {boolean} True if skill matches this pillar
 */
function matchSkillToPillar(userSkill, pillarSkills) {
  for (const knownSkill of pillarSkills) {
    // Bidirectional contains matching
    if (userSkill.includes(knownSkill) || knownSkill.includes(userSkill)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect which pillars a user has based on their skills
 * Each skill maps to only ONE pillar (first match wins)
 * Each pillar is counted only ONCE even if multiple skills match it
 * 
 * @param {string[]} userSkills - Array of normalized user skills
 * @returns {Set<string>} Set of pillar keys detected
 */
export function detectPillars(userSkills) {
  const detectedPillars = new Set();
  
  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return detectedPillars;
  }
  
  // Process each user skill
  for (const userSkill of userSkills) {
    if (!userSkill || typeof userSkill !== 'string') {
      continue;
    }
    
    const normalizedSkill = userSkill.toLowerCase().trim();
    
    // Check each pillar (in order)
    for (const [pillarKey, pillarDef] of Object.entries(PILLAR_DEFINITIONS)) {
      // Skip if this pillar is already detected
      if (detectedPillars.has(pillarKey)) {
        continue;
      }
      
      // Check if skill matches this pillar
      if (matchSkillToPillar(normalizedSkill, pillarDef.skills)) {
        detectedPillars.add(pillarKey);
        break; // One skill maps to only one pillar
      }
    }
  }
  
  return detectedPillars;
}

/**
 * Get human-readable pillar names
 * 
 * @param {Set<string>|string[]} pillarKeys - Set or array of pillar keys
 * @returns {string[]} Array of human-readable pillar names
 */
export function getPillarNames(pillarKeys) {
  const pillars = Array.from(pillarKeys);
  return pillars
    .map(key => PILLAR_DEFINITIONS[key]?.name)
    .filter(name => name !== undefined);
}

/**
 * Get all pillar keys
 * 
 * @returns {string[]} Array of all pillar keys
 */
export function getAllPillarKeys() {
  return Object.keys(PILLAR_DEFINITIONS);
}

/**
 * Get pillar definition
 * 
 * @param {string} pillarKey - Pillar key
 * @returns {object|null} Pillar definition or null
 */
export function getPillarDefinition(pillarKey) {
  return PILLAR_DEFINITIONS[pillarKey] || null;
}







