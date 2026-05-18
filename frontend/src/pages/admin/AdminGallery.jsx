import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const S = {
  h1:'text-2xl font-mono font-bold text-[#F0EBE0]',
  addBtn:'bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-mono text-sm',
  table:'bg-[#04060A] border border-[#3A609E] rounded-xl overflow-hidden',
  thead:'bg-[#3A609E]/30 text-[#F0EBE0]',th:'px-6 py-4 font-mono text-xs tracking-widest uppercase',
  tbody:'divide-y divide-[#3A609E]',tr:'hover:bg-[#8FA9C4]/5 transition-colors',
  td:'px-6 py-4 font-mono text-sm text-[#8FA9C4]',tdPrimary:'px-6 py-4 font-mono text-sm font-medium text-[#F0EBE0]',
  tdRight:'px-6 py-4 text-right',empty:'px-6 py-8 text-center text-[#8FA9C4]/60 font-mono text-sm',
  overlay:'fixed inset-0 bg-[#F0EBE0]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal:'bg-[#04060A] border border-[#3A609E] rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col',
  modalHead:'flex justify-between items-center p-6 border-b border-[#3A609E]',
  modalH2:'text-xl font-mono font-bold text-[#F0EBE0]',
  label:'block font-mono text-xs tracking-[0.2em] uppercase text-[#8FA9C4] mb-1',
  input:'w-full bg-[#0E1A2F] border border-[#3A609E] focus:border-[#8FA9C4] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm outline-none transition-colors',
  fileInput:'w-full bg-[#0E1A2F] border border-[#3A609E] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-[#8FA9C4]/10 file:text-[#8FA9C4] hover:file:bg-[#8FA9C4]/20',
  hint:'text-xs font-mono text-[#8FA9C4]/60 mt-1',
  cancelBtn:'flex-1 px-4 py-2 rounded-lg border border-[#3A609E] text-[#8FA9C4] hover:bg-[#3A609E]/20 font-mono text-sm transition-colors',
  saveBtn:'flex-1 px-4 py-2 rounded-lg bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] font-mono text-sm transition-colors',
  editBtn:'text-[#8FA9C4] hover:text-[#F0EBE0] p-2 transition-colors',
  delBtn:'text-red-400 hover:text-red-600 p-2 transition-colors',
  loading:'font-mono text-sm text-[#8FA9C4] animate-pulse',
};

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title:'', image:null, order:0, type:'image' });

  const fetchGallery = async () => {
    try { const r = await api.get('/gallery'); setGallery(r.data); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title||'');
    data.append('order', formData.order||0);
    data.append('type', formData.type);
    if (formData.image instanceof File) data.append('image', formData.image);
    try {
      if (editingId) { data.append('_method','PUT'); await api.post(`/gallery/${editingId}`, data, {headers:{'Content-Type':'multipart/form-data'}}); }
      else { await api.post('/gallery', data, {headers:{'Content-Type':'multipart/form-data'}}); }
      setIsModalOpen(false); fetchGallery();
    } catch(e){console.error(e);}
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this item?')){
      try{await api.delete(`/gallery/${id}`);fetchGallery();}catch(e){console.error(e);}
    }
  };

  const openModal = (item = null) => {
    setEditingId(item?.id||null);
    setFormData(item ? {title:item.title||'',image:null,image_url:item.image_url||'',order:item.order||0,type:item.type||'image'} : {title:'',image:null,image_url:'',order:0,type:'image'});
    setIsModalOpen(true);
  };

  if (loading) return <div className={S.loading}>Loading gallery...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={S.h1}>Gallery</h1>
        <button onClick={() => openModal()} className={S.addBtn}><Plus size={18}/> Add Item</button>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full text-left">
          <thead className={S.thead}><tr>
            <th className={S.th}>Image</th><th className={S.th}>Title</th><th className={S.th}>Type</th><th className={S.th + ' text-right'}>Actions</th>
          </tr></thead>
          <tbody className={S.tbody}>
            {gallery.map(item => (
              <tr key={item.id} className={S.tr}>
                <td className={S.td}><img src={item.image_url} alt={item.title||'Gallery'} className="w-16 h-12 rounded object-cover border border-[#3A609E]"/></td>
                <td className={S.tdPrimary}>{item.title||'-'}</td>
                <td className={S.td + ' capitalize'}>{item.type}</td>
                <td className={S.tdRight}>
                  <button onClick={()=>openModal(item)} className={S.editBtn}><Edit2 size={18}/></button>
                  <button onClick={()=>handleDelete(item.id)} className={S.delBtn}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {gallery.length===0 && <tr><td colSpan="4" className={S.empty}>No gallery items yet.</td></tr>}
          </tbody>
        </table></div>

      {isModalOpen && (
        <div className={S.overlay}>
          <div className="admin-modal">
            <div className={S.modalHead}>
              <h2 className={S.modalH2}>{editingId?'Edit Gallery Item':'Add Gallery Item'}</h2>
              <button onClick={()=>setIsModalOpen(false)} className="text-[#8FA9C4] hover:text-[#F0EBE0]"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={S.label}>Title (Optional)</label>
                <input type="text" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} className={S.input}/>
              </div>
              <div>
                <label className={S.label}>Image / Video File</label>
                {formData.image_url && !formData.image && (
                  <div className="mb-4">
                    {formData.type === 'video' ? (
                      <video src={formData.image_url} className="w-full max-w-xs rounded border border-[#3A609E]" autoPlay loop muted />
                    ) : (
                      <img src={formData.image_url} alt="Gallery Preview" className="w-full max-w-xs rounded border border-[#3A609E]" />
                    )}
                  </div>
                )}
                <input type="file" accept="image/*,video/*" onChange={e=>setFormData({...formData,image:e.target.files[0]})} className={S.fileInput}/>
                {editingId&&!formData.image&&<p className={S.hint}>Leave empty to keep existing.</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={S.label}>Type</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})} className={S.input}>
                    <option value="image">Image</option><option value="video">Video</option>
                  </select>
                </div>
                <div><label className={S.label}>Order Index</label><input type="number" value={formData.order} onChange={e=>setFormData({...formData,order:e.target.value})} className={S.input}/></div>
              </div>
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
export default AdminGallery;



