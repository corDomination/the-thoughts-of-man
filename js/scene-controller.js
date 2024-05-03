class SceneController {
  constructor(canvas) {
    this._scene = null;
    this._engine = null;
    this._canvas = canvas;
    this._camera = null;
    this._sunlight = null;
    this._moonlight = null;
    this._pillarlight = null;
    this._objects = [];
    this._frame = 0;
    this._pillar = null;
  }

  get canvas() { return this._canvas; }

  async prepare() {
    this._engine = await new BABYLON.Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
    this._scene = this._createScene();
    this._addModels();
    const gl = new BABYLON.GlowLayer('glow', this._scene, {
      mainTextureFixedSize: 256,
      blurKernelSize: 64
    });
    this._startRenderLoop();
    // this._scene.debugLayer.show();
  }

  _createScene() {
    const scene = new BABYLON.Scene(this._engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this._camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-2345.337, 1025.595, 3213.437), scene);
    this._camera.setTarget(new BABYLON.Vector3(-848.943, 403.618, 1939.095));
    this._camera.attachControl(this._canvas, true);
    this._camera.maxZ = 1000000;
    this._camera.speed = 20;
    const light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 70000000;
    light.diffuse = new BABYLON.Color3.FromHexString('#fcba03');
    this._sunlight = light;

    const light2 = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 700000;
    light2.diffuse = new BABYLON.Color3.FromHexString('#00ff22');
    this._moonlight = light2;

    const light3 = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light3.intensity = 0;
    light3.diffuse = new BABYLON.Color3.FromHexString('#0000ff');
    this._pillarlight = light3;
    return scene;
  }

  async _addModels() {
    const earthMeshes = await this._importMesh('earth.glb', new BABYLON.Vector3(0, 0, 2000), new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 2, 0.2));
    const moonMeshes = await this._importMesh('moon.glb', new BABYLON.Vector3(500, 0, 1200), new BABYLON.Vector3(0.1, 0.1, 0.1));
    const lightMoonMeshes = await this._importMesh('moon.glb', new BABYLON.Vector3(500, 0, -1200), new BABYLON.Vector3(0.1, 0.1, 0.1));
    moonMeshes[0].parent = earthMeshes[0];
    const sunMeshes = await this._importMesh('sun.glb', new BABYLON.Vector3(4000, 0, -4000));
    lightMoonMeshes[0].parent = earthMeshes[0];
    this._moonlight.parent = lightMoonMeshes[0];
    lightMoonMeshes[1].material.emissiveColor = BABYLON.Color3.FromHexString('#009E22');
    this._sunlight.parent = sunMeshes[0];
    sunMeshes[1].material.emissiveColor = BABYLON.Color3.FromHexString('#FF9E47');
    const box = BABYLON.MeshBuilder.CreateBox('box', {});
    box.scaling = new BABYLON.Vector3(10, 10, 250);
    box.parent = earthMeshes[0];
    box.position = new BABYLON.Vector3(0, 0, 520.000);
    const material = new BABYLON.StandardMaterial('pillar-material');
    material.emissiveColor = BABYLON.Color3.FromHexString('#0055ff');
    box.material = material;
    this._pillarlight.parent = box;
    this._objects = [earthMeshes[0], moonMeshes[0], sunMeshes[0]];
    this._pillar = box;
  }

  _startRenderLoop() {
    this._engine.runRenderLoop(() => {
      this._frame++;
      if (this._scene && this._scene.activeCamera) {
        this._scene.render();
        this._engine.resize();
      }
      for (const object of this._objects) {
        object.rotation.y += 0.001;
      }
      if (this._pillarlight === null || this._pillar === null) { return; }
      const rate = (Math.cos(this._frame * 0.01) + 1) * 0.5;
      this._pillarlight.intensity = Math.pow(rate * 1000, 2);
      this._pillar.material.alpha = rate;
    });
  }

  async _importMesh(filename, position = new BABYLON.Vector3(0, 0, 0), scaling = new BABYLON.Vector3(1, 1, 1), rotation = new BABYLON.Vector3(0, 0, 0)) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync('', 'models/', filename, this._scene);
    const { meshes } = result;
    meshes[0].name = `${meshes[1].name}_root`;
    meshes[0].position = position;
    meshes[0].scaling = scaling;
    meshes[0].rotationQuaternion = null;
    meshes[0].rotation = rotation;
    return meshes;
  }
}
