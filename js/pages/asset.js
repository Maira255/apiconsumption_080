const baseUrl = 'https://api.melangkah.my.id/asset';
const readUrl = baseUrl + '/read.php';
const createUrl = baseUrl + '/create.php';
const updateUrl = baseUrl + '/update.php';
const deleteUrl = baseUrl + '/delete.php';

const tableBody = document.querySelector('#dataTable tbody');
const form = document.getElementById('formModalForm');
let dataAsset = [];

// READ
async function getAsset() {
  try {
    const response = await fetch(readUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    dataAsset = await response.json();
    tableBody.innerHTML = '';

    if (!Array.isArray(dataAsset) || dataAsset.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada data asset.</td></tr>';
      return;
    }

    dataAsset.forEach(a => {
      tableBody.innerHTML += `
        <tr>
          <td>${a.id}</td>
          <td>${a.nama_asset}</td>
          <td>${a.kategori}</td>
          <td style="text-align: right">${a.jumlah}</td>
          <td>${a.kondisi}</td>
          <td>${a.lokasi}</td>
          <td class="text-center">${a.status}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm" title="Edit" onclick="editAsset(${a.id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" title="Hapus" onclick="deleteAsset(${a.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Gagal mengambil data asset:', error);
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Tidak dapat mengambil data asset.</td></tr>';
  }
}

// Tampilkan form tambah
document.getElementById('btnAdd').addEventListener('click', function () {
  form.reset();
  document.getElementById('recordId').value = '';
  document.getElementById('formModalTitle').textContent = 'Tambah Asset';
  $('#formModal').modal('show');
});

// Tampilkan form edit
function editAsset(id) {
  const a = dataAsset.find(x => x.id == id);
  document.getElementById('recordId').value = a.id;
  document.getElementById('nama_asset').value = a.nama_asset;
  document.getElementById('kategori').value = a.kategori;
  document.getElementById('jumlah').value = a.jumlah;
  document.getElementById('kondisi').value = a.kondisi;
  document.getElementById('lokasi').value = a.lokasi;
  document.getElementById('status').value = a.status;
  document.getElementById('formModalTitle').textContent = 'Edit Asset';
  $('#formModal').modal('show');
}

// CREATE & UPDATE
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('recordId').value;
  const asset = {
    nama_asset: document.getElementById('nama_asset').value,
    kategori: document.getElementById('kategori').value,
    jumlah: document.getElementById('jumlah').value,
    kondisi: document.getElementById('kondisi').value,
    lokasi: document.getElementById('lokasi').value,
    status: document.getElementById('status').value
  };
  if (id) asset.id = Number(id);

  try {
    const response = await fetch(id ? updateUrl : createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    alert(id ? 'Asset berhasil diperbarui!' : 'Asset berhasil ditambahkan!');
    $('#formModal').modal('hide');
    getAsset();
  } catch (error) {
    console.error('Gagal menyimpan asset:', error);
    alert('Gagal menyimpan asset.');
  }
});

// DELETE
async function deleteAsset(id) {
  if (!confirm('Yakin ingin menghapus asset ini?')) return;

  try {
    const response = await fetch(`${deleteUrl}?id=${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    alert('Asset berhasil dihapus!');
    getAsset();
  } catch (error) {
    console.error('Gagal menghapus asset:', error);
    alert('Gagal menghapus asset.');
  }
}

getAsset();
