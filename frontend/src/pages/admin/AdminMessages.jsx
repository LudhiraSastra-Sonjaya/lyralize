import { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import api from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try { const r = await api.get('/messages'); setMessages(r.data); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this message?')){
      try {
        await api.delete(`/messages/${id}`);
        if (selectedMessage?.id === id) setSelectedMessage(null);
        fetchMessages();
      } catch(e){console.error(e);}
    }
  };

  const markAsRead = async (msg) => {
    if (!msg.is_read) {
      try { await api.put(`/messages/${msg.id}`, { is_read: true }); fetchMessages(); }
      catch(e){console.error(e);}
    }
  };

  const handleSelect = (msg) => { setSelectedMessage(msg); markAsRead(msg); };

  if (loading) return <div className="font-mono text-sm text-[#4A6090] animate-pulse">Loading messages...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-mono font-bold text-[#0C1B4D]">Messages</h1>
      </div>

      <div className="flex-1 bg-[#F0EBE0] border border-[#C8C0A8] rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        {/* Inbox list */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#C8C0A8] flex flex-col overflow-hidden max-h-[40vh] md:max-h-none">
          <div className="p-4 border-b border-[#C8C0A8] bg-[#C8C0A8]/20">
            <h2 className="font-mono text-sm font-medium text-[#0C1B4D] flex items-center gap-2">
              <Mail size={16}/> Inbox ({messages.filter(m=>!m.is_read).length} unread)
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#C8C0A8]">
            {messages.map(msg => (
              <button key={msg.id} onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 hover:bg-[#1E3FA8]/5 transition-colors ${selectedMessage?.id===msg.id ? 'bg-[#1E3FA8]/8' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-mono text-sm ${msg.is_read ? 'text-[#4A6090]' : 'text-[#0C1B4D] font-bold'}`}>{msg.name}</span>
                  <span className="text-xs font-mono text-[#4A6090]/60">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <div className={`font-mono text-xs mb-1 ${msg.is_read ? 'text-[#4A6090]/70' : 'text-[#0C1B4D]'}`}>{msg.subject||'No Subject'}</div>
                <div className="font-mono text-xs text-[#4A6090]/50 truncate">{msg.content}</div>
              </button>
            ))}
            {messages.length===0 && <div className="p-8 text-center text-[#4A6090]/60 font-mono text-sm">No messages yet.</div>}
          </div>
        </div>

        {/* Message content */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#F0EBE0]">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-[#C8C0A8] flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-lg font-mono font-bold text-[#0C1B4D] mb-1">{selectedMessage.subject||'No Subject'}</h2>
                  <div className="text-sm font-mono text-[#4A6090]">
                    From: <span className="text-[#0C1B4D]">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
                  </div>
                  <div className="text-xs font-mono text-[#4A6090]/60 mt-1">
                    Received: {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <button onClick={() => handleDelete(selectedMessage.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors" title="Delete">
                  <Trash2 size={20}/>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="font-mono text-sm text-[#0C1B4D] whitespace-pre-wrap leading-relaxed">{selectedMessage.content}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#4A6090]/40">
              <Mail size={48} className="mb-4 opacity-50"/>
              <p className="font-mono text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminMessages;
