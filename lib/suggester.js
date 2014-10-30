module.exports = {
	scope: {
		suggest: function (inputString, data, done) {
			data({
				display: inputString,
				value: inputString
			});

			var suggestion = this.$call(this.suggest, inputString, function (err, suggestion) {
				if (err) {
					return done(err);
				}
				data({
					display: suggestion,
					value: suggestion
				});
				done();
			});
		}
	},

	phrases: [{
		name: 'suggester',
		root: {
			type: 'value',
			compute: 'suggest',
			id: '@value'
		}
	}]
}
