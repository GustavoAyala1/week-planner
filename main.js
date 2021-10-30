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
const $modalDelete = document.querySelector('.modal-delete');

let data = {
  currentDay: 'Monday',
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  nextEntryId: 1,
  editing: null
};
/*
{
  time: null,
  description,
  entryId:1++,
}
*/
const previousDataJSON = localStorage.getItem('calendar-data');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', () => {
  data.currentDay = 'Monday';
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('calendar-data', dataJSON);
});

$addEntryButton.addEventListener('click', event => {
  $modalBg.classList.remove('hidden');
  $spanEntryType.textContent = event.target.getAttribute('data-entry-type');
});

$tbody.addEventListener('click', event => {
  if (event.target.getAttribute('data-entry-type') === 'Update') {
    $modalBg.classList.remove('hidden');
    $spanEntryType.textContent = event.target.getAttribute('data-entry-type');
    const index = findEntryId(event.target.getAttribute('data-id'));

    $daysOfWeek.value = data.currentDay;
    $addTime.value = data[data.currentDay][index].time;
    $notes.value = data[data.currentDay][index].description;
    data.editing = index;
  } else if (event.target.getAttribute('data-entry-type') === 'Delete') {
    $modalDelete.classList.remove('hidden');
    const index = findEntryId(event.target.getAttribute('data-id'));

    $daysOfWeek.value = data.currentDay;
    $addTime.value = data[data.currentDay][index].time;
    $notes.value = data[data.currentDay][index].description;
    data.editing = index;
  }
});

$modalDelete.addEventListener('click', event => {
  if (event.target.matches('.delete-no')) {
    $modalDelete.classList.add('hidden');
  } else if (event.target.matches('.delete-yes')) {
    const index = data.editing;
    data[data.currentDay].splice(index, 1);
    $modalDelete.classList.add('hidden');

    const $trs = document.querySelectorAll('tbody tr');
    for (const tr of $trs) {
      tr.remove();
    }
    for (const entry of data[data.currentDay]) {
      const $tr = renderTableEntry(
        entry.time,
        entry.description,
        entry.entryId
      );
      $tbody.appendChild($tr);
    }
  }
});

$entryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (data.editing === null) {
    data[$daysOfWeek.value].push({
      time: $addTime.value,
      description: $notes.value,
      entryId: data.nextEntryId++
    });
    if ($daysOfWeek.value === data.currentDay) {
      const $tr = renderTableEntry(
        $addTime.value,
        $notes.value,
        data.nextEntryId - 1
      );
      $tbody.appendChild($tr);
    }
  } else {
    const index = data.editing;
    const currentDay = data.currentDay;
    data[currentDay][index].time = $addTime.value;
    data[currentDay][index].description = $notes.value;

    let entry = null;

    entry = data[currentDay].splice(index, 1)[0];
    data[$daysOfWeek.value].push(entry);

    const $trs = document.querySelectorAll('tbody tr');
    for (const tr of $trs) {
      tr.remove();
    }
    for (const entry of data[data.currentDay]) {
      const $tr = renderTableEntry(
        entry.time,
        entry.description,
        entry.entryId
      );
      $tbody.appendChild($tr);
    }

    data.editing = null;
  }
  $modalBg.classList.add('hidden');
  $entryForm.reset();
});

window.addEventListener('DOMContentLoaded', event => {
  createTimeSelect();
  $scheduledEventsText.textContent = data.currentDay;
  for (const entry of data[data.currentDay]) {
    const $tr = renderTableEntry(entry.time, entry.description, entry.entryId);
    $tbody.appendChild($tr);
  }
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
    const $tr = renderTableEntry(entry.time, entry.description, entry.entryId);
    $tbody.appendChild($tr);
  }
});

function createTimeSelect() {
  for (let i = 0; i <= 23; i++) {
    const $option = document.createElement('option');
    $option.setAttribute('value', i);
    $option.textContent = `${i}:00`;
    $timeSelect.appendChild($option);
  }
}

function renderTableEntry(time, description, id) {
  const $tr = document.createElement('tr');
  $tr.setAttribute('data-id', id);

  const $tdTime = document.createElement('td');
  $tdTime.textContent = time + ':00';

  const $tdDescription = document.createElement('td');
  $tdDescription.textContent = description;

  const $updateButton = document.createElement('button');
  $updateButton.setAttribute('data-id', id);
  $updateButton.classList.add('update');
  $updateButton.setAttribute('data-entry-type', 'Update');
  $updateButton.textContent = 'Update';

  const $deleteButton = document.createElement('button');
  $deleteButton.classList.add('delete');
  $deleteButton.setAttribute('data-entry-type', 'Delete');
  $deleteButton.textContent = 'Delete';
  $deleteButton.setAttribute('data-id', id);

  $tdDescription.appendChild($updateButton);
  $tdDescription.appendChild($deleteButton);
  $tr.appendChild($tdTime);
  $tr.appendChild($tdDescription);
  return $tr;
}

function findEntryId(id) {
  for (let i = 0; i < data[data.currentDay].length; i++) {
    if (id === data[data.currentDay][i].entryId.toString()) {
      return i;
    }
  }
  return null;
}
