import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/logo-unidum.png"
                alt="Universitas Dumai Logo"
                className="w-12 h-12 object-contain rounded-lg"
              />
              <span className="text-white font-semibold text-lg">Universitas Dumai</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/surveys" className="text-gray-300 hover:text-white transition-colors">Survei</Link>
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Fitur</Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">Tentang</Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Kontak</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Melacak
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}Sukses Alumni
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Platform tracer study yang komprehensif untuk memetakan perjalanan karir alumni dan meningkatkan kualitas pendidikan Universitas Dumai
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Isi Survei</h3>
                <p className="text-gray-300 mb-6">
                  Partisipasi dalam survei tracer study dan bantu universitas meningkatkan kualitas pendidikan
                </p>

                <Link
                  href="/surveys"
                  className="inline-flex items-center text-green-300 font-medium hover:text-green-200 transition-colors"
                >
                  <span>Lihat Survei Tersedia</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              <div className="hidden bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Portal Administrator</h3>
                <p className="text-gray-300 mb-6">
                  Kelola survey, analisis data alumni, dan dashboard komprehensif untuk monitoring tracer study
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center text-purple-300 font-medium hover:text-purple-200 transition-colors"
                >
                  <span>Login Admin</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Profile Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Universitas Dumai Profile</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Institusi pendidikan tinggi yang berkomitmen menghasilkan lulusan berkualitas dan siap kerja
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-4-4h1m5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Tentang Universitas
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>Universitas Dumai adalah perguruan tinggi swasta yang terletak di Kota Dumai, Provinsi Riau. Sebagai institusi pendidikan yang terus berkembang, Universitas Dumai berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi dan relevan dengan kebutuhan industri.</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Didirikan</p>
                      <p className="text-lg font-semibold text-white">2005 (Sebelumnya STMIK Dumai)</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Lokasi</p>
                      <p className="text-lg font-semibold text-white">Jl. Utama Karya, Bukit Batrem, Kota Dumai, Riau</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Fakultas</p>
                      <p className="text-lg font-semibold text-white">3 Fakultas</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Program Studi</p>
                      <p className="text-lg font-semibold text-white">6 Program Studi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Kampus Universitas Dumai
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>Dapatkan gambaran lengkap tentang fasilitas dan lingkungan kampus Universitas Dumai yang mendukung proses pembelajaran yang kondusif dan berkualitas.</p>
                  <div className="mt-6 rounded-lg overflow-hidden">
                    <img
                      src="/unidum.jpg"
                      alt="Kampus Universitas Dumai"
                      className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Fasilitas Laboratorium</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">Modern</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Perpustakaan Digital</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">Lengkap</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Fasilitas</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">Lengkap</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tracer Study Statistics</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Data aktual dari laporan tracer study 2022-2023 untuk alumni 2018-2022
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Fitur Unggulan</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Sistem tracer study yang dirancang khusus untuk kebutuhan Universitas Dumai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Tentang Tracer Study</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Tracer Study Universitas Dumai adalah sistem informasi yang dirancang untuk melacak perkembangan karir alumni setelah lulus.
              Data yang dikumpulkan membantu universitas dalam evaluasi kurikulum, peningkatan kualitas pendidikan,
              dan pembangunan jaringan alumni yang kuat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Universitas Dumai. All rights reserved. Powered by Tracer Study System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}