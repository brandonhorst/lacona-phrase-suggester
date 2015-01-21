var chai = require('chai');
var expect = chai.expect;
var fulltext = require('lacona-util-fulltext');
var lacona = require('lacona');
var stream = require('stream');

var suggester = require('..');

function toStream(strings) {
	var newStream = new stream.Readable({objectMode: true});

	strings.forEach(function (string) {
		newStream.push(string);
	});
	newStream.push(null);

	return newStream;
}

function toArray(done) {
	var newStream = new stream.Writable({objectMode: true});
	var list = [];
	newStream.write = function(obj) {
		list.push(obj);
	};

	newStream.end = function() {
		done(list);
	};

	return newStream;
}

describe('suggester', function () {
	var parser;

	beforeEach(function () {
		parser = new lacona.Parser();
	});

	it('suggests something', function (done) {
		var test = lacona.createPhrase({
			name: 'test/test',
			suggestFunction: function (input, data, done) {
				setTimeout(function () {
					data(input +  ' and more');
					done(null);
				}, 0);
			},
			describe: function () {
				return suggester({
					suggest: this.suggestFunction,
					id: 'test'
				});
			}
		});

		function callback(data) {
			expect(data).to.have.length(4);
			expect(fulltext.match(data[1].data)).to.equal('test');
			expect(data[1].data.result.test).to.equal('test');
			expect(fulltext.suggestion(data[2].data)).to.equal('test and more');
			expect(data[2].data.result.test).to.equal('test and more');
			done();
		}

		parser.sentences = [test()];

		toStream(['test'])
			.pipe(parser)
			.pipe(toArray(callback));
	});
});
