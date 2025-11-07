// Main frontend JS for Smart Feedback project
const API = 'http://127.0.0.1:5000';

// Helpers
async function post(url, body, token){
  const headers = {'Content-Type':'application/json'};
  if (token) headers['Authorization']='Bearer '+token;
  const res = await fetch(url, {method:'POST', headers, body: JSON.stringify(body)});
  return res;
}
async function get(url, token){
  const headers = token?{'Authorization':'Bearer '+token}:{};
  const res = await fetch(url, {headers});
  return res;
}

// Home send feedback (guest)
document.getElementById('sendBtn')?.addEventListener('click', async ()=>{
  const username = document.getElementById('username').value.trim() || 'Anonymous';
  const email = document.getElementById('email').value.trim() || '';
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('status');
  if (!message){ status.innerText='Please write feedback.'; return;}
  try{
    const r = await post(API + '/api/feedback', { username, email, message });
    const data = await r.json();
    if (r.ok){ status.innerText = 'Thanks — '+data.sentiment+' (score '+data.score+')'; document.getElementById('message').value=''; loadSummary(); showBadge(data.sentiment); }
    else { status.innerText = data.error || 'Submit failed'; }
  }catch(e){ console.error(e); status.innerText='Network error'; }
});

function showBadge(text){ const b=document.getElementById('badge'); b.innerText = text; b.className='success-badge small'; setTimeout(()=>{ b.innerText=''; b.className='small'; },2200); }

// Load summary chart on Home
let homeChart=null;
async function loadSummary(){
  try{
    const r = await fetch(API + '/api/summary');
    const arr = await r.json();
    const map = {Positive:0,Negative:0,Neutral:0};
    arr.forEach(x=>map[x.sentiment]=x.count);
    const ctx = document.getElementById('chart')?.getContext('2d');
    if (!ctx) return;
    if (homeChart) homeChart.destroy();
    homeChart = new Chart(ctx, { type: 'doughnut', data: { labels:['Positive','Negative','Neutral'], datasets:[{ data:[map.Positive,map.Negative,map.Neutral], backgroundColor:['#10b981','#ef4444','#f59e0b'] }] }, options:{responsive:true,maintainAspectRatio:false,animation:{duration:600}}});
  }catch(e){ console.error(e); }
}
window.addEventListener('load', ()=>{ loadSummary(); loadMyHistory(); });

// Register
document.getElementById('regBtn')?.addEventListener('click', async ()=>{
  const name=document.getElementById('reg_name').value.trim();
  const email=document.getElementById('reg_email').value.trim();
  const pass=document.getElementById('reg_pass').value.trim();
  const p=document.getElementById('regStatus');
  if(!email||!pass){ p.innerText='Email & password required'; return; }
  const r = await post(API + '/auth/register', {name,email,password:pass});
  const d = await r.json();
  p.innerText = d.message || d.error || 'Error';
  if (r.ok) setTimeout(()=>location.href='login.html',900);
});

// Login
document.getElementById('loginBtn')?.addEventListener('click', async ()=>{
  const email=document.getElementById('li_email').value.trim();
  const pass=document.getElementById('li_password').value.trim();
  const p=document.getElementById('loginStatus');
  const r = await post(API + '/auth/login', {email,password:pass});
  const d = await r.json();
  if (r.ok){ localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user)); p.innerText='Login successful'; setTimeout(()=>location.href='feedback.html',700); }
  else p.innerText = d.error || 'Login failed';
});

// User dashboard - send feedback as logged in user
document.getElementById('userSend')?.addEventListener('click', async ()=>{
  const token = localStorage.getItem('token'); if(!token){ alert('Login required'); return; }
  const msg = document.getElementById('userMsg').value.trim(); if(!msg) return alert('Enter message');
  const user = JSON.parse(localStorage.getItem('user'));
  const r = await post(API + '/api/feedback', { user_id: user.id, username: user.name, email: user.email, message: msg }, token);
  const d = await r.json();
  if (r.ok){ alert('Sentiment: '+d.sentiment); document.getElementById('userMsg').value=''; loadMyHistory(); }
  else alert(d.error || 'Send failed');
});

async function loadMyHistory(){
  const token = localStorage.getItem('token'); if(!token) return;
  const r = await get(API + '/api/feedbacks', token);
  if (!r.ok) return;
  const rows = await r.json();
  const wrap = document.getElementById('myHistory'); if(!wrap) return; wrap.innerHTML='';
  rows.forEach(row=>{ const el=document.createElement('div'); el.className='card'; el.style.marginTop='10px'; el.innerHTML = `<strong>${row.username||'Anon'}</strong> <small class='small'>${row.created_at}</small><p>${row.message}</p><p>Sentiment: <strong>${row.sentiment}</strong></p>`; wrap.appendChild(el); });
}

// Admin login and area
document.getElementById('adminLogin')?.addEventListener('click', async ()=>{
  const email=document.getElementById('adminEmail').value.trim();
  const pass=document.getElementById('adminPass').value.trim();
  const r = await post(API + '/auth/login', {email,password:pass});
  const d = await r.json();
  if (!r.ok){ alert(d.error||'Login failed'); return; }
  if (d.user.role !== 'admin'){ alert('Not admin'); return; }
  localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user));
  document.getElementById('adminArea').style.display = 'block';
  loadAdminArea();
});

async function loadAdminArea(){
  const token = localStorage.getItem('token'); if(!token) return;
  const r = await fetch(API + '/api/all', { headers: { 'Authorization':'Bearer '+token } });
  if (!r.ok) return alert('Failed to fetch admin data');
  const rows = await r.json(); const wrap = document.getElementById('adminTable'); wrap.innerHTML='';
  const tb = document.createElement('table'); tb.className='table'; tb.innerHTML = '<tr><th>ID</th><th>User</th><th>Message</th><th>Sentiment</th><th>Action</th></tr>';
  rows.forEach(rr=>{ const tr=document.createElement('tr'); tr.innerHTML = `<td>${rr.id}</td><td>${rr.username||rr.email}</td><td>${rr.message}</td><td><span class="tag ${rr.sentiment==='Positive'?'good':rr.sentiment==='Negative'?'bad':'neutral'}">${rr.sentiment}</span></td><td>${rr.sentiment==='Negative'?'<button onclick="adminDelete('+rr.id+')">Delete</button>':''}</td>`; tb.appendChild(tr); });
  wrap.appendChild(tb);

  // chart
  const sres = await fetch(API + '/admin/stats', { headers:{ 'Authorization':'Bearer '+token } });
  const stats = await sres.json(); const map={Positive:0,Negative:0,Neutral:0}; stats.forEach(s=>map[s.sentiment]=s.count);
  const ctx = document.getElementById('adminChart')?.getContext('2d');
  if (ctx){ if (window._adminChart) window._adminChart.destroy(); window._adminChart = new Chart(ctx, { type:'pie', data:{ labels:['Positive','Negative','Neutral'], datasets:[{ data:[map.Positive,map.Negative,map.Neutral], backgroundColor:['#10b981','#ef4444','#f59e0b'] }] }, options:{responsive:true,maintainAspectRatio:false} }); }
}

window.adminDelete = async function(id){
  if(!confirm('Delete negative feedback?')) return;
  const token = localStorage.getItem('token');
  const r = await fetch(API + '/api/feedback/' + id, { method:'DELETE', headers: { 'Authorization':'Bearer '+token } });
  if (r.ok) { alert('Deleted'); loadAdminArea(); } else alert('Delete failed');
}
