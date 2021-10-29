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
const $spanEntryType = document.querySelector('#entry-type');

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
  $spanEntryType.textContent = event.target.getAttribute('data-entry-type');

});

$tbody.addEventListener('click', event => {
  if (event.target.getAttribute('data-entry-type') !== 'Update') {
    return;
  }
  $modalBg.classList.remove('hidden');
  $spanEntryType.textContent = event.target.getAttribute('data-entry-type');
  $addTime.value = data[data.currentDay].time;
  $notes.value = data[data.currentDay].description;

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

  const $updateButton = document.createElement('button');
  $updateButton.classList.add('update');
  $updateButton.setAttribute('data-entry-type', 'Update');
  $updateButton.textContent = 'Update';

  const $deleteButton = document.createElement('button');
  $deleteButton.classList.add('delete');
  $deleteButton.setAttribute('data-entry-type', 'Delete');
  $deleteButton.textContent = 'Delete';

  $tdDescription.appendChild($updateButton);
  $tdDescription.appendChild($deleteButton);
  $tr.appendChild($tdTime);
  $tr.appendChild($tdDescription);
  return $tr;
}

/* <tr>
  <td>9:00</td>
  <td>Meeting with Brett <button class="update" data-entry-type="Update">Update</button><button class="delete" data-entry-type="Delete">Delete</button></td>
</tr> */
