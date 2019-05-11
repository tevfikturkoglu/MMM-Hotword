var recipe = {
  models: [
    {
      hotwords    : "smart_mirror",
      file        : "smart_mirror.umdl",
      sensitivity : "0.5",
    },
  ],
  customCommands: {
    "smart_mirror": {
      moduleExec: {
        module: ["clock"],
        exec: (module, hotword, file) => {
          module.hide()
        }
      }
    }
  }
}

exports.recipe = recipe // Don't remove this line.
