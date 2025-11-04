// upload.js — simple client-side uploader using GitHub Contents API
// WARNING: You enter your PAT into the page. Keep token secret and revoke after use if wanted.

const drop = document.getElementById('drop');
const fileListEl = document.getElementById('file-list');
const startBtn = document.getElementById('start-upload');
let files = [];

drop.addEventListener('click', ()=> {
  const inp = document.createElement('input'); inp.type='file'; inp.multiple=true; inp.accept='image/*';
  inp.onchange = e => addFiles(Array.from(e.target.files));
  inp.click();
});
drop.addEventListener('dragover', e=>{ e.preventDefault(); drop.classList.add('dragover'); });
drop.addEventListener('dragleave', e=>{ drop.classList.remove('dragover'); });
drop.addEventListener('drop', e=>{ e.preventDefault(); drop.classList.remove('dragover'); addFiles(Array.from(e.dataTransfer.files)); });

function addFiles(list){
  list.forEach(f=>{
    if(!f.type.startsWith('image/')) return;
    files.push(f);
  });
  renderList();
}

function renderList(){
  fileListEl.innerHTML = '';
  files.forEach((f,i)=>{
    const div = document.createElement('div'); div.className='file-item';
    div.innerHTML = `<span>${f.name} — ${(f.size/1024|0)} KB</span><button data-i="${i}" class="btn" style="background:#ccc;color:#000">Xóa</button>`;
    fileListEl.appendChild(div);
  });
  fileListEl.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', e=>{
      const i = Number(e.target.dataset.i);
      files.splice(i,1); renderList();
    });
  });
}

async function startUpload(){
  if(files.length===0){ alert('Chưa có file nào'); return; }
  const token = document.getElementById('token').value.trim();
  const repo = document.getElementById('repo').value.trim();
  const branch = document.getElementById('branch').value.trim() || 'main';
  if(!token || !repo){ alert('Vui lòng cung cấp token và repo'); return; }
  startBtn.disabled = true;
  document.getElementById('status').textContent = 'Đang upload...';

  const timestamp = Date.now();
  const basePath = `images/${timestamp}`;

  for(let i=0;i<files.length;i++){
    const f = files[i];
    try{
      const content = await fileToBase64(f);
      const path = `${basePath}/${sanitizeName(f.name)}`;
      await uploadFileToRepo({ownerRepo:repo, path, contentBase64: content.split(',')[1], token, branch, message: `Add ${path}`});
      document.getElementById('status').textContent = `Uploaded ${i+1}/${files.length}`;
    }catch(err){
      console.error(err);
      alert('Lỗi upload: ' + err.message);
      break;
    }
  }

  document.getElementById('status').textContent = 'Xong. Kiểm tra repo để thấy ảnh trong ' + basePath;
  startBtn.disabled = false;
}

startBtn.addEventListener('click', startUpload);

function fileToBase64(file){
  return new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function sanitizeName(name){
  return name.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-_\.]/g,'').toLowerCase();
}

// Upload single file using GitHub Contents API: PUT /repos/{owner}/{repo}/contents/{path}
async function uploadFileToRepo({ownerRepo, path, contentBase64, token, branch, message}){
  const url = `https://api.github.com/repos/${ownerRepo}/contents/${encodeURIComponent(path)}`;
  // Check if file exists to set "sha" param (we assume not exist for new images)
  const payload = {
    message: message || `Add ${path}`,
    content: contentBase64,
    branch
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json();
}