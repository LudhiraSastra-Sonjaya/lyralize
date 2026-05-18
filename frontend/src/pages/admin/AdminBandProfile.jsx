import { useState, useEffect } from 'react';
import api from '../../services/api';

const S = {
  label:'block font-mono text-xs tracking-[0.2em] uppercase text-[#8FA9C4] mb-1',
  input:'w-full bg-[#0E1A2F] border border-[#3A609E] focus:border-[#8FA9C4] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm outline-none transition-colors',
  textarea:'w-full bg-[#0E1A2F] border border-[#3A609E] focus:border-[#8FA9C4] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm outline-none transition-colors',
  fileInput:'w-full bg-[#0E1A2F] border border-[#3A609E] rounded-lg px-4 py-2.5 text-[#F0EBE0] font-mono text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-[#8FA9C4]/10 file:text-[#8FA9C4] hover:file:bg-[#8FA9C4]/20',
  hint:'text-xs font-mono text-[#8FA9C4]/60 mt-1',
  section:'bg-[#04060A] border border-[#3A609E] rounded-xl p-8 space-y-4',
  sectionH2:'font-mono text-sm font-bold tracking-widest uppercase text-[#8FA9C4] border-b border-[#3A609E] pb-3 mb-4',
  saveBtn:'px-6 py-2.5 rounded-lg bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] font-mono text-sm transition-colors disabled:opacity-50',
};

const AdminBandProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name:'', bio:'', hero_video_file:null,
    contact_email:'', phone:'', location:'',
    instagram_url:'', apple_music_url:'', tiktok_url:'', youtube_url:'', spotify_url:''
  });

  const fetchProfile = async () => {
    try {
      const r = await api.get('/band-profile');
      if (r.data) setFormData({
        name:r.data.name||'', bio:r.data.bio||'', hero_video_file:null, hero_video_url:r.data.hero_video_url||'',
        contact_email:r.data.contact_email||'', phone:r.data.phone||'', location:r.data.location||'',
        instagram_url:r.data.instagram_url||'', apple_music_url:r.data.apple_music_url||'',
        tiktok_url:r.data.tiktok_url||'', youtube_url:r.data.youtube_url||'', spotify_url:r.data.spotify_url||''
      });
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(() => { fetchProfile(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccessMsg('');
    const data = new FormData();
    ['name','bio','contact_email','phone','location','instagram_url','apple_music_url','tiktok_url','youtube_url','spotify_url'].forEach(k => data.append(k, formData[k]||''));
    if (formData.hero_video_file instanceof File) data.append('hero_video_file', formData.hero_video_file);
    try {
      await api.post('/band-profile', data, {headers:{'Content-Type':'multipart/form-data'}});
      setSuccessMsg('Profile saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(e){console.error(e);} finally{setSaving(false);}
  };

  const F = (k) => (e) => setFormData({...formData, [k]: e.target.value});

  if (loading) return <div className="font-mono text-sm text-[#8FA9C4] animate-pulse">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-mono font-bold text-[#F0EBE0]">Band Profile</h1>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg font-mono text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={S.section}>
          <h2 className={S.sectionH2}>// Basic Information</h2>
          <div>
            <label className={S.label}>Band Name</label>
            <input type="text" required value={formData.name} onChange={F('name')} className={S.input}/>
          </div>
          <div>
            <label className={S.label}>Biography</label>
            <textarea value={formData.bio} onChange={F('bio')} className={S.textarea + ' min-h-[150px]'}></textarea>
          </div>
          <div>
            <label className={S.label}>Hero Image / Video (Background for Home)</label>
            {formData.hero_video_url && (
              <div className="mb-4">
                {formData.hero_video_url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={formData.hero_video_url} className="w-full max-w-sm rounded border border-[#3A609E]" autoPlay loop muted />
                ) : (
                  <img src={formData.hero_video_url} alt="Hero Media" className="w-full max-w-sm rounded border border-[#3A609E]" />
                )}
              </div>
            )}
            <input type="file" accept="image/*,video/*" onChange={e=>setFormData({...formData,hero_video_file:e.target.files[0]})} className={S.fileInput}/>
            {!formData.hero_video_file && <p className={S.hint}>Leave empty to keep existing media.</p>}
          </div>
        </div>

        {/* Contact Info */}
        <div className={S.section}>
          <h2 className={S.sectionH2}>// Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Email','contact_email','email'],['Phone','phone','text']].map(([lbl,key,type]) => (
              <div key={key}><label className={S.label}>{lbl}</label><input type={type} value={formData[key]} onChange={F(key)} className={S.input}/></div>
            ))}
            <div className="md:col-span-2"><label className={S.label}>Location</label><input type="text" value={formData.location} onChange={F('location')} className={S.input}/></div>
          </div>
        </div>

        {/* Social Links */}
        <div className={S.section}>
          <h2 className={S.sectionH2}>// Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Instagram URL', 'instagram_url'],
              ['Apple Music URL', 'apple_music_url'],
              ['TikTok URL', 'tiktok_url'],
              ['YouTube URL', 'youtube_url'],
              ['Spotify URL', 'spotify_url']
            ].map(([lbl,key]) => (
              <div key={key}><label className={S.label}>{lbl}</label><input type="url" value={formData[key]} onChange={F(key)} className={S.input}/></div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className={S.saveBtn}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminBandProfile;
