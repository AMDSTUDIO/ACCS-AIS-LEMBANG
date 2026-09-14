import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCctvStore } from '../../store/useCctvStore';
import { Settings as SettingsIcon, Save, Plus, Trash, Server, Map as MapIcon, Video } from 'lucide-react';

export default function SettingsPage() {
  const { cameras, setCameras, settings, setSettings } = useCctvStore();
  const [mapConfig, setMapConfig] = useState({ lat: -6.2, lng: 106.8, zoom: 13 });
  const [nvrConfig, setNvrConfig] = useState({ ip: '127.0.0.1', user: 'admin', pass: 'admin123', port: 554 });
  const [newCam, setNewCam] = useState({ name: '', location: '', channel: 1, lat: '', lng: '' });
  const [activeTab, setActiveTab] = useState('cameras');
  
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [cams, sets] = await Promise.all([
      axios.get('http://localhost:5000/api/cameras'),
      axios.get('http://localhost:5000/api/settings')
    ]);
    setCameras(cams.data);
    if (sets.data.map_config) {
      setSettings(sets.data);
      setMapConfig(sets.data.map_config);
    }
    if (sets.data.nvr_config) setNvrConfig(sets.data.nvr_config);
  };

  const saveConfig = async (key, val) => {
    await axios.post('http://localhost:5000/api/settings', { key, value: val });
    alert(key === 'nvr_config' ? 'NVR connection saved!' : 'Map settings saved!');
  };

  const addCamera = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/cameras', newCam);
    setNewCam({ name: '', location: '', channel: 1, lat: '', lng: '' });
    fetchData();
  };

  const deleteCamera = async (id) => {
    if (confirm('Delete this camera?')) {
      await axios.delete(`http://localhost:5000/api/cameras/${id}`);
      fetchData();
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 gap-2">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Preferences</div>
        <button onClick={() => setActiveTab('cameras')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'cameras' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-slate-800 text-slate-400'}`}>
          <Video size={18} /> <span>Camera Manager</span>
        </button>
        <button onClick={() => setActiveTab('nvr')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'nvr' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'hover:bg-slate-800 text-slate-400'}`}>
          <Server size={18} /> <span>NVR Connection</span>
        </button>
        <button onClick={() => setActiveTab('map')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'map' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'hover:bg-slate-800 text-slate-400'}`}>
          <MapIcon size={18} /> <span>Map Engine</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <SettingsIcon size={28} className="text-slate-400"/> 
            {activeTab === 'cameras' ? 'Camera Manager' : activeTab === 'nvr' ? 'NVR Connection Settings' : 'Map Engine Configuration'}
          </h2>

          {activeTab === 'nvr' && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl shadow-black/50">
              <p className="text-slate-400 mb-6">Configure the global connection to your Dahua NVR. The system will securely construct RTSP streams via WebRTC on the backend.</p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">NVR IP Address</label>
                  <input type="text" value={nvrConfig.ip} onChange={e => setNvrConfig({...nvrConfig, ip: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">RTSP Port (Default 554)</label>
                  <input type="number" value={nvrConfig.port} onChange={e => setNvrConfig({...nvrConfig, port: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">NVR Username</label>
                  <input type="text" value={nvrConfig.user} onChange={e => setNvrConfig({...nvrConfig, user: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">NVR Password</label>
                  <input type="password" value={nvrConfig.pass} onChange={e => setNvrConfig({...nvrConfig, pass: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                </div>
              </div>
              <button onClick={() => saveConfig('nvr_config', nvrConfig)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-purple-600/20"><Save size={18}/> Save Connection</button>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl shadow-black/50">
              <p className="text-slate-400 mb-6">Set the default coordinates and zoom level when the dashboard is loaded.</p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Latitude</label>
                  <input type="number" step="any" value={mapConfig.lat} onChange={e => setMapConfig({...mapConfig, lat: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Longitude</label>
                  <input type="number" step="any" value={mapConfig.lng} onChange={e => setMapConfig({...mapConfig, lng: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Zoom</label>
                  <input type="number" value={mapConfig.zoom} onChange={e => setMapConfig({...mapConfig, zoom: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                </div>
              </div>
              <button onClick={() => saveConfig('map_config', mapConfig)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-green-600/20"><Save size={18}/> Save Map Settings</button>
            </div>
          )}

          {activeTab === 'cameras' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/50">
                <h3 className="text-lg font-bold text-white mb-4">Add New Camera</h3>
                <form onSubmit={addCamera} className="grid grid-cols-6 gap-4 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Name / Label</label>
                    <input required type="text" value={newCam.name} onChange={e => setNewCam({...newCam, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="Front Gate"/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-slate-400 mb-1">Location</label>
                    <input type="text" value={newCam.location} onChange={e => setNewCam({...newCam, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="Entrance"/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-slate-400 mb-1">Channel (NVR)</label>
                    <input required type="number" value={newCam.channel} onChange={e => setNewCam({...newCam, channel: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-slate-400 mb-1">Geo Coordinates</label>
                    <div className="flex gap-2">
                       <input required type="number" step="any" value={newCam.lat} onChange={e => setNewCam({...newCam, lat: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none" placeholder="Lat"/>
                       <input required type="number" step="any" value={newCam.lng} onChange={e => setNewCam({...newCam, lng: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none" placeholder="Lng"/>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg flex justify-center items-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/20 transition"><Plus size={16}/> Add</button>
                  </div>
                </form>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl shadow-black/50 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50">
                    <tr className="text-slate-400 font-medium">
                      <th className="py-4 px-6">ID</th>
                      <th className="py-4 px-6">Camera Name</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Channel</th>
                      <th className="py-4 px-6">Coordinates</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {cameras.map(cam => (
                      <tr key={cam.id} className="hover:bg-slate-800/50 transition">
                        <td className="py-4 px-6 text-slate-500">#{cam.id}</td>
                        <td className="py-4 px-6 font-semibold text-white">{cam.name}</td>
                        <td className="py-4 px-6 text-slate-300">{cam.location}</td>
                        <td className="py-4 px-6 text-slate-300">Ch {cam.channel}</td>
                        <td className="py-4 px-6 text-slate-400 text-xs">{cam.lat}, {cam.lng}</td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => deleteCamera(cam.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><Trash size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
