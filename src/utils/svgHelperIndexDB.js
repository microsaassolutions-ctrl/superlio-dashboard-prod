import { openDB } from 'idb';

const DB_NAME = 'SVGEditorDB';
const DB_VERSION = 1;
const THEMES_STORE_NAME = 'svg_data';
const THEME_DB_KEY = 'all_svgs';
const THEME_CONFIG_STORE = "theme_config";
const THEME_CONFIG_KEY = 'theme_config_json';

// Initialize DB
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(THEMES_STORE_NAME)) {
        db.createObjectStore(THEMES_STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(THEME_CONFIG_STORE)) {
        db.createObjectStore(THEME_CONFIG_STORE, { keyPath: 'id' });
      }
    },
  });
}
async function fetchAllSVGsFromPublic({themes}) {
  const result = {};
  for (const theme of themes) {
    const folder = theme.name; // e.g., C-07
    const path = `/assets/svgs/${folder}/svg.json`;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to fetch ${path}`);
      const json = await response.json();
      result[folder] = json[folder]; // Extract inner data
    } catch (e) {
      console.warn(`Skipping ${folder}:`, e.message);
    }
  }
  return result;
}

// Save full SVG collection to IndexedDB
async function storeAllSVGs({themes}) {
  const db = await initDB();
  const now = Date.now();
  const eightHours = 8 * 60 * 60 * 1000;
  const record = await db.get(THEMES_STORE_NAME, THEME_DB_KEY);
  if (record?.updatedAt) {
    const lastUpdated = new Date(record.updatedAt).getTime();
    if (now - lastUpdated < eightHours) {
      return record.data; // Return existing data
    }
  }
  const allSVGs = await fetchAllSVGsFromPublic({themes});
  // Save or update in IndexedDB
  await db.put(THEMES_STORE_NAME, { id: THEME_DB_KEY, data: allSVGs, updatedAt: new Date().toISOString() });
  return allSVGs;
}

// Read all SVGs from IndexedDB
async function getStoredSVGs() {
  const db = await initDB();
  const record = await db.get(THEMES_STORE_NAME, THEME_DB_KEY);
  return record?.data || null;
}

// Save Theme config to IndexedDB
async function storeThemeConfig({ theme }) {
  const db = await initDB();
  const now = Date.now();
  const eightHours = 8 * 60 * 60 * 1000;
  const record = await db.get(THEME_CONFIG_STORE, THEME_CONFIG_KEY);
  if (record?.updatedAt) {
    const lastUpdated = new Date(record.updatedAt).getTime();
    if (now - lastUpdated < eightHours) {
      return record.data; // Return existing data
    }
  }
  // Save or update in IndexedDB
  await db.put(THEME_CONFIG_STORE, { id: THEME_CONFIG_KEY, data: theme, updatedAt: new Date().toISOString() });
  return theme;
}

// Read all Theme Config from IndexedDB
async function getStoredThemeConfig() {
  const db = await initDB();
  const record = await db.get(THEME_CONFIG_STORE, THEME_CONFIG_KEY);
  return record?.data || null;
}

export {
  storeAllSVGs,     // => fetch + store all SVGs
  getStoredSVGs,     // => retrieve from IndexedDB
  storeThemeConfig,
  getStoredThemeConfig
};