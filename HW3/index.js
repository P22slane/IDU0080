var koa = require('koa');
var jade = require('jade');
var mongel = require('mongel');
var parse = require(‘co-body');

var Page = mongel('pages', ‘mongodb://localhost/app');
var app = koa();

app.use(function* (next) {
	if (this.path != '/create') {
		yield next;
		return
	}
});