class SceneController extends EventEmitter {
  constructor(controller, canvas) {
    super();
    this._controller = controller;
    this._scene = null;
    this._engine = null;
    this._canvas = canvas;
    this._camera = null;
    this._pillarlight = null;
    this._objects = [];
    this._frame = 0;
    this._pillar = null;
    this._root = null;
  }

  get controller() { return this._controller; }
  get canvas() { return this._canvas; }
  get camera() { return this._camera; }
  get scene() { return this._scene; }

  async prepare() {
    if (this._engine !== null) { return; }
    this._engine = await new BABYLON.Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
    this._scene = this._createScene();
    this._root = new BABYLON.TransformNode('root');
    this._addModels();
    this._startRenderLoop();

    const url = new URL(window.location.href);
    if (url.searchParams.has('debug')) {
      this._scene.debugLayer.show();
    }
  }

  _createScene() {
    const scene = new BABYLON.Scene(this._engine);
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogStart = 2;
    scene.fogEnd = 25;
    scene.fogColor = BABYLON.Color3.Black();
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
    this._camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, -10), scene);
    this._camera.fov = 1;
    this._camera.setTarget(new BABYLON.Vector3(0, 3, 1));
    // this._camera.attachControl(this._canvas, true);
    this._cameraController = new CameraController(this);
    this._cameraController.prepare();


    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    scene.imageProcessingConfiguration.exposure = 3;
    const pipeline = new BABYLON.DefaultRenderingPipeline('default', true, scene);
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.1;
    pipeline.bloomWeight = 3;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;
    pipeline.glowLayerEnabled = true;
    pipeline.glowLayer.blurKernelSize = 64;
    pipeline.glowLayer.intensity = 0.2;
    return scene;
  }

  async _addModels() {
    const caveMeshes = await this._importMesh(
      'cave-lg.glb',
      {
        parent: this._root,
        position: new BABYLON.Vector3(),
        rotation: new BABYLON.Vector3(),
        rotationQuaternion: null,
        receiveShadows: true
      }
    );
    const children = caveMeshes[0].getChildren();
    for (const child of children) {
      if (child.name === 'Plane') {
        child.material.roughness = 1;
      }
    }
    const torchMeshes = await this._importMesh(
      'torch.glb',
      {
        parent: this._root,
        position: new BABYLON.Vector3(5, 0, 4),
        rotation: new BABYLON.Vector3(),
        rotationQuaternion: null,
        receiveShadows: true
      }
    );
    const torch = torchMeshes[0];
    this._pillarlight = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 2.5, 0), this._scene);
    this._pillarlight.intensity = 150;
    this._pillarlight.diffuse = new BABYLON.Color3.FromHexString('#FF6645');
    this._pillarlight.parent = torchMeshes[0];
    const torch2 = torchMeshes[0].clone('torch2', this._root);
    torch2.position.x = -5;

    const particleSpawner = new ParticleSpawner(this);
    particleSpawner.prepare(torch, new BABYLON.Vector3(0, 2.5, 0));

    const particleSpawner2 = new ParticleSpawner(this);
    particleSpawner2.prepare(torch2, new BABYLON.Vector3(0, 2.5, 0));
  }

  _createShadows(meshes) {
    const shadowGenerator2 = new BABYLON.ShadowGenerator(1024, this._pillarlight);
    shadowGenerator.getShadowMap().renderList.push(...meshes);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 64;
  }

  _startRenderLoop() {
    this._engine.runRenderLoop(() => {
      this._frame++;
      this.emit('3d-frame', this._timerTime);
      if (this._scene && this._scene.activeCamera) {
        this._scene.render();
        this._engine.resize();
      }
      // for (const object of this._objects) {
      //   object.rotation.y += 0.001;
      // }
      // if (this._pillarlight === null) { return; }
      // const rate = (Math.cos(this._frame * 0.01) + 1) * 0.5;
      // this._pillarlight.intensity = Math.pow(rate * 5000, 2);
    });
  }

  async _importMesh(filename, details) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync('', 'models/', filename, this._scene);
    const { meshes } = result;
    meshes[0].name = `${meshes[1].name}_root`;
    const {
      parent,
      position,
      rotation,
      rotationQuaternion,
      scaling,
      receiveShadows
    } = details;
    if (typeof parent !== 'undefined') {
      meshes[0].parent = parent;
    }
    if (typeof position !== 'undefined') {
      meshes[0].position = position;
    }
    if (typeof rotation !== 'undefined') {
      meshes[0].rotation = rotation;
    }
    if (typeof rotationQuaternion !== 'undefined') {
      meshes[0].rotationQuaternion = null;
    }
    if (typeof scaling !== 'undefined') {
      meshes[0].scaling = scaling;
    }
    if (typeof receiveShadows !== 'undefined') {
      for (const mesh of meshes) {
        mesh.receiveShadows = receiveShadows;
      }
    }
    return meshes;
  }
}
