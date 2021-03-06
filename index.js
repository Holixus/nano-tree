
function NanoNode(type, id) {
	this.type = type;
	this.id = id;
	this.up = undefined;
}

NanoNode.prototype = {
	added: function () {
		return this.up;
	},
	predrop: function () {
	},
	postdrop: function () {
	},
	drop: function () {
		if (this.up)
			this.up.remove(this);
	},
	destroy: function () {
		this.drop();
	},
};

function complete(to, from) {
	for (var id in from)
		if (!(id in to))
			to[id] = from[id];
}

NanoNode.ancestor = undefined;
NanoNode.hiers = [ NanoNode ];
NanoNode.install = function (types, constr) {
	throw Error('There is not constructors in Node class available');
};/*
NanoNode.uninstall = function (types, constr) {
	throw Error('There is not constructors in Node class available');
};*/

NanoNode.expand = function (constr, cutoff) {
	if (!cutoff) {
		var an = this;
		do {
			an.hiers.push(constr);
		} while ((an = an.ancestor));
	}
	complete(constr.prototype, this.prototype);
	constr.ancestor = !cutoff ? this : undefined;
	constr.hiers = [ constr ];
	constr.uid = this.uid;
	constr.expand = this.expand;
	constr.install = this.install;
	//constr.uninstall = this.uninstall;
};

var NanoGroup = function _NanoGroup(type, id) {
	NanoNode.call(this, type, id);
	this.children = Object.create(null);
	this.length = 0;
	this.first = undefined;
	this.last = undefined;
};

NanoGroup.prototype = {
	regroup: function () {},
	added: function () {
		return this;
	},
	add: function (node) {
		var c = this.children[node.id];
		if (c)
			this.remove(c); // force replace
		(node.up = this).children[node.id] = node;
		var ret = node.added();
		if (!this.length++)
			this.first = node;
		this.last = node;
		this.regroup();
		return ret;
	},
	remove: function (node) {
		if (node.up !== this)
			return;
		node.predrop();
		delete this.children[node.id];
		if (!--this.length)
			this.first = this.last = undefined;
		else {
			if (this.first === node)
				for (var n in this.children) {
					this.first = this.children[n];
					break;
				}
			if (this.last === node)
				for (var n in this.children)
					this.last = this.children[n];
		}
		node.up = undefined;
		this.regroup();
		node.postdrop();
	},
	empty: function () {
		var s = this.children;
		for (var n in s)
			s[n].destroy();
		this.children = Object.create(null); // IE patch
		return this;
	},
	destroy: function () {
		var s = this.children;
		for (var n in s)
			s[n].destroy();
		this.drop();
	}
};

NanoNode.expand(NanoGroup);

NanoGroup.uid = (function () {
	var sid = 0;
	return function (id) { return id === undefined ? '$'+(sid++).toString(36) : id; };
})();

NanoGroup.install = function (types, constr) {
	var hs = this.hiers,
	    cls = this;
	types.split(/\s*,\s*/).forEach(function (type) {
		var create = function createNanoNode(id, a, b, c) {
			return this.add(new constr(type, cls.uid(id), a, b, c));
		};
		for (var i = 0, n = hs.length; i < n; ++i) {
			var c = hs[i],
			    p = c.prototype;
			if (type in p)
				throw Error(c.type+'.'+type+'() method conflicts with the constructor');
			p[type] = create;
		}
	});
};

/*
NanoGroup.uninstall = function (types) {
	var hs = this.hiers;
	types.split(/\s*,\s{0,}/).forEach(function (type) {
		for (var i = 0, n = hs.length; i < n; ++i)
			delete hs[i].prototype[type];
	});
};*/

module.exports = {
	Node: NanoNode,
	Group: NanoGroup
};
