/* ============================================================
       GREGADO THEME TRANSITIONS
       Ocean shader + glass-shard animation ported from theme.html.
       Uses the homepage's already-loaded Three.js global.
       ============================================================ */
    (function () {
      const vertexShader = `
        uniform float uTime;
        uniform vec2 uViewport;
        varying vec2 vUv;
        varying float vHeight;

        float gerstner(vec2 point, vec2 direction, float frequency, float amplitude, float speed, inout vec2 lateral) {
          float phase = frequency * dot(direction, point) - speed * uTime;
          lateral += direction * (amplitude * 0.31 * cos(phase));
          return amplitude * sin(phase);
        }

        float waveHeight(vec2 point, out vec2 lateral) {
          lateral = vec2(0.0);
          float height = 0.0;
          height += gerstner(point, normalize(vec2(0.88, 0.48)), 0.015, 9.0, 1.12, lateral);
          height += gerstner(point, normalize(vec2(-0.43, 0.90)), 0.024, 4.8, 1.67, lateral);
          height += gerstner(point, normalize(vec2(0.61, -0.79)), 0.046, 1.9, 2.24, lateral);
          height += gerstner(point, normalize(vec2(-0.78, -0.62)), 0.085, 0.68, 2.91, lateral);
          return height;
        }

        void main() {
          vUv = uv;
          vec2 screenPoint = uv * uViewport;
          vec2 lateral;
          float height = waveHeight(screenPoint, lateral);
          vec3 displaced = vec3(position.xy + lateral, height * 0.58);
          vHeight = height;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uViewport;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying float vHeight;

        float waveHeight(vec2 point, out vec2 slope) {
          float height = 0.0;
          slope = vec2(0.0);
          vec2 d1 = normalize(vec2(0.88, 0.48));
          vec2 d2 = normalize(vec2(-0.43, 0.90));
          vec2 d3 = normalize(vec2(0.61, -0.79));
          vec2 d4 = normalize(vec2(-0.78, -0.62));
          float p1 = 0.015 * dot(d1, point) - 1.12 * uTime;
          float p2 = 0.024 * dot(d2, point) - 1.67 * uTime;
          float p3 = 0.046 * dot(d3, point) - 2.24 * uTime;
          float p4 = 0.085 * dot(d4, point) - 2.91 * uTime;
          height += 9.0 * sin(p1); slope += d1 * (9.0 * 0.015 * cos(p1));
          height += 4.8 * sin(p2); slope += d2 * (4.8 * 0.024 * cos(p2));
          height += 1.9 * sin(p3); slope += d3 * (1.9 * 0.046 * cos(p3));
          height += 0.68 * sin(p4); slope += d4 * (0.68 * 0.085 * cos(p4));
          return height;
        }

        void main() {
          vec2 uv = vUv;
          vec2 point = uv * uViewport;
          vec2 slope;
          float height = waveHeight(point, slope);
          vec3 normal = normalize(vec3(-slope.x * 1.8, -slope.y * 1.8, 1.0));
          vec3 viewDirection = vec3(0.0, 0.0, 1.0);
          vec3 lightDirection = normalize(vec3(-0.43, 0.63, 0.66));
          float diffuse = 0.52 + 0.48 * max(dot(normal, lightDirection), 0.0);
          float facing = max(dot(normal, viewDirection), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - facing, 5.0);
          vec3 reflectedView = reflect(-viewDirection, normal);
          float skyBlend = smoothstep(-0.40, 0.82, reflectedView.y);
          vec3 reflectedSky = mix(vec3(0.07, 0.25, 0.34), vec3(0.70, 0.88, 0.97), skyBlend);
          float specular = pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 48.0);
          float broadGlint = pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 12.0);
          float shimmer = pow(0.5 + 0.5 * sin(point.x * 0.034 + point.y * 0.018 + height * 0.92 + uTime * 1.8), 10.0);

          // Diagonal ocean front advances from lower-left to upper-right.
          float alongCrest = uv.x - uv.y;
          float crestShape = 0.020 * sin(alongCrest * 31.0 + uTime * 1.65)
                           + 0.009 * sin(alongCrest * 77.0 - uTime * 2.4)
                           + 0.004 * height;
          float front = uProgress - (uv.x + uv.y) + crestShape;
          float water = smoothstep(-0.020, 0.020, front);
          if (water < 0.002) discard;

          float foamBand = 1.0 - smoothstep(0.009, 0.082, abs(front));
          float foamGrain = sin(point.x * 0.043 + sin(point.y * 0.021 + uTime * 1.4) * 1.25)
                          + sin(point.y * 0.052 - point.x * 0.018 + uTime * 1.15)
                          + sin((point.x + point.y) * 0.027 - uTime * 0.82);
          float brokenFoam = smoothstep(-0.48, 0.70, foamGrain);
          float foam = foamBand * (0.20 + 0.80 * brokenFoam);
          float crest = smoothstep(0.13, 0.31, length(slope)) * brokenFoam;
          vec3 deepWater = uColor * (0.55 + 0.14 * sin(height * 0.42 + uTime * 0.55));
          vec3 litWater = uColor * (0.92 + 0.22 * diffuse);
          vec3 color = mix(deepWater, litWater, 0.38 + 0.36 * diffuse);
          color = mix(color, reflectedSky, fresnel * 0.56);
          color += vec3(0.54, 0.82, 0.96) * (specular * 0.76 + broadGlint * 0.11 + shimmer * 0.12);
          color += vec3(0.56, 0.86, 0.97) * (fresnel * 0.25);
          color = mix(color, vec3(0.88, 0.98, 1.0), clamp(foam * 0.72 + crest * 0.24, 0.0, 0.88));
          float alpha = water * (0.87 + fresnel * 0.08 + specular * 0.03);
          // Three.js r128 does not inject the newer colorspace_fragment chunk.
          // Apply its sRGB output transfer here so the shader matches theme.html's color output.
          vec3 linearColor = max(color, vec3(0.0));
          vec3 encodedLow = linearColor * 12.92;
          vec3 encodedHigh = 1.055 * pow(linearColor, vec3(0.4166667)) - 0.055;
          vec3 srgbColor = mix(encodedLow, encodedHigh, step(vec3(0.0031308), linearColor));
          gl_FragColor = vec4(srgbColor, alpha);
        }
      `;

      class GregadoThemeTransition {
        constructor(host) {
          this.host = host;
          this.renderer = null;
          this.scene = new THREE.Scene();
          this.camera = null;
          this.effectGroup = new THREE.Group();
          this.frameId = 0;
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.oceanMesh = null;
          this.resizeHandler = () => this.resize();
          this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0.1, 1000);
          this.camera.position.z = 120;
          this.scene.add(this.effectGroup);
          this.scene.add(new THREE.AmbientLight(0xffffff, 1.15));
          const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
          directionalLight.position.set(-0.45, 0.7, 1);
          this.scene.add(directionalLight);
          const pointLight = new THREE.PointLight(0x93caff, 2, 1800);
          pointLight.position.set(this.width * 0.2, this.height * 0.36, 60);
          this.scene.add(pointLight);

          try {
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power", premultipliedAlpha: false });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
            this.renderer.setSize(this.width, this.height, false);
            this.renderer.setClearColor(0x000000, 0);
            if ("outputEncoding" in this.renderer && THREE.sRGBEncoding !== undefined) this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.domElement.setAttribute("aria-hidden", "true");
            this.renderer.domElement.style.display = "block";
            this.host.appendChild(this.renderer.domElement);
          } catch (error) {
            this.renderer = null;
            console.warn("Gregado theme transition renderer could not initialize:", error);
          }
          window.addEventListener("resize", this.resizeHandler, { passive: true });
        }

        resize() {
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.camera.left = -this.width / 2;
          this.camera.right = this.width / 2;
          this.camera.top = this.height / 2;
          this.camera.bottom = -this.height / 2;
          this.camera.updateProjectionMatrix();
          this.renderer?.setSize(this.width, this.height, false);
          if (this.oceanMesh) {
            const nextGeometry = this.createWaveGeometry();
            this.oceanMesh.geometry.dispose();
            this.oceanMesh.geometry = nextGeometry;
          }
          const pointLight = this.scene.children.find(item => item instanceof THREE.PointLight);
          if (pointLight) pointLight.position.set(this.width * 0.2, this.height * 0.36, 60);
        }

        clearEffect() {
          this.effectGroup.traverse(item => {
            item.geometry?.dispose();
            if (Array.isArray(item.material)) item.material.forEach(material => material.dispose());
            else item.material?.dispose();
          });
          this.effectGroup.clear();
          this.oceanMesh = null;
        }

        stopFrame() {
          if (this.frameId) window.cancelAnimationFrame(this.frameId);
          this.frameId = 0;
        }

        finish() {
          this.stopFrame();
          this.clearEffect();
          this.renderer?.clear();
          this.host.style.display = "none";
        }

        start() {
          this.stopFrame();
          this.clearEffect();
          if (!this.renderer) return false;
          this.host.style.display = "block";
          return true;
        }

        createWaveGeometry() {
          return new THREE.PlaneGeometry(
            this.width,
            this.height,
            Math.min(164, Math.max(72, Math.ceil(this.width / 7))),
            Math.min(116, Math.max(56, Math.ceil(this.height / 7)))
          );
        }

        wave(color, onComplete) {
          if (!this.start()) { onComplete(); return; }
          const geometry = this.createWaveGeometry();
          const uniforms = {
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uViewport: { value: new THREE.Vector2(this.width, this.height) },
            uColor: { value: new THREE.Color(color) }
          };
          const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.frustumCulled = false;
          this.oceanMesh = mesh;
          this.effectGroup.add(mesh);
          const startedAt = performance.now();
          let committed = false;
          const duration = 2050;
          const renderFrame = now => {
            if (!this.renderer) return;
            const progress = Math.min(1, (now - startedAt) / duration);
            uniforms.uTime.value = (now - startedAt) / 1000;
            uniforms.uProgress.value = progress * 2.08;
            uniforms.uViewport.value.set(this.width, this.height);
            if (!committed && progress >= 0.48) { committed = true; onComplete(); }
            this.renderer.render(this.scene, this.camera);
            if (progress < 1) this.frameId = window.requestAnimationFrame(renderFrame);
            else { if (!committed) onComplete(); this.finish(); }
          };
          this.frameId = window.requestAnimationFrame(renderFrame);
        }

        glassBurst(color, point, onComplete) {
          if (!this.start()) { onComplete(); return; }
          const count = Math.min(260, this.width < 600 ? 155 : 230);
          const geometry = new THREE.IcosahedronGeometry(1, 0);
          const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false });
          const shards = new THREE.InstancedMesh(geometry, material, count);
          shards.frustumCulled = false;
          const accent = new THREE.Color(color);
          const white = new THREE.Color("#FFFFFF");
          const particles = [];
          for (let index = 0; index < count; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const elevation = Math.random() * 1.25 - 0.48;
            const horizontal = Math.cos(elevation);
            const speed = 130 + Math.random() * 370;
            const tint = accent.clone().lerp(white, 0.19 + Math.random() * 0.54);
            shards.setColorAt(index, tint);
            particles.push({
              x: (Math.random() - 0.5) * 7, y: (Math.random() - 0.5) * 7, z: (Math.random() - 0.5) * 8,
              vx: Math.cos(angle) * horizontal * speed,
              vy: Math.sin(elevation) * speed + 42,
              vz: Math.sin(angle) * horizontal * speed * 0.48,
              rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: Math.random() * Math.PI,
              spinX: (Math.random() - 0.5) * 7, spinY: (Math.random() - 0.5) * 9, spinZ: (Math.random() - 0.5) * 8,
              scale: 1.1 + Math.random() * 3.2
            });
          }
          this.effectGroup.add(shards);
          const originX = point.x - this.width / 2;
          const originY = this.height / 2 - point.y;
          const ringGeometry = new THREE.RingGeometry(1, 0.075, 8, 72);
          const ringMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.set(originX, originY, 12);
          ring.scale.setScalar(4);
          this.effectGroup.add(ring);
          const dummy = new THREE.Object3D();
          const startedAt = performance.now();
          let committed = false;
          const duration = 1320;
          const renderFrame = now => {
            if (!this.renderer) return;
            const progress = Math.min(1, (now - startedAt) / duration);
            const elapsed = progress * (duration / 1000);
            const eased = 1 - Math.pow(1 - progress, 2.7);
            particles.forEach((particle, index) => {
              dummy.position.set(
                originX + particle.x + particle.vx * elapsed,
                originY + particle.y + particle.vy * elapsed - 170 * elapsed * elapsed,
                particle.z + particle.vz * elapsed
              );
              dummy.rotation.set(
                particle.rx + particle.spinX * elapsed,
                particle.ry + particle.spinY * elapsed,
                particle.rz + particle.spinZ * elapsed
              );
              dummy.scale.setScalar(particle.scale * (1 - progress * 0.16));
              dummy.updateMatrix();
              shards.setMatrixAt(index, dummy.matrix);
            });
            shards.instanceMatrix.needsUpdate = true;
            material.opacity = 0.92 * (1 - Math.max(0, (progress - 0.48) / 0.52));
            ring.scale.setScalar(4 + eased * Math.min(this.width, this.height) * 0.38);
            ringMaterial.opacity = Math.max(0, 0.8 * (1 - progress));
            if (!committed && progress >= 0.31) { committed = true; onComplete(); }
            this.renderer.render(this.scene, this.camera);
            if (progress < 1) this.frameId = window.requestAnimationFrame(renderFrame);
            else { if (!committed) onComplete(); this.finish(); }
          };
          this.frameId = window.requestAnimationFrame(renderFrame);
        }

        dispose() {
          this.stopFrame();
          this.clearEffect();
          window.removeEventListener("resize", this.resizeHandler);
          if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            this.renderer.domElement.remove();
            this.renderer = null;
          }
        }
      }

      let host = null;
      let transition = null;
      function getTransition() {
        if (!window.THREE) return null;
        if (!host) {
          host = document.createElement("div");
          host.className = "transition-stage";
          host.setAttribute("aria-hidden", "true");
          document.body.appendChild(host);
        }
        if (!transition) transition = new GregadoThemeTransition(host);
        return transition;
      }

      window.GregadoThemeFX = {
        playWave(color, callback) {
          const fx = getTransition();
          if (!fx) { callback(); return; }
          fx.wave(color, callback);
        },
        playGlassBurst(color, point, callback) {
          const fx = getTransition();
          if (!fx) { callback(); return; }
          fx.glassBurst(color, point || { x: window.innerWidth / 2, y: window.innerHeight / 2 }, callback);
        },
        dispose() { transition?.dispose(); transition = null; host?.remove(); host = null; }
      };

      // Compatibility bridge for any existing homepage code that calls the old hook.
      window.trigger3DThemeChange = function (targetColor, source) {
        const callback = () => { };
        if (source === "menu") window.GregadoThemeFX.playGlassBurst(targetColor, { x: window.innerWidth / 2, y: window.innerHeight / 2 }, callback);
        else window.GregadoThemeFX.playWave(targetColor, callback);
      };
    })();
