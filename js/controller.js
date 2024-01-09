import * as Model from './model.js';
import updateResultsView from './view/updateResultsView.js';
import programs from './view/radioPrograms.js';
import { updateMinPercents } from './view/utils.js';

import costInput from './view/costInput.js';
import costRange from './view/costRange.js';

import paymentInput from './view/paymentInput .js';
import paymentRange from './view/paymentRange.js';

import timeInput from './view/timeInput.js';
import timeRange from './view/timeRange.js';

window.onload = function () {
	const getData = Model.getData;

	programs(getData);

	const cleaveCost = costInput(getData);
	const sliderCost = costRange(getData);

	const cleavePayment = paymentInput(getData);
	const sliderPayment = paymentRange(getData);

	const cleaveTime = timeInput(getData);
	const sliderTime = timeRange(getData);

	Model.setData({});
	const results = Model.getResults();
	updateResultsView(results);

	document.addEventListener('updateForm', e => {
		Model.setData(e.detail);

		const data = Model.getData();
		const results = Model.getResults();

		updateFormAndSliders(data);

		updateResultsView(results);
	});

	function updateFormAndSliders(data) {
		if (data.onUpdate === 'radioProgram') {
			updateMinPercents(data);

			sliderPayment.noUiSlider.updateOptions({
				range: {
					min: data.minPaymentPercents * 100,
					max: data.maxPaymentPercents * 100,
				},
			});
		}

		if (data.onUpdate !== 'inputCost') {
			cleaveCost.setRawValue(data.cost);
		}
		if (data.onUpdate !== 'costSlider') {
			sliderCost.noUiSlider.set(data.cost);
		}

		if (data.onUpdate !== 'inputPayment') {
			cleavePayment.setRawValue(data.payment);
		}

		if (data.onUpdate !== 'paymentSlider') {
			sliderPayment.noUiSlider.set(data.paymentPercents * 100);
		}

		if (data.onUpdate !== 'inputTime') {
			cleaveTime.setRawValue(data.time);
		}

		if (data.onUpdate !== 'timeSlider') {
			sliderTime.noUiSlider.set(data.time);
		}
	}

	const openFormBtn = document.querySelector('#openFormBtn');
	const orderForm = document.querySelector('#orderForm');
	const submitFormBtn = document.querySelector('#submitFormBtn');

	openFormBtn.addEventListener('click', function () {
		orderForm.classList.remove('none');
		openFormBtn.classList.add('none');
	});

	orderForm.addEventListener('submit', function (e) {
		e.preventDefault();
		const formData = new FormData(orderForm);

		submitFormBtn.setAttribute('disabled', true);
		submitFormBtn.innerText = 'Заявка отправляется...';

		orderForm.querySelectorAll('input').forEach(function (input) {
			input.setAttribute('disabled', true);
		});

		fetchData();

		async function fetchData() {
			const data = Model.getData();
			const results = Model.getResults();

			let url = checkOnUrl(document.location.href);

			function checkOnUrl(url) {
				let urlArrayDot = url.split('.');

				if (urlArrayDot[urlArrayDot.length - 1] === 'html') {
					urlArrayDot.pop();
					let newUrl = urlArrayDot.join('.');
					let urlArraySlash = newUrl.split('/');
					urlArraySlash.pop();
					newUrl = urlArraySlash.join('/') + '/';
					return newUrl;
				}

				return url;
			}

			const response = await fetch(url + 'mail.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify({
					form: {
						name: formData.get('name'),
						email: formData.get('email'),
						phone: formData.get('phone'),
					},
					data,
					results,
				}),
			});

			const result = await response.text();

			submitFormBtn.removeAttribute('disabled', true);
			submitFormBtn.innerText = 'Оформить заявку';

			orderForm.querySelectorAll('input').forEach(input => {
				input.removeAttribute('disabled', true);
			});

			orderForm.reset();
			orderForm.classList.add('none');

			if (result === 'SUCCESS') {
				document.getElementById('success').classList.remove('none');
			} else {
				document.getElementById('error').classList.remove('none');
			}
		}
	});
};
