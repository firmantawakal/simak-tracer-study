import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">UD</span>
              </div>
              <span className="text-white font-semibold text-lg">Universitas Dumai</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Fitur</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">Tentang</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Kontak</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                🎓 Sistem Tracer Study Modern
              </span>
            </div>

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
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Portal Alumni</h3>
                <p className="text-gray-300 mb-6">
                  Bagikan pengalaman karir Anda dan bantu universitas meningkatkan kualitas pendidikan untuk generasi mendatang
                </p>
                <div className="flex items-center text-blue-300 font-medium">
                  <span>Akses melalui email</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Portal Administrator</h3>
                <p className="text-gray-300 mb-6">
                  Kelola survey, analisis data alumni, dan dashboard komprehensif untuk monitoring tracer study
                </p>
                <Link
                  href="/admin/login"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Tentang Universitas
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>Universitas Dumai adalah perguruan tinggi swasta yang terletak di Kota Dumai, Provinsi Riau. Sebagai institusi pendidikan yang terus berkembang, Universitas Dumai berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi dan relevan dengan kebutuhan industri.</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Didirikan</p>
                      <p className="text-lg font-semibold text-white">2008</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Lokasi</p>
                      <p className="text-lg font-semibold text-white">Kota Dumai, Riau</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Fakultas</p>
                      <p className="text-lg font-semibold text-white">5 Fakultas</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Program Studi</p>
                      <p className="text-lg font-semibold text-white">15 Program Studi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Akreditasi & Prestasi
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>Universitas Dumai telah mendapatkan pengakuan dari berbagai lembaga akreditasi dan terus meningkatkan kualitas pendidikan untuk memenuhi standar nasional.</p>
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Akreditasi Institusi</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">Baik</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Lulusan Terdaftar</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">1,800+</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <span className="text-gray-300">Tingkat Employability</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">87%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-8">Data berdasarkan Laporan Tracer Study Universitas Dumai 2022-2023</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">1,800+</span>
              </div>
              <p className="text-gray-400">Total Alumni</p>
              <p className="text-sm text-gray-500 mt-2">Lulusan sebelum 2022</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">87%</span>
              </div>
              <p className="text-gray-400">Tingkat Kerja</p>
              <p className="text-sm text-gray-500 mt-2">Employment Rate</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">65%</span>
              </div>
              <p className="text-gray-400">Tingkat Respon</p>
              <p className="text-sm text-gray-500 mt-2">1,170 Responden</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">3-6</span>
              </div>
              <p className="text-gray-400">Bulan Tunggu</p>
              <p className="text-sm text-gray-500 mt-2">Rata-rata dapat kerja</p>
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Distribusi Sektor Kerja</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10"></circle>
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-blue-400"
                            strokeDasharray={`${2 * Math.PI * 36 * 0.72} ${2 * Math.PI * 36}`} strokeLinecap="round"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">72%</span>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Sektor Swasta</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10"></circle>
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-green-400"
                            strokeDasharray={`${2 * Math.PI * 36 * 0.15} ${2 * Math.PI * 36}`} strokeLinecap="round"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">15%</span>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Pemerintah</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10"></circle>
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-purple-400"
                            strokeDasharray={`${2 * Math.PI * 36 * 0.08} ${2 * Math.PI * 36}`} strokeLinecap="round"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">8%</span>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Wirausaha</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10"></circle>
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-yellow-400"
                            strokeDasharray={`${2 * Math.PI * 36 * 0.05} ${2 * Math.PI * 36}`} strokeLinecap="round"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">5%</span>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Lanjut Studi</p>
              </div>
            </div>
          </div>

          {/* Top Industries */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Industri Teratas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">Perbankan & Keuangan</h4>
                  <span className="text-xl font-bold text-blue-400">23%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{width: '23%'}}></div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">Pendidikan</h4>
                  <span className="text-xl font-bold text-green-400">18%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '18%'}}></div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">Minyak & Gas</h4>
                  <span className="text-xl font-bold text-purple-400">15%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">Manufaktur</h4>
                  <span className="text-xl font-bold text-yellow-400">12%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{width: '12%'}}></div>
                </div>
              </div>
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Aman & Terpercaya</h3>
                <p className="text-gray-400">
                  Sistem keamanan berlapis dengan enkripsi data dan token aksi yang unik untuk setiap alumni
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Cepat & Efisien</h3>
                <p className="text-gray-400">
                  Interface yang responsif dan proses survey yang streamlined untuk pengalaman pengguna terbaik
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Analisis Komprehensif</h3>
                <p className="text-gray-400">
                  Dashboard analitik yang powerful dengan visualisasi data untuk insight mendalam
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Mobile Friendly</h3>
                <p className="text-gray-400">
                  Desain responsif yang sempurna di berbagai perangkat, dari desktop hingga smartphone
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Notifikasi Otomatis</h3>
                <p className="text-gray-400">
                  Sistem pengiriman email otomatis untuk invite survey dan reminder kepada alumni
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Customizable</h3>
                <p className="text-gray-400">
                  Survey yang dapat disesuaikan dengan berbagai jenis pertanyaan dan konfigurasi
                </p>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Evaluasi Kurikulum</h4>
                <p className="text-gray-400 text-sm">Membantu universitas mengevaluasi dan meningkatkan kualitas pembelajaran</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Jaringan Alumni</h4>
                <p className="text-gray-400 text-sm">Membangun komunitas alumni yang kuat dan saling mendukung</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Analisis Karir</h4>
                <p className="text-gray-400 text-sm">Memberikan insight tentang perkembangan karir alumni</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UD</span>
                </div>
                <span className="text-white font-semibold">Universitas Dumai</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistem tracer study modern untuk melacak kesuksesan alumni
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Portal Alumni</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portal Admin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bantuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tentang</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@universitasdumai.ac.id
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (0761) 12345
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Universitas Dumai. All rights reserved. Powered by Tracer Study System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}