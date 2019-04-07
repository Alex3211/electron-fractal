const presets = require('./config.json')
module.exports = class SettingsManager {
  constructor() {
    this.settings = {
      drawManager: {
        active: true,
        size: 150,
        angle: 0.4,
        scale: 0.67,
        iterations: 5,
        animate: true,
        speed: 0.3,
        offset: 0,
        slices: 13,
        arcAngle: 0.1,
        strokeSize: 1,
        strokeColor: {
          color: '#FFF',
          backgroundColor: '#000000'
        },
        bgSpaceGradient: '#CCC',
        mode: 'preset 1',
        lastModified: 'preset 1'
      },
      backgroundSpace: {
        active: true,
        loopContextGlobalAplha: 0.4,
        bgSpaceGradient: '#CCC',
        loopContextGlobalAlphaTwo: 1,
        strokeStyle: '#FFF',
        drawPointFillStyle: '#FAA',
        drawPointGlobalAlpha: 1
      }
    }
    this.presets = presets.data
  }
  changeSettingsConfig() {
    for (let index = 0; index < presets.data.length; index++) {
      const preset = presets.data[index];
      if (!this.settings.drawManager.lastModified !== preset.is && this.settings.drawManager.mode === preset.is) {
        const keyArray = Object.keys(preset);
        for (let keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
          const keyPreset = keyArray[keyIndex];
          this.settings.drawManager[keyPreset] = preset[keyPreset];
        }
      }
    }
  }
}