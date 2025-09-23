/**
 * Scriptsetu - Indian Script Transliterator
 * 
 * This module provides transliteration functionality between various Indian scripts.
 * It follows the Unicode standard for mapping characters between scripts.
 * 
 * Supported Scripts:
 * - Devanagari (Hindi, Marathi, etc.)
 * - Bengali
 * - Tamil
 * - Telugu
 * - Malayalam
 * - Kannada
 * - Gujarati
 * - Punjabi (Gurmukhi)
 * - Oriya
 * - Assamese
 */

// Unicode ranges for Indian scripts
const SCRIPT_RANGES = {
  DEVANAGARI: { start: 0x0900, end: 0x097F },
  BENGALI: { start: 0x0980, end: 0x09FF },
  GURMUKHI: { start: 0x0A00, end: 0x0A7F },
  GUJARATI: { start: 0x0A80, end: 0x0AFF },
  ORIYA: { start: 0x0B00, end: 0x0B7F },
  TAMIL: { start: 0x0B80, end: 0x0BFF },
  TELUGU: { start: 0x0C00, end: 0x0C7F },
  KANNADA: { start: 0x0C80, end: 0x0CFF },
  MALAYALAM: { start: 0x0D00, end: 0x0D7F },
  SINHALA: { start: 0x0D80, end: 0x0DFF },
  ASSAMESE: { start: 0x0980, end: 0x09FF }, // Same as Bengali with some variations
};

// Mapping tables for transliteration
// These are simplified mappings for demonstration purposes
// In a production app, you would use more comprehensive mapping tables

const DEVANAGARI_TO_TAMIL_MAP = {
  // Vowels
  '\u0905': '\u0B85', // अ -> அ
  '\u0906': '\u0B86', // आ -> ஆ
  '\u0907': '\u0B87', // इ -> இ
  '\u0908': '\u0B88', // ई -> ஈ
  '\u0909': '\u0B89', // उ -> உ
  '\u090A': '\u0B8A', // ऊ -> ஊ
  '\u090F': '\u0B8E', // ए -> எ
  '\u0910': '\u0B8F', // ऐ -> ஏ
  '\u0913': '\u0B92', // ओ -> ஒ
  '\u0914': '\u0B93', // औ -> ஓ
  
  // Consonants
  '\u0915': '\u0B95', // क -> க
  '\u0916': '\u0B95\u0BCD\u0BB9', // ख -> க்ஹ
  '\u0917': '\u0B95', // ग -> க (simplified)
  '\u0918': '\u0B95', // घ -> க (simplified)
  '\u0919': '\u0B99', // ङ -> ங
  
  '\u091A': '\u0B9A', // च -> ச
  '\u091B': '\u0B9A', // छ -> ச (simplified)
  '\u091C': '\u0B9C', // ज -> ஜ
  '\u091D': '\u0B9C', // झ -> ஜ (simplified)
  '\u091E': '\u0B9E', // ञ -> ஞ
  
  '\u091F': '\u0B9F', // ट -> ட
  '\u0920': '\u0B9F', // ठ -> ட (simplified)
  '\u0921': '\u0BA1', // ड -> ட
  '\u0922': '\u0BA1', // ढ -> ட (simplified)
  '\u0923': '\u0BA3', // ण -> ண
  
  '\u0924': '\u0BA4', // त -> த
  '\u0925': '\u0BA4', // थ -> த (simplified)
  '\u0926': '\u0BA6', // द -> த
  '\u0927': '\u0BA6', // ध -> த (simplified)
  '\u0928': '\u0BA8', // न -> ந
  
  '\u092A': '\u0BAA', // प -> ப
  '\u092B': '\u0BAA', // फ -> ப (simplified)
  '\u092C': '\u0BAC', // ब -> ப
  '\u092D': '\u0BAC', // भ -> ப (simplified)
  '\u092E': '\u0BAE', // म -> ம
  
  '\u092F': '\u0BAF', // य -> ய
  '\u0930': '\u0BB0', // र -> ர
  '\u0932': '\u0BB2', // ल -> ல
  '\u0935': '\u0BB5', // व -> வ
  '\u0938': '\u0BB8', // स -> ஸ
  '\u0939': '\u0BB9', // ह -> ஹ
};

const TAMIL_TO_DEVANAGARI_MAP = {
  // Reverse mapping for Tamil to Devanagari
  '\u0B85': '\u0905', // அ -> अ
  '\u0B86': '\u0906', // ஆ -> आ
  '\u0B87': '\u0907', // இ -> इ
  '\u0B88': '\u0908', // ஈ -> ई
  '\u0B89': '\u0909', // உ -> उ
  '\u0B8A': '\u090A', // ஊ -> ऊ
  '\u0B8E': '\u090F', // எ -> ए
  '\u0B8F': '\u0910', // ஏ -> ऐ
  '\u0B92': '\u0913', // ஒ -> ओ
  '\u0B93': '\u0914', // ஓ -> औ
  
  '\u0B95': '\u0915', // க -> क
  '\u0B99': '\u0919', // ங -> ङ
  '\u0B9A': '\u091A', // ச -> च
  '\u0B9E': '\u091E', // ஞ -> ञ
  '\u0B9F': '\u091F', // ட -> ट
  '\u0BA3': '\u0923', // ண -> ण
  '\u0BA4': '\u0924', // த -> त
  '\u0BA8': '\u0928', // ந -> न
  '\u0BAA': '\u092A', // ப -> प
  '\u0BAE': '\u092E', // ம -> म
  '\u0BAF': '\u092F', // ய -> य
  '\u0BB0': '\u0930', // ர -> र
  '\u0BB2': '\u0932', // ல -> ल
  '\u0BB5': '\u0935', // வ -> व
  '\u0BB8': '\u0938', // ஸ -> स
  '\u0BB9': '\u0939', // ஹ -> ह
};

// Add more mapping tables as needed for other script combinations

/**
 * Transliterates text from one Indian script to another
 * @param text The text to transliterate
 * @param fromScript The source script
 * @param toScript The target script
 * @returns The transliterated text
 */
export function transliterateText(
  text: string,
  fromScript: string,
  toScript: string
): string {
  // For demonstration purposes, we'll implement a few script combinations
  // In a real application, you would have comprehensive mapping tables
  
  if (fromScript === 'Devanagari' && toScript === 'Tamil') {
    return transliterateWithMap(text, DEVANAGARI_TO_TAMIL_MAP);
  } else if (fromScript === 'Tamil' && toScript === 'Devanagari') {
    return transliterateWithMap(text, TAMIL_TO_DEVANAGARI_MAP);
  } else {
    // For unsupported combinations, return the original text with a note
    return `[Transliteration from ${fromScript} to ${toScript} not yet implemented] ${text}`;
  }
}

/**
 * Helper function to perform transliteration using a mapping table
 * @param text The text to transliterate
 * @param mapping The character mapping table
 * @returns The transliterated text
 */
function transliterateWithMap(text: string, mapping: Record<string, string>): string {
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // Check if the character exists in our mapping
    if (mapping[char]) {
      result += mapping[char];
    } else {
      // If not found, keep the original character
      result += char;
    }
  }
  
  return result;
}

/**
 * Gets the list of supported Indian scripts
 * @returns Array of supported script names
 */
export function getSupportedScripts(): string[] {
  return [
    'Devanagari (Hindi, Marathi, etc.)',
    'Bengali',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Kannada',
    'Gujarati',
    'Punjabi (Gurmukhi)',
    'Oriya',
    'Assamese',
    'Urdu',
    'Sinhala'
  ];
}

/**
 * Gets the script name from the full description
 * @param fullName The full script description
 * @returns The script name
 */
export function getScriptName(fullName: string): string {
  const scriptNames: Record<string, string> = {
    'Devanagari (Hindi, Marathi, etc.)': 'Devanagari',
    'Bengali': 'Bengali',
    'Tamil': 'Tamil',
    'Telugu': 'Telugu',
    'Malayalam': 'Malayalam',
    'Kannada': 'Kannada',
    'Gujarati': 'Gujarati',
    'Punjabi (Gurmukhi)': 'Gurmukhi',
    'Oriya': 'Oriya',
    'Assamese': 'Assamese',
    'Urdu': 'Urdu',
    'Sinhala': 'Sinhala'
  };
  
  return scriptNames[fullName] || fullName;
}

export default {
  transliterateText,
  getSupportedScripts,
  getScriptName
};