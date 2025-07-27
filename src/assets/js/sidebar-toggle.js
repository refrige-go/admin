// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const mainWrapper = document.getElementById('main-wrapper');
    const sidebar = document.getElementById('application-sidebar-brand');
    
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-collapsed');
            mainWrapper.classList.toggle('sidebar-collapsed-main');
            
            // 아이콘 변경
            const toggleIcon = sidebarToggleBtn.querySelector('i');
            if (sidebar.classList.contains('sidebar-collapsed')) {
                toggleIcon.classList.remove('ti-chevron-left');
                toggleIcon.classList.add('ti-chevron-right');
            } else {
                toggleIcon.classList.remove('ti-chevron-right');
                toggleIcon.classList.add('ti-chevron-left');
            }
        });
    }
}); 