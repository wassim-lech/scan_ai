/*document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM chargé");

    const settingsIcon = document.querySelector('.settings-icon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!settingsIcon || !sidebar || !overlay) {
        console.error("Un ou plusieurs éléments manquent dans le DOM");
        return;
    }

    function toggleSidebar() {
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    }

    settingsIcon.addEventListener('click', function () {
        console.log("Icône réglages cliquée");
        toggleSidebar();
    });

    overlay.addEventListener('click', function () {
        toggleSidebar();
    });

    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    let isLoggedIn = false;
    const sidebarContent = document.getElementById('sidebarContent');
    sidebarContent.innerHTML = isLoggedIn
        ? `
            <div class="item"><i class="fa-solid fa-user"></i><span>Mon compte</span></div>
            <div class="item"><i class="fa-solid fa-shield-halved"></i><span>Sécurité</span></div>
            <div class="item"><i class="fa-solid fa-bell"></i><span>Notifications</span></div>
            <div class="item"><i class="fa-solid fa-gear"></i><span>Paramètres</span></div>
          `
        : `
            <div class="item"><i class="fa-solid fa-user"></i><span>Se connecter</span></div>
            <div class="item"><i class="fa-solid fa-info-circle"></i><span>À propos</span></div>
            <div class="item"><i class="fa-solid fa-phone"></i><span>Contact</span></div>
          `;
});
*/