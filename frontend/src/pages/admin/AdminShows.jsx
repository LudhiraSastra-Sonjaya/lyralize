import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const C = {
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
  fileInput:'w-full bg-[#E8E2D0] border border-[#C8C0A8] rounded-lg px-4 py-2.5 text-[#0C1B4D] font-mono text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-[#1E3FA8]/10 file:text-[#1E3FA8] hover:file:bg-[#1E3FA8]/20',
  hint:'text-xs font-mono text-[#4A6090]/60 mt-1',
};

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title:'', show_date:'', venue:'', location:'', ticket_url:'' });

  const fetchShows = async () => {
    try { const r = await api.get('/shows'); setShows(r.data); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchShows(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/shows/${editingId}`, formData);
      else await api.post('/shows', formData);
      setIsModalOpen(false); fetchShows();
    } catch(e){console.error(e);}
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this show?')){
      try{await api.delete(`/shows/${id}`);fetchShows();}catch(e){console.error(e);}
    }
  };

  const openModal = (item = null) => {
    setEditingId(item?.id||null);
    setFormData(item
      ? { title:item.title||'', show_date: item.show_date ? new Date(item.show_date).toISOString().split('T')[0]:'', venue:item.venue||'', location:item.location||'', ticket_url:item.ticket_url||'' }
      : {title:'', show_date:'',venue:'',location:'',ticket_url:''});
    setIsModalOpen(true);
  };

  if (loading) return <div className={C.loading}>Loading shows...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={C.h1}>Live Shows</h1>
        <button onClick={() => openModal()} className={C.addBtn}><Plus size={18}/> Add Show</button>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full text-left">
          <thead className={C.thead}><tr>
            <th className={C.th}>Date</th>
            <th className={C.th}>Venue</th>
            <th className={C.th}>Location</th>
            <th className={C.th + ' text-right'}>Actions</th>
          </tr></thead>
          <tbody className={C.tbody}>
            {shows.map(item => (
              <tr key={item.id} className={C.tr}>
                <td className={C.tdPrimary}>{item.show_date ? new Date(item.show_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '-'}</td>
                <td className={C.td}>{item.venue}</td>
                <td className={C.td}>{item.location}</td>
                <td className={C.tdRight}>
                  <button onClick={()=>openModal(item)} className={C.editBtn}><Edit2 size={18}/></button>
                  <button onClick={()=>handleDelete(item.id)} className={C.delBtn}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {shows.length===0 && <tr><td colSpan="4" className={C.empty}>No shows yet. Add one!</td></tr>}
          </tbody>
        </table></div>

      {isModalOpen && (
        <div className={C.overlay}>
          <div className="admin-modal">
            <div className={C.modalHead}>
              <h2 className={C.modalH2}>{editingId?'Edit Show':'Add Show'}</h2>
              <button onClick={()=>setIsModalOpen(false)} className="text-[#4A6090] hover:text-[#0C1B4D]"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['Title (e.g. World Tour)','title','text',true],['Date','show_date','date',true],['Venue','venue','text',true],['Location (City, Country)','location','text',true],['Ticket Link (Optional)','ticket_url','url',false]].map(([lbl,key,type,req])=>(
                <div key={key}>
                  <label className={C.label}>{lbl}</label>
                  <input type={type} required={req} value={formData[key]} onChange={e=>setFormData({...formData,[key]:e.target.value})} className={C.input}/>
                </div>
              ))}
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={()=>setIsModalOpen(false)} className={C.cancelBtn}>Cancel</button>
                <button type="submit" className={C.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminShows;



