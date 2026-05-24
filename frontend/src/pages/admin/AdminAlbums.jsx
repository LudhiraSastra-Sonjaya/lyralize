import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const C = {
  page:      'space-y-6',
  h1:        'text-2xl font-mono font-bold text-[#F0EBE0]',
  addBtn:    'bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-mono text-sm',
  table:     'w-full bg-[#04060A] border border-[#3A609E] rounded-xl overflow-hidden',
  thead:     'bg-[#3A609E]/30 text-[#F0EBE0]',
  th:        'px-6 py-4 font-mono text-xs tracking-widest uppercase',
  tbody:     'divide-y divide-[#3A609E]',
  tr:        'hover:bg-[#8FA9C4]/5 transition-colors',
  td:        'px-6 py-4 font-mono text-sm text-[#8FA9C4]',
  tdPrimary: 'px-6 py-4 font-mono text-sm font-medium text-[#F0EBE0]',
  tdRight:   'px-6 py-4 text-right',
  empty:     'px-6 py-8 text-center text-[#8FA9C4]/60 font-mono text-sm',
  overlay:   'fixed inset-0 bg-[#F0EBE0]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal:     'bg-[#04060A] border border-[#3A609E] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col',
  modalHead: 'flex justify-between items-center p-6 border-b border-[#3A609E] shrink-0',
  modalH2:   'text-xl font-mono font-bold text-[#F0EBE0]',
  modalBody: 'p-6 overflow-y-auto',
  modalFoot: 'p-6 border-t border-[#3A609E] shrink-0 flex gap-3',
  label:     'block font-mono text-xs tracking-[0.2em] uppercase text-[#8FA9C4] mb-1',
  input:     'w-full bg-[#0E1A2F] border border-[#3A609E] focus:border-[#8FA9C4] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm outline-none transition-colors',
  textarea:  'w-full bg-[#0E1A2F] border border-[#3A609E] focus:border-[#8FA9C4] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm outline-none transition-colors',
  fileInput: 'w-full bg-[#0E1A2F] border border-[#3A609E] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-[#8FA9C4]/10 file:text-[#8FA9C4] hover:file:bg-[#8FA9C4]/20',
  hint:      'text-xs font-mono text-[#8FA9C4]/60 mt-1',
  cancelBtn: 'flex-1 px-4 py-2 rounded-lg border border-[#3A609E] text-[#8FA9C4] hover:bg-[#3A609E]/20 font-mono text-sm transition-colors',
  saveBtn:   'flex-1 px-4 py-2 rounded-lg bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] font-mono text-sm transition-colors',
  editBtn:   'text-[#8FA9C4] hover:text-[#F0EBE0] p-2 transition-colors',
  delBtn:    'text-red-400 hover:text-red-600 p-2 transition-colors',
  loading:   'font-mono text-sm text-[#8FA9C4] animate-pulse',
};

const AdminAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', release_date: '', cover_image: null, purchase_url: '', spotify_url: '', apple_music_url: '' });

  const fetchAlbums = async () => {
    try { const r = await api.get('/albums'); setAlbums(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAlbums(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    ['title','description','release_date','purchase_url','spotify_url','apple_music_url'].forEach(k => data.append(k, formData[k] || ''));
    if (formData.cover_image instanceof File) data.append('cover_image', formData.cover_image);
    try {
      if (editingId) { data.append('_method','PUT'); await api.post(`/albums/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      else { await api.post('/albums', data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      setIsModalOpen(false); fetchAlbums();
    } catch (e) { console.error(e); }
  };
  const handleDelete = async (id) => { if (window.confirm('Delete this album?')) { try { await api.delete(`/albums/${id}`); fetchAlbums(); } catch(e){console.error(e);} } };
  const openModal = (item = null) => {
    setEditingId(item?.id || null);
    setFormData(item ? { title: item.title, description: item.description||'', release_date: item.release_date||'', cover_image: null, cover_image_url: item.cover_image_url||'', purchase_url: item.purchase_url||'', spotify_url: item.spotify_url||'', apple_music_url: item.apple_music_url||'' } : { title:'', description:'', release_date:'', cover_image:null, cover_image_url:'', purchase_url:'', spotify_url:'', apple_music_url:'' });
    setIsModalOpen(true);
  };

  if (loading) return <div className={C.loading}>Loading albums...</div>;

  return (
    <div className={C.page}>
      <div className="flex justify-between items-center">
        <h1 className={C.h1}>Albums</h1>
        <button onClick={() => openModal()} className={C.addBtn}><Plus size={18} /> Add Album</button>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full text-left">
          <thead className={C.thead}><tr>
            <th className={C.th}>Cover</th><th className={C.th}>Title</th><th className={C.th}>Release Date</th><th className={C.th + ' text-right'}>Actions</th>
          </tr></thead>
          <tbody className={C.tbody}>
            {albums.map(item => (
              <tr key={item.id} className={C.tr}>
                <td className={C.td}>{item.cover_image_url ? <img src={item.cover_image_url} alt={item.title} className="w-12 h-12 rounded object-cover border border-[#3A609E]" /> : <div className="w-12 h-12 bg-[#3A609E]/30 rounded flex items-center justify-center text-[#8FA9C4] text-xs">N/A</div>}</td>
                <td className={C.tdPrimary}>{item.title}</td>
                <td className={C.td}>{item.release_date || '-'}</td>
                <td className={C.tdRight}><button onClick={() => openModal(item)} className={C.editBtn}><Edit2 size={18}/></button><button onClick={() => handleDelete(item.id)} className={C.delBtn}><Trash2 size={18}/></button></td>
              </tr>
            ))}
            {albums.length === 0 && <tr><td colSpan="4" className={C.empty}>No albums yet. Add one!</td></tr>}
          </tbody>
        </table></div>

      {isModalOpen && (
        <div className={C.overlay}>
          <div className="admin-modal">
            <div className={C.modalHead}>
              <h2 className={C.modalH2}>{editingId ? 'Edit Album' : 'Add Album'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8FA9C4] hover:text-[#F0EBE0]"><X size={24}/></button>
            </div>
            <div className="admin-modal-body">
              <form id="album-form" onSubmit={handleSubmit} className="space-y-4">
                {[['Title','title','text',true],['Description','description','text',false],['Release Date','release_date','date',false]].map(([lbl,key,type,req]) => (
                  <div key={key}><label className={C.label}>{lbl}</label>
                    {key === 'description' ? <textarea value={formData[key]} onChange={e => setFormData({...formData,[key]:e.target.value})} className={C.textarea + ' h-24'} /> : <input type={type} required={req} value={formData[key]} onChange={e => setFormData({...formData,[key]:e.target.value})} className={C.input} />}
                  </div>
                ))}
                <div>
                  <label className={C.label}>Cover Image</label>
                  {formData.cover_image_url && !formData.cover_image && (
                    <div className="mb-4">
                      <img src={formData.cover_image_url} alt="Cover Preview" className="w-32 h-32 object-cover rounded border border-[#3A609E]" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => setFormData({...formData,cover_image:e.target.files[0]})} className={C.fileInput}/>
                  {editingId && !formData.cover_image && <p className={C.hint}>Leave empty to keep existing cover.</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[['Spotify URL','spotify_url'],['Apple Music URL','apple_music_url']].map(([lbl,key]) => (
                    <div key={key}><label className={C.label}>{lbl}</label><input type="url" value={formData[key]} onChange={e => setFormData({...formData,[key]:e.target.value})} className={C.input}/></div>
                  ))}
                </div>
                <div><label className={C.label}>Purchase URL (Optional)</label><input type="url" value={formData.purchase_url} onChange={e => setFormData({...formData,purchase_url:e.target.value})} className={C.input}/></div>
              </form>
            </div>
            <div className={C.modalFoot}>
              <button type="button" onClick={() => setIsModalOpen(false)} className={C.cancelBtn}>Cancel</button>
              <button form="album-form" type="submit" className={C.saveBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAlbums;



