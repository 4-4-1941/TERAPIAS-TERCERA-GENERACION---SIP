document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll('.sidebar__nav a, #tocContainer a'));
  const sections = Array.from(document.querySelectorAll('.panel[id]'));
  const header = document.querySelector('.site-header');
  const headerOffset = header ? header.offsetHeight + 24 : 100;

  function setActiveLink(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const target = href && href.startsWith('#') ? href.slice(1) : null;
      link.classList.toggle('active', target === id);
    });
  }

  function updateActiveSection() {
    let currentId = sections[0]?.id || null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top - headerOffset <= 0 && rect.bottom > headerOffset) {
        currentId = section.id;
        break;
      }
    }

    if (currentId) setActiveLink(currentId);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
});
