// src/utils/deviceUtils.js
/**
 * Gets or creates a unique device identifier
 * @param {string} storageKey - Key to use in localStorage
 * @returns {string} Device identifier
 */
export const getDeviceId = (storageKey = 'emojiCipher_deviceId') => {
    let id = localStorage.getItem(storageKey);
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(storageKey, id);
    }
    return id;
  };