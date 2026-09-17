import * as THREE from 'three';
import { themeManager } from '../services/theme.js';

export class ScrollGlobeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.atmosphere = null;
    this.windParticles = null;
    this.stationGroup = null;
    this.isobarGroup = null;
    this.anomalyGroup = null;
    this.stationPins = [];
    this.animationFrameId = null;

    // Scroll state & interpolation targets
    this.targetScrollProgress = 0;
    this.currentScrollProgress = 0;
    this.scrollEase = 0.05;

    // Camera trajectory keyframes for the 6 stages
    // Stage 0: Global Earth
    // Stage 1: Atmospheric Intelligence (Approaching)
    // Stage 2: AWS Observations (Station Network)
    // Stage 3: Meteorological Parameters (Isobars / Heat contours)
    // Stage 4: Anomaly Detection (Quarantine Beacon on Divergent Station)
    // Stage 5: Platform Transition (Wide Orbital Outro)
    this.keyframes = [
      { progress: 0.0, camPos: new THREE.Vector3(0, 1.5, 14.5), rotY: 0.0, rotX: 0.1, atmosOpacity: 0.7, scale: 1.0, stationOpacity: 0.4, isobarOpacity: 0.0, anomalyOpacity: 0.0 },
      { progress: 0.2, camPos: new THREE.Vector3(2.5, 2.8, 10.5), rotY: 0.75, rotX: 0.25, atmosOpacity: 0.9, scale: 1.05, stationOpacity: 0.7, isobarOpacity: 0.2, anomalyOpacity: 0.0 },
      { progress: 0.4, camPos: new THREE.Vector3(-1.8, 1.2, 8.5), rotY: 1.85, rotX: 0.15, atmosOpacity: 0.6, scale: 1.1, stationOpacity: 1.0, isobarOpacity: 0.5, anomalyOpacity: 0.2 },
      { progress: 0.6, camPos: new THREE.Vector3(1.2, -0.8, 7.8), rotY: 3.2, rotX: -0.1, atmosOpacity: 0.5, scale: 1.15, stationOpacity: 1.0, isobarOpacity: 0.9, anomalyOpacity: 0.4 },
      { progress: 0.8, camPos: new THREE.Vector3(0.5, 0.4, 7.2), rotY: 4.4, rotX: 0.2, atmosOpacity: 0.6, scale: 1.2, stationOpacity: 1.0, isobarOpacity: 0.4, anomalyOpacity: 1.0 },
      { progress: 1.0, camPos: new THREE.Vector3(0, 2.0, 13.0), rotY: 6.28, rotX: 0.1, atmosOpacity: 0.7, scale: 1.0, stationOpacity: 0.8, isobarOpacity: 0.3, anomalyOpacity: 0.3 }
    ];

    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const isDark = themeManager.getTheme() === 'dark';

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.copy(this.keyframes[0].camPos);

    // 2. WebGL Renderer with performance clamping
    const isMobile = window.innerWidth < 768;
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // 3. Earth Core Sphere with procedural landmass & ocean bathymetry texture
    const globeRadius = 4.8;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, isMobile ? 36 : 64, isMobile ? 36 : 64);
    
    // Create scientific surface canvas texture
    const earthCanvas = this.generateEarthTexture(isDark);
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.wrapS = THREE.ClampToEdgeWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: isDark ? 0.75 : 0.85,
      metalness: isDark ? 0.2 : 0.1,
      bumpScale: 0.05
    });

    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.scene.add(this.globe);

    // 4. Latitude / Longitude Scientific Geodetic Grid
    const gridGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 1.008, 24, 18));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0f766e,
      transparent: true,
      opacity: isDark ? 0.15 : 0.12
    });
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.globe.add(gridLines);

    // 5. Atmospheric Fresnel Halo
    const atmosGeometry = new THREE.SphereGeometry(globeRadius * 1.12, isMobile ? 32 : 64, isMobile ? 32 : 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uOpacity;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(uColor, 1.0) * intensity * uOpacity;
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color(isDark ? 0x2dd4bf : 0x0f766e) },
        uOpacity: { value: 0.7 }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.scene.add(this.atmosphere);

    // 6. Global Atmospheric Wind Streams (Particles flowing along vectors)
    const particleCount = isMobile ? 250 : 550;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = globeRadius * 1.03 + (Math.random() * 0.35);

      positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);
      opacities[i] = 0.2 + Math.random() * 0.6;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.1,
      color: isDark ? 0x38bdf8 : 0x0f766e,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.windParticles = new THREE.Points(particleGeometry, particleMaterial);
    this.globe.add(this.windParticles);

    // 7. Ground Station Nodes (Real coordinates: Alps, Pacific Coast, Midwest, Mojave, Taiga, Metro)
    this.stationGroup = new THREE.Group();
    this.globe.add(this.stationGroup);

    const stationData = [
      { lat: 45.8, lon: 6.8, code: 'AWS-101-ALP', name: 'Alpine High Summit', status: 'ONLINE', val: '24.6°C' },
      { lat: 36.6, lon: -121.8, code: 'AWS-204-CST', name: 'Pacific Marine Tower', status: 'ONLINE', val: '19.8°C' },
      { lat: 41.8, lon: -93.0, code: 'AWS-312-PLN', name: 'Midwest Agricultural', status: 'DEGRADED', val: '48.6°C' },
      { lat: 35.0, lon: -115.4, code: 'AWS-408-DSN', name: 'Mojave Solar Boundary', status: 'ONLINE', val: '38.2°C' },
      { lat: 53.5, lon: -113.4, code: 'AWS-505-FRT', name: 'Boreal Forest Research', status: 'ONLINE', val: '14.1°C' },
      { lat: 40.7, lon: -74.0, code: 'AWS-610-MET', name: 'Urban Island Boundary', status: 'ONLINE', val: '26.4°C' }
    ];

    stationData.forEach(st => {
      const pin = this.createStationNode(st, globeRadius, isDark);
      this.stationGroup.add(pin);
      this.stationPins.push(pin);
    });

    // 8. Meteorological Isobaric Pressure Rings & Contours
    this.isobarGroup = new THREE.Group();
    this.globe.add(this.isobarGroup);
    this.createIsobaricContours(globeRadius, isDark);

    // 9. Anomaly Flare & Quarantine Beacon (Targeting Plains station AWS-312)
    this.anomalyGroup = new THREE.Group();
    this.globe.add(this.anomalyGroup);
    this.createAnomalyBeacon(41.8, -93.0, globeRadius);

    // 10. Lighting Setup
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xe2e8f0, isDark ? 1.8 : 2.4);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isDark ? 0x2dd4bf : 0x0f766e, isDark ? 2.5 : 2.0);
    sunLight.position.set(12, 10, 10);
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x94a3b8, isDark ? 1.2 : 0.8);
    fillLight.position.set(-10, -6, -8);
    this.scene.add(fillLight);

    // 11. Bind Listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // Initial scroll calculation
    this.onScroll();
    this.animate();
  }

  generateEarthTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base Ocean Color
    ctx.fillStyle = isDark ? '#0b1320' : '#eaf0f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bathymetry depth bands
    ctx.fillStyle = isDark ? '#0f1c30' : '#dee7f0';
    ctx.beginPath();
    ctx.ellipse(512, 256, 480, 230, 0, 0, Math.PI * 2);
    ctx.fill();

    // Procedural Continents (North America, South America, Eurasia, Africa, Australia)
    ctx.fillStyle = isDark ? '#1a2638' : '#cbd5e1';

    // North America
    ctx.beginPath();
    ctx.moveTo(180, 120);
    ctx.lineTo(280, 100);
    ctx.lineTo(340, 160);
    ctx.lineTo(310, 260);
    ctx.lineTo(250, 280);
    ctx.lineTo(200, 230);
    ctx.closePath();
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.moveTo(270, 290);
    ctx.lineTo(340, 310);
    ctx.lineTo(360, 390);
    ctx.lineTo(300, 480);
    ctx.lineTo(270, 400);
    ctx.closePath();
    ctx.fill();

    // Eurasia
    ctx.beginPath();
    ctx.moveTo(480, 100);
    ctx.lineTo(820, 90);
    ctx.lineTo(860, 210);
    ctx.lineTo(720, 270);
    ctx.lineTo(580, 230);
    ctx.lineTo(490, 190);
    ctx.closePath();
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.moveTo(480, 210);
    ctx.lineTo(590, 220);
    ctx.lineTo(600, 350);
    ctx.lineTo(540, 440);
    ctx.lineTo(470, 310);
    ctx.closePath();
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.moveTo(780, 340);
    ctx.lineTo(880, 330);
    ctx.lineTo(890, 420);
    ctx.lineTo(790, 410);
    ctx.closePath();
    ctx.fill();

    // Draw subtle coastlines
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 118, 110, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    return canvas;
  }

  createStationNode(data, radius, isDark) {
    const phi = (90 - data.lat) * (Math.PI / 180);
    const theta = (data.lon + 180) * (Math.PI / 180);
    const r = radius * 1.01;

    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);

    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.lookAt(x * 2, y * 2, z * 2);

    const isAlert = data.status === 'DEGRADED';
    const colorHex = isAlert ? 0xd97706 : (isDark ? 0x2dd4bf : 0x0f766e);

    // 1. Station Central Point
    const pointGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const pointMesh = new THREE.Mesh(pointGeo, pointMat);
    group.add(pointMesh);

    // 2. Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.14, 0.24, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    group.add(ringMesh);

    return group;
  }

  createIsobaricContours(radius, isDark) {
    const centers = [
      { lat: 45.0, lon: 10.0, r: 1.2 },
      { lat: 38.0, lon: -100.0, r: 1.8 },
      { lat: 50.0, lon: -110.0, r: 1.4 }
    ];

    centers.forEach(c => {
      const phi = (90 - c.lat) * (Math.PI / 180);
      const theta = (c.lon + 180) * (Math.PI / 180);
      const pos = new THREE.Vector3(
        -(radius * 1.02 * Math.sin(phi) * Math.cos(theta)),
        radius * 1.02 * Math.cos(phi),
        radius * 1.02 * Math.sin(phi) * Math.sin(theta)
      );

      for (let ring = 1; ring <= 3; ring++) {
        const ringGeo = new THREE.RingGeometry(ring * 0.35, ring * 0.35 + 0.04, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: isDark ? 0x38bdf8 : 0x0f766e,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.25 / ring
        });
        const mesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.position.copy(pos);
        mesh.lookAt(pos.clone().multiplyScalar(2));
        this.isobarGroup.add(mesh);
      }
    });
  }

  createAnomalyBeacon(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = radius * 1.015;

    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);

    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(x, y, z);
    beaconGroup.lookAt(x * 2, y * 2, z * 2);

    // Warning / Anomaly core
    const coreGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    beaconGroup.add(coreMesh);

    // Expanding warning ring
    const alertRingGeo = new THREE.RingGeometry(0.2, 0.45, 32);
    const alertRingMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const alertRing = new THREE.Mesh(alertRingGeo, alertRingMat);
    beaconGroup.add(alertRing);

    this.anomalyGroup.add(beaconGroup);
  }

  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrollY = window.scrollY || window.pageYOffset;
    this.targetScrollProgress = Math.min(Math.max(scrollY / docHeight, 0), 1);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  interpolateKeyframes(progress) {
    let p = progress;
    let k1 = this.keyframes[0];
    let k2 = this.keyframes[1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (p >= this.keyframes[i].progress && p <= this.keyframes[i + 1].progress) {
        k1 = this.keyframes[i];
        k2 = this.keyframes[i + 1];
        break;
      }
    }

    const span = k2.progress - k1.progress;
    const localT = span === 0 ? 0 : (p - k1.progress) / span;
    const easeT = (1 - Math.cos(localT * Math.PI)) / 2;

    return {
      camPos: new THREE.Vector3().lerpVectors(k1.camPos, k2.camPos, easeT),
      rotY: THREE.MathUtils.lerp(k1.rotY, k2.rotY, easeT),
      rotX: THREE.MathUtils.lerp(k1.rotX, k2.rotX, easeT),
      atmosOpacity: THREE.MathUtils.lerp(k1.atmosOpacity, k2.atmosOpacity, easeT),
      scale: THREE.MathUtils.lerp(k1.scale, k2.scale, easeT),
      stationOpacity: THREE.MathUtils.lerp(k1.stationOpacity, k2.stationOpacity, easeT),
      isobarOpacity: THREE.MathUtils.lerp(k1.isobarOpacity, k2.isobarOpacity, easeT),
      anomalyOpacity: THREE.MathUtils.lerp(k1.anomalyOpacity, k2.anomalyOpacity, easeT)
    };
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Smooth scroll progress interpolation
    this.currentScrollProgress += (this.targetScrollProgress - this.currentScrollProgress) * this.scrollEase;

    const state = this.interpolateKeyframes(this.currentScrollProgress);

    // Apply Camera Position & Rotation
    if (this.camera) {
      this.camera.position.copy(state.camPos);
      this.camera.lookAt(0, 0, 0);
    }

    // Apply Globe Rotation
    if (this.globe) {
      this.globe.rotation.y = state.rotY + (Date.now() * 0.00015);
      this.globe.rotation.x = state.rotX;
      this.globe.scale.set(state.scale, state.scale, state.scale);
    }

    // Atmosphere Uniform Update
    if (this.atmosphere && this.atmosphere.material.uniforms) {
      this.atmosphere.material.uniforms.uOpacity.value = state.atmosOpacity;
    }

    // Station Pulse
    const time = Date.now() * 0.003;
    if (this.stationPins) {
      this.stationPins.forEach((pin, idx) => {
        const ring = pin.children[1];
        if (ring) {
          const s = 1 + Math.sin(time + idx * 1.5) * 0.35;
          ring.scale.set(s, s, s);
        }
      });
    }

    // Anomaly Warning Pulse
    if (this.anomalyGroup && this.anomalyGroup.children[0]) {
      const beacon = this.anomalyGroup.children[0];
      const alertRing = beacon.children[1];
      if (alertRing) {
        const s = 1 + Math.sin(time * 2) * 0.6;
        alertRing.scale.set(s, s, s);
        alertRing.material.opacity = (0.9 - (s - 1) * 0.6) * state.anomalyOpacity;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('scroll', this.onScroll);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
