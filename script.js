/* ═══════════════════════════════════════════════════
   JIWA TEMPAT — script.js  (versi lengkap)
   Cursor · Loader · Navbar · Reveal · Lightbox · Zone Modal
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════
  //  LOADER
  // ══════════════════════════════════════
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }

  window.addEventListener('load', () => setTimeout(hideLoader, 1200));
  setTimeout(hideLoader, 3000); // fallback


  // ══════════════════════════════════════
  //  CUSTOM CURSOR
  // ══════════════════════════════════════
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .gallery-item, .hierarki-card, .arsitek-item, .ring, .ring-center').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px'; cursor.style.height = '16px';
      follower.style.width = '50px'; follower.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px'; cursor.style.height = '8px';
      follower.style.width = '32px'; follower.style.height = '32px';
    });
  });


  // ══════════════════════════════════════
  //  NAVBAR SCROLL
  // ══════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });


  // ══════════════════════════════════════
  //  MOBILE NAV TOGGLE
  // ══════════════════════════════════════
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });


  // ══════════════════════════════════════
  //  INTERSECTION OBSERVER — REVEAL
  // ══════════════════════════════════════
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));


  // ══════════════════════════════════════
  //  ACTIVE NAV LINK ON SCROLL
  // ══════════════════════════════════════
  document.querySelectorAll('section[id]').forEach(sec => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 }).observe(sec);
  });


  // ══════════════════════════════════════
  //  IMAGE ERROR HANDLING
  // ══════════════════════════════════════
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const ph = img.parentElement.querySelector('.photo-placeholder');
      if (ph) ph.style.opacity = '1';
    });
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) {
        img.style.display = 'block';
        img.style.opacity = '1';
        const ph = img.parentElement.querySelector('.photo-placeholder');
        if (ph) ph.style.display = 'none';
      }
    });
  });


  // ══════════════════════════════════════
  //  LIGHTBOX (galeri)
  // ══════════════════════════════════════
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = document.getElementById('lb-close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      if (img && img.complete && img.naturalWidth > 0) {
        openLightbox(img.src, cap ? cap.textContent : '');
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });


  // ══════════════════════════════════════
  //  ZONE MODAL — Diagram Konsentris
  // ══════════════════════════════════════
  const zoneModal       = document.getElementById('zone-modal');
  const zoneBackdrop    = document.getElementById('zone-modal-backdrop');
  const zoneClose       = document.getElementById('zone-modal-close');
  const zoneTitle       = document.getElementById('zone-modal-title');
  const zoneDesc        = document.getElementById('zone-modal-desc');
  const zonePhoto       = document.getElementById('zone-modal-photo');
  const zonePlaceholder = document.getElementById('zone-modal-placeholder');

  function openZoneModal(el) {
    const title = el.dataset.title;
    const desc  = el.dataset.desc;
    const photo = el.dataset.photo;
    if (!title) return;

    zoneTitle.textContent = title;
    zoneDesc.textContent  = desc || '';

    // Reset foto dulu
    zonePhoto.style.display       = 'none';
    zonePlaceholder.style.display = 'flex';

    if (photo) {
      const testImg = new Image();
      testImg.onload = () => {
        zonePhoto.src = photo;
        zonePhoto.style.display = 'block';
        zonePlaceholder.style.display = 'none';
      };
      testImg.onerror = () => {
        zonePhoto.style.display = 'none';
        zonePlaceholder.style.display = 'flex';
      };
      testImg.src = photo;
    }

    zoneModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeZoneModal() {
    zoneModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Pasang event ke semua ring & ring-center yang punya data-title
  document.querySelectorAll('.ring[data-title], .ring-center[data-title]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      openZoneModal(el);
    });
  });

  zoneClose.addEventListener('click', closeZoneModal);
  zoneBackdrop.addEventListener('click', closeZoneModal);


  // ══════════════════════════════════════
  //  ESCAPE KEY — tutup semua modal/lightbox
  // ══════════════════════════════════════
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeZoneModal();
    }
  });


  // ══════════════════════════════════════
  //  PARALLAX HERO
  // ══════════════════════════════════════
  const heroImg = document.getElementById('hero-img');
  window.addEventListener('scroll', () => {
    if (!heroImg) return;
    if (window.scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });


  // ══════════════════════════════════════
  //  SMOOTH SCROLL
  // ══════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  console.log('%c꧁ Jiwa Tempat — Keraton Yogyakarta ꧂',
    'color:#c9a84c; font-family:serif; font-size:1.2rem; padding:8px;');
  console.log('%cTaruh foto di folder photos/ sesuai README.md',
    'color:#8a6520; font-size:0.85rem;');

});

/* ═══════════════════════════════════════
   TABEL EDITOR — Kencana, Mandalasana, Perbandingan
═══════════════════════════════════════ */
(function() {
  const modal    = document.getElementById('edit-modal');
  const backdrop = document.getElementById('edit-backdrop');
  const textarea = document.getElementById('edit-textarea');
  const titleEl  = document.getElementById('edit-modal-title');
  const btnSave  = document.getElementById('btn-edit-save');
  const btnCancel= document.getElementById('btn-edit-cancel');
  const btnDel   = document.getElementById('btn-edit-row') || document.getElementById('btn-del-row');

  if (!modal) return;

  let activeCell = null;
  let activeRow  = null;

  function openModal(td) {
    activeCell = td;
    activeRow  = td.parentElement;
    const colIdx = td.cellIndex;
    const table  = td.closest('table');
    const header = table.querySelector('thead tr').cells[colIdx];
    titleEl.textContent = 'Edit: ' + (header ? header.textContent.trim() : 'Sel');
    const current = td.textContent.trim();
    textarea.value = td.classList.contains('empty-cell') ? '' : current;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => textarea.focus(), 80);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    activeCell = null;
    activeRow  = null;
  }

  function saveEdit() {
    if (!activeCell) return;
    const val = textarea.value.trim();
    if (val === '') {
      activeCell.textContent = '— isi di sini —';
      activeCell.classList.add('empty-cell');
    } else {
      activeCell.textContent = val;
      activeCell.classList.remove('empty-cell');
    }
    closeModal();
  }

  function deleteRow() {
    if (!activeRow) return;
    if (confirm('Hapus baris ini?')) {
      activeRow.remove();
      closeModal();
    }
  }

  // Delegate clicks on editable cells in all three tables
  ['tabel-kencana', 'tabel-mandalasana', 'tabel-perbandingan'].forEach(id => {
    const tbl = document.getElementById(id);
    if (!tbl) return;
    tbl.addEventListener('click', e => {
      const td = e.target.closest('td.editable-cell');
      if (td) openModal(td);
    });
  });

  btnSave.addEventListener('click', saveEdit);
  btnCancel.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  if (btnDel) btnDel.addEventListener('click', deleteRow);

  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // ─── ADD ROW (generic, dimension-aware) ───
  function addRow(tbodyId) {
    const tbody = document.getElementById('tbodyId'.replace('Id', '-' + tbodyId)) || document.getElementById('tbody-' + tbodyId);
    if (!tbody) return;
    const colCount = tbody.closest('table').querySelector('thead tr').cells.length;
    const tr = document.createElement('tr');
    let cellsHtml = '<td class="editable-cell empty-cell">— variabel baru —</td>';
    if (tbodyId === 'perbandingan') {
      cellsHtml = '<td class="editable-cell empty-cell">— aspek baru —</td>' +
                  '<td class="editable-cell col-kencana empty-cell">— isi di sini —</td>' +
                  '<td class="editable-cell col-mandalasana empty-cell">— isi di sini —</td>' +
                  '<td class="editable-cell empty-cell">— isi di sini —</td>';
    } else {
      cellsHtml += '<td class="editable-cell empty-cell">— dimensi —</td>';
      for (let i = 2; i < colCount; i++) {
        cellsHtml += '<td class="editable-cell empty-cell">— isi di sini —</td>';
      }
    }
    tr.innerHTML = cellsHtml;
    tbody.appendChild(tr);
    const wrap = tbody.closest('.tabel-scroll-wrap');
    if (wrap) wrap.scrollTop = wrap.scrollHeight;
  }

  // ─── ADD COLUMN (Kencana / Mandalasana only) ───
  function addColumn(target) {
    const table = document.getElementById('tabel-' + target);
    if (!table) return;
    const colName = prompt('Nama kolom baru:', 'Kolom Baru');
    if (colName === null) return; // cancelled
    const label = colName.trim() === '' ? 'Kolom Baru' : colName.trim();

    // Add header cell
    const headRow = table.querySelector('thead tr');
    const th = document.createElement('th');
    th.textContent = label;
    makeHeaderDeletable(th, table);
    headRow.appendChild(th);

    // Add empty cell to every existing row
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(tr => {
      const td = document.createElement('td');
      td.className = 'editable-cell empty-cell';
      td.textContent = '— isi di sini —';
      tr.appendChild(td);
    });
  }

  // ─── DELETE COLUMN ───
  // The first 2 columns (Variabel/Indikator + Dimensi) are protected — they're
  // the core structure of the table and shouldn't be removable by accident.
  const PROTECTED_COLS = 2;

  function deleteColumn(th, table) {
    const colIndex = Array.from(th.parentElement.children).indexOf(th);
    if (colIndex < PROTECTED_COLS) {
      alert('Kolom inti (Variabel/Dimensi) tidak bisa dihapus.');
      return;
    }
    const colLabel = th.textContent.trim();
    if (!confirm('Hapus kolom "' + colLabel + '"? Semua isi di kolom ini akan hilang.')) return;

    th.remove();
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(tr => {
      const cell = tr.children[colIndex];
      if (cell) cell.remove();
    });
  }

  function makeHeaderDeletable(th, table) {
    th.classList.add('th-deletable');
    th.title = 'Klik untuk menghapus kolom ini';
    th.addEventListener('click', () => deleteColumn(th, table));
  }

  // Wire up delete-on-click for existing headers (skip protected columns)
  ['tabel-kencana', 'tabel-mandalasana'].forEach(id => {
    const table = document.getElementById(id);
    if (!table) return;
    const ths = table.querySelectorAll('thead th');
    ths.forEach((th, i) => {
      if (i >= PROTECTED_COLS) makeHeaderDeletable(th, table);
    });
  });

  // Wire up all .btn-addrow buttons (row or column mode)
  document.querySelectorAll('.btn-addrow[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const mode   = btn.dataset.mode;
      if (mode === 'col') addColumn(target);
      else addRow(target);
    });
  });

  // Legacy single-button support (perbandingan keeps its own ids if present)
  const addPerLegacy = document.getElementById('addrow-perbandingan');
  if (addPerLegacy) {
    addPerLegacy.addEventListener('click', () => addRow('perbandingan'));
  }

})();