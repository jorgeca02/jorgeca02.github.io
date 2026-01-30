document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const filtersDiv = document.getElementById('filters');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxTags = document.getElementById('lightbox-tags');
  const closeBtn = document.getElementById('close');

  fetch('data/images.json')
    .then(res => res.json())
    .then(images => {
      renderGallery(images);
      renderFilters(images);
      console.log("done")
    });

  function renderGallery(images) {
    gallery.innerHTML = '';
    images.forEach(img => {
      const image = document.createElement('img');
      image.src = `images/photography/${img.file}`;
      image.alt = img.title;

      image.onclick = () => openLightbox(img);
      gallery.appendChild(image);
    });
  }

  function renderFilters(images) {
    const tags = [...new Set(images.flatMap(img => img.tags))];
    filtersDiv.innerHTML = '<span class="filter active" data-tag="all">All</span>';

    tags.forEach(tag => {
      const btn = document.createElement('span');
      btn.className = 'filter';
      btn.textContent = tag;
      btn.dataset.tag = tag;
      filtersDiv.appendChild(btn);
    });

    filtersDiv.addEventListener('click', e => {
      if (!e.target.classList.contains('filter')) return;

      document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');

      const tag = e.target.dataset.tag;
      fetch('data/images.json')
        .then(r => r.json())
        .then(imgs => {
          renderGallery(tag === 'all'
            ? imgs
            : imgs.filter(i => i.tags.includes(tag))
          );
        });
    });
  }

  function openLightbox(img) {
    lightbox.style.display = 'flex';
    lightboxImg.src = `images/photography/${img.file}`;
    lightboxTitle.textContent = img.title;
    lightboxDesc.textContent = img.description;
    lightboxTags.innerHTML = img.tags.map(t => `<span>#${t}</span>`).join('');
  }

  closeBtn.onclick = () => lightbox.style.display = 'none';
  lightbox.onclick = e => e.target === lightbox && (lightbox.style.display = 'none');
});
