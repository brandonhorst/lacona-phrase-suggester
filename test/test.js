var chai = require('chai');
var expect = chai.expect;
var suggester = require('../lib/suggester')
var sinon = require('sinon');
var Parser = require('lacona').Parser;

chai.use(require('sinon-chai'));

describe('suggester', function () {
	var parser;

	beforeEach(function () {
		parser = new Parser().understand(suggester);
	});

	it('handles a valid integer', function (done) {
		var grammar = {
			scope: {
				suggestFunction: function (input, done) {
					process.nextTick(function () {
						done(null, input +  ' and more');
					});
				}
			},
			schema: {
				root: {
					type: 'suggester',
					suggest: 'suggestFunction',
					id: 'test'
				},
				run: ''
			}
		}

		var handleData = sinon.spy(function (data) {
			if (handleData.callCount === 1) {
				expect(data.match[0].string).to.equal('test');
			} else if (handleData.callCount === 2) {
				expect(data.suggestion.words[0].string).to.equal('test and more')
			}
		});

		var handleEnd = function () {
			expect(handleData).to.have.been.called.twice;
			done()
		};

		parser
		.understand(grammar)
		.on('data', handleData)
		.on('end', handleEnd)
		.parse('test');
	});
});