var lacona = require('lacona');
module.exports = lacona.createPhrase({
	name: 'lacona/suggester',
	suggest: function (inputString, data, done) {
		data({
			text: inputString,
			value: inputString
		});

		this.props.suggest(inputString, function (suggestion) {
			data({
				text: suggestion,
				value: suggestion
			});
		}, done);
	},
	getValue: function (result) {
		return result.value;
	},
	describe: function () {
		return lacona.value({
			compute: this.suggest,
			id: 'value'
		});
	}
});
