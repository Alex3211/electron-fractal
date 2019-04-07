const dat = require('dat.gui');
module.exports = class DrawManager {
  constructor(context) {
    this.context = context;
    this.gui = new dat.GUI();
    document.addEventListener('keypress', (event) => {
      if(event.key === 'a') {
        console.log(
          JSON.stringify(context.settingsManager.settings.drawManager)
        )
      }
    });
    this.setDrawManagerConfig();
    this.setSpaceDrawConfig();
  }
  setSpaceDrawConfig() {
    const folder = this.gui.addFolder('Space Background')
    folder.add(this.context.settingsManager.settings.backgroundSpace, 'active');
    folder.add(this.context.settingsManager.settings.backgroundSpace, 'loopContextGlobalAplha', 0, 1).step(0.1).listen();
    folder.addColor(this.context.settingsManager.settings.backgroundSpace, 'bgSpaceGradient').listen();
    folder.add(this.context.settingsManager.settings.backgroundSpace, 'loopContextGlobalAlphaTwo', 0, 1).step(0.1).listen();
    folder.addColor(this.context.settingsManager.settings.backgroundSpace, 'strokeStyle').listen();
    folder.addColor(this.context.settingsManager.settings.backgroundSpace, 'drawPointFillStyle').listen();
    folder.add(this.context.settingsManager.settings.backgroundSpace, 'drawPointGlobalAlpha', 0, 1).step(0.1).listen();

  }
  setDrawManagerConfig() {
    const folder = this.gui.addFolder('Fractales')
    folder.add(this.context.settingsManager.settings.drawManager, 'active');
    folder.add(this.context.settingsManager.settings.drawManager, 'animate');
    folder.add(this.context.settingsManager.settings.drawManager, 'mode', this.getPreset()).listen().onFinishChange((e) => this.context.settingsManager.changeSettingsConfig());
    folder.add(this.context.settingsManager.settings.drawManager, 'scale', 0, 4).step(0.1).listen();
    folder.add(this.context.settingsManager.settings.drawManager, 'arcAngle', 0, 2).step(0.1).listen();
    folder.add(this.context.settingsManager.settings.drawManager, 'angle', 0, Math.PI);
    folder.add(this.context.settingsManager.settings.drawManager, 'iterations', 0, 12).step(1).listen();
    folder.add(this.context.settingsManager.settings.drawManager, 'speed', 0, 2).listen();
    folder.add(this.context.settingsManager.settings.drawManager, 'offset', 0, Math.PI * 2).listen();
    folder.add(this.context.settingsManager.settings.drawManager, 'slices', 1, 40).step(1).listen();
    folder.addColor(this.context.settingsManager.settings.drawManager.strokeColor, 'color').listen();
    folder.addColor(this.context.settingsManager.settings.backgroundSpace, 'bgSpaceGradient').listen();
  }
  getPreset() {
    const presets = [];
    for (let index = 0; index < this.context.settingsManager.presets.length; index++) {
      const element = this.context.settingsManager.presets[index];
      presets.push(element.is);
    }
    return presets;
  }
}