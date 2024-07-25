class ParticleSpawner {
  constructor(sceneController) {
    this._sceneController = sceneController;
  }

  prepare(parent, position) {
    const { scene } = this._sceneController;
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    const fireEmitter = new BABYLON.AbstractMesh('fireEmitter', scene);
    fireEmitter.parent = parent;
    fireEmitter.position = position;
    const noiseTexture1 = new BABYLON.NoiseProceduralTexture('perlin', 256, scene);
    noiseTexture1.animationSpeedFactor = 5;
    noiseTexture1.persistence = 0.2;
    noiseTexture1.brightness = 0.5;
    noiseTexture1.octaves = 4;

    // Particles
    const sparksCore = BABYLON.ParticleHelper.CreateDefault(fireEmitter, 300);
    sparksCore.name = 'Core'
    sparksCore.createBoxEmitter(new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(-0.2, 0, -0.2), new BABYLON.Vector3(0.2, 0, 0.2));
    sparksCore.particleTexture = new BABYLON.Texture('https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sparks/sparks.png', scene);
    sparksCore.minLifeTime = 3;
    sparksCore.maxLifeTime = 3;
    sparksCore.minSize = 0.07;
    sparksCore.maxSize = 0.25;
    sparksCore.emitRate = 20;
    sparksCore.minEmitPower = 1.5;
    sparksCore.maxEmitPower = 2.5;
    sparksCore.noiseTexture = noiseTexture1;
    sparksCore.noiseStrength = new BABYLON.Vector3(5, 1, 5);
    sparksCore.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    this.colorParticles(sparksCore);

    let delta = 0;
    scene.registerBeforeRender(() => {
      fireEmitter.position = new BABYLON.Vector3(Math.sin(delta) * 0.4, fireEmitter.position.y, 0);
      fireEmitter.rotation = new BABYLON.Vector3(Math.sin(delta) * 0.5, fireEmitter.position.y, 0);
      delta += 0.1;
    });

    sparksCore.start();
  }

  colorParticles = (system) => {
    system.addColorGradient(0.0, new BABYLON.Color4(0.9245, 0.6540, 0.0915, 1));
    system.addColorGradient(0.04, new BABYLON.Color4(0.9062, 0.6132, 0.0942, 1));
    system.addColorGradient(0.4, new BABYLON.Color4(0.7968, 0.3685, 0.1105, 1));
    system.addColorGradient(0.7, new BABYLON.Color4(0.6886, 0.1266, 0.1266, 1));
    system.addColorGradient(0.9, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));
    system.addColorGradient(1.0, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));

    // Defines the color ramp to apply
    system.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
    system.addRampGradient(1.0, new BABYLON.Color3(0.7968, 0.3685, 0.1105));
    system.useRampGradients = true;

    system.addColorRemapGradient(0, 0, 0.1);
    system.addColorRemapGradient(0.2, 0.1, 0.8);
    system.addColorRemapGradient(0.3, 0.2, 0.85);
    system.addColorRemapGradient(0.35, 0.4, 0.85);
    system.addColorRemapGradient(0.4, 0.5, 0.9);
    system.addColorRemapGradient(0.5, 0.95, 1.0);
    system.addColorRemapGradient(1.0, 0.95, 1.0);
  }
}
