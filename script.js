const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const count = document.getElementById('count');
const clearBtn = document.getElementById('clearBtn');
const emptyState = document.getElementById('emptyState');
const todayEl = document.getElementById('today');
const filters = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// 日付表示
const today = new Date();
todayEl.textContent = today.toLocaleDateString('ja-JP', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
});

const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const trashIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

function getFiltered() {
  if (currentFilter === 'active') return tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

function render() {
  taskList.innerHTML = '';
  const filtered = getFiltered();

  filtered.forEach((task) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <div class="check">${checkIcon}</div>
      <span>${escapeHtml(task.text)}</span>
      <button class="delete-btn" aria-label="削除">${trashIcon}</button>
    `;

    li.querySelector('.check').addEventListener('click', () => {
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      save();
      render();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      setTimeout(() => {
        tasks.splice(originalIndex, 1);
        save();
        render();
      }, 200);
    });

    taskList.appendChild(li);
  });

  // 空状態表示
  emptyState.classList.toggle('show', filtered.length === 0);

  // カウント
  const activeCount = tasks.filter(t => !t.completed).length;
  count.textContent = `${activeCount} 件の残り`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }
  tasks.push({ text, completed: false, createdAt: Date.now() });
  taskInput.value = '';
  save();
  render();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();