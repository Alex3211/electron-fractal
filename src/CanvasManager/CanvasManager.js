const DrawManager = require('../DrawManager');
const GUIManager = require('../GUIManager');
const SettingsManager = require('../SettingsManager');
module.exports = class CanvasManager {
  constructor() {
    this.settingsManager = new SettingsManager();
    this.width = 0;
    this.height = 0;
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.bufferCanvas = document.createElement('canvas');
    this.bufferContext = this.bufferCanvas.getContext('2d');
    window.addEventListener('resize', this.resize(this));
    this.resize(this);
    this.drawManager = new DrawManager(this.settingsManager.settings, this.width, this.height, this.canvas, this.context, this.bufferCanvas, this.bufferContext);
    this.drawManager.draw(this.settingsManager.settings, this.width, this.height, this.canvas, this.context, this.bufferCanvas, this.bufferContext);
    this.guiManager = new GUIManager(this);
  }
  resize(context) {
    context.width = context.bufferCanvas.width = context.canvas.width = window.innerWidth;
    context.height = context.bufferCanvas.height = context.canvas.height = window.innerHeight;
    context.bufferContext.translate(context.width * 0.5, context.height);
  }
}