const $addEntryButton = document.querySelector('.add-entry-button');
const $modalBg = document.querySelector('.modal-bg');
const $timeSelect = document.querySelector('#add-time');
const $scheduledEventsText = document.querySelector('#day-of-the-week');
const $views = document.querySelector('.views');
const $entryForm = document.querySelector('form');
const $daysOfWeek = $entryForm.elements['days-of-week'];
const $addTime = $entryForm.elements.time;
const $notes = $entryForm.elements.notes;
const $tbody = document.querySelector('tbody');

const data = {
  currentDay: 'Monday',
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: []
};
/*
{
  time: null,
  description
}
*/

$addEntryButton.addEventListener('click', event => {
  $modalBg.classList.remove('hidden');
});

$entryForm.addEventListener('submit', event => {
  data[$daysOfWeek.value].push({
    time: $addTime.value,
    description: $notes.value
  });
  if ($daysOfWeek.value === data.currentDay) {
    const $tr = renderTableEntry($addTime.value, $notes.value);
    $tbody.appendChild($tr);
  }
  $modalBg.classList.add('hidden');
  $entryForm.reset();
  event.preventDefault();
});
// <!-- <tr>
//                 <td>9:00</td>
//                 <td>Meeting with Brett</td>
//               </tr> -->

window.addEventListener('DOMContentLoaded', event => {
  createTimeSelect();
  $scheduledEventsText.textContent = data.currentDay;
});

$views.addEventListener('click', event => {
  if (!event.target.getAttribute('data-day')) {
    return;
  }
  data.currentDay = event.target.getAttribute('data-day');
  $scheduledEventsText.textContent = data.currentDay;
  const $trs = document.querySelectorAll('tbody tr');
  for (const tr of $trs) {
    tr.remove();
  }
  for (const entry of data[data.currentDay]) {
    const $tr = renderTableEntry(entry.time, entry.description);
    $tbody.appendChild($tr);
  }
});

function createTimeSelect() {
  // const $optionDefault = document.createElement('option');
  // $optionDefault.setAttribute('value', 'default');
  // $optionDefault.textContent = 'Time';
  // $timeSelect.prepend($optionDefault);
  for (let i = 0; i <= 23; i++) {
    const $option = document.createElement('option');
    $option.setAttribute('value', i);
    $option.textContent = `${i}:00`;
    $timeSelect.appendChild($option);
  }
}

function renderTableEntry(time, description) {
  const $tr = document.createElement('tr');

  const $tdTime = document.createElement('td');
  $tdTime.textContent = time + ':00';

  const $tdDescription = document.createElement('td');
  $tdDescription.textContent = description;

  $tr.appendChild($tdTime);
  $tr.appendChild($tdDescription);
  return $tr;
}
