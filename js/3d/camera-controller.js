class CameraController {
  constructor(sceneController) {
    this._sceneController = sceneController;
    this._eventListenerGroup = new EventListenerGroup();
    this._goalRotation = new BABYLON.Vector3();
  }

  prepare() {
    this._eventListenerGroup.addEventListener(document, 'mousemove', this._onDocumentMouseMove.bind(this));
    this._eventListenerGroup.on(this._sceneController, '3d-frame', this._on3dFrame.bind(this));
  }

  _onDocumentMouseMove(event) {
    console.log('mousemove');
    const rotationX = -(window.innerHeight / 2 - event.pageY) * 0.0005;
    const rotationY = -(window.innerWidth / 2 - event.pageX) * 0.0007;
    this._goalRotation = new BABYLON.Vector3(rotationX, rotationY, 0);
  }

  _on3dFrame() {
    // this._sceneController.camera.rotation = BABYLON.Vector3.Lerp(this._sceneController.camera.rotation, this._goalRotation, 0.1);
  }
}
