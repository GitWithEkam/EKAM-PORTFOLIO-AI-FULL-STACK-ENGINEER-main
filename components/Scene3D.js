'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Tech / AI tokens floating in the background (no religious symbols)
const GLYPHS = ['</>', '{ }', 'AI', '\u03BB', '01', '( )', '#', '=>', '[ ]', '&&', '01', '</>'];

function makeGlyphTexture(glyph) {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const isLong = glyph.length > 2;
  ctx.font = `bold ${isLong ? 92 : 150}px "Noto Sans Gurmukhi", "Space Grotesk", system-ui, sans-serif`;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 16;
  ctx.fillText(glyph, size / 2, size / 2 + 6);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

export default function Scene3D({ theme }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getSize = () => ({ w: mount.clientWidth || window.innerWidth, h: mount.clientHeight || window.innerHeight });
    let { w, h } = getSize();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const p1 = new THREE.PointLight(0xffffff, 1.9);
    p1.position.set(9, 9, 9);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xffffff, 1.4);
    p2.position.set(-9, -7, -3);
    scene.add(p2);

    const group = new THREE.Group();
    scene.add(group);

    // ---- Neural / AI tech constellation ----
    const NODES = 46;
    const nodePos = [];
    for (let i = 0; i < NODES; i++) {
      nodePos.push(new THREE.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 11, -1 - Math.random() * 6));
    }
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePos);
    const nodeMat = new THREE.PointsMaterial({ size: 0.16, color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodes);

    const linePts = [];
    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        if (nodePos[i].distanceTo(nodePos[j]) < 3.4) {
          linePts.push(nodePos[i].x, nodePos[i].y, nodePos[i].z, nodePos[j].x, nodePos[j].y, nodePos[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ---- Floating glyph sprites (Punjab + tech) ----
    const sprites = [];
    const spritePositions = [
      [-5, 2.5, -1], [5.2, 1.8, -2], [3.5, -2.4, -1.5], [-4.5, -2, -2],
      [6, -0.5, -3], [-6.2, 0.2, -2.5], [1.5, 3.2, -2], [-2, -3, -1.5],
      [4.5, 3, -3], [-3.5, 3.2, -2.5], [2.5, -3.2, -2], [0, -1, -4],
    ];
    spritePositions.forEach((pp, i) => {
      const glyph = GLYPHS[i % GLYPHS.length];
      const tex = makeGlyphTexture(glyph);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false });
      const sp = new THREE.Sprite(mat);
      sp.position.set(pp[0], pp[1], pp[2]);
      const sc = glyph.length > 2 ? 1.6 : 1.25;
      sp.scale.set(sc, sc, sc);
      sp.userData = { phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.6, baseY: pp[1], baseX: pp[0] };
      group.add(sp);
      sprites.push({ sp, tex });
    });

    // ---- Subtle wireframe shapes for tech depth ----
    const shapeDefs = [
      { g: new THREE.IcosahedronGeometry(1, 1), p: [-3, 1, -3], s: 1.1 },
      { g: new THREE.OctahedronGeometry(1, 0), p: [4, -1.5, -3.5], s: 0.9 },
      { g: new THREE.TorusGeometry(0.8, 0.18, 16, 60), p: [2, 2, -4], s: 1.0 },
    ];
    const shapes = [];
    shapeDefs.forEach((d) => {
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x000000, emissiveIntensity: 0.25, roughness: 0.2, metalness: 0.6, wireframe: true, transparent: true, opacity: 0.5 });
      const m = new THREE.Mesh(d.g, mat);
      m.position.set(d.p[0], d.p[1], d.p[2]);
      m.scale.setScalar(d.s);
      m.userData = { speed: 0.4 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2, baseY: d.p[1] };
      group.add(m);
      shapes.push({ m, mat, g: d.g });
    });

    // ---- Starfield ----
    const sCount = 1100;
    const sArr = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      sArr[i * 3] = (Math.random() - 0.5) * 150;
      sArr[i * 3 + 1] = (Math.random() - 0.5) * 150;
      sArr[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sArr, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff, transparent: true, opacity: 0.55 });
    const stars = new THREE.Points(sGeo, starMat);
    scene.add(stars);

    // ---- Interaction ----
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const tm = clock.getElapsedTime();
      sprites.forEach((o) => {
        const u = o.sp.userData;
        o.sp.position.y = u.baseY + Math.sin(tm * u.speed + u.phase) * 0.5;
        o.sp.position.x = u.baseX + Math.cos(tm * u.speed * 0.6 + u.phase) * 0.3;
      });
      shapes.forEach((o) => {
        const u = o.m.userData;
        o.m.rotation.x += 0.004 * u.speed;
        o.m.rotation.y += 0.005 * u.speed;
        o.m.position.y = u.baseY + Math.sin(tm * u.speed + u.phase) * 0.4;
      });
      nodes.rotation.z = tm * 0.01;
      group.rotation.y += (mouse.x * 0.35 - group.rotation.y) * 0.04;
      group.rotation.x += (-mouse.y * 0.22 - group.rotation.x) * 0.04;
      stars.rotation.y = tm * 0.008;
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const s = getSize();
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      renderer.setSize(s.w, s.h);
    };
    window.addEventListener('resize', onResize);

    stateRef.current = { sprites, shapes, nodeMat, lineMat, p1, p2, starMat };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      nodeGeo.dispose();
      lineGeo.dispose();
      sGeo.dispose();
      sprites.forEach((o) => { o.tex.dispose(); o.sp.material.dispose(); });
      shapes.forEach((o) => { o.g.dispose(); o.mat.dispose(); });
      nodeMat.dispose();
      lineMat.dispose();
      starMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const st = stateRef.current;
    if (!st || !st.sprites) return;
    const c = (theme && theme.particles) || ['#FF9A1F', '#FFD24A', '#3B82F6'];
    st.sprites.forEach((o, i) => { o.sp.material.color.set(new THREE.Color(c[i % c.length])); });
    st.shapes.forEach((o, i) => {
      const col = new THREE.Color(c[i % c.length]);
      o.mat.color.copy(col);
      o.mat.emissive.copy(col);
    });
    st.nodeMat.color.set(new THREE.Color(c[0]));
    st.lineMat.color.set(new THREE.Color(c[1] || c[0]));
    st.p1.color.set(new THREE.Color(c[0]));
    st.p2.color.set(new THREE.Color(c[c.length - 1]));
    if (st.starMat) st.starMat.color.set(new THREE.Color((theme && theme.star) || '#ffffff'));
  }, [theme]);

  return <div ref={mountRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }} />;
}
