import * as THREE from 'three';

export class AtmosphericGlobeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.atmosphere = null;
    this.particles = null;
    this.stationPins = [];
    this.animationFrameId = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 18);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 3. Globe Core (Earth sphere with atmospheric shader/gradient)
    const globeGeometry = new THREE.SphereGeometry(6, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2,
      wireframe: false
    });
    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.scene.add(this.globe);

    // 4. Lat/Long Grid Rings
    const gridGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(6.05, 24, 24));
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.18 });
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.globe.add(gridLines);

    // 5. Atmospheric Outer Glow
    const atmosGeometry = new THREE.SphereGeometry(6.6, 64, 64);
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
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(0.035, 0.71, 0.83, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.scene.add(this.atmosphere);

    // 6. Particle Wind Streams
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 6.2 + Math.random() * 0.4;

      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = 0.02 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.globe.add(this.particles);

    // 7. Add Station Pins (Coordinates: Alps, Pacific, Midwest, Mojave, Taiga, Metro)
    const stations = [
      { lat: 45.8, lon: 6.8, code: 'ALP', status: 'ONLINE' },
      { lat: 36.6, lon: -121.8, code: 'CST', status: 'ONLINE' },
      { lat: 41.8, lon: -93.0, code: 'PLN', status: 'DEGRADED' },
      { lat: 35.0, lon: -115.4, code: 'DSN', status: 'ONLINE' },
      { lat: 53.5, lon: -113.4, code: 'FRT', status: 'ONLINE' },
      { lat: 40.7, lon: -74.0, code: 'MET', status: 'ONLINE' }
    ];

    stations.forEach(st => {
      const pin = this.createStationPin(st.lat, st.lon, st.status === 'DEGRADED' ? 0xf59e0b : 0x06b6d4);
      this.globe.add(pin);
      this.stationPins.push(pin);
    });

    // 8. Lights
    const ambientLight = new THREE.AmbientLight(0x334155, 1.5);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x22d3ee, 2.5);
    dirLight1.position.set(10, 10, 10);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1.0);
    dirLight2.position.set(-10, -5, -10);
    this.scene.add(dirLight2);

    // 9. Resize & Interaction Listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // Mouse drag interaction
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };

    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.globe) return;
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;
      this.globe.rotation.y += deltaX * 0.005;
      this.globe.rotation.x += deltaY * 0.005;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.animate = this.animate.bind(this);
    this.animate();
  }

  createStationPin(lat, lon, colorHex) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const radius = 6.08;

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Pin sphere
    const pinGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    group.add(pinMesh);

    // Pulse wave ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.35, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.lookAt(0, 0, 0);
    group.add(ringMesh);

    return group;
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

    if (this.globe && !this.isDragging) {
      this.globe.rotation.y += 0.0015;
    }
    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }

    // Pulse station rings
    const time = Date.now() * 0.003;
    this.stationPins.forEach((pin, index) => {
      const ring = pin.children[1];
      if (ring) {
        const scale = 1 + Math.sin(time + index) * 0.4;
        ring.scale.set(scale, scale, scale);
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
