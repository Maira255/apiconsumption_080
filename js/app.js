// Layout bersama (sidebar & topbar)
function renderLayout(active) {
  const menu = [
    { key: 'index', href: 'index.html', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { key: 'asset', href: 'asset.html', icon: 'fa-boxes', label: 'Master Asset' },
    { key: 'mahasiswa', href: 'mahasiswa.html', icon: 'fa-user-graduate', label: 'Master Mahasiswa' },
    { key: 'peminjaman', href: 'peminjaman.html', icon: 'fa-handshake', label: 'Transaksi Peminjaman' }
  ];
  const items = menu.map(function (m) {
    return '<li class="nav-item' + (m.key === active ? ' active' : '') + '">' +
      '<a class="nav-link" href="' + m.href + '"><i class="fas fa-fw ' + m.icon + '"></i><span>' + m.label + '</span></a></li>';
  }).join('');

  $('#accordionSidebar').html(
    '<a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">' +
    '<div class="sidebar-brand-icon"><i class="fas fa-warehouse"></i></div>' +
    '<div class="sidebar-brand-text mx-3">Peminjaman Asset</div></a>' +
    '<hr class="sidebar-divider my-0">' + items +
    '<hr class="sidebar-divider d-none d-md-block">' +
    '<div class="text-center d-none d-md-inline"><button class="rounded-circle border-0" id="sidebarToggle"></button></div>'
  );

  $('#topbar').html(
    '<button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3"><i class="fa fa-bars"></i></button>'
  );
}
