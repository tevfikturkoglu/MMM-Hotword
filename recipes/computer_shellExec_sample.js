var recipe = {
  models: [
    {
      hotwords    : "computer",
      file        : "computer.umdl",
      sensitivity : "0.6",
    },
  ],
  customCommands: {
    "computer": {
      shellExec: {
        exec: (hotword, file) => {
          return "pm2 stop all"
        }
      }
    }
  }
}

exports.recipe = recipe // Don't remove this line.
