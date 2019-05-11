var recipe = {
  models: [
    {
      hotwords    : "snowboy",
      file        : "snowboy.umdl",
      sensitivity : "0.5",
    },
  ],
  customCommands: {
    "snowboy": {
      notificationExec: {
        notification: "SHOW_ALERT",
        payload: (hotword, file) => {
          return {"message": `Detected:${hotword}`, timeout:2000}
        }
      }
    }
  }
}

exports.recipe = recipe // Don't remove this line.
