const DrawManager = require('../DrawManager');
const GUIManager = require('../GUIManager');
const SettingsManager = require('../SettingsManager');
const SpaceDraw = require('../SpaceDraw');
module.exports = class CanvasManager {
  constructor() {
    this.settingsManager = new SettingsManager();
    this.width = 0;
    this.height = 0;
    this.canvasSpace = document.getElementById('canvasSpace');
    this.contextCanvasSpace = this.canvasSpace.getContext('2d');
    this.canvas = document.getElementById('canvasManager');
    this.context = this.canvas.getContext('2d');
    this.bufferCanvas = document.createElement('canvas');
    this.bufferContext = this.bufferCanvas.getContext('2d');
    window.addEventListener('resize', this.resize(this));
    this.resize(this);
    this.spaceDraw = new SpaceDraw(this.settingsManager.settings, this.width, this.height, this.canvasSpace, this.contextCanvasSpace);
    this.drawManager = new DrawManager(this.settingsManager.settings, this.width, this.height, this.canvas, this.context, this.bufferCanvas, this.bufferContext);
    this.spaceDraw.draw();
    this.drawManager.draw(this.settingsManager.settings, this.width, this.height, this.canvas, this.context, this.bufferCanvas, this.bufferContext);
    this.guiManager = new GUIManager(this);
  }
  resize(context) {
    context.width = context.bufferCanvas.width = context.canvas.width = window.innerWidth;
    context.height = context.bufferCanvas.height = context.canvas.height = window.innerHeight;  
		context.canvasSpace.width = context.width;
		context.canvasSpace.height = context.height;
		this.settingsManager.settings.bgSpaceGradient=context.contextCanvasSpace.createRadialGradient((context.width >> 1), context.height >> 1, context.width, context.width >> 1, context.height >> 1, 0);
		this.settingsManager.settings.bgSpaceGradient.addColorStop(1, '#b7b7b7');
    this.settingsManager.settings.bgSpaceGradient.addColorStop(0.2, '#21b3bc');
    

    context.bufferContext.translate(context.width * 0.5, context.height);
  }
}