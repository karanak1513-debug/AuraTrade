import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Edit2, Check, X, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Profile() {
  const { userData, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData?.name || '');
  const [optimisticName, setOptimisticName] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync newName with Firestore data when it loads/changes
  React.useEffect(() => {
    if (userData?.name) {
      setNewName(userData.name);
      setOptimisticName(userData.name);
    }
  }, [userData?.name]);

  const skillData = [
    { name: 'Quiz Accuracy', value: userData?.quizAccuracy || 70 },
    { name: 'Modules Read', value: 85 }, // Simulated learning progress
    { name: 'Market Skills', value: 60 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    
    setOptimisticName(newName);
    setIsEditing(false);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      await Promise.race([
        setDoc(userRef, { name: newName }, { merge: true }),
        timeoutPromise
      ]);
    } catch (error) {
      console.error("Name Update Fallback:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality to keep it under Firestore limits
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, { photoURL: dataUrl }, { merge: true });
          } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
          } finally {
            setUploading(false);
          }
        };
        img.onerror = () => {
          alert("Error processing image.");
          setUploading(false);
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        alert("Error reading file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1.5rem' }}>
          <div 
            onClick={handleImageClick}
            style={{ 
              width: '100%', height: '100%', borderRadius: '50%', 
              background: 'var(--bg-secondary)', border: '4px solid var(--accent-primary)', 
              overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {userData?.photoURL || currentUser?.photoURL ? (
              <img src={userData?.photoURL || currentUser?.photoURL} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={80} color="var(--text-muted)" />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '50%' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
              <Camera size={24} />
            </div>
          </div>
          <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          {uploading && <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Uploading...</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="glass"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1.25rem', width: '200px' }}
              />
              <button onClick={handleUpdateName} className="btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-primary)' }}><Check size={20} /></button>
              <button onClick={() => setIsEditing(false)} className="btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-secondary)' }}><X size={20} /></button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>{optimisticName || userData?.name || 'User Name'}</h1>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={18} /></button>
            </>
          )}
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{currentUser?.email}</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
          <TrendingUp className="text-gradient" /> Learning & Quiz Performance
        </h3>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          This chart represents your combined progress in quizzes and market education.
        </div>
      </div>
    </div>
  );
}
