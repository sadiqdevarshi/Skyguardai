import * as THREE from 'three';
import { themeManager } from '../services/theme.js';

export class ScrollGlobeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.cloudMesh = null;
    this.atmosphere = null;
    this.depthShadow = null;
    this.windParticles = null;
    this.stationGroup = null;
    this.isobarGroup = null;
    this.anomalyGroup = null;
    this.stationPins = [];
    this.ambientLight = null;
    this.sunLight = null;
    this.fillLight = null;
    this.gridLines = null;
    this.animationFrameId = null;

    // Scroll state & interpolation targets
    this.targetScrollProgress = 0;
    this.currentScrollProgress = 0;
    this.scrollEase = 0.05;

    // Camera trajectory keyframes for the 6 narrative stages
    this.keyframes = [
      { progress: 0.0, camPos: new THREE.Vector3(0, 0.4, 15.0), rotY: 0.0, rotX: 0.08, atmosOpacity: 0.75, scale: 1.0, stationOpacity: 0.4, isobarOpacity: 0.0, anomalyOpacity: 0.0 },
      { progress: 0.2, camPos: new THREE.Vector3(2.2, 2.0, 10.8), rotY: 0.8, rotX: 0.20, atmosOpacity: 0.85, scale: 1.05, stationOpacity: 0.7, isobarOpacity: 0.2, anomalyOpacity: 0.0 },
      { progress: 0.4, camPos: new THREE.Vector3(-1.6, 1.0, 9.2), rotY: 1.85, rotX: 0.14, atmosOpacity: 0.65, scale: 1.1, stationOpacity: 1.0, isobarOpacity: 0.5, anomalyOpacity: 0.2 },
      { progress: 0.6, camPos: new THREE.Vector3(1.2, -0.6, 8.2), rotY: 3.2, rotX: -0.08, atmosOpacity: 0.55, scale: 1.15, stationOpacity: 1.0, isobarOpacity: 0.9, anomalyOpacity: 0.4 },
      { progress: 0.8, camPos: new THREE.Vector3(0.4, 0.3, 7.6), rotY: 4.4, rotX: 0.16, atmosOpacity: 0.65, scale: 1.2, stationOpacity: 1.0, isobarOpacity: 0.4, anomalyOpacity: 1.0 },
      { progress: 1.0, camPos: new THREE.Vector3(0, 1.4, 13.8), rotY: 6.28, rotX: 0.08, atmosOpacity: 0.75, scale: 1.0, stationOpacity: 0.8, isobarOpacity: 0.3, anomalyOpacity: 0.3 }
    ];

    this.onThemeChange = this.onThemeChange.bind(this);
    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const isDark = themeManager.getTheme() === 'dark';
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    this.camera.position.copy(this.keyframes[0].camPos);

    // 2. WebGL Renderer with High Dynamic Range & Color Calibration
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = isDark ? 1.05 : 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    const globeRadius = 4.6;

    // 3. Subtle Ambient Depth Disc (Natural volumetric grounding)
    this.createDepthShadow(globeRadius, isDark);

    // 4. Earth Core Sphere with Realistic Procedural Bathymetry & Continents
    const globeGeometry = new THREE.SphereGeometry(globeRadius, isMobile ? 40 : 72, isMobile ? 40 : 72);
    
    this.earthCanvas = this.generateEarthTexture(isDark);
    this.earthTexture = new THREE.CanvasTexture(this.earthCanvas);
    this.earthTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    this.bumpCanvas = this.generateBumpTexture();
    this.bumpTexture = new THREE.CanvasTexture(this.bumpCanvas);

    this.globeMaterial = new THREE.MeshStandardMaterial({
      map: this.earthTexture,
      bumpMap: this.bumpTexture,
      bumpScale: 0.08,
      roughness: isDark ? 0.72 : 0.75,
      metalness: isDark ? 0.18 : 0.10
    });

    this.globe = new THREE.Mesh(globeGeometry, this.globeMaterial);
    this.scene.add(this.globe);

    // 5. Cloud & Meteorological Circulation Layer
    this.cloudCanvas = this.generateCloudTexture(isDark);
    this.cloudTexture = new THREE.CanvasTexture(this.cloudCanvas);
    const cloudGeometry = new THREE.SphereGeometry(globeRadius * 1.012, isMobile ? 32 : 64, isMobile ? 32 : 64);
    this.cloudMaterial = new THREE.MeshStandardMaterial({
      map: this.cloudTexture,
      transparent: true,
      opacity: isDark ? 0.4 : 0.32,
      blending: THREE.NormalBlending,
      roughness: 0.9,
      metalness: 0.05
    });
    this.cloudMesh = new THREE.Mesh(cloudGeometry, this.cloudMaterial);
    this.globe.add(this.cloudMesh);

    // 6. Scientific Geodetic Latitude/Longitude Coordinate Grid
    const gridGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 1.006, 24, 18));
    this.gridMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.18 : 0.18
    });
    this.gridLines = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    this.globe.add(this.gridLines);

    // 7. Atmospheric Fresnel Limb
    this.createAtmosphere(globeRadius, isDark, isMobile);

    // 8. Global Atmospheric Wind Streams (Streamline particles)
    this.createWindStreams(globeRadius, isDark, isMobile);

    // 9. Ground Station Telemetry Nodes (WMO Coordinate Network)
    this.stationGroup = new THREE.Group();
    this.globe.add(this.stationGroup);
    this.createStationNodes(globeRadius, isDark);

    // 10. Meteorological Isobaric Pressure Rings & Contours
    this.isobarGroup = new THREE.Group();
    this.globe.add(this.isobarGroup);
    this.createIsobaricContours(globeRadius, isDark);

    // 11. Anomaly Flare & Quarantine Beacon (Targeting Plains station AWS-312)
    this.anomalyGroup = new THREE.Group();
    this.globe.add(this.anomalyGroup);
    this.createAnomalyBeacon(41.8, -93.0, globeRadius);

    // 12. Lighting Architecture
    this.setupLighting(isDark);

    // 13. Bind Listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('aerisence-theme-change', this.onThemeChange);

    // Initial scroll calculation & animation loop
    this.onScroll();
    this.animate();
  }

  setupLighting(isDark) {
    if (this.ambientLight) this.scene.remove(this.ambientLight);
    if (this.sunLight) this.scene.remove(this.sunLight);
    if (this.fillLight) this.scene.remove(this.fillLight);

    // Ambient fill for global atmospheric readability
    this.ambientLight = new THREE.AmbientLight(
      isDark ? 0x1e293b : 0xe2e8f0,
      isDark ? 1.6 : 1.5
    );
    this.scene.add(this.ambientLight);

    // Key Sun directional light
    this.sunLight = new THREE.DirectionalLight(
      0xffffff,
      isDark ? 2.4 : 2.2
    );
    this.sunLight.position.set(12, 10, 10);
    this.scene.add(this.sunLight);

    // Cool sky fill light from opposite hemisphere
    this.fillLight = new THREE.DirectionalLight(
      isDark ? 0x38bdf8 : 0x0284c7,
      isDark ? 1.0 : 0.65
    );
    this.fillLight.position.set(-10, -6, -8);
    this.scene.add(this.fillLight);
  }

  createDepthShadow(radius, isDark) {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 110);
    grad.addColorStop(0, isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(15, 23, 42, 0.1)');
    grad.addColorStop(0.6, isDark ? 'rgba(15, 23, 42, 0.18)' : 'rgba(15, 23, 42, 0.03)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(shadowCanvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const geo = new THREE.PlaneGeometry(radius * 2.5, radius * 2.5);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

    if (this.depthShadow) this.scene.remove(this.depthShadow);
    this.depthShadow = new THREE.Mesh(geo, mat);
    this.depthShadow.position.set(0, 0, -1.8);
    this.scene.add(this.depthShadow);
  }

  createAtmosphere(radius, isDark, isMobile) {
    if (this.atmosphere) this.scene.remove(this.atmosphere);

    const atmosGeometry = new THREE.SphereGeometry(radius * 1.035, isMobile ? 32 : 64, isMobile ? 32 : 64);
    
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewVec;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 eyePos = modelViewMatrix * vec4(position, 1.0);
        vViewVec = -normalize(eyePos.xyz);
        gl_Position = projectionMatrix * eyePos;
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vViewVec;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uIsDark;
      void main() {
        float dotNV = max(dot(vNormal, vViewVec), 0.0);
        float rim = pow(1.0 - dotNV, 3.2);
        float alpha = rim * uOpacity * (uIsDark > 0.5 ? 0.85 : 0.6);
        gl_FragColor = vec4(uColor, alpha);
      }
    `;

    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(isDark ? 0x2dd4bf : 0x0284c7) },
        uOpacity: { value: 0.8 },
        uIsDark: { value: isDark ? 1.0 : 0.0 }
      },
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false
    });

    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.scene.add(this.atmosphere);
  }

  generateEarthTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Base Oceanic Fill (Deep rich marine slate in light mode, deep void navy in dark mode)
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isDark) {
      oceanGrad.addColorStop(0, '#09111c');
      oceanGrad.addColorStop(0.5, '#0b1624');
      oceanGrad.addColorStop(1, '#09111c');
    } else {
      oceanGrad.addColorStop(0, '#101d2d');
      oceanGrad.addColorStop(0.5, '#16283d');
      oceanGrad.addColorStop(1, '#101d2d');
    }
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Bathymetric Oceanic Trench & Continental Shelf Contours
    ctx.fillStyle = isDark ? 'rgba(30, 58, 95, 0.25)' : 'rgba(8, 20, 35, 0.35)';
    ctx.beginPath();
    ctx.ellipse(1024, 512, 960, 460, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. High-Fidelity Continents
    ctx.fillStyle = isDark ? '#1a283c' : '#283849';

    // --- North America & Greenland ---
    ctx.beginPath();
    ctx.moveTo(180, 160);
    ctx.lineTo(260, 140);
    ctx.lineTo(340, 180);
    ctx.lineTo(460, 190);
    ctx.lineTo(540, 240);
    ctx.lineTo(580, 310);
    ctx.lineTo(520, 370);
    ctx.lineTo(470, 460);
    ctx.lineTo(420, 470);
    ctx.lineTo(380, 530);
    ctx.lineTo(340, 480);
    ctx.lineTo(260, 420);
    ctx.lineTo(210, 320);
    ctx.lineTo(170, 240);
    ctx.closePath();
    ctx.fill();

    // Greenland
    ctx.beginPath();
    ctx.moveTo(560, 100);
    ctx.lineTo(640, 90);
    ctx.lineTo(680, 150);
    ctx.lineTo(620, 210);
    ctx.lineTo(560, 180);
    ctx.closePath();
    ctx.fill();

    // --- South America ---
    ctx.beginPath();
    ctx.moveTo(390, 530);
    ctx.lineTo(490, 540);
    ctx.lineTo(570, 600);
    ctx.lineTo(590, 680);
    ctx.lineTo(520, 840);
    ctx.lineTo(470, 960);
    ctx.lineTo(430, 850);
    ctx.lineTo(410, 700);
    ctx.lineTo(370, 580);
    ctx.closePath();
    ctx.fill();

    // --- Europe & Eurasia ---
    ctx.beginPath();
    ctx.arc(880, 260, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(920, 190);
    ctx.lineTo(1080, 160);
    ctx.lineTo(1280, 140);
    ctx.lineTo(1540, 170);
    ctx.lineTo(1680, 230);
    ctx.lineTo(1720, 340);
    ctx.lineTo(1620, 450);
    ctx.lineTo(1480, 510);
    ctx.lineTo(1360, 560);
    ctx.lineTo(1320, 640);
    ctx.lineTo(1270, 560);
    ctx.lineTo(1180, 500);
    ctx.lineTo(1120, 440);
    ctx.lineTo(980, 420);
    ctx.lineTo(920, 320);
    ctx.closePath();
    ctx.fill();

    // Japan
    ctx.beginPath();
    ctx.ellipse(1740, 370, 35, 120, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // --- Africa & Madagascar ---
    ctx.beginPath();
    ctx.moveTo(920, 430);
    ctx.lineTo(1060, 420);
    ctx.lineTo(1160, 490);
    ctx.lineTo(1210, 610);
    ctx.lineTo(1140, 770);
    ctx.lineTo(1050, 880);
    ctx.lineTo(960, 810);
    ctx.lineTo(890, 640);
    ctx.lineTo(860, 510);
    ctx.closePath();
    ctx.fill();

    // Madagascar
    ctx.beginPath();
    ctx.ellipse(1230, 780, 20, 60, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- Australia & New Zealand ---
    ctx.beginPath();
    ctx.moveTo(1520, 670);
    ctx.lineTo(1680, 650);
    ctx.lineTo(1740, 740);
    ctx.lineTo(1710, 840);
    ctx.lineTo(1580, 840);
    ctx.lineTo(1510, 750);
    ctx.closePath();
    ctx.fill();

    // New Zealand
    ctx.beginPath();
    ctx.ellipse(1800, 830, 15, 50, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // --- Antarctica Ice Cap ---
    ctx.fillStyle = isDark ? '#233852' : '#394d60';
    ctx.beginPath();
    ctx.rect(0, 940, canvas.width, 84);
    ctx.fill();

    // 4. Subtle Topographical Contour Shading
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.14)';
    ctx.beginPath();
    ctx.moveTo(270, 200);
    ctx.lineTo(330, 360);
    ctx.lineTo(430, 740);
    ctx.lineTo(460, 900);
    ctx.lineWidth = 14;
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.14)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(940, 310);
    ctx.lineTo(1120, 380);
    ctx.lineTo(1350, 430);
    ctx.lineWidth = 16;
    ctx.stroke();

    // 5. Crisp Coastline Outlines
    ctx.strokeStyle = isDark ? 'rgba(45, 212, 191, 0.35)' : 'rgba(14, 165, 233, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    return canvas;
  }

  generateBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#a8a8a8';
    ctx.beginPath();
    ctx.ellipse(256, 180, 160, 120, 0, 0, Math.PI * 2);
    ctx.ellipse(600, 180, 280, 140, 0, 0, Math.PI * 2);
    ctx.ellipse(300, 360, 80, 140, 0, 0, Math.PI * 2);
    ctx.ellipse(540, 340, 100, 160, 0, 0, Math.PI * 2);
    ctx.ellipse(820, 380, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d0d0d0';
    ctx.beginPath();
    ctx.arc(220, 160, 30, 0, Math.PI * 2);
    ctx.arc(660, 220, 40, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  generateCloudTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cloudColor = isDark ? 'rgba(240, 249, 255, 0.32)' : 'rgba(255, 255, 255, 0.42)';
    ctx.fillStyle = cloudColor;

    for (let i = 0; i < 24; i++) {
      const x = (i * 48 + 30) % 1024;
      const y1 = 120 + Math.sin(i * 0.8) * 35;
      const y2 = 360 + Math.cos(i * 0.7) * 45;

      ctx.beginPath();
      ctx.ellipse(x, y1, 45 + Math.sin(i) * 15, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse((x + 120) % 1024, y2, 50 + Math.cos(i) * 20, 20, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(380, 160, 35, 0, Math.PI * 2);
    ctx.arc(760, 140, 40, 0, Math.PI * 2);
    ctx.arc(280, 380, 45, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  createWindStreams(radius, isDark, isMobile) {
    if (this.windParticles) this.globe.remove(this.windParticles);

    const particleCount = isMobile ? 260 : 580;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = radius * 1.025 + (Math.random() * 0.35);

      positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.07 : 0.09,
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    this.windParticles = new THREE.Points(particleGeometry, this.particleMaterial);
    this.globe.add(this.windParticles);
  }

  createStationNodes(radius, isDark) {
    this.stationPins = [];
    while (this.stationGroup.children.length > 0) {
      this.stationGroup.remove(this.stationGroup.children[0]);
    }

    const stationData = [
      { lat: 45.8, lon: 6.8, code: 'AWS-101-ALP', name: 'Alpine High Summit', status: 'ONLINE', val: '24.6°C' },
      { lat: 36.6, lon: -121.8, code: 'AWS-204-CST', name: 'Pacific Marine Tower', status: 'ONLINE', val: '19.8°C' },
      { lat: 41.8, lon: -93.0, code: 'AWS-312-PLN', name: 'Midwest Agricultural', status: 'DEGRADED', val: '48.6°C' },
      { lat: 35.0, lon: -115.4, code: 'AWS-408-DSN', name: 'Mojave Solar Boundary', status: 'ONLINE', val: '38.2°C' },
      { lat: 53.5, lon: -113.4, code: 'AWS-505-FRT', name: 'Boreal Forest Research', status: 'ONLINE', val: '14.1°C' },
      { lat: 40.7, lon: -74.0, code: 'AWS-610-MET', name: 'Urban Island Boundary', status: 'ONLINE', val: '26.4°C' }
    ];

    stationData.forEach(st => {
      const pin = this.createStationNode(st, radius, isDark);
      this.stationGroup.add(pin);
      this.stationPins.push(pin);
    });
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

    // 1. Station Point
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
    while (this.isobarGroup.children.length > 0) {
      this.isobarGroup.remove(this.isobarGroup.children[0]);
    }

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
          color: isDark ? 0x38bdf8 : 0x0284c7,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: (isDark ? 0.3 : 0.35) / ring
        });
        const mesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.position.copy(pos);
        mesh.lookAt(pos.clone().multiplyScalar(2));
        this.isobarGroup.add(mesh);
      }
    });
  }

  createAnomalyBeacon(lat, lon, radius) {
    while (this.anomalyGroup.children.length > 0) {
      this.anomalyGroup.remove(this.anomalyGroup.children[0]);
    }

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

    // Expanding quarantine telemetry ring
    const alertRingGeo = new THREE.RingGeometry(0.2, 0.45, 32);
    const alertRingMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const alertRing = new THREE.Mesh(alertRingGeo, alertRingMat);
    beaconGroup.add(alertRing);

    this.anomalyGroup.add(beaconGroup);
  }

  onThemeChange(e) {
    const isDark = e.detail?.theme === 'dark';
    const isMobile = window.innerWidth < 768;
    const radius = 4.6;

    // 1. Update Earth Textures & Materials
    this.earthCanvas = this.generateEarthTexture(isDark);
    this.earthTexture.image = this.earthCanvas;
    this.earthTexture.needsUpdate = true;

    this.cloudCanvas = this.generateCloudTexture(isDark);
    this.cloudTexture.image = this.cloudCanvas;
    this.cloudTexture.needsUpdate = true;

    if (this.globeMaterial) {
      this.globeMaterial.roughness = isDark ? 0.72 : 0.75;
      this.globeMaterial.metalness = isDark ? 0.18 : 0.10;
      this.globeMaterial.needsUpdate = true;
    }

    // 2. Update Grid
    if (this.gridMaterial) {
      this.gridMaterial.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      this.gridMaterial.opacity = isDark ? 0.18 : 0.18;
    }

    // 3. Update Atmosphere
    this.createAtmosphere(radius, isDark, isMobile);

    // 4. Update Depth Shadow
    this.createDepthShadow(radius, isDark);

    // 5. Update Particle Streams
    if (this.particleMaterial) {
      this.particleMaterial.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      this.particleMaterial.opacity = isDark ? 0.6 : 0.45;
      this.particleMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }

    // 6. Update Stations & Isobars
    this.createStationNodes(radius, isDark);
    this.createIsobaricContours(radius, isDark);

    // 7. Update Lighting & Exposure
    if (this.renderer) {
      this.renderer.toneMappingExposure = isDark ? 1.05 : 1.0;
    }
    this.setupLighting(isDark);
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

    // Apply Globe Rotation & Subtle Cloud Drift
    if (this.globe) {
      this.globe.rotation.y = state.rotY + (Date.now() * 0.00015);
      this.globe.rotation.x = state.rotX;
      this.globe.scale.set(state.scale, state.scale, state.scale);

      if (this.cloudMesh) {
        this.cloudMesh.rotation.y = Date.now() * 0.00008;
      }
    }

    // Atmosphere Uniform Update
    if (this.atmosphere && this.atmosphere.material && this.atmosphere.material.uniforms) {
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
    window.removeEventListener('aerisence-theme-change', this.onThemeChange);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
