'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const control = require('./control.js')

mongoose.Promise = Promise

function MongooseConnector(collection) {
    this.dbpath = 'mongodb://localhost:27017/' + collection
    this.connection = mongoose.createConnection(this.dbpath)
    this.connection.on('connected', onConnected.bind(this));
    this.connection.on('error', onError.bind(this));
    this.connection.on('disconnected', onDisconnected.bind(this));
    this.schemaInited = !1
    this.connected = !1
    this.model = null
}

MongooseConnector.Schema = Schema

MongooseConnector.prototype.initSchema = function (modelName, schemaOpt) {
    if (modelName && schemaOpt) {
        if (schemaOpt instanceof Schema) {
            this.model = this.connection.model(modelName, schemaOpt);
        } else {
            this.model = this.connection.model(modelName, new Schema(schemaOpt));
        }
        this.schemaInited = !0;
    }
}

MongooseConnector.prototype.insert = function (opt) {
    return this.connected && this.schemaInited ? control.insert(this.model, opt) : "unconnected  or schemaUninited"
}

MongooseConnector.prototype.delete = function (condition) {
    return this.connected && this.schemaInited ? control.delete(this.model, condition) : "unconnected  or schemaUninited"
}

MongooseConnector.prototype.find = function (condition, opt) {
    return this.connected && this.schemaInited ? control.find(this.model, condition, opt) : "unconnected  or schemaUninited"
}

MongooseConnector.prototype.update = function (condition, update) {
    return this.connected && this.schemaInited ? control.update(this.model, condition, update) : "unconnected  or schemaUninited"
}

MongooseConnector.prototype.findAllByConditions = function (condition, outputOpt) {
    return this.connected && this.schemaInited ? control.findAllByConditions(this.model, condition, outputOpt) : "unconnected  or schemaUninited"
}

MongooseConnector.prototype.getCount = function () {
    return this.connected && this.schemaInited ? control.getCount(this.model) : "unconnected  or schemaUninited"
}

function onConnected() {
    this.connected = !0
    console.log('Mongoose connection open to ' + this.dbpath);
}

function onError(err) {
    console.log('Mongoose connection error: ' + err);
    this.schemaInited = !1
    this.connected = !1
}

function onDisconnected() {
    console.log('Mongoose connection disconnected');
    this.schemaInited = !1
    this.connected = !1
}

module.exports = MongooseConnector
