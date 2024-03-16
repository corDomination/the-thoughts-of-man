class SceneController {
  constructor(canvas) {
    this._scene = null;
    this._engine = null;
    this._canvas = canvas;
    this._camera = null;
    this._sunlight = null;
  }

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
    this._createSkybox();
    this._camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);
    this._camera.setTarget(new BABYLON.Vector3(0, 0, 2000));
    this._camera.attachControl(this._canvas, true);
    this._camera.maxZ = 1000000;
    const light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 70000000;
    light.groundColor = BABYLON.Color3.FromHexString('#FFD96F');
    this._sunlight = light;
    return scene;
  }

  _createSkybox() {
    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size:100000.0 });
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox');
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('images/textures/skybox');
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }

  async _addModels() {
    await this._importMesh('earth.glb', new BABYLON.Vector3(0, 0, 2000));
    await this._importMesh('moon.glb', new BABYLON.Vector3(500, 0, 1200), new BABYLON.Vector3(0.1, 0.1, 0.1));
    const sunMeshes = await this._importMesh('sun.glb', new BABYLON.Vector3(4000, 0, -4000));
    this._sunlight.parent = sunMeshes[0];
    sunMeshes[1].material.emissiveColor = BABYLON.Color3.FromHexString('#FF9E47');
  }

  _startRenderLoop() {
    this._engine.runRenderLoop(() => {
      if (this._scene && this._scene.activeCamera) {
        this._scene.render();
        this._engine.resize();
      }
    });
  }

  async _importMesh(filename, position = new BABYLON.Vector3(0, 0, 0), scaling = new BABYLON.Vector3(1, 1, 1)) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync('', 'models/', filename, this._scene);
    const { meshes } = result;
    meshes[0].name = `${meshes[1].name}_root`;
    meshes[0].position = position;
    meshes[0].scaling = scaling;
    return meshes;
  }
}
