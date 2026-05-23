import * as THREE from "three";
import { COUNTRIES } from "./countries.js";

// Lazy-load flag PNGs from flagcdn.com and return THREE.Texture.
// Results are cached so each flag is only fetched once.

const FLAG_BASE = "https://flagcdn.com/w160";
const cache = new Map(); // iso(3) → Promise<THREE.Texture | null>

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

export function getFlagTexture(iso) {
  if (cache.has(iso)) return cache.get(iso);

  const meta = COUNTRIES[iso];
  if (!meta || !meta.iso2) {
    const p = Promise.resolve(null);
    cache.set(iso, p);
    return p;
  }

  const url = `${FLAG_BASE}/${meta.iso2}.png`;
  const promise = new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      () => {
        console.warn(`Flag missing for ${iso} (${meta.iso2})`);
        resolve(null);
      },
    );
  });
  cache.set(iso, promise);
  return promise;
}
