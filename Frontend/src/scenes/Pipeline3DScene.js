import * as THREE from 'three';

export class Pipeline3DScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stages = [];
    this.particles = [];
    this.animationFrameId = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 850;
    const height = this.container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 5 Architectural Stages along X axis
    const stageNames = ['AWS Station', 'Ingestion Core', 'Physics Check', 'Anomaly Engine', 'Decision Ops'];
    const colors = [0x0ea5e9, 0x06b6d4, 0x10b981, 0xf59e0b, 0x6366f1];

    const spacing = 3.2;
    const startX = -((stageNames.length - 1) * spacing) / 2;

    stageNames.forEach((name, idx) => {
      const x = startX + idx * spacing;
      const color = colors[idx];

      // Stage Ring / Hexagon Geometry
      const ringGeo = new THREE.TorusGeometry(1.1, 0.08, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, 0, 0);
      this.scene.add(ring);
      this.stages.push({ mesh: ring, speed: 0.01 + idx * 0.005 });

      // Core Glass Disc inside
      const discGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.06, 32);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      disc.position.set(x, 0, 0);
      this.scene.add(disc);

      // Connecting pipeline cylinder
      if (idx < stageNames.length - 1) {
        const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, spacing, 8);
        const pipeMat = new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 });
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(x + spacing / 2, 0, 0);
        this.scene.add(pipe);
      }
    });

    // Flowing Telemetry Data Stream Particles
    const particleCount = 40;
    const minX = startX;
    const maxX = startX + (stageNames.length - 1) * spacing;

    for (let i = 0; i < particleCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        minX + Math.random() * (maxX - minX),
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      );
      this.scene.add(pMesh);
      this.particles.push({ mesh: pMesh, minX, maxX, speed: 0.04 + Math.random() * 0.03 });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x64748b, 2.0);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x22d3ee, 2.0);
    dirLight.position.set(5, 10, 10);
    this.scene.add(dirLight);

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    this.animate = this.animate.bind(this);
    this.animate();
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Rotate stage rings
    this.stages.forEach(s => {
      s.mesh.rotation.y += s.speed;
      s.mesh.rotation.x += s.speed * 0.5;
    });

    // Move data particles from left to right
    this.particles.forEach(p => {
      p.mesh.position.x += p.speed;
      if (p.mesh.position.x > p.maxX) {
        p.mesh.position.x = p.minX;
      }
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
