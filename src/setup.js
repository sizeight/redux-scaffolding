import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;
global.navigator = global.window.navigator;
global.document.cookie = 'csrftoken=abcd1234';
