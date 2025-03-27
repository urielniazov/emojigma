/**
 * Splits a string containing complex emoji sequences correctly
 * This handles emojis that consist of multiple code points like 🧙‍♀️
 * @param {string} str - String containing emojis to split
 * @returns {string[]} - Array of properly separated emojis
 */
export const splitEmojiString = (str) => {
    // Use the Grapheme Cluster breaking algorithm via Intl.Segmenter if available
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      const segments = segmenter.segment(str);
      return Array.from(segments).map(s => s.segment);
    }
    
    // Fallback for browsers without Intl.Segmenter
    // This regex pattern attempts to match emoji sequences, but is not perfect
    const emojiRegex = /\p{Emoji}(\p{Emoji_Modifier}|\u200D\p{Emoji})*\uFE0F?/gu;
    return Array.from(str.match(emojiRegex) || []);
  };