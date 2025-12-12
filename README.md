<h1>Panduan Setup, Deployment, & Pengujian</h1>
<h2>Aplikasi: Singitronic – Electronics eCommerce Web Application</h2>

<p>Dokumen ini berfungsi sebagai panduan teknis untuk instalasi lingkungan pengembangan lokal, eksekusi aplikasi, dan prosedur pengujian kualitas perangkat lunak (SQA).</p>

<h3>1. Persiapan Awal (Cloning & Environment)</h3>
<p>Langkah pertama untuk menyiapkan proyek di lingkungan lokal:</p>
<ol>
<li>
<p><strong>Clone Repository</strong>

Pastikan Anda menggunakan <em>fork</em> repository yang tepat. Unduh kode sumber dan masuk ke direktori proyek melalui terminal:</p>

<pre><code>git clone https://github.com/YanardRognuh/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS.git
cd Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS</code></pre>
</li>
<li>
<p><strong>Generate Environment Variables</strong>

Jalankan perintah setup otomatis untuk membuat file konfigurasi <code>.env</code> yang diperlukan:</p>

<pre><code>npm run setup</code></pre>
<blockquote>
<p><strong>Catatan:</strong> Perintah ini akan mengkonfigurasi variabel lingkungan dasar (default) untuk frontend dan backend agar aplikasi dapat berjalan tanpa konfigurasi manual yang rumit.</p>
</blockquote>
</li>
</ol>

<h3>2. Menjalankan Aplikasi</h3>
<p>Silakan pilih salah satu metode di bawah ini.</p>

<blockquote>
<p><strong>⚠️ PENTING: Rekomendasi Mode untuk Pengujian</strong>

Terdapat <strong>isu performa yang diketahui (Known Issue)</strong> pada mode pengembangan manual (seperti <em>latency</em> tinggi yang diduga akibat mekanisme <em>rate limiting</em> atau overhead pada dev server).

Oleh karena itu, untuk pengalaman pengguna yang optimal dan <strong>kelancaran pengujian Cypress</strong>, sangat direkomendasikan untuk menggunakan <strong>Metode B (Docker/Production Mode)</strong>.</p>

</blockquote>

<h4>Metode A: Mode Manual (XAMPP / Development)</h4>
<p><em>Cocok untuk: Pengembangan fitur harian (coding) dan debugging spesifik.</em></p>

<p><strong>Langkah-langkah:</strong></p>
<ol>
<li>
<p><strong>Persiapan Database:</strong></p>
<ul>
<li>Pastikan XAMPP aktif (Start Apache & MySQL).</li>
<li>(Opsional) Buka phpMyAdmin dan buat database baru bernama: <code>singitronic_nextjs</code>.</li>
</ul>
</li>
<li>
<p><strong>Instalasi Dependensi & Migrasi Data:</strong>

Jalankan perintah berikut secara berurutan di terminal <em>root</em>:</p>

<pre><code>npm install
cd server
npm install
npx prisma migrate dev
cd utils
node insertDemoData.js</code></pre>
</li>
<li>
<p><strong>Jalankan Aplikasi:</strong>

Gunakan dua terminal terpisah agar frontend dan backend berjalan bersamaan:</p>

<p><strong>Terminal 1 (Backend):</strong></p>
<pre><code>cd server && node app.js</code></pre>
<p><strong>Terminal 2 (Frontend):</strong></p>
<pre><code>npm run dev</code></pre>
</li>
</ol>

<h4>Metode B: Mode Docker (Containerization / Production-like) — <strong>DIREKOMENDASIKAN</strong></h4>
<p><em>Cocok untuk: Validasi portabilitas, Demo, dan Pengujian Otomatis (E2E).</em></p>

<p><strong>Langkah-langkah:</strong></p>
<ol>
<li>
<p><strong>Persiapan:</strong></p>
<ul>
<li><strong>Matikan MySQL XAMPP</strong> agar port <code>3306</code> tidak mengalami konflik (bentrok).</li>
<li>Pastikan aplikasi <strong>Docker Desktop</strong> sudah berjalan.</li>
</ul>
</li>
<li>
<p><strong>Eksekusi:</strong>

Cukup jalankan satu perintah ini di <em>root</em> folder proyek:</p>

