const baseUrl = 'https://api.melangkah.my.id';

async function getJson(path) {
  const response = await fetch(baseUrl + path);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

async function getDashboard() {
  try {
    const asset = await getJson('/asset/read.php');
    const mahasiswa = await getJson('/mahasiswa/read.php');
    const peminjaman = await getJson('/peminjaman/read.php');

    document.getElementById('cntAsset').textContent = asset.length;
    document.getElementById('cntMhs').textContent = mahasiswa.length;
    document.getElementById('cntPinjam').textContent = peminjaman.length;
    document.getElementById('cntPending').textContent =
      peminjaman.filter(p => p.status_peminjaman === 'Pending').length;
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error);
    alert('Gagal mengambil data dashboard.');
  }
}

getDashboard();
