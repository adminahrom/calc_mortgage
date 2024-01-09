function updateMinPercents(data) {
	document.querySelector('#percents-from').innerText =
		data.minPaymentPercents * 100 + '%';
}

export { updateMinPercents };
