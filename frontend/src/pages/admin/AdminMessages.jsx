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

  if (loading) return <div className="font-mono text-sm text-[#8FA9C4] animate-pulse">Loading messages...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-mono font-bold text-[#F0EBE0]">Messages</h1>
      </div>

      <div className="flex-1 bg-[#04060A] border border-[#3A609E] rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        {/* Inbox list */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#3A609E] flex flex-col overflow-hidden max-h-[40vh] md:max-h-none">
          <div className="p-4 border-b border-[#3A609E] bg-[#3A609E]/20">
            <h2 className="font-mono text-sm font-medium text-[#F0EBE0] flex items-center gap-2">
              <Mail size={16}/> Inbox ({messages.filter(m=>!m.is_read).length} unread)
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#3A609E]">
            {messages.map(msg => (
              <button key={msg.id} onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 hover:bg-[#8FA9C4]/5 transition-colors ${selectedMessage?.id===msg.id ? 'bg-[#8FA9C4]/8' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-mono text-sm ${msg.is_read ? 'text-[#8FA9C4]' : 'text-[#F0EBE0] font-bold'}`}>{msg.name}</span>
                  <span className="text-xs font-mono text-[#8FA9C4]/60">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <div className={`font-mono text-xs mb-1 ${msg.is_read ? 'text-[#8FA9C4]/70' : 'text-[#F0EBE0]'}`}>{msg.subject||'No Subject'}</div>
                <div className="font-mono text-xs text-[#8FA9C4]/50 truncate">{msg.content}</div>
              </button>
            ))}
            {messages.length===0 && <div className="p-8 text-center text-[#8FA9C4]/60 font-mono text-sm">No messages yet.</div>}
          </div>
        </div>

        {/* Message content */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#04060A]">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-[#3A609E] flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-lg font-mono font-bold text-[#F0EBE0] mb-1">{selectedMessage.subject||'No Subject'}</h2>
                  <div className="text-sm font-mono text-[#8FA9C4]">
                    From: <span className="text-[#F0EBE0]">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
                  </div>
                  <div className="text-xs font-mono text-[#8FA9C4]/60 mt-1">
                    Received: {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <button onClick={() => handleDelete(selectedMessage.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors" title="Delete">
                  <Trash2 size={20}/>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="font-mono text-sm text-[#F0EBE0] whitespace-pre-wrap leading-relaxed">{selectedMessage.content}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8FA9C4]/40">
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
