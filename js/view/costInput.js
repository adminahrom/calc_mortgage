import updateModel from './../utils/updateModel.js';

function init(getData) {
	const data = getData();
	const input = document.querySelector('#input-cost');

	const settings = {
		numeral: true,
		numeralThousandsGroupStyle: 'thousand',
		delimiter: ' ',
	};

	const cleaveInput = new Cleave(input, settings);
	cleaveInput.setRawValue(data.cost);

	input.addEventListener('input', function () {
		const value = +cleaveInput.getRawValue();

		if (value < data.minPrice || value > data.maxPrice) {
			input.closest('.param__details').classList.add('param__details--error');
		}

		if (value >= data.minPrice && value <= data.maxPrice) {
			input
				.closest('.param__details')
				.classList.remove('param__details--error');
		}

		updateModel(input, { cost: value, onUpdate: 'inputCost' });
	});

	input.addEventListener('change', function () {
		const value = +cleaveInput.getRawValue();

		if (value > data.maxPrice) {
			input
				.closest('.param__details')
				.classList.remove('param__details--error');
			cleaveInput.setRawValue(data.maxPrice);
		}

		if (value < data.minPrice) {
			input
				.closest('.param__details')
				.classList.remove('param__details--error');
			cleaveInput.setRawValue(data.minPrice);
		}

		updateModel(input, {
			cost: +cleaveInput.getRawValue(),
			onUpdate: 'inputCost',
		});
	});

	return cleaveInput;
}

export default init;
