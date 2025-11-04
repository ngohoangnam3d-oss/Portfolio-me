// script.js — load gallery.json, render gallery, allow copy embed code
async function init(){
  const res = await fetch('gallery.json');
  if(!res.ok){
    document.getElementById('gallery').innerText = 'Không thể tải gallery.json';
    return;
  }
  const data = await res.json();
  const gallery = document.getElementById('gallery');
  const filter = document.getElementById('filter');

  // build category list
  const cats = Array.from(new Set(data.map(i => i.category || 'uncategorized')));
  cats.forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  function render(activeCat){
    gallery.innerHTML = '';
    const items = data.filter(i => activeCat === 'all' ? true : (i.category === activeCat));
    if(items.length === 0){
      gallery.innerHTML = '<p class="small-note">Không có ảnh cho lựa chọn này.</p>';
      return;
    }
    items.forEach(item=>{
      const tpl = document.getElementById('card-template');
      const node = tpl.content.cloneNode(true);
      const img = node.querySelector('img');
      img.src = item.url;
      img.alt = item.alt || item.title || '';
      node.querySelector('.caption').textContent = item.title || item.alt || '';
      const view = node.querySelector('.view-link');
      view.href = item.url;
      const btn = node.querySelector('.copy-btn');
      btn.addEventListener('click', ()=>{
        const embed = makeEmbedHTML(item);
        copyToClipboard(embed).then(()=>{
          btn.classList.add('copied');
          btn.textContent = 'Đã copy';
          setTimeout(()=>{ btn.classList.remove('copied'); btn.textContent = 'Copy mã nhúng' },1500);
        });
      });
      gallery.appendChild(node);
    });
  }

  filter.addEventListener('change', ()=> render(filter.value));
  render('all');
}

// Create simple img tag as embed HTML, using srcset if provided
function makeEmbedHTML(item){
  let attrs = `src="${item.url}" alt="${escapeHtml(item.alt || item.title || '')}" loading="lazy"`;
  if(item.width) attrs += ` width="${item.width}"`;
  if(item.height) attrs += ` height="${item.height}"`;
  if(item.srcset && Array.isArray(item.srcset)){
    const ss = item.srcset.map(s => `${s.url} ${s.w}w`).join(', ');
    attrs += ` srcset="${ss}" sizes="(max-width:600px) 100vw, 600px"`;
  }
  return `<img ${attrs} />`;
}

function copyToClipboard(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text);
  }
  return new Promise((res, rej)=>{
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); res(); }catch(e){ rej(e); }
    ta.remove();
  });
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

init().catch(err=>{
  console.error(err);
  document.getElementById('gallery').innerText = 'Lỗi khi khởi tạo gallery';
});