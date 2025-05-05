
document.querySelector('.settings-icon').addEventListener('click', () => {
    toggleSidebar();
  });
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
  
    const isHidden = sidebar.classList.contains('hidden');
    
    if (isHidden) {
      sidebar.classList.remove('hidden');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
      overlay.classList.add('hidden');
    }
  
    updateSidebarContent();
  }
  
  let isLoggedIn = false; // à changer à true pour simuler un utilisateur connecté

  function updateSidebarContent() {
    const content = document.getElementById('sidebarContent');
    content.innerHTML = ''; // on nettoie d'abord
  
    const items = isLoggedIn
      ? [
          { icon: '👤', text: 'Mon compte' },
          { icon: '🔒', text: 'Sécurité' },
          { icon: '🔔', text: 'Notifications' },
          { icon: '⚙️', text: 'Paramètres' }
        ]
      : [
          { icon: 'ℹ️', text: 'À propos de E-med' },
          { icon: '🔐', text: 'Connexion' },
          { icon: '📞', text: 'Contact' }
        ];
  
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<i>${item.icon}</i><span>${item.text}</span>`;
      content.appendChild(div);
    });
  }
  document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const icon = document.querySelector('.settings-icon');
  
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnIcon = icon.contains(event.target);
  
    // Si le clic est à l'extérieur de la sidebar ET pas sur l'icône
    if (!isClickInsideSidebar && !isClickOnIcon && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
    }
  });

  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('sidebarOverlay').classList.add('hidden');
  });
  // Gérer la sélection active dans la sidebar
document.addEventListener("DOMContentLoaded", () => {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      // Supprimer 'active' de tous les items
      sidebarItems.forEach(i => i.classList.remove("active"));
      
      // Ajouter 'active' à celui cliqué
      item.classList.add("active");
    });
  });
});

  