/**
 * Skill Normalization Engine
 * 
 * Handles normalization, alias resolution, and fuzzy matching
 * for free-text user skills to predefined skill categories.
 */

/**
 * Skill alias dictionary for common variations
 */
const SKILL_ALIASES = {
  "ga": "google analytics",
  "ga4": "google analytics",
  "google analytics 4": "google analytics",
  "fb ads": "meta ads",
  "facebook ads": "meta ads",
  "insta ads": "meta ads",
  "ppc": "google ads",
  "chat gpt": "chatgpt",
  "prompting": "prompt engineering",
  "ai prompting": "prompt engineering",
  "gen ai": "generative ai",
  "gtm": "google tag manager",
  "gsheets": "google sheets"
};

/**
 * Normalize a skill string
 * - Convert to lowercase
 * - Remove special characters (keep spaces, letters, numbers)
 * - Trim whitespace
 * 
 * @param {string} skill - Raw skill input from user
 * @returns {string} Normalized skill string
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') {
    return '';
  }
  
  return skill
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special chars, keep alphanumeric and spaces
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .trim();
}

/**
 * Resolve skill aliases to canonical form
 * 
 * @param {string} normalizedSkill - Normalized skill string
 * @returns {string} Canonical skill name (or original if no alias found)
 */
export function resolveAlias(normalizedSkill) {
  // Direct alias match
  if (SKILL_ALIASES[normalizedSkill]) {
    return SKILL_ALIASES[normalizedSkill];
  }
  
  // Check if any alias key is contained in the skill
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    if (normalizedSkill.includes(alias) || alias.includes(normalizedSkill)) {
      return canonical;
    }
  }
  
  return normalizedSkill;
}

/**
 * Fuzzy match a user skill against a known skill
 * Uses simple contains matching (bidirectional)
 * 
 * @param {string} userSkill - Normalized user skill
 * @param {string} knownSkill - Known skill from predefined list
 * @returns {boolean} True if match found
 */
export function fuzzyMatch(userSkill, knownSkill) {
  if (!userSkill || !knownSkill) {
    return false;
  }
  
  const normalizedUser = normalizeSkill(userSkill);
  const normalizedKnown = normalizeSkill(knownSkill);
  
  // Bidirectional contains matching
  return normalizedUser.includes(normalizedKnown) || 
         normalizedKnown.includes(normalizedUser);
}

/**
 * Normalize and process an array of user skills
 * 
 * @param {string[]} userSkills - Array of raw skill strings from user
 * @returns {string[]} Array of normalized, alias-resolved skills
 */
export function processUserSkills(userSkills) {
  if (!Array.isArray(userSkills)) {
    return [];
  }
  
  return userSkills
    .map(skill => {
      const normalized = normalizeSkill(skill);
      if (!normalized) return null;
      return resolveAlias(normalized);
    })
    .filter(skill => skill !== null && skill.length > 0);
}





