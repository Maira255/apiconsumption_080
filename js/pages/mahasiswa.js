const baseUrl = 'https://api.melangkah.my.id/mahasiswa';
const readUrl = baseUrl + '/read.php';
const createUrl = baseUrl + '/create.php';
const updateUrl = baseUrl + '/update.php';
const deleteUrl = baseUrl + '/delete.php';

const tableBody = document.querySelector('#dataTable tbody');
const form = document.getElementById('formModalForm');
let dataMahasiswa = [];

// READ
async function getMahasiswa() {
  try {
    const response = await fetch(readUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    dataMahasiswa = await response.json();
    tableBody.innerHTML = '';

    if (!Array.isArray(dataMahasiswa) || dataMahasiswa.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada data mahasiswa.</td></tr>';
      return;
    }

    dataMahasiswa.forEach(m => {
      tableBody.innerHTML += `
        <tr>
          <td>${m.id}</td>
          <td>${m.nim}</td>
          <td>${m.nama}</td>
          <td width="15%">${m.jurusan}</td>
          <td>${m.angkatan}</td>
          <td>${m.email}</td>
          <td>${m.telepon}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm" title="Edit" onclick="editMahasiswa(${m.id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" title="Hapus" onclick="deleteMahasiswa(${m.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Gagal mengambil data mahasiswa:', error);
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Tidak dapat mengambil data mahasiswa.</td></tr>';
  }
}

// Tampilkan form tambah
document.getElementById('btnAdd').addEventListener('click', function () {
  form.reset();
  document.getElementById('recordId').value = '';
  document.getElementById('formModalTitle').textContent = 'Tambah Mahasiswa';
  $('#formModal').modal('show');
});

// Tampilkan form edit
function editMahasiswa(id) {
  const m = dataMahasiswa.find(x => x.id == id);
  document.getElementById('recordId').value = m.id;
  document.getElementById('nim').value = m.nim;
  document.getElementById('nama').value = m.nama;
  document.getElementById('jurusan').value = m.jurusan;
  document.getElementById('angkatan').value = m.angkatan;
  document.getElementById('email').value = m.email;
  document.getElementById('telepon').value = m.telepon;
  document.getElementById('formModalTitle').textContent = 'Edit Mahasiswa';
  $('#formModal').modal('show');
}

// CREATE & UPDATE
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('recordId').value;
  const mahasiswa = {
    nim: document.getElementById('nim').value,
    nama: document.getElementById('nama').value,
    jurusan: document.getElementById('jurusan').value,
    angkatan: document.getElementById('angkatan').value,
    email: document.getElementById('email').value,
    telepon: document.getElementById('telepon').value
  };
  if (id) mahasiswa.id = Number(id);

  try {
    const response = await fetch(id ? updateUrl : createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mahasiswa)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    alert(id ? 'Mahasiswa berhasil diperbarui!' : 'Mahasiswa berhasil ditambahkan!');
    $('#formModal').modal('hide');
    getMahasiswa();
  } catch (error) {
    console.error('Gagal menyimpan mahasiswa:', error);
    alert('Gagal menyimpan mahasiswa.');
  }
});

// DELETE
async function deleteMahasiswa(id) {
  if (!confirm('Yakin ingin menghapus mahasiswa ini?')) return;

  try {
    const response = await fetch(`${deleteUrl}?id=${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    alert('Mahasiswa berhasil dihapus!');
    getMahasiswa();
  } catch (error) {
    console.error('Gagal menghapus mahasiswa:', error);
    alert('Gagal menghapus mahasiswa.');
  }
}

getMahasiswa();
