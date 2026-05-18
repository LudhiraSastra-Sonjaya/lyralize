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

const AdminMerch = () => {
  const [merch, setMerch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name:'', description:'', price:'', image:null, category:'clothing', in_stock:true, ecommerce_link:'' });

  const fetchMerch = async () => {
    try { const r = await api.get('/merch'); setMerch(r.data); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchMerch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description||'');
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('ecommerce_link', formData.ecommerce_link||'#');
    data.append('in_stock', formData.in_stock ? 1 : 0);
    if (formData.image instanceof File) data.append('image', formData.image);
    try {
      if (editingId) { data.append('_method','PUT'); await api.post(`/merch/${editingId}`, data, {headers:{'Content-Type':'multipart/form-data'}}); }
      else { await api.post('/merch', data, {headers:{'Content-Type':'multipart/form-data'}}); }
      setIsModalOpen(false); fetchMerch();
    } catch(e){console.error(e);}
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this item?')){
      try{await api.delete(`/merch/${id}`);fetchMerch();}catch(e){console.error(e);}
    }
  };

  const openModal = (item = null) => {
    setEditingId(item?.id||null);
    setFormData(item
      ? {name:item.name,description:item.description||'',price:item.price,image:null,image_url:item.image_url||'',category:item.category||'clothing',in_stock:item.in_stock!==false,ecommerce_link:item.ecommerce_link||''}
      : {name:'',description:'',price:'',image:null,image_url:'',category:'clothing',in_stock:true,ecommerce_link:''});
    setIsModalOpen(true);
  };

  if (loading) return <div className={S.loading}>Loading merchandise...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={S.h1}>Merchandise</h1>
        <button onClick={() => openModal()} className={S.addBtn}><Plus size={18}/> Add Merch</button>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full text-left">
          <thead className={S.thead}><tr>
            <th className={S.th}>Item</th><th className={S.th}>Price</th><th className={S.th}>Status</th><th className={S.th + ' text-right'}>Actions</th>
          </tr></thead>
          <tbody className={S.tbody}>
            {merch.map(item => (
              <tr key={item.id} className={S.tr}>
                <td className={S.tdPrimary}>
                  <div>{item.name}</div>
                  <div className="text-xs text-[#8FA9C4] capitalize mt-0.5">{item.category}</div>
                </td>
                <td className={S.td}>IDR {Number(item.price).toLocaleString('id-ID')}</td>
                <td className={S.td}>
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${item.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className={S.tdRight}>
                  <button onClick={()=>openModal(item)} className={S.editBtn}><Edit2 size={18}/></button>
                  <button onClick={()=>handleDelete(item.id)} className={S.delBtn}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {merch.length===0 && <tr><td colSpan="4" className={S.empty}>No merchandise yet. Add some!</td></tr>}
          </tbody>
        </table></div>

      {isModalOpen && (
        <div className={S.overlay}>
          <div className="admin-modal">
            <div className={S.modalHead}>
              <h2 className={S.modalH2}>{editingId?'Edit Merch':'Add Merch'}</h2>
              <button onClick={()=>setIsModalOpen(false)} className="text-[#8FA9C4] hover:text-[#F0EBE0]"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={S.label}>Name</label><input type="text" required value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className={S.input}/></div>
              <div><label className={S.label}>Price (IDR)</label><input type="number" required value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} className={S.input}/></div>
              <div>
                <label className={S.label}>Image</label>
                {formData.image_url && !formData.image && (
                  <div className="mb-4">
                    <img src={formData.image_url} alt="Merch Preview" className="w-32 h-32 object-cover rounded border border-[#3A609E]" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e=>setFormData({...formData,image:e.target.files[0]})} className={S.fileInput}/>
                {editingId&&!formData.image&&<p className={S.hint}>Leave empty to keep existing.</p>}
              </div>
              <div><label className={S.label}>E-commerce Link</label><input type="url" value={formData.ecommerce_link} onChange={e=>setFormData({...formData,ecommerce_link:e.target.value})} className={S.input}/></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="in_stock" checked={formData.in_stock} onChange={e=>setFormData({...formData,in_stock:e.target.checked})} className="rounded border-[#3A609E] text-[#8FA9C4]"/>
                <label htmlFor="in_stock" className="font-mono text-sm text-[#F0EBE0]">In Stock</label>
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
export default AdminMerch;



