// certificados-script.js
// Funcionalidades para a página de certificados

// Ano dinâmico no footer
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Sistema de Filtros ======
const filterButtons = document.querySelectorAll('.filter-btn');
const certificateCards = document.querySelectorAll('.certificate-card');
const noResults = document.getElementById('no-results');
const grid = document.getElementById('certificates-grid');

// Função para filtrar certificados
function filterCertificates(category) {
  let visibleCount = 0;

  certificateCards.forEach(card => {
    const categories = card.dataset.category || '';
    
    if (category === 'todos' || categories.includes(category)) {
      card.classList.remove('hidden');
      // Animação de entrada
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = 'fadeInScale .4s ease forwards';
      }, 10);
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Mostrar/ocultar mensagem de "sem resultados"
  if (visibleCount === 0) {
    noResults.style.display = 'block';
    grid.style.display = 'none';
  } else {
    noResults.style.display = 'none';
    grid.style.display = 'grid';
  }
}

// Event listeners para os botões de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' de todos os botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona 'active' ao botão clicado
    button.classList.add('active');
    
    // Filtra os certificados
    const category = button.dataset.filter;
    filterCertificates(category);
  });
});

// CSS de animação (adicionar ao styles inline ou ao CSS)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translateY(20px) scale(.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;
document.head.appendChild(style);

// ====== Sistema de Modal ======
const modal = document.getElementById('cert-modal');
const modalImage = document.getElementById('modal-image');

// Mapeamento de certificados para suas imagens
const certificateImages = {
  cert1: 'assets/certificados/Certificado_-_Conhecimentos_Gerais_page-0001.png',
  cert2: 'assets/certificados/Certificado__Yellow_Belt_page-0001.png',
  cert3: 'assets/certificados/Certificado__White_Belt_page-0001.png',
  cert4: 'assets/certificados/python-automation.jpg',
  cert5: 'assets/certificados/ux-ui-design.jpg',
  cert6: 'assets/certificados/java-spring.jpg'
};

// Função para abrir modal
function openModal(certId) {
  const imageSrc = certificateImages[certId];
  if (imageSrc) {
    modalImage.src = imageSrc;
    modalImage.alt = `Certificado ${certId}`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Função para fechar modal
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Limpar imagem após animação
  setTimeout(() => {
    modalImage.src = '';
  }, 300);
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

// Prevenir scroll do body quando modal está aberto
modal.addEventListener('wheel', (e) => {
  e.preventDefault();
}, { passive: false });

// ====== Scroll Animations ======
// Observador de interseção para animações ao rolar
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInScale .6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar todos os cards de certificados
certificateCards.forEach(card => {
  card.style.opacity = '0';
  observer.observe(card);
});

// ====== Contador Animado nas Estatísticas ======
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Animar contadores quando a seção de stats entrar na viewport
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.textContent);
        setTimeout(() => {
          animateCounter(stat, target, 1500);
        }, index * 100);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  statsObserver.observe(statsGrid);
}

// ====== Lazy Loading de Imagens ======
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ====== Scroll to Top Suave ======
const topButton = document.querySelector('.top');
if (topButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topButton.style.opacity = '1';
      topButton.style.pointerEvents = 'auto';
    } else {
      topButton.style.opacity = '0';
      topButton.style.pointerEvents = 'none';
    }
  });
}

// ====== Acessibilidade: Trap focus no modal ======
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
});

// Tornar funções globais para uso nos botões HTML
window.openModal = openModal;
window.closeModal = closeModal;

console.log('✅ Sistema de certificados carregado com sucesso!');