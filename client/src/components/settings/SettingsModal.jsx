import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCctvStore } from '../../store/useCctvStore';
import { X, Save, Plus, Trash, Server, MapIcon, Video, Crosshair, MapPin, Edit } from 'lucide-react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';

function MiniMapEvents({ setMapConfig }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setMapConfig({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
    },
  });
  return null;
}

function MapCenterUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    const current = map.getCenter();
    if (Math.abs(current.lat - lat) > 0.0001 || Math.abs(current.lng - lng) > 0.0001) {
      map.setView([lat, lng]);
    }
  }, [lat, lng, map]);
  return null;
}

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('cctv'); // cctv, nvr, map
  const { cameras, setCameras } = useCctvStore();
  const [nvrConfig, setNvrConfig] = useState({ host: '', user: '', password: '', port: 554 });
  const [mapConfig, setMapConfig] = useState({ lat: -6.808722, lng: 107.649002, zoom: 19 });
  
  const [newCam, setNewCam] = useState({ id: null, name: '', location: '', channel: 1, lat: -6.808722, lng: 107.649002, rtsp_url: '' });
  const [batchConfig, setBatchConfig] = useState({ prefix: 'CAM-', start: 1, end: 16 });
  const [cameraMode, setCameraMode] = useState('single');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [cams, sets] = await Promise.all([
      axios.get('/api/cameras'),
      axios.get('/api/settings')
    ]);
    setCameras(cams.data);
    if (sets.data.map_config) { 
      setMapConfig(sets.data.map_config); 
      setNewCam(prev => ({ ...prev, lat: sets.data.map_config.lat || -6.808722, lng: sets.data.map_config.lng || 107.649002 }));
    }
    if (sets.data.nvr_config) setNvrConfig(sets.data.nvr_config);
  };

  const saveConfig = async (key, val) => {
    await axios.post('/api/settings', { key, value: val });
    alert(key === 'nvr_config' ? 'Koneksi NVR Disimpan!' : 'Pengaturan Peta Disimpan!');
  };

  const addCamera = async (e) => {
    e.preventDefault();
    if (!newCam.name) return alert('Nama kamera wajib diisi');
    
    try {
      if (newCam.id) {
        await axios.put(`/api/cameras/${newCam.id}`, newCam);
        alert('Kamera berhasil diperbarui!');
      } else {
        await axios.post('/api/cameras', newCam);
      }
      
      setNewCam({ id: null, name: '', location: '', channel: 1, lat: mapConfig.lat || -6.808722, lng: mapConfig.lng || 107.649002, rtsp_url: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan kamera! Terjadi kesalahan pada server.');
    }
  };

  const generateBatchCameras = async (e) => {
    e.preventDefault();
    const count = batchConfig.end - batchConfig.start + 1;
    if (count <= 0) return alert('Rentang channel tidak valid');
    if (!confirm(`Generate ${count} kamera sekaligus?`)) return;
    
    let currentLat = mapConfig.lat || -6.808722;
    let currentLng = mapConfig.lng || 107.649002;
    
    const promises = [];
    for (let ch = batchConfig.start; ch <= batchConfig.end; ch++) {
      promises.push(axios.post('/api/cameras', {
        name: `${batchConfig.prefix}${ch}`,
        location: `Lokasi NVR Ch ${ch}`,
        channel: ch,
        lat: currentLat + (Math.random() * 0.02 - 0.01),
        lng: currentLng + (Math.random() * 0.02 - 0.01)
      }));
    }
    await Promise.all(promises);
    fetchData();
    alert(`${count} kamera berhasil ditambahkan!`);
  };

  const deleteCamera = async (id) => {
    if (confirm('Hapus kamera ini?')) {
      await axios.delete(`/api/cameras/${id}`);
      fetchData();
    }
  };

  const editCamera = (cam) => {
    setNewCam({
      id: cam.id,
      name: cam.name,
      location: cam.location || '',
      channel: cam.channel,
      lat: cam.lat,
      lng: cam.lng,
      rtsp_url: cam.rtsp_url || ''
    });
    setCameraMode('single');
    const scrollContainer = document.getElementById('settings-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const searchLocation = async () => {
    const query = prompt('Masukkan nama lokasi (misal: "Alun-alun Bandung"):');
    if (!query) return;
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      if (res.data && res.data.length > 0) {
        setNewCam(prev => ({...prev, lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon)}));
      } else {
        alert('Lokasi tidak ditemukan');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mencari lokasi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden">
        
        {/* SIDEBAR TABS */}
        <div className="w-64 bg-[#0a0f1c] border-r border-slate-800 p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pengaturan Sistem</div>
          
          <button onClick={() => setActiveTab('cctv')} className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${activeTab === 'cctv' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Video size={18} />
            Manajemen CCTV
          </button>
          <button onClick={() => setActiveTab('nvr')} className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${activeTab === 'nvr' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Server size={18} />
            Koneksi NVR
          </button>
          <button onClick={() => setActiveTab('map')} className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <MapIcon size={18} />
            Konfigurasi Peta
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full bg-[#111827]">
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0a0f1c]">
            <h2 className="text-lg font-bold text-white">
              {activeTab === 'cctv' ? 'Data Kamera CCTV' : activeTab === 'nvr' ? 'Pengaturan Server NVR' : 'Pusat Koordinat Peta Default'}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
              <X size={20} />
            </button>
          </div>

          <div id="settings-scroll-area" className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
            
            {/* MAP CONFIG TAB */}
            {activeTab === 'map' && (
              <div className="max-w-2xl">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <h3 className="text-blue-400 font-bold mb-1">Peta Default Aplikasi</h3>
                  <p className="text-sm text-slate-300">
                    Geser peta dan atur zoom ke posisi yang Anda inginkan, lalu klik Simpan.
                  </p>
                  <div className="h-64 w-full rounded-xl overflow-hidden relative border border-slate-700 shadow-inner mt-4">
                    <MapContainer key="config-map" center={[mapConfig.lat, mapConfig.lng]} zoom={mapConfig.zoom} maxZoom={22} zoomControl={true} className="w-full h-full z-0">
                      <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22} />
                      <MiniMapEvents setMapConfig={setMapConfig} />
                      <MapCenterUpdater lat={mapConfig.lat} lng={mapConfig.lng} />
                    </MapContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none text-red-500 drop-shadow-md">
                      <Crosshair size={32} />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 bg-slate-900 rounded-lg p-2 px-3 border border-slate-700">
                      <span className="text-[10px] text-slate-500 block">LATITUDE</span>
                      <span className="font-mono text-sm text-white">{mapConfig.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg p-2 px-3 border border-slate-700">
                      <span className="text-[10px] text-slate-500 block">LONGITUDE</span>
                      <span className="font-mono text-sm text-white">{mapConfig.lng.toFixed(6)}</span>
                    </div>
                    <div className="w-24 bg-slate-900 rounded-lg p-2 px-3 border border-slate-700">
                      <span className="text-[10px] text-slate-500 block">ZOOM</span>
                      <span className="font-mono text-sm text-white">{mapConfig.zoom}</span>
                    </div>
                  </div>
                  <button onClick={() => saveConfig('map_config', mapConfig)} className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                    <Save size={18} /> Simpan Pengaturan Peta
                  </button>
                </div>
              </div>
            )}

            {/* NVR CONFIG TAB */}
            {activeTab === 'nvr' && (
              <div className="max-w-xl">
                <form onSubmit={(e) => { e.preventDefault(); saveConfig('nvr_config', nvrConfig); }} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">IP Address / Host</label>
                    <input type="text" value={nvrConfig.host} onChange={e=>setNvrConfig({...nvrConfig, host:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="Contoh: 192.168.1.100" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Username</label>
                      <input type="text" value={nvrConfig.user} onChange={e=>setNvrConfig({...nvrConfig, user:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Password</label>
                      <input type="password" value={nvrConfig.password} onChange={e=>setNvrConfig({...nvrConfig, password:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 mt-2">
                    <Save size={18} /> Simpan Koneksi NVR
                  </button>
                </form>
              </div>
            )}

            {/* CCTV TAB */}
            {activeTab === 'cctv' && (
              <div>
                <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-lg w-max border border-slate-800">
                  <button onClick={() => setCameraMode('single')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${cameraMode === 'single' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Tambah Manual</button>
                  <button onClick={() => setCameraMode('batch')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${cameraMode === 'batch' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Generate Massal (NVR)</button>
                </div>

                {cameraMode === 'single' ? (
                  <form onSubmit={addCamera} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl mb-8">
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Left: Form */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Nama Kamera</label>
                          <div className="flex gap-2">
                            <input type="text" name="name" value={newCam.name} onChange={e => setNewCam({...newCam, name: e.target.value})} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="Contoh: Kamera Parkiran Depan"/>
                            <select value={newCam.channel} onChange={e => setNewCam({...newCam, channel: parseInt(e.target.value)})} className="bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:border-blue-500 outline-none">
                              {[...Array(64)].map((_, i) => <option key={i+1} value={i+1}>CH {i+1}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">RTSP URL Stream Sub (Opsional, override otomatis)</label>
                          <input type="text" name="rtsp_url" value={newCam.rtsp_url} onChange={e => setNewCam({...newCam, rtsp_url: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-white focus:border-blue-500 outline-none" placeholder="rtsp://admin:Bismillah123@192.168.80.15"/>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="col-span-3">
                            <label className="text-xs text-slate-400 block mb-1">Grup Kamera / Lokasi (Opsional)</label>
                            <input 
                              type="text" 
                              list="group-suggestions"
                              value={newCam.location} 
                              onChange={e => setNewCam({...newCam, location: e.target.value})}
                              placeholder="Misal: Area Parkir"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:border-blue-500 outline-none"
                            />
                            <datalist id="group-suggestions">
                              {[...new Set(cameras.map(c => c.location).filter(Boolean))].map(grp => (
                                <option key={grp} value={grp} />
                              ))}
                            </datalist>
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[10px] text-slate-400 mb-1 uppercase">Latitude (Kordinat Langsung)</label>
                            <input 
                              type="number" 
                              step="any"
                              value={newCam.lat || ''} 
                              onChange={e => setNewCam({...newCam, lat: parseFloat(e.target.value)})} 
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500" 
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[10px] text-slate-400 mb-1 uppercase">Longitude (Kordinat Langsung)</label>
                            <input 
                              type="number" 
                              step="any"
                              value={newCam.lng || ''} 
                              onChange={e => setNewCam({...newCam, lng: parseFloat(e.target.value)})} 
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Map Selector */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                          <label className="text-xs text-slate-400 block">Pilih Titik di Peta</label>
                          <button type="button" onClick={searchLocation} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300">Cari</button>
                        </div>
                        <div className="h-full min-h-[170px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-700">
                          <MapContainer key="add-cam-map" center={[newCam.lat, newCam.lng]} zoom={16} maxZoom={22} zoomControl={true} className="w-full h-full z-0">
                            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22} />
                            <MiniMapEvents setMapConfig={(c) => setNewCam(prev => ({...prev, lat: typeof c === 'function' ? c(prev).lat : c.lat, lng: typeof c === 'function' ? c(prev).lng : c.lng}))} />
                            <MapCenterUpdater lat={newCam.lat} lng={newCam.lng} />
                          </MapContainer>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none drop-shadow-xl text-red-500">
                            <MapPin size={32} strokeWidth={2.5} fill="#0f172a" />
                          </div>
                          <div className="absolute top-2 left-2 right-2 bg-slate-900/80 backdrop-blur text-[10px] text-white p-1.5 rounded text-center border border-slate-700 pointer-events-none">
                            Geser peta untuk set pin lokasi
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full mt-6">
                      <button type="submit" className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20">
                        {newCam.id ? <><Save size={18}/> Simpan Perubahan</> : <><Plus size={18}/> Simpan Kamera</>}
                      </button>
                      {newCam.id && (
                        <button type="button" onClick={() => setNewCam({ id: null, name: '', location: '', channel: 1, lat: mapConfig.lat || -6.808722, lng: mapConfig.lng || 107.649002, rtsp_url: '' })} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <form onSubmit={generateBatchCameras} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl mb-8">
                    <p className="text-sm text-slate-300 mb-4">Fitur ini akan menghasilkan puluhan kamera sekaligus secara otomatis dengan asumsi menggunakan NVR yang sama.</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Prefix Nama</label>
                        <input type="text" value={batchConfig.prefix} onChange={e=>setBatchConfig({...batchConfig, prefix:e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Channel Awal</label>
                        <input type="number" min="1" value={batchConfig.start} onChange={e=>setBatchConfig({...batchConfig, start:parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Channel Akhir</label>
                        <input type="number" min="1" value={batchConfig.end} onChange={e=>setBatchConfig({...batchConfig, end:parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none" />
                      </div>
                    </div>
                    <button type="submit" className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20">
                      <Server size={18} /> Generate Kamera (1 NVR)
                    </button>
                  </form>
                )}

                {/* TABLE LIST */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#0a0f1c] text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Nama Kamera</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Koordinat</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {[...cameras].sort((a,b) => (a.channel||0) - (b.channel||0)).map(cam => (
                        <tr key={cam.id} className={`hover:bg-slate-800/50 transition-colors ${newCam.id === cam.id ? 'bg-blue-900/30' : ''}`}>
                          <td className="py-3 px-4 text-white font-medium">{cam.name}</td>
                          <td className="py-3 px-4 text-slate-400">CH {cam.channel}</td>
                          <td className="py-3 px-4 text-xs font-mono text-slate-500">{cam.lat},<br/>{cam.lng}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => editCamera(cam)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition" title="Edit">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => deleteCamera(cam.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition" title="Hapus">
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {cameras.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-8 text-slate-500">Belum ada kamera terdaftar</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
