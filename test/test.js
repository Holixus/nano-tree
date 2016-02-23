var assert = require('core-assert');

var nano = require('../index.js');

suite('API', function () {
	test('Group.add() to empty', function (done) {
		var g = new nano.Group('group','abs'),
		    n = new nano.Node('node', 'added'),
		    rg = 0;
		g.regroup = function () { ++rg; };
		g.add(n);
		assert.strictEqual(n.up, g, 'node.up !== group');
		assert.strictEqual(g.first, n, 'group.first !== node');
		assert.strictEqual(g.last, n, 'group.last !== node');
		assert.strictEqual(g.children.added, n, 'group.children.added !== node');
		assert.strictEqual(g.length, 1);
		assert.strictEqual(rg, 1);
		done();
	});

	test('Group.add()', function (done) {
		var g = new nano.Group('group', 'abs'),
		    first = new nano.Node('node', 'first'),
		    n = new nano.Node('node', 'added');
		g.add(first).add(n);
		assert.strictEqual(first.up, g, 'first.up !== group');
		assert.strictEqual(n.up, g, 'node.up !== group');
		assert.strictEqual(g.first, first, 'group.first !== first');
		assert.strictEqual(g.last, n, 'group.last !== node');
		assert.strictEqual(g.children.first, first, 'group.children.first !== first');
		assert.strictEqual(g.children.added, n, 'group.children.added !== node');
		assert.strictEqual(g.length, 2);
		done();
	});

	test('Group.add() duplicate', function (done) {
		var g = new nano.Group('group', 'abs'),
		    first = new nano.Node('node', 'first'),
		    n = new nano.Node('node', 'added'),
		    dup = new nano.Node('node', 'first');
		g.add(first).add(n).add(dup);
		assert.strictEqual(first.up, undefined, 'first.up !== undefined');
		assert.strictEqual(n.up, g, 'node.up !== group');
		assert.strictEqual(dup.up, g, 'dup.up !== group');
		assert.strictEqual(g.first, n, 'group.first !== node');
		assert.strictEqual(g.last, dup, 'group.last !== dup');
		assert.strictEqual(g.children.first, dup, 'group.children.first !== dup');
		assert.strictEqual(g.children.added, n, 'group.children.added !== node');
		assert.strictEqual(g.length, 2);
		done();
	});

	test('Group.remove() single in group node', function (done) {
		var group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added'),
		    rg = 0,
		    prerem = 0,
		    postrem = 0;

		group.regroup = function () { ++rg; };
		node.predrop = function () {
			++prerem;
		};
		node.postdrop = function () {
			++postrem;
		};
		group.add(node);
		assert.strictEqual(node.up, group, 'node.up !== group');
		assert.strictEqual(group.first, node, 'group.first !== node');
		assert.strictEqual(group.last, node, 'group.last !== node');
		assert.strictEqual(group.children.added, node, 'group.children.added !== node');
		assert.strictEqual(group.length, 1);
		assert.strictEqual(prerem, 0);
		assert.strictEqual(postrem, 0);
		assert.strictEqual(rg, 1);

		group.remove(node);

		assert.strictEqual(node.up, undefined, 'node.up !== undefined');
		assert.strictEqual(group.first, undefined, 'group.first !== undefined');
		assert.strictEqual(group.last, undefined, 'group.last !== undefined');
		assert.strictEqual(group.children.added, undefined, 'group.children.added !== undefined');
		assert.strictEqual(group.length, 0);
		assert.strictEqual(prerem, 1, 'predrop wasn`t called');
		assert.strictEqual(postrem, 1, 'postdrop wasn`t called');
		assert.strictEqual(rg, 2, 'regroup wasn`t called by remove');
		done();
	});

	test('Group.remove() first node', function (done) {
		var group = new nano.Group('group','abs'),
			first = new nano.Node('node', 'first'),
		    node = new nano.Node('node', 'added'),
		    rg = 0,
		    prerem = 0,
		    postrem = 0;

		group.regroup = function () { ++rg; };
		first.predrop = function () {
			++prerem;
		};
		first.postdrop = function () {
			++postrem;
		};
		group.add(first).add(node);

		group.remove(first);

		assert.strictEqual(first.up, undefined, 'first.up !== undefined');
		assert.strictEqual(node.up, group, 'node.up !== group');
		assert.strictEqual(group.first, node, 'group.first !== node');
		assert.strictEqual(group.last, node, 'group.last !== node');
		assert.strictEqual(group.children.first, undefined, 'group.children.first !== undefined');
		assert.strictEqual(group.children.added, node, 'group.children.added !== node');
		assert.strictEqual(group.length, 1);
		assert.strictEqual(prerem, 1, 'predrop wasn`t called');
		assert.strictEqual(postrem, 1, 'postdrop wasn`t called');
		assert.strictEqual(rg, 3, 'regroup wasn`t called by remove');
		done();
	});

	test('Group.remove() last node', function (done) {
		var group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added'),
			last = new nano.Node('node', 'last'),
		    rg = 0,
		    prerem = 0,
		    postrem = 0;

		group.regroup = function () { ++rg; };
		last.predrop = function () {
			++prerem;
		};
		last.postdrop = function () {
			++postrem;
		};
		group.add(node).add(last);

		group.remove(last);

		assert.strictEqual(last.up, undefined, 'last.up !== undefined');
		assert.strictEqual(node.up, group, 'node.up !== group');
		assert.strictEqual(group.first, node, 'group.first !== node');
		assert.strictEqual(group.last, node, 'group.last !== node');
		assert.strictEqual(group.children.last, undefined, 'group.children.last !== undefined');
		assert.strictEqual(group.children.added, node, 'group.children.added !== node');
		assert.strictEqual(group.length, 1);
		assert.strictEqual(prerem, 1, 'predrop wasn`t called');
		assert.strictEqual(postrem, 1, 'postdrop wasn`t called');
		assert.strictEqual(rg, 3, 'regroup wasn`t called by remove');
		done();
	});

	test('Group.remove() alien node', function (done) {
		var group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added'),
			last = new nano.Node('node', 'last'),
		    group2 = new nano.Group('group','abs'),
			alien = new nano.Node('node', 'alien');

		group.add(node).add(last);
		group2.add(alien);

		group.remove(alien);

		assert.strictEqual(alien.up, group2, 'alien.up !== group2');
		assert.strictEqual(group.length, 2);
		done()
	});

	test('Node.drop()', function (done) {
		var group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added');
		group.add(node);
		assert.strictEqual(group.length, 1);
		node.drop();
		assert.strictEqual(node.up, undefined);
		assert.strictEqual(group.last, undefined);
		assert.strictEqual(group.first, undefined);
		assert.strictEqual(group.length, 0);
		done();
	});

	test('Node.drop() of free node', function (done) {
		var node = new nano.Node('node', 'added');
		node.drop();
		done();
	});

	test('Group.empty()', function (done) {
		var group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added');
		group.add(node);
		assert.strictEqual(group.length, 1);
		group.empty();
		assert.strictEqual(node.up, undefined);
		assert.strictEqual(group.last, undefined);
		assert.strictEqual(group.first, undefined);
		assert.strictEqual(group.length, 0);
		done();
	});

	test('Group.destroy()', function (done) {
		var top = new nano.Group('group','top'),
		    group = new nano.Group('group','abs'),
		    node = new nano.Node('node', 'added'),
		    node2 = new nano.Node('node', 'added2'),
		    node3 = new nano.Node('node', 'added3');
		top.add(group.add(node).add(node2).add(node3));
		assert.strictEqual(top.length, 1);
		assert.strictEqual(group.length, 3);
		group.destroy();
		assert.strictEqual(top.length, 0);
		assert.strictEqual(group.length, 0);
		assert.strictEqual(node.up, undefined);
		assert.strictEqual(node2.up, undefined);
		assert.strictEqual(node3.up, undefined);
		assert.strictEqual(group.up, undefined);
		done();
	});

	test('Node.expand()', function (done) {
		function MenuPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuPage.prototype = {
		};

		nano.Node.expand(MenuPage);
		assert.deepStrictEqual(nano.Node.prototype, MenuPage.prototype);
		assert.deepStrictEqual([MenuPage], MenuPage.hiers);
		assert.strictEqual(nano.Node.expand, MenuPage.expand);
		assert.strictEqual(nano.Node.uid, MenuPage.uid);
		assert.strictEqual(nano.Node.install, MenuPage.install);
		assert.strictEqual(nano.Node, MenuPage.ancestor);
		done();
	});

	test('Node.expand() 2nd level', function (done) {
		function MenuPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuPage.prototype = {
		};

		nano.Node.expand(MenuPage);

		assert.deepStrictEqual(nano.Node.prototype, MenuPage.prototype);
		assert.deepStrictEqual([MenuPage], MenuPage.hiers);
		assert.strictEqual(nano.Node.expand, MenuPage.expand);
		assert.strictEqual(nano.Node.uid, MenuPage.uid);
		assert.strictEqual(nano.Node.install, MenuPage.install);
		assert.strictEqual(nano.Node, MenuPage.ancestor);

		function MenuSubPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuSubPage.prototype = {
		};

		MenuPage.expand(MenuSubPage);

		assert.deepStrictEqual(MenuPage.prototype, MenuSubPage.prototype);
		assert.deepStrictEqual([MenuSubPage], MenuSubPage.hiers);
		assert.strictEqual(MenuPage.expand, MenuSubPage.expand);
		assert.strictEqual(MenuPage.uid, MenuSubPage.uid);
		assert.strictEqual(MenuPage.install, MenuSubPage.install);
		assert.strictEqual(MenuPage, MenuSubPage.ancestor);

		assert.deepStrictEqual([MenuPage, MenuSubPage], MenuPage.hiers);

		done();
	});

	test('Node.expand() 2nd level with cut off', function (done) {
		function MenuPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuPage.prototype = {
		};

		nano.Node.expand(MenuPage);

		assert.deepStrictEqual(nano.Node.prototype, MenuPage.prototype);
		assert.deepStrictEqual([MenuPage], MenuPage.hiers);
		assert.strictEqual(nano.Node.expand, MenuPage.expand);
		assert.strictEqual(nano.Node.uid, MenuPage.uid);
		assert.strictEqual(nano.Node.install, MenuPage.install);
		assert.strictEqual(nano.Node, MenuPage.ancestor);

		function MenuSubPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuSubPage.prototype = {
		};

		MenuPage.expand(MenuSubPage, true);

		assert.deepStrictEqual(MenuPage.prototype, MenuSubPage.prototype);
		assert.deepStrictEqual([MenuSubPage], MenuSubPage.hiers);
		assert.strictEqual(MenuPage.expand, MenuSubPage.expand);
		assert.strictEqual(MenuPage.uid, MenuSubPage.uid);
		assert.strictEqual(MenuPage.install, MenuSubPage.install);
		assert.strictEqual(undefined, MenuSubPage.ancestor);

		assert.deepStrictEqual([MenuPage], MenuPage.hiers);

		done();
	});


	test('Node.install()', function (done) {
		function MenuPage(type, id) {
			nano.Node.call(this, type, id);
		}

		MenuPage.prototype = {
			toString: function () { return this.type+(this.id.charAt(0) !== '$' ? '#'+this.id : ''); }
		};

		try {
			nano.Node.install('page', MenuPage);
		} catch (e) {
			done();
		}
	});

	test('Group.install() for two levels', function (done) {
		function defnode(name, ancestor, cutoff) {
			var c = new Function (name, 'type,id', 'nano.Node.call(this, type, id);');
			c.prototype = {};
			ancestor.expand(c, cutoff);
			return c;
		}
		function defgroup(name, ancestor, cutoff) {
			var c = new Function (name, 'type,id', 'nano.Group.call(this, type, id);');
			c.prototype = {};
			ancestor.expand(c, cutoff);
			return c;
		}

		var Bow = defgroup('Bow', nano.Group),
		    LongBow = defgroup('LongBow', Bow),
		    ShortBow = defgroup('ShowBow', Bow),
		    NotBow = defgroup('NotBow', Bow, true);

		var Arrow = defnode('Arrow', nano.Node);

		Bow.install('arrow', Arrow);

		assert.strictEqual('function', typeof LongBow.prototype.arrow);
		assert.strictEqual('function', typeof ShortBow.prototype.arrow);
		assert.strictEqual('undefined', typeof NotBow.prototype.arrow);
		done()
	});

	test('Group.install() for two same constructors', function (done) {
		function defnode(name, ancestor, cutoff) {
			var c = new Function (name, 'type,id', 'nano.Node.call(this, type, id);');
			c.prototype = {};
			ancestor.expand(c, cutoff);
			return c;
		}
		function defgroup(name, ancestor, cutoff) {
			var c = new Function (name, 'type,id', 'nano.Group.call(this, type, id);');
			c.prototype = {};
			ancestor.expand(c, cutoff);
			return c;
		}

		var Bow = defgroup('Bow', nano.Group);
		var Arrow = defnode('Arrow', nano.Node);

		Bow.install('arrow', Arrow);

		try {
			Bow.install('arrow', nano.Node);
		} catch (e) {
			return done();
		}
		done(Error('error not thrown'))
	});

});

suite('creating', function () {

	test('basic tree creating', function (done) {
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
		done();
	});
});
