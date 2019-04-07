const dat = require('dat.gui');
module.exports = class DrawManager {
  constructor(context) {
    this.gui = new dat.GUI();
    this.gui.add(context.settingsManager.settings, 'animate');
    this.gui.add(context.settingsManager.settings, 'mode', ['preset 1', 'tunnel', 'tunnel2']).listen().onFinishChange((e) => context.settingsManager.changeSettingsConfig());
    this.gui.add(context.settingsManager.settings, 'scale', 0, 4).step(0.1).listen();
    this.gui.add(context.settingsManager.settings, 'arcAngle', 0, 2).step(0.1).listen();
    this.gui.add(context.settingsManager.settings, 'angle', 0, Math.PI);
    this.gui.add(context.settingsManager.settings, 'iterations', 0, 12).step(1).listen();
    this.gui.add(context.settingsManager.settings, 'speed', 0, 2).listen();
    this.gui.add(context.settingsManager.settings, 'offset', 0, Math.PI * 2).listen();
    this.gui.add(context.settingsManager.settings, 'slices', 1, 40).step(1).listen();
    this.gui.addColor(context.settingsManager.settings.strokeColor, 'color').listen();
    this.gui.addColor(context.settingsManager.settings.strokeColor, 'backgroundColor').listen();
  }
}