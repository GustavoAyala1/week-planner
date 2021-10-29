const $addEntryButton = document.querySelector('.add-entry-button');
const $modalBg = document.querySelector('.modal-bg');
const $submitButton = document.querySelector('.submit-button');
const $timeSelect = document.querySelector('#add-time');

$addEntryButton.addEventListener('click', event => {
  $modalBg.classList.remove('hidden');
});

$submitButton.addEventListener('click', event => {
  $modalBg.classList.add('hidden');
});

window.addEventListener('DOMContentLoaded', event => {
  createTimeSelect();
});

function createTimeSelect() {
  const $optionDefault = document.createElement('option');
  $optionDefault.setAttribute('value', 'default');
  $optionDefault.textContent = 'Time';
  $timeSelect.prepend($optionDefault);
  for (let i = 0; i <= 23; i++) {
    const $option = document.createElement('option');
    $option.setAttribute('value', i);
    $option.textContent = `${i}:00`;
    $timeSelect.appendChild($option);
  }
}
