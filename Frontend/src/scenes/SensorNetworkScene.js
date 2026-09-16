import * as THREE from 'three';

export class SensorNetworkScene {
  constructor(container, onNodeClick = null) {
    this.container = container;
    this.onNodeClick = onNodeClick;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodes = [];
    this.edges = [];
    this.packets = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.animationFrameId = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 550;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 5, 22);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Central Processing Hub Node
    const hubGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.8
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.position.set(0, 0, 0);
    this.scene.add(hub);
    this.hub = hub;

    // Station Nodes Data
    const stationData = [
      { id: 1, code: 'AWS-101-ALP', name: 'Alpine Summit', pos: [-8, 3, 2], status: 'ONLINE' },
      { id: 2, code: 'AWS-204-CST', name: 'Pacific Coast', pos: [-6, -4, -3], status: 'ONLINE' },
      { id: 3, code: 'AWS-312-PLN', name: 'Central Plains', pos: [7, 4, 1], status: 'DEGRADED' },
      { id: 4, code: 'AWS-408-DSN', name: 'Mojave Basin', pos: [8, -3, -2], status: 'ONLINE' },
      { id: 5, code: 'AWS-515-FRT', name: 'Boreal Taiga', pos: [0, 7, -4], status: 'ONLINE' },
      { id: 6, code: 'AWS-620-MET', name: 'Metro Tower', pos: [-2, -6, 3], status: 'ONLINE' }
    ];

    stationData.forEach(st => {
      const color = st.status === 'DEGRADED' ? 0xf59e0b : 0x06b6d4;

      // Node Mesh
      const nodeGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.6
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...st.pos);
      nodeMesh.userData = st;
      this.scene.add(nodeMesh);
      this.nodes.push(nodeMesh);

      // Edge Connection line to Hub
      const lineMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...st.pos),
        new THREE.Vector3(0, 0, 0)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      this.scene.add(line);
      this.edges.push({ line, start: nodeMesh.position, end: hub.position });

      // Telemetry Packet Particle traveling along edge
      const packetGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      this.scene.add(packet);
      this.packets.push({
        mesh: packet,
        start: new THREE.Vector3(...st.pos),
        end: new THREE.Vector3(0, 0, 0),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.006
      });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0x475569, 1.8);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 3, 50);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);

    // Resize
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // Hover & Click Raycasting
    this.container.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.nodes);

      if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        if (this.onNodeClick) {
          this.onNodeClick(clickedNode.userData);
        }
      }
    });

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

    // Rotate Hub
    if (this.hub) {
      this.hub.rotation.x += 0.005;
      this.hub.rotation.y += 0.008;
    }

    // Animate telemetry packets
    this.packets.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1.0) p.progress = 0.0;
      p.mesh.position.lerpVectors(p.start, p.end, p.progress);
    });

    // Orbit Camera slightly
    const time = Date.now() * 0.0004;
    this.camera.position.x = Math.sin(time) * 4;
    this.camera.position.y = 5 + Math.cos(time * 0.7) * 1.5;
    this.camera.lookAt(0, 0, 0);

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
