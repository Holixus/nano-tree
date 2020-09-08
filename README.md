[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

# nano-tree
Very convenient objects hierarchies creation library.


## Example

```js
var nano = require('nano-tree');

function MenuPage(type, id) {
	nano.Node.call(this, type, id);
}

MenuPage.prototype = {
	toString: function () { return this.type+(this.id.charAt(0) !== '$' ? '#'+this.id : ''); }
};

function MenuGroup(type, id) {
	nano.Group.call(this, type, id);
};

MenuGroup.prototype = {
	toString: function () {
		var cs = this.children;
		return MenuPage.prototype.toString.call(this)+':['+Object.keys(cs).map(function (key) {
			return cs[key].toString();
		}).join(',')+']';
	}
};

nano.Node.expand(MenuPage);
nano.Group.expand(MenuGroup);

MenuGroup.install('page', MenuPage);
MenuGroup.install('group', MenuGroup);

var menu = 
(new MenuGroup('menu', 'root'))
	.group('internet')
		.page('wan')
		.up
	.group('system')
		.page('options')
		.page('reboot')
		.page('options') // test of duplicated id
		.up
	.group()
		.page()
		.up;

assert.strictEqual('menu#root:[group#internet:[page#wan],group#system:[page#reboot,page#options],group:[page]]', menu.toString());

```

[bithound-image]: https://www.bithound.io/github/Holixus/nano-tree/badges/score.svg
[bithound-url]: https://www.bithound.io/github/Holixus/nano-tree

[gitter-image]: https://badges.gitter.im/Holixus/nano-tree.svg
[gitter-url]: https://gitter.im/Holixus/nano-tree

[npm-image]: https://badge.fury.io/js/nano-tree.svg
[npm-url]: https://badge.fury.io/js/nano-tree

[github-tag]: http://img.shields.io/github/tag/Holixus/nano-tree.svg
[github-url]: https://github.com/Holixus/nano-tree/tags

[travis-image]: https://travis-ci.org/Holixus/nano-tree.svg?branch=master
[travis-url]: https://travis-ci.org/Holixus/nano-tree

[coveralls-image]: https://coveralls.io/repos/github/Holixus/nano-tree/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Holixus/nano-tree?branch=master

[david-image]: https://david-dm.org/Holixus/nano-tree.svg
[david-url]: https://david-dm.org/Holixus/nano-tree

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[downloads-image]: http://img.shields.io/npm/dt/nano-tree.svg
[downloads-url]: https://npmjs.org/package/nano-tree