<pre><code>docker-compose up --build</code></pre>
</li>
</ol>

<p><strong>Akses Aplikasi:</strong></p>
<ul>
<li><strong>Frontend:</strong> <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
<li><strong>Backend:</strong> <a href="http://localhost:3001" target="_blank">http://localhost:3001</a></li>
</ul>

<h3>3. Prosedur Pengujian (Cypress E2E)</h3>
<p>Setelah aplikasi berjalan, langkah selanjutnya adalah menjalankan pengujian <em>End-to-End</em> (E2E) untuk memvalidasi fungsionalitas sistem.</p>

<p><strong>Prasyarat:</strong>

Pastikan aplikasi Singitronic sedang berjalan. Seperti disebutkan di atas, <strong>sangat disarankan menggunakan Mode Docker (<code>docker-compose up</code>)</strong> sebelum menjalankan perintah di bawah ini untuk menghindari <em>timeout</em> pada Cypress akibat respon server yang lambat di mode development.</p>

<p><strong>Langkah Eksekusi:</strong></p>
<ol>
<li><p>Buka terminal baru di root folder proyek.</p></li>
<li>
<p>Jalankan Cypress Test Runner:</p>
<pre><code>npx cypress open</code></pre>
</li>
<li><p>Pada jendela Cypress yang terbuka, pilih <strong>E2E Testing</strong>.</p></li>
<li><p>Pilih browser (Chrome/Electron) dan klik <strong>Start E2E Testing</strong>.</p></li>
<li><p>Pilih spesifikasi tes (Spec) yang ingin dijalankan dari daftar yang tersedia.</p></li>
</ol>

<h3>4. Perbandingan Metode Setup</h3>
<table border="1">
<thead>
<tr>
<th>Aspek</th>
<th>Manual (XAMPP)</th>
<th>Docker Compose</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Kecepatan Development</strong></td>
<td>⚡ Sangat cepat (<em>hot reload</em> aktif)</td>
<td>❌ Lambat (perlu <em>rebuild</em> saat ubah kode)</td>
</tr>
<tr>
<td><strong>Stabilitas & Performa</strong></td>
<td>⚠️ Rentan isu <em>rate limiting</em>/lambat</td>
<td>✅ Stabil & Cepat (Production Environment)</td>
</tr>
<tr>
<td><strong>Prasyarat</strong></td>
<td>Butuh Node.js & XAMPP terinstall</td>
<td>Hanya butuh Docker</td>
</tr>
<tr>
<td><strong>Konsistensi</strong></td>
<td>Bergantung konfigurasi lokal PC</td>
<td>Konsisten di semua mesin (<em>isolated</em>)</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>MySQL XAMPP (Localhost)</td>
<td>MySQL Container (Isolated)</td>
</tr>
<tr>
<td><strong>Kegunaan Utama</strong></td>
<td><em>Coding</em> & <em>Debugging</em></td>
<td><strong>Cypress Testing</strong>, Final Test, & Demo</td>
</tr>
</tbody>
</table>

<h3>5. Troubleshooting & Catatan Penting</h3>
<ol>
<li>
<p><strong>Konflik Port 3306</strong>

Jangan menjalankan XAMPP MySQL dan Docker secara bersamaan. Jika Anda ingin menjalankan Docker, matikan servis MySQL di XAMPP terlebih dahulu (<em>Stop</em>), begitu juga sebaliknya.</p>

</li>
<li>
<p><strong>Update Data di Docker</strong>

Jika Anda mengubah skrip data <em>dummy</em> (<code>insertDemoData.js</code>) atau skema database, Anda perlu me-<em>rebuild</em> container agar perubahan diterapkan:</p>

<pre><code>docker-compose up --build</code></pre>
</li>
<li>
<p><strong>Rekomendasi Alur Kerja (Workflow)</strong></p>
<ul>
<li>Gunakan <strong>Metode A (Manual)</strong> saat Anda sedang menulis kode atau memperbaiki bug (<em>debugging</em>).</li>
<li>Gunakan <strong>Metode B (Docker)</strong> saat Anda ingin menjalankan <strong>Cypress</strong>, demo aplikasi, atau memvalidasi portabilitas sesuai standar ISO/IEC 25010.</li>
</ul>
</li>
</ol>
