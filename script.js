
const scriptURL = 'https://script.google.com/macros/s/AKfycbzQMpzTivBHt3KeBSlOBJo4WxgzbM_wmy0bv9lNR-a4D6i27-AUmDm-oFLKixee9dPk/exec';

function toggleForm() {
  const form = document.getElementById('messageForm');
  form.classList.toggle('hidden');
  if (!form.classList.contains('hidden')) {
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

function submitMessage(event) {
  event.preventDefault();
  const data = {
    author: document.getElementById('author').value,
    church: document.getElementById('church').value,
    text: document.getElementById('text').value
  };
  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(() => {
    alert('응원 메시지가 등록되었습니다!');
    document.getElementById('author').value = '';
    document.getElementById('church').value = '';
    document.getElementById('text').value = '';
    toggleForm();
    loadMessages();
  })
  .catch(err => alert('오류 발생: ' + err));
}

function loadMessages() {
  fetch(scriptURL)
    .then(res => res.json())
    .then(messages => {
      const container = document.getElementById('messages');
      container.innerHTML = '';
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
      messages.reverse().forEach(msg => {
        const isToday = msg.date === today;
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
          <p>"${msg.text}"</p>
          <small>- ${msg.author} (${msg.church}) / ${msg.date} ${isToday ? '<span class="new-label">NEW</span>' : ''}</small>`;
        container.appendChild(div);
      });
    });
}

window.onload = loadMessages;
