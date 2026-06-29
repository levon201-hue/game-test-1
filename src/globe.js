import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { loadCountries, COLORS, latLngToVec3 } from "./geo.js";
import { getFlagTexture } from "./flags.js";

const OCEAN_RADIUS = 1.0;
const FLAG_POLE_BASE = 1.01;

// Realistic Earth diffuse texture (NASA / Three.js examples — stable hosting).
const EARTH_TEX_URL = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

export async function createGlobe(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0.5, 3.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Earth sphere uses MeshBasicMaterial so the diffuse texture renders at full
  // brightness on every angle — no half-shadowed hemisphere. Atmosphere glow
  // (added below) supplies the 3D feel.
  const earthMat = new THREE.MeshBasicMaterial({ color: 0x1a3548 });
  const earthSphere = new THREE.Mesh(
    new THREE.SphereGeometry(OCEAN_RADIUS, 96, 96),
    earthMat,
  );
  scene.add(earthSphere);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(
    EARTH_TEX_URL,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      earthMat.map = tex;
      earthMat.color.set(0xffffff);
      earthMat.needsUpdate = true;
    },
    undefined,
    (err) => console.warn("Earth texture failed; falling back to flat ocean.", err),
  );

  // Warm atmosphere glow ring
  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(0xa3cffb) } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 uColor;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        gl_FragColor = vec4(uColor, 1.0) * intensity * 0.7;
      }`,
  });
  const glow = new THREE.Mesh(new THREE.SphereGeometry(1.20, 64, 64), glowMat);
  scene.add(glow);

  scene.add(makeStars(1400));

  const { countriesGroup, bordersGroup, byIso } = await loadCountries();
  scene.add(countriesGroup);
  scene.add(bordersGroup);

  // Flags container — render after everything so they always sit on top.
  const flagsGroup = new THREE.Group();
  flagsGroup.name = "flags";
  flagsGroup.renderOrder = 10;
  scene.add(flagsGroup);
  const flagByIso = new Map();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.55;
  controls.minDistance = 1.6;
  controls.maxDistance = 6.5;
  controls.zoomSpeed = 0.6;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  let userHasInteracted = false;
  const stopAutoRotate = () => {
    if (userHasInteracted) return;
    userHasInteracted = true;
    controls.autoRotate = false;
  };
  controls.addEventListener("start", stopAutoRotate);

  let hoveredIso = null;
  const lockedIsos = new Set();

  // Hover and flash use the country mesh's opacity + tint, since the mesh is
  // transparent over the Earth texture in the resting state.
  function setHover(iso, on) {
    const entry = byIso.get(iso);
    if (!entry) return;
    if (on) {
      entry.material.color.set(0xffffff);
      entry.material.opacity = 0.28;
    } else {
      entry.material.color.copy(entry.baseColor);
      entry.material.opacity = 0.0;
    }
  }

  function pickIsoFromPointer(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(countriesGroup.children, false);
    return hits.length > 0 ? hits[0].object.userData.iso : null;
  }

  function onPointerMove(e) {
    if (e.pointerType === "touch") return;
    const iso = pickIsoFromPointer(e.clientX, e.clientY);
    if (iso === hoveredIso) return;
    if (hoveredIso && !lockedIsos.has(hoveredIso)) setHover(hoveredIso, false);
    hoveredIso = iso;
    if (iso && !lockedIsos.has(iso)) setHover(iso, true);
  }
  renderer.domElement.addEventListener("pointermove", onPointerMove);

  function flashCountry(iso, color, durationMs = 800) {
    const entry = byIso.get(iso);
    if (!entry) return null;
    lockedIsos.add(iso);
    entry.material.color.copy(color);
    entry.material.opacity = 0.65;
    return setTimeout(() => {
      entry.material.color.copy(entry.baseColor);
      entry.material.opacity = hoveredIso === iso ? 0.28 : 0.0;
      if (hoveredIso === iso) entry.material.color.set(0xffffff);
      lockedIsos.delete(iso);
    }, durationMs);
  }

  // Smoothly rotate the camera so the given country faces the viewer, with a
  // slight zoom-in for emphasis when transitioning between questions.
  function focusOnCountry(iso, opts = {}) {
    const entry = byIso.get(iso);
    if (!entry) return;
    controls.autoRotate = false;
    const { lat, lng } = entry.centroid;
    const currentDist = camera.position.length();
    const targetDist = opts.zoom ?? Math.max(2.4, Math.min(currentDist, 2.8));
    const target = latLngToVec3(lat, lng, targetDist);
    const start = camera.position.clone();
    const dur = opts.duration ?? 900;
    const t0 = performance.now();
    function step() {
      const e = Math.min(1, (performance.now() - t0) / dur);
      const k = 1 - Math.pow(1 - e, 3);
      camera.position.lerpVectors(start, target, k);
      camera.lookAt(0, 0, 0);
      controls.update();
      if (e < 1) requestAnimationFrame(step);
    }
    step();
  }

  async function plantFlag(iso) {
    if (flagByIso.has(iso)) return;
    const entry = byIso.get(iso);
    if (!entry) return;
    const tex = await getFlagTexture(iso);
    if (!tex) return;

    const group = new THREE.Group();
    group.renderOrder = 11;
    const basePos = latLngToVec3(entry.centroid.lat, entry.centroid.lng, FLAG_POLE_BASE);
    group.position.copy(basePos);

    const radial = basePos.clone().normalize();
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), radial);

    const poleH = 0.085;
    const poleGeom = new THREE.CylinderGeometry(0.0018, 0.0018, poleH, 8);
    const poleMat = new THREE.MeshBasicMaterial({ color: 0x111111, depthTest: true });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.y = poleH / 2;
    pole.renderOrder = 11;
    group.add(pole);

    // Small sphere at the top of the pole (knob)
    const knobGeom = new THREE.SphereGeometry(0.003, 8, 8);
    const knob = new THREE.Mesh(knobGeom, new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
    knob.position.y = poleH;
    knob.renderOrder = 11;
    group.add(knob);

    const flagW = 0.075;
    const flagH = 0.050;
    const flagGeom = new THREE.PlaneGeometry(flagW, flagH);
    const flagMat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: false,
      depthTest: true,
    });
    const flag = new THREE.Mesh(flagGeom, flagMat);
    flag.position.set(flagW / 2 + 0.002, poleH - flagH / 2 - 0.004, 0);
    flag.renderOrder = 12;
    group.add(flag);

    // White outline behind the flag so light-colored flags read against the Earth
    const backGeom = new THREE.PlaneGeometry(flagW + 0.004, flagH + 0.004);
    const backMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, side: THREE.DoubleSide });
    const back = new THREE.Mesh(backGeom, backMat);
    back.position.set(flagW / 2 + 0.002, poleH - flagH / 2 - 0.004, -0.0005);
    back.renderOrder = 11;
    group.add(back);

    group.scale.setScalar(0.001);
    flagsGroup.add(group);
    flagByIso.set(iso, group);

    const t0 = performance.now();
    function grow() {
      const e = Math.min(1, (performance.now() - t0) / 380);
      const k = 1 - Math.pow(1 - e, 3);
      group.scale.setScalar(k);
      if (e < 1) requestAnimationFrame(grow);
    }
    grow();
  }

  function clearFlags() {
    for (const group of flagByIso.values()) {
      flagsGroup.remove(group);
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose?.();
      });
    }
    flagByIso.clear();
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  return {
    scene, camera, renderer, controls, byIso,
    pickIsoFromPointer, flashCountry, focusOnCountry, plantFlag, clearFlags,
    render, resize,
    get plantedIsos() { return new Set(flagByIso.keys()); },
    get isInteracted() { return userHasInteracted; },
  };
}

function makeStars(count) {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 30 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  return new THREE.Points(geom, mat);
}
