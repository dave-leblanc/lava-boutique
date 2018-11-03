const crud = require('./tasks/crud');
const cud = require('./tasks/cud_triggers');
const cron = require('./tasks/cron_sample');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const email_registration = require('./tasks/email_on_registration');
const imdb = require('./tasks/imdb');
const web_hook = require('./tasks/web_hook');
admin.initializeApp(functions.config().firebase);

// // Export Basic Crud Functions
//
exports.create = crud.create;
exports.read = crud.read;
exports.update = crud.update;
exports.delete = crud.delete;

exports.createTodo = cud.createTodo;
exports.updateTodo = cud.updateTodo;
exports.deleteTodo = cud.deleteTodo;

exports.accountcleanup = cron.accountcleanup;

exports.createUser = email_registration.createUser;
exports.search_movie = imdb.search_movie;

exports.github_hook = web_hook.github_hook;