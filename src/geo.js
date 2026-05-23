import * as THREE from "three";
import * as topojson from "topojson-client";
import earcut from "earcut";

import { COUNTRIES, colorForCountry } from "./countries.js";

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LAND_RADIUS   = 1.002;
const BORDER_RADIUS = 1.005;

export const COLORS = {
  correct: new THREE.Color("#22c55e"),
  wrong:   new THREE.Color("#dc2626"),
  reveal:  new THREE.Color("#f59e0b"),
  hover:   new THREE.Color("#ffffff"),
};

export function latLngToVec3(lat, lng, radius = 1) {
  const phi = (lat * Math.PI) / 180;
  const lam = (lng * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.cos(lam),
    radius * Math.sin(phi),
    -radius * cosPhi * Math.sin(lam),
  );
}

function padIso(id) {
  const s = String(id);
  return s.length >= 3 ? s : s.padStart(3, "0");
}

function polygonToGeometry(rings, radius) {
  const flat = [];
  const holeIndices = [];
  let cursor = 0;
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    const len = ring.length > 1 &&
      ring[0][0] === ring[ring.length - 1][0] &&
      ring[0][1] === ring[ring.length - 1][1]
        ? ring.length - 1
        : ring.length;
    if (r > 0) holeIndices.push(cursor);
    for (let i = 0; i < len; i++) {
      flat.push(ring[i][0], ring[i][1]);
      cursor++;
    }
  }
  const triangles = earcut(flat, holeIndices, 2);
  if (triangles.length === 0) return null;
  const vertexCount = flat.length / 2;
  const positions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount; i++) {
    const lng = flat[i * 2];
    const lat = flat[i * 2 + 1];
    const v = latLngToVec3(lat, lng, radius);
    positions[i * 3 + 0] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setIndex(triangles);
  geom.computeVertexNormals();
  return geom;
}

function ringToLinePositions(ring, radius, segmentMaxDeg = 2) {
  const out = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i];
    const b = ring[i + 1];
    const dLng = b[0] - a[0];
    const dLat = b[1] - a[1];
    const dist = Math.hypot(dLng, dLat);
    const steps = Math.max(1, Math.ceil(dist / segmentMaxDeg));
    for (let s = 0; s < steps; s++) {
      const t0 = s / steps;
      const t1 = (s + 1) / steps;
      const p0 = latLngToVec3(a[1] + dLat * t0, a[0] + dLng * t0, radius);
      const p1 = latLngToVec3(a[1] + dLat * t1, a[0] + dLng * t1, radius);
      out.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
    }
  }
  return out;
}

// Find the largest polygon of a country (by ring vertex count) and return
// a {lat, lng} representing roughly its centroid. Good enough for flag pole.
function approximateCentroid(polygons) {
  let bestRing = null;
  let bestLen = -1;
  for (const rings of polygons) {
    const outer = rings[0];
    if (outer && outer.length > bestLen) {
      bestLen = outer.length;
      bestRing = outer;
    }
  }
  if (!bestRing) return { lat: 0, lng: 0 };
  let sx = 0, sy = 0, n = 0;
  for (const [lng, lat] of bestRing) { sx += lng; sy += lat; n++; }
  return { lng: sx / n, lat: sy / n };
}

export async function loadCountries() {
  const resp = await fetch(TOPO_URL);
  if (!resp.ok) throw new Error(`Failed to fetch country data: HTTP ${resp.status}`);
  const topo = await resp.json();
  const fc = topojson.feature(topo, topo.objects.countries);

  const countriesGroup = new THREE.Group();
  countriesGroup.name = "countries";
  const bordersGroup = new THREE.Group();
  bordersGroup.name = "borders";

  // iso(3-digit) → { meshes, material, baseColor, centroid, name, tier }
  const byIso = new Map();

  for (const feature of fc.features) {
    const iso = padIso(feature.id);
    if (!COUNTRIES[iso]) continue;

    const meta = COUNTRIES[iso];
    const baseColor = new THREE.Color(colorForCountry(iso));
    // Country meshes are invisible by default — the realistic Earth texture
    // shows through. Hover/flash bring opacity up briefly. Mesh stays
    // raycastable while transparent so picking still works.
    const material = new THREE.MeshBasicMaterial({
      color: baseColor.clone(),
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const meshes = [];
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    const borderPositions = [];

    for (const rings of polygons) {
      const geom = polygonToGeometry(rings, LAND_RADIUS);
      if (!geom) continue;
      const mesh = new THREE.Mesh(geom, material);
      mesh.userData = { iso, name: meta.name_en };
      mesh.renderOrder = 1;
      countriesGroup.add(mesh);
      meshes.push(mesh);

      for (const ring of rings) {
        const pts = ringToLinePositions(ring, BORDER_RADIUS, 2);
        for (let i = 0; i < pts.length; i++) borderPositions.push(pts[i]);
      }
    }

    if (borderPositions.length > 0) {
      const bgeom = new THREE.BufferGeometry();
      bgeom.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(borderPositions), 3),
      );
      const bmat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(bgeom, bmat);
      lines.renderOrder = 2;
      bordersGroup.add(lines);
    }

    const centroid = approximateCentroid(polygons);

    byIso.set(iso, {
      meshes,
      material,
      baseColor,
      centroid,
      name: meta.name_en,
      tier: meta.tier,
    });
  }

  return { countriesGroup, bordersGroup, byIso };
}
