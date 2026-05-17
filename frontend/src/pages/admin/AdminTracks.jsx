import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const S = {
  h1:'text-2xl font-mono font-bold text-[#0C1B4D]',
  addBtn:'bg-[#1E3FA8] hover:bg-[#2A52C9] text-[#F0EBE0] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-mono text-sm',
  table:'bg-[#F0EBE0] border border-[#C8C0A8] rounded-xl overflow-hidden',
  thead:'bg-[#C8C0A8]/30 text-[#0C1B4D]',th:'px-6 py-4 font-mono text-xs tracking-widest uppercase',
  tbody:'divide-y divide-[#C8C0A8]',tr:'hover:bg-[#1E3FA8]/5 transition-colors',
  td:'px-6 py-4 font-mono text-sm text-[#4A6090]',tdPrimary:'px-6 py-4 font-mono text-sm font-medium text-[#0C1B4D]',
  tdRight:'px-6 py-4 text-right',empty:'px-6 py-8 text-center text-[#4A6090]/60 font-mono text-sm',
  overlay:'fixed inset-0 bg-[#0C1B4D]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal:'bg-[#F0EBE0] border border-[#C8C0A8] rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col',
  modalHead:'flex justify-between items-center p-6 border-b border-[#C8C0A8]',
  modalH2:'text-xl font-mono font-bold text-[#0C1B4D]',
  label:'block font-mono text-xs tracking-[0.2em] uppercase text-[#4A6090] mb-1',
  input:'w-full bg-[#E8E2D0] border border-[#C8C0A8] focus:border-[#1E3FA8] rounded-lg px-4 py-2.5 text-[#0C1B4D] font-mono text-sm outline-none transition-colors',
  cancelBtn:'flex-1 px-4 py-2 rounded-lg border border-[#C8C0A8] text-[#4A6090] hover:bg-[#C8C0A8]/20 font-mono text-sm transition-colors',
  saveBtn:'flex-1 px-4 py-2 rounded-lg bg-[#1E3FA8] hover:bg-[#2A52C9] text-[#F0EBE0] font-mono text-sm transition-colors',
  editBtn:'text-[#1E3FA8] hover:text-[#0C1B4D] p-2 transition-colors',
  delBtn:'text-red-400 hover:text-red-600 p-2 transition-colors',
  loading:'font-mono text-sm text-[#4A6090] animate-pulse',
};

const AdminTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ album_id:'', title:'', duration:'', preview_url:'', track_number:'' });

  const fetchData = async () => {
    try {
      const [tr, al] = await Promise.all([api.get('/tracks'), api.get('/albums')]);
      setTracks(tr.data); setAlbums(al.data);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/tracks/${editingId}`, formData);
      else await api.post('/tracks', formData);
      setIsModalOpen(false); fetchData();
    } catch(e){console.error(e);}
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this track?')){
      try{await api.delete(`/tracks/${id}`);fetchData();}catch(e){console.error(e);}
    }
  };

  const openModal = (item = null) => {
    setEditingId(item?.id||null);
    setFormData(item
      ? {album_id:item.album_id||'',title:item.title,duration:item.duration||'',preview_url:item.preview_url||'',track_number:item.track_number||''}
      : {album_id:albums.length>0?albums[0].id:'',title:'',duration:'',preview_url:'',track_number:''});
    setIsModalOpen(true);
  };

  if (loading) return <div className={S.loading}>Loading tracks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={S.h1}>Tracks</h1>
        <button onClick={() => openModal()} className={S.addBtn}><Plus size={18}/> Add Track</button>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full text-left">
          <thead className={S.thead}><tr>
            <th className={S.th}>#</th><th className={S.th}>Title</th><th className={S.th}>Album</th><th className={S.th}>Duration</th><th className={S.th + ' text-right'}>Actions</th>
          </tr></thead>
          <tbody className={S.tbody}>
            {tracks.map(item => (
              <tr key={item.id} className={S.tr}>
                <td className={S.td}>{item.track_number||'-'}</td>
                <td className={S.tdPrimary}>{item.title}</td>
                <td className={S.td}>{item.album?.title||'Unknown'}</td>
                <td className={S.td}>{item.duration||'-'}</td>
                <td className={S.tdRight}>
                  <button onClick={()=>openModal(item)} className={S.editBtn}><Edit2 size={18}/></button>
                  <button onClick={()=>handleDelete(item.id)} className={S.delBtn}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {tracks.length===0 && <tr><td colSpan="5" className={S.empty}>No tracks yet. Add one!</td></tr>}
          </tbody>
        </table></div>

      {isModalOpen && (
        <div className={S.overlay}>
          <div className="admin-modal">
            <div className={S.modalHead}>
              <h2 className={S.modalH2}>{editingId?'Edit Track':'Add Track'}</h2>
              <button onClick={()=>setIsModalOpen(false)} className="text-[#4A6090] hover:text-[#0C1B4D]"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={S.label}>Album</label>
                <select required value={formData.album_id} onChange={e=>setFormData({...formData,album_id:e.target.value})} className={S.input}>
                  <option value="" disabled>Select an album</option>
                  {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              <div><label className={S.label}>Title</label><input type="text" required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} className={S.input}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={S.label}>Track #</label><input type="number" value={formData.track_number} onChange={e=>setFormData({...formData,track_number:e.target.value})} className={S.input}/></div>
                <div><label className={S.label}>Duration (e.g. 3:45)</label><input type="text" value={formData.duration} onChange={e=>setFormData({...formData,duration:e.target.value})} className={S.input}/></div>
              </div>
              <div><label className={S.label}>Preview URL</label><input type="url" value={formData.preview_url} onChange={e=>setFormData({...formData,preview_url:e.target.value})} className={S.input}/></div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={()=>setIsModalOpen(false)} className={S.cancelBtn}>Cancel</button>
                <button type="submit" className={S.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTracks;



