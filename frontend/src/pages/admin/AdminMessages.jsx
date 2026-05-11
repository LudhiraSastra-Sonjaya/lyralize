import { useState, useEffect } from 'react';
import { Trash2, Mail, Check, X } from 'lucide-react';
import api from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message', error);
      }
    }
  };

  const markAsRead = async (message) => {
    if (!message.is_read) {
      try {
        await api.put(`/messages/${message.id}`, { is_read: true });
        fetchMessages();
      } catch (error) {
        console.error('Failed to mark message as read', error);
      }
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    markAsRead(message);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-display font-bold text-white">Messages</h1>
      </div>

      <div className="flex-1 bg-[#0F0F1A] border border-white/5 rounded-xl overflow-hidden flex min-h-[500px]">
        {/* Messages List */}
        <div className="w-1/3 border-r border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5">
            <h2 className="font-medium text-white flex items-center gap-2">
              <Mail size={18} /> Inbox ({messages.filter(m => !m.is_read).length} unread)
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={`w-full text-left p-4 hover:bg-white/[0.02] transition-colors ${selectedMessage?.id === message.id ? 'bg-white/[0.05]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${message.is_read ? 'text-gray-300' : 'text-white'}`}>
                    {message.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={`text-sm mb-1 ${message.is_read ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                  {message.subject || 'No Subject'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {message.content}
                </div>
              </button>
            ))}
            {messages.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No messages found.
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="w-2/3 flex flex-col bg-[#050508]/50">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-white/5 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedMessage.subject || 'No Subject'}</h2>
                  <div className="text-sm text-gray-400">
                    From: <span className="text-white">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Received: {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-red-400 hover:bg-red-400/10 p-2 rounded transition-colors"
                  title="Delete message"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-sans">
                  {selectedMessage.content}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Mail size={48} className="mb-4 opacity-50" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
