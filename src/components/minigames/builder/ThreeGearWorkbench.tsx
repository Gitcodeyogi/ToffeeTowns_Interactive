// ThreeGearWorkbench.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Premium Level 4 Pixar-style Workbench in 3D using native Three.js.
// Renders rich 3D brass/copper skeletal cogs on a polished oak table with
// glowing blueprints, cinematic spotlights, and floating ambient particles.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SoundSynth } from '../shared/SoundSynth';

interface ThreeGearWorkbenchProps {
  onWin: () => void;
  onFail: () => void;
}

export const ThreeGearWorkbench: React.FC<ThreeGearWorkbenchProps> = ({ onWin, onFail }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // React state mirroring game scores/slots
  const [score, setScore] = useState(0);
  const [slotsFilled, setSlotsFilled] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const winCallbackRef = useRef(onWin);
  winCallbackRef.current = onWin;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // ── 1. SETUP THREE.JS SCENE ──────────────────────────────────────────────
    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    // Warm rich workshop dark background color with very light mist
    scene.background = new THREE.Color(0x130d0a);
    scene.fog = new THREE.FogExp2(0x130d0a, 0.012);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    // Dynamic cinematic camera position looking down at the workbench cogs
    camera.position.set(0, 9.2, 10.5);
    camera.lookAt(0, -0.9, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── 2. CINEMATIC STUDIO LIGHTING ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.85); // Warm ambient fill
    scene.add(ambientLight);

    // High-intensity warm spot light focused on cogs casting sharp shadows
    const spotLight = new THREE.SpotLight(0xffecd6, 5.0, 30, Math.PI / 3, 0.6, 0.8);
    spotLight.position.set(-3, 12, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.bias = -0.0002;
    scene.add(spotLight);

    // Warm orange rim fill light from the left
    const warmRim = new THREE.DirectionalLight(0xf97316, 0.8);
    warmRim.position.set(-8, 4, -2);
    scene.add(warmRim);

    // Cozy blue window light from the right side
    const blueFill = new THREE.DirectionalLight(0x38bdf8, 0.95);
    blueFill.position.set(8, 4, 3);
    scene.add(blueFill);

    // ── 3. WORKBENCH TABLE (Polished Wood Lacquer) ───────────────────────────
    const tableGeo = new THREE.BoxGeometry(16, 1, 12);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314, // Warm mahogany wood shade
      roughness: 0.45,
      metalness: 0.15,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -1.5, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Glowing Neon Blueprint Plane
    const paperGeo = new THREE.PlaneGeometry(10.5, 7.5);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0x07152e, // Deep blueprint blue
      emissive: 0x050f24,
      roughness: 0.5,
      metalness: 0.1,
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 2;
    paper.position.set(0, -0.99, 0);
    paper.receiveShadow = true;
    scene.add(paper);

    // Draw 3D Grid helper lines on the blueprint schematic spanning the center workspace
    const blueprintGrid = new THREE.GridHelper(10, 20, 0x0ea5e9, 0x0284c7);
    blueprintGrid.position.set(0, -0.985, 0);
    scene.add(blueprintGrid);

    // ── 4. DETAILED MACHINE PEGS ─────────────────────────────────────────────
    const PEG_COUNT = 4;
    const pegPositions = [-2.7, -0.9, 0.9, 2.7];
    const pegMeshes: THREE.Group[] = [];
    const slotState: (number | null)[] = [null, null, null, null]; // Stores index of gear placed on each peg

    pegPositions.forEach((pos) => {
      const pegGroup = new THREE.Group();
      
      // peg brass base collar
      const baseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -0.98;
      base.receiveShadow = true;
      pegGroup.add(base);

      // peg steel cylinder core
      const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.9 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = -0.7;
      core.castShadow = true;
      core.receiveShadow = true;
      pegGroup.add(core);

      // peg gold rounded cap ball
      const capGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.2,
        metalness: 0.8,
        emissive: new THREE.Color(0xfacc15).multiplyScalar(0.3),
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = -0.35;
      pegGroup.add(cap);

      pegGroup.position.x = pos;
      scene.add(pegGroup);
      pegMeshes.push(pegGroup);
    });

    // ── 5. PROCEDURAL DETAILED 3D SKELETAL COG GENERATOR ─────────────────────
    const make3DGear = (size: 'S' | 'M' | 'L', mainColor: number): THREE.Group => {
      const group = new THREE.Group();
      const radius = size === 'S' ? 0.5 : size === 'M' ? 0.95 : 1.4;
      const thickness = 0.2;
      const teeth = size === 'S' ? 8 : size === 'M' ? 12 : 18;

      // Base Materials - super metallic and specular reflective
      const brassMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        roughness: 0.25,
        metalness: 0.75,
        emissive: new THREE.Color(mainColor).clone().multiplyScalar(0.22),
        side: THREE.DoubleSide,
      });

      const spokesMat = new THREE.MeshStandardMaterial({
        color: 0x475569, // dark slate steel spokes
        roughness: 0.35,
        metalness: 0.65,
        side: THREE.DoubleSide,
      });

      // Outer rim loop
      const rimGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32, 1, true);
      const rim = new THREE.Mesh(rimGeo, brassMat);
      rim.castShadow = true;
      rim.receiveShadow = true;
      group.add(rim);

      // Inner rim ring
      const innerRimGeo = new THREE.CylinderGeometry(radius - 0.08, radius - 0.08, thickness, 32, 1, true);
      const innerRim = new THREE.Mesh(innerRimGeo, brassMat);
      group.add(innerRim);

      // Gear teeth (Box extrusions with bevel gaps)
      const toothWidth = size === 'S' ? 0.16 : size === 'M' ? 0.2 : 0.24;
      const toothGeo = new THREE.BoxGeometry(toothWidth, thickness, 0.25);
      for (let i = 0; i < teeth; i++) {
        const tooth = new THREE.Mesh(toothGeo, brassMat);
        const angle = (i * Math.PI * 2) / teeth;
        tooth.position.set(Math.cos(angle) * (radius - 0.05), 0, Math.sin(angle) * (radius - 0.05));
        tooth.rotation.y = -angle;
        tooth.castShadow = true;
        tooth.receiveShadow = true;
        group.add(tooth);
      }

      // Three physical spokes
      const spokeLength = radius - 0.24;
      const spokeGeo = new THREE.BoxGeometry(0.12, thickness - 0.02, spokeLength);
      for (let i = 0; i < 3; i++) {
        const spoke = new THREE.Mesh(spokeGeo, spokesMat);
        const angle = (i * Math.PI * 2) / 3;
        spoke.position.set(Math.cos(angle) * (spokeLength / 2 + 0.1), 0, Math.sin(angle) * (spokeLength / 2 + 0.1));
        spoke.rotation.y = -angle;
        spoke.castShadow = true;
        group.add(spoke);
      }

      // Center core hub collar
      const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, thickness + 0.06, 16);
      const hub = new THREE.Mesh(hubGeo, brassMat);
      hub.castShadow = true;
      group.add(hub);

      // Steel center pin hole grommet
      const ringGeo = new THREE.CylinderGeometry(0.14, 0.14, thickness + 0.08, 16);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.98 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      return group;
    };

    // ── 6. GEAR INVENTORY (SPAWNED resting on workbench) ──────────────────────
    const gearsOnTable: { mesh: THREE.Group; size: 'S' | 'M' | 'L'; radius: number; homePos: THREE.Vector3 }[] = [];
    const gearSpecs: { size: 'S' | 'M' | 'L'; color: number; radius: number }[] = [
      { size: 'S', color: 0xf97316, radius: 0.5 },    // S gear (Orange)
      { size: 'M', color: 0x38bdf8, radius: 0.95 },   // M gear 1 (Cyan)
      { size: 'M', color: 0xa3e635, radius: 0.95 },   // M gear 2 (Lime)
      { size: 'L', color: 0xfacc15, radius: 1.4 },    // L gear (Gold)
    ];

    gearSpecs.forEach((spec, idx) => {
      const gGroup = make3DGear(spec.size, spec.color);
      // Spawn aligned horizontally below each peg
      const homeX = -2.7 + idx * 1.8;
      const homeZ = 3.2;
      gGroup.position.set(homeX, -0.9, homeZ);
      scene.add(gGroup);
      gearsOnTable.push({
        mesh: gGroup,
        size: spec.size,
        radius: spec.radius,
        homePos: new THREE.Vector3(homeX, -0.9, homeZ),
      });
    });

    // Purple drive motor (static on left)
    const driveMotor = make3DGear('L', 0xa855f7);
    driveMotor.position.set(-4.5, -0.9, 0);
    scene.add(driveMotor);

    // Green output spindle (static on right)
    const spindleOut = make3DGear('M', 0x10b981);
    spindleOut.position.set(4.5, -0.9, 0);
    scene.add(spindleOut);

    // ── 7. AMBIENT WARM SUN PARTICLES (Cozy Atmosphere) ───────────────────────
    const particleCount = 20;
    const particleGeometry = new THREE.SphereGeometry(0.04, 6, 6);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.35,
    });
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeometry, particleMaterial);
      p.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * 5 - 1.2,
        (Math.random() - 0.5) * 8
      );
      scene.add(p);
      particles.push(p);
    }

    // ── 8. WIN SPARKS GENERATOR ──────────────────────────────────────────────
    const sparkCount = 30;
    const sparkGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const sparksGroup = new THREE.Group();
    scene.add(sparksGroup);

    const sparkVelocities: THREE.Vector3[] = [];
    for (let i = 0; i < sparkCount; i++) {
      const s = new THREE.Mesh(sparkGeometry, sparkMaterial);
      s.visible = false;
      sparksGroup.add(s);
      sparkVelocities.push(new THREE.Vector3());
    }

    const triggerSparks = (pos: THREE.Vector3) => {
      SoundSynth.playBell();
      sparksGroup.children.forEach((sMesh, i) => {
        sMesh.position.copy(pos);
        sMesh.visible = true;
        // Explode outward radially
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.12;
        sparkVelocities[i].set(
          Math.cos(angle) * speed,
          0.05 + Math.random() * 0.1,
          Math.sin(angle) * speed
        );
      });
    };

    // Check contact-based chain connection
    const checkChainConnected = () => {
      // 1. Check Peg 1 (must have gear touching the drive motor)
      const idx1 = slotState[0];
      if (idx1 === null) return false;
      const g1 = gearsOnTable[idx1];
      // Drive motor is L (1.4 radius) at -4.5. Peg 1 is at -2.7. Distance is 1.8.
      if (1.4 + g1.radius < 1.75) return false;

      // 2. Check Peg 1 to Peg 2 (distance 1.8)
      const idx2 = slotState[1];
      if (idx2 === null) return false;
      const g2 = gearsOnTable[idx2];
      if (g1.radius + g2.radius < 1.75) return false;

      // 3. Check Peg 2 to Peg 3 (distance 1.8)
      const idx3 = slotState[2];
      if (idx3 === null) return false;
      const g3 = gearsOnTable[idx3];
      if (g2.radius + g3.radius < 1.75) return false;

      // 4. Check Peg 3 to Peg 4 (distance 1.8)
      const idx4 = slotState[3];
      if (idx4 === null) return false;
      const g4 = gearsOnTable[idx4];
      if (g3.radius + g4.radius < 1.75) return false;

      // 5. Check Peg 4 to Spindle Out (M: 0.95 radius at 4.5. Peg 4 is at 2.7. Distance is 1.8)
      if (g4.radius + 0.95 < 1.75) return false;

      return true;
    };

    // Helper to update score and victory states
    const updateGameState = () => {
      const count = slotState.filter((v) => v !== null).length;
      setSlotsFilled(count);
      setScore(count * 25);

      if (checkChainConnected()) {
        setIsWon(true);
      }
    };

    // ── 9. DRAG-AND-DROP MOUSE INTERACTION ───────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedGear: typeof gearsOnTable[number] | null = null;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.9); // table height plane
    const intersection = new THREE.Vector3();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      for (const gear of gearsOnTable) {
        const intersects = raycaster.intersectObjects(gear.mesh.children);
        if (intersects.length > 0) {
          selectedGear = gear;
          SoundSynth.playTick();
          // Elevate selected cog slightly off table
          selectedGear.mesh.position.y = -0.4;

          // Clear it from slotState immediately so it can be moved
          const gearIdx = gearsOnTable.indexOf(selectedGear);
          const prevSlotIdx = slotState.indexOf(gearIdx);
          if (prevSlotIdx !== -1) {
            slotState[prevSlotIdx] = null;
            updateGameState();
          }
          break;
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!selectedGear) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        selectedGear.mesh.position.x = intersection.x;
        selectedGear.mesh.position.z = intersection.z;
      }
    };

    const handlePointerUp = () => {
      if (!selectedGear) return;

      // Find closest peg
      let minDst = 1.1;
      let targetPegIdx = -1;

      pegPositions.forEach((pos, idx) => {
        const dst = selectedGear!.mesh.position.distanceTo(new THREE.Vector3(pos, -0.9, 0));
        if (dst < minDst) {
          minDst = dst;
          targetPegIdx = idx;
        }
      });

      const gearIdx = gearsOnTable.indexOf(selectedGear);

      if (targetPegIdx !== -1 && slotState[targetPegIdx] === null) {
        const pos = pegPositions[targetPegIdx];
        selectedGear.mesh.position.set(pos, -0.9, 0);
        slotState[targetPegIdx] = gearIdx;
        SoundSynth.playClink();
        triggerSparks(new THREE.Vector3(pos, -0.6, 0));

        // Start spring bounce damping on peg entry
        selectedGear.mesh.userData = { bouncing: true, bounceVel: 0.08, gravity: 0.016 };
      } else {
        // Return to tray
        selectedGear.mesh.position.copy(selectedGear.homePos);
        SoundSynth.playThud();
      }

      selectedGear = null;
      updateGameState();
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerup', handlePointerUp);

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── 10. ANIMATION LOOP ───────────────────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Drift ambient dust particles gently
      particles.forEach((p, idx) => {
        p.position.y += Math.sin(elapsed + idx) * 0.003;
        p.position.x += Math.cos(elapsed * 0.5 + idx) * 0.002;
        if (p.position.y > 4) p.position.y = -1.2;
      });

      // Animate explosion sparks if active
      sparksGroup.children.forEach((sMesh, i) => {
        if (sMesh.visible) {
          sMesh.position.add(sparkVelocities[i]);
          sparkVelocities[i].y -= 0.008; // gravity
          sMesh.scale.multiplyScalar(0.94); // shrink size
          if (sMesh.scale.x < 0.05) {
            sMesh.visible = false;
            sMesh.scale.set(1, 1, 1);
          }
        }
      });

      // Handle bounce damping equations on drops
      gearsOnTable.forEach(g => {
        if (g.mesh.userData.bouncing) {
          const ud = g.mesh.userData;
          g.mesh.position.y += ud.bounceVel;
          ud.bounceVel -= ud.gravity;
          if (g.mesh.position.y <= -0.9) {
            g.mesh.position.y = -0.9;
            if (Math.abs(ud.bounceVel) < 0.015) {
              ud.bouncing = false;
            } else {
              ud.bounceVel = -ud.bounceVel * 0.35; // bounce damp
            }
          }
        }
      });

      // Rotate active cogs connected to the motor (left-to-right cascade)
      let connectedToMotor = true;
      driveMotor.rotation.y = elapsed * 1.5;

      const slot1 = slotState[0];
      if (slot1 !== null && connectedToMotor) {
        const gear1 = gearsOnTable[slot1];
        const ratio1 = gear1.size === 'S' ? 2.2 : gear1.size === 'M' ? 1.4 : 0.9;
        gear1.mesh.rotation.y = -elapsed * 1.5 * ratio1;

        const slot2 = slotState[1];
        if (slot2 !== null) {
          const gear2 = gearsOnTable[slot2];
          if (gear1.radius + gear2.radius >= 1.75) {
            const ratio2 = gear2.size === 'S' ? 2.2 : gear2.size === 'M' ? 1.4 : 0.9;
            gear2.mesh.rotation.y = elapsed * 1.5 * ratio2;

            const slot3 = slotState[2];
            if (slot3 !== null) {
              const gear3 = gearsOnTable[slot3];
              if (gear2.radius + gear3.radius >= 1.75) {
                const ratio3 = gear3.size === 'S' ? 2.2 : gear3.size === 'M' ? 1.4 : 0.9;
                gear3.mesh.rotation.y = -elapsed * 1.5 * ratio3;

                const slot4 = slotState[3];
                if (slot4 !== null) {
                  const gear4 = gearsOnTable[slot4];
                  if (gear3.radius + gear4.radius >= 1.75) {
                    const ratio4 = gear4.size === 'S' ? 2.2 : gear4.size === 'M' ? 1.4 : 0.9;
                    gear4.mesh.rotation.y = elapsed * 1.5 * ratio4;

                    if (gear4.radius + 0.95 >= 1.75) {
                      spindleOut.rotation.y = -elapsed * 1.5 * 1.4;
                    }
                  } else {
                    connectedToMotor = false;
                  }
                }
              } else {
                connectedToMotor = false;
              }
            }
          } else {
            connectedToMotor = false;
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── 11. CLEANUP SCENE MESHES ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      tableGeo.dispose();
      tableMat.dispose();
      paperGeo.dispose();
      paperMat.dispose();
      blueprintGrid.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
    };
  }, []);

  // Win callback trigger
  useEffect(() => {
    if (isWon) {
      setTimeout(() => {
        winCallbackRef.current();
      }, 2500);
    }
  }, [isWon]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex flex-col justify-between overflow-hidden rounded-[2rem]">
      {/* Dynamic scoreboard HUD integrated into board design */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 p-3 rounded-2xl bg-black/60 border border-white/10 select-none pointer-events-none font-brand">
        <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block">ROWAN'S BLUEPRINT WORKBENCH</span>
        <div className="flex gap-4 items-center mt-1">
          <div className="flex flex-col">
            <span className="text-[18px] text-white font-black font-mono leading-none">{score}</span>
            <span className="text-[7.5px] uppercase tracking-wider text-white/50">TALLY</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[18px] text-yellow-400 font-black font-mono leading-none">{slotsFilled}/4</span>
            <span className="text-[7.5px] uppercase tracking-wider text-white/50">PINS</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {isWon && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-950/85 pointer-events-none animate-fade-in text-center font-brand">
          <p className="text-5xl animate-bounce">🔔</p>
          <h2 className="text-3xl text-emerald-400 font-bold mt-3 uppercase tracking-wider">MECHANISM ENGAGED!</h2>
          <p className="text-white/60 text-sm mt-1 max-w-xs leading-relaxed font-sans">The church bell assembly hums smoothly. Mill power restored.</p>
        </div>
      )}
    </div>
  );
};
