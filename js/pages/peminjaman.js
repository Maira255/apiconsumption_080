const baseUrl = 'https://api.melangkah.my.id';
const readUrl = baseUrl + '/peminjaman/read.php';
const createUrl = baseUrl + '/peminjaman/create.php';
const detailUrl = baseUrl + '/peminjaman/detail.php';
const mahasiswaUrl = baseUrl + '/mahasiswa/read.php';
const assetUrl = baseUrl + '/asset/read.php';

const tableBody = document.querySelector('#dataTable tbody');
const form = document.getElementById('formModalForm');

// READ
async function getPeminjaman() {
  try {
    const response = await fetch(readUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    tableBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada data peminjaman.</td></tr>';
      return;
    }

    data.forEach(p => {
      tableBody.innerHTML += `
        <tr>
          <td>${p.id_peminjaman}</td>
          <td>${p.nim}</td>
          <td>${p.nama_mahasiswa}</td>
          <td>${p.nama_asset}</td>
          <td style="text-align: right">${p.jumlah}</td>
          <td>${p.tanggal_pinjam}</td>
          <td>${p.tanggal_kembali}</td>
          <td class="text-center">${p.status_peminjaman}</td>
          <td class="text-center">
            <button class="btn btn-info btn-sm" title="Detail" onclick="detailPeminjaman(${p.id_peminjaman})"><i class="fas fa-eye"></i></button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Gagal mengambil data peminjaman:', error);
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Tidak dapat mengambil data peminjaman.</td></tr>';
  }
}

// DETAIL
async function detailPeminjaman(id) {
  try {
    const response = await fetch(`${detailUrl}?id_peminjaman=${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const d = await response.json();
    document.getElementById('detailBody').innerHTML = `
      <table class="table table-sm mb-0">
        <tr><th style="width:40%">ID Peminjaman</th><td>${d.id_peminjaman}</td></tr>
        <tr><th>NIM</th><td>${d.nim}</td></tr>
        <tr><th>Mahasiswa</th><td>${d.nama_mahasiswa}</td></tr>
        <tr><th>Jurusan</th><td>${d.jurusan}</td></tr>
        <tr><th>Asset</th><td>${d.nama_asset}</td></tr>
        <tr><th>Kategori</th><td>${d.kategori_asset}</td></tr>
        <tr><th>Jumlah</th><td>${d.jumlah}</td></tr>
        <tr><th>Tanggal Pinjam</th><td>${d.tanggal_pinjam}</td></tr>
        <tr><th>Tanggal Kembali</th><td>${d.tanggal_kembali}</td></tr>
        <tr><th>Keterangan</th><td>${d.keterangan || '-'}</td></tr>
        <tr><th>Status</th><td>${d.status_peminjaman}</td></tr>
        <tr><th>Dibuat</th><td>${d.created_at}</td></tr>
      </table>
    `;
    $('#detailModal').modal('show');
  } catch (error) {
    console.error('Gagal mengambil detail peminjaman:', error);
    alert('Gagal mengambil detail peminjaman.');
  }
}

// Tampilkan form (isi pilihan mahasiswa & asset dulu)
document.getElementById('btnAdd').addEventListener('click', async function () {
  try {
    const [resMhs, resAsset] = await Promise.all([fetch(mahasiswaUrl), fetch(assetUrl)]);
    if (!resMhs.ok || !resAsset.ok) throw new Error('Gagal mengambil data pilihan');
    const mahasiswa = await resMhs.json();
    const asset = await resAsset.json();

    form.reset();
    document.getElementById('id_mahasiswa').innerHTML =
      '<option value="">-- Pilih Mahasiswa --</option>' +
      mahasiswa.map(m => `<option value="${m.id}">${m.nim} - ${m.nama}</option>`).join('');
    document.getElementById('id_asset').innerHTML =
      '<option value="">-- Pilih Asset --</option>' +
      asset.map(a => `<option value="${a.id}">${a.nama_asset} (stok ${a.jumlah})</option>`).join('');

    $('#formModal').modal('show');
  } catch (error) {
    console.error('Gagal membuka form:', error);
    alert('Gagal membuka form peminjaman.');
  }
});

// CREATE
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const peminjaman = {
    id_mahasiswa: Number(document.getElementById('id_mahasiswa').value),
    id_asset: Number(document.getElementById('id_asset').value),
    jumlah: Number(document.getElementById('jumlah').value),
    tanggal_pinjam: document.getElementById('tanggal_pinjam').value,
    tanggal_kembali: document.getElementById('tanggal_kembali').value,
    keterangan: document.getElementById('keterangan').value,
    status_peminjaman: 'Pending'
  };

  try {
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(peminjaman)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    alert('Peminjaman berhasil ditambahkan!');
    $('#formModal').modal('hide');
    getPeminjaman();
  } catch (error) {
    console.error('Gagal menambahkan peminjaman:', error);
    alert('Gagal menambahkan peminjaman.');
  }
});

getPeminjaman();
