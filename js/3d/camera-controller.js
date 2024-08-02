class CameraController {
  constructor(sceneController) {
    this._sceneController = sceneController;
    this._eventListenerGroup = new EventListenerGroup();
    this._goalRotation = new BABYLON.Vector3();
  }

  prepare() {
    this._eventListenerGroup.addEventListener(document, 'mousemove', this._onDocumentMouseMove.bind(this));
    this._eventListenerGroup.on(this._sceneController, '3d-frame', this._on3dFrame.bind(this));
    const permissionRequestController = new PermissionRequestController();
    const section = this._sceneController.controller.getSectionByName('earth');
    permissionRequestController.prepare(section.element, this.getOrientation.bind(this));

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => {
        this.tilt([event.beta, event.gamma]);
      }, true);
    } else if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (event) => {
        this.tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
      }, true);
    } else {
      window.addEventListener('MozOrientation', () => {
        this.tilt([Screen.orientation.x * 50, Screen.orientation.y * 50]);
      }, true);
    }
  }

  tilt(value) {
    this._goalRotation = new BABYLON.Vector3(value[1] * 0.05, value[0] * 0.05, 0);
  }

  _onDocumentMouseMove(event) {
    console.log('mousemove');
    const rotationX = -(window.innerHeight / 2 - event.pageY) * 0.0002;
    const rotationY = -(window.innerWidth / 2 - event.pageX) * 0.0004;
    this._goalRotation = new BABYLON.Vector3(rotationX, rotationY, 0);
  }

  _on3dFrame() {
    this._sceneController.camera.rotation = BABYLON.Vector3.Lerp(this._sceneController.camera.rotation, this._goalRotation, 0.1);
  }

  async getOrientation() {
    if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
      return false;
    }

    const permission = await window.DeviceOrientationEvent.requestPermission();
    if (permission !== 'granted') {
      return false;
    }
    return true;
  }
}
