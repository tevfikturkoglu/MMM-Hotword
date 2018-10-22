//
// Module : MMM-Hotword
//

'use strict'

const path = require('path')

const record = require('node-record-lpcm16')
const Detector = require('snowboy').Detector
const Models = require('snowboy').Models

var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    console.log(this.name + " started");
    this.config = {}
    this.status = 'OFF'
    this.restart = false
  },

  initializeAfterLoading: function (config) {
    this.config = config
    this.restart = this.config.autorestart
  },

  socketNotificationReceived: function (notification, payload) {
    switch(notification) {

      case 'INIT':
        this.initializeAfterLoading(payload)
        this.sendSocketNotification('INITIALIZED')
        break
      case 'RESUME':
        if (this.status == 'OFF') {
          this.status = 'ON'
          this.activate()
          this.sendSocketNotification('RESUMED')
        } else {
          this.sendSocketNotification('NOT_RESUMED')
        }
        break
      case 'PAUSE':
        if (this.status == 'ON') {
          this.status = 'OFF'
          this.deactivate()
          this.sendSocketNotification('PAUSED')
        } else {
          this.sendSocketNotification('NOT_PAUSED')
        }
        break
    }
  },

  activate: function() {
    var testMic = this.config.testMic
    console.log("TESTMIC:", testMic)
    var models = new Models();
    this.config.snowboy.forEach((model)=>{
      model.file = path.resolve(__dirname, model.file)
      models.add(model)
    })
    var mic = record.start(this.config.record)
    console.log(mic)
    var detector = new Detector({
      resource: path.resolve(__dirname, "resources/common.res"),
      models: models,
      audioGain: 2.0,
    })
    console.log('[HOTWORD] begins listening.')
    detector
      .on('silence', ()=>{
        if (testMic) {
          console.log("[HOTWORD] Still Silence.")
        }
        //do nothing
      })
      .on('sound', (buffer)=>{
        if (testMic) {
          console.log("[HOTWORD] Sound Captured.")
        }
        //do nothing
      })
      .on('error', (err)=>{
        console.log('[HOTWORD] Detector Error', err)
        this.stopListening()
        mic = null
        this.sendSocketNotification('ERROR', 'DETECTOR')
        return
      })
      .on('hotword', (index, hotword, buffer)=>{
        console.log('[HOTWORD] << ', hotword, ' >> is detected.')
        if (this.restart == false) {
          this.stopListening()
          mic = null
        }
        this.sendSocketNotification('DETECTED', {index:index, hotword:hotword})
        return
      })

    mic.pipe(detector);
  },

  deactivate: function() {
    this.stopListening()

  },

  stopListening: function() {
    console.log('[HOTWORD] stops listening')
    record.stop()
    this.status = 'OFF'
  }
})
