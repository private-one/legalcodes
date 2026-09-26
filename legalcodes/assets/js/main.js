(() => {
  const root = document.documentElement;
  const isArticle = location.pathname.includes('/articles/');
  const base = isArticle ? '../' : './';
  let articles = [];

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const formatDate = value => {
    const d = new Date(value + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
  };

  async function loadArticles() {
    try {
      const response = await fetch(base + 'data/articles.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Article index unavailable');
      articles = await response.json();
      renderHome();
      renderArchive();
    } catch (error) {
      console.error(error);
      document.querySelectorAll('#featured-grid, #latest-list, #archive-list').forEach(el => {
        if (el) el.innerHTML = '<p class="empty-state">The article index could not be loaded.</p>';
      });
    }
  }

  function articleURL(article) { return base + 'articles/' + article.file; }

  function articleMarkup(article, number = '') {
    return `<a class="article-row" href="${articleURL(article)}">
      <span class="article-row-number">${number}</span>
      <span class="article-row-main">
        <span class="article-row-meta">${escapeHTML(article.category)} · ${formatDate(article.date)} · ${escapeHTML(article.readTime)}</span>
        <span class="article-row-title">${escapeHTML(article.title)}</span>
        <span class="article-row-description">${escapeHTML(article.description)}</span>
      </span>
      <span class="article-arrow">↗</span>
    </a>`;
  }

  function renderHome() {
    const featured = document.querySelector('#featured-grid');
    const latest = document.querySelector('#latest-list');
    if (!articles.length) return;

    const selected = articles.filter(a => a.featured).slice(0, 4);
    const display = selected.length ? selected : articles.slice(0, 4);

    if (featured) {
      featured.innerHTML = display.map((a, i) => `
        <a class="featured-item ${i === 0 ? 'featured-main' : ''}" href="${articleURL(a)}">
          <span class="featured-number">0${i + 1}</span>
          <span class="featured-meta">${escapeHTML(a.category)} · ${formatDate(a.date)} · ${escapeHTML(a.readTime)}</span>
          <h2>${escapeHTML(a.title)}</h2>
          <p>${escapeHTML(a.description)}</p>
          <span class="featured-link">Read essay <b>→</b></span>
        </a>`).join('');
    }

    if (latest) {
      latest.innerHTML = articles.slice(0, 5).map((a, i) => articleMarkup(a, String(i + 1).padStart(2, '0'))).join('');
    }
  }

  function renderArchive() {
    const list = document.querySelector('#archive-list');
    const count = document.querySelector('#article-count');
    if (!list) return;
    if (count) count.textContent = `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`;
    list.innerHTML = articles.length
      ? articles.map((a, i) => articleMarkup(a, String(i + 1).padStart(2, '0'))).join('')
      : '<p class="empty-state">No articles yet.</p>';
  }

  function openSearch() {
    const overlay = document.querySelector('[data-search-overlay]');
    const input = document.querySelector('[data-search-input]');
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    root.classList.add('search-open');
    setTimeout(() => input?.focus(), 30);
  }

  function closeSearch() {
    const overlay = document.querySelector('[data-search-overlay]');
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    root.classList.remove('search-open');
  }

  function search(query) {
    const results = document.querySelector('#search-results');
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<p class="search-hint">Search across the publication.</p>';
      return;
    }
    const matches = articles.filter(a => [a.title, a.category, a.description, a.date].join(' ').toLowerCase().includes(q)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(a => `<a class="search-result" href="${articleURL(a)}"><span>${escapeHTML(a.category)}</span><strong>${escapeHTML(a.title)}</strong><small>${formatDate(a.date)} · ${escapeHTML(a.readTime)}</small></a>`).join('')
      : '<p class="search-hint">No articles matched that search.</p>';
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-search-open]')) openSearch();
    if (event.target.closest('[data-search-close]')) closeSearch();
    if (event.target.matches('[data-search-overlay]')) closeSearch();
  });

  document.addEventListener('input', event => {
    if (event.target.matches('[data-search-input]')) search(event.target.value);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });

  loadArticles();
})();
