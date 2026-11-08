'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProStatus } from './lib/useProStatus';
import { trackCheckout, trackExport } from './lib/beacon';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface GearItem {
  id: string;
  name: string;
  x: number;
  y: number;
  channel: string;
  micPref: string;
}

const GEAR_PRESETS = [
  { name: 'Vocal Mic', defaultChannel: 'Ch 1', defaultMic: 'SM58' },
  { name: 'Guitar Amp', defaultChannel: 'Ch 2', defaultMic: 'e609' },
  { name: 'Bass DI', defaultChannel: 'Ch 3', defaultMic: 'Active DI' },
  { name: 'Drum Kit', defaultChannel: 'Ch 4-8', defaultMic: 'Full Mic Kit' },
  { name: 'Keyboard', defaultChannel: 'Ch 9-10', defaultMic: 'Stereo DI' },
  { name: 'Acoustic', defaultChannel: 'Ch 11', defaultMic: 'LR Baggs DI' },
];

function StagePlotEditor() {
  const searchParams = useSearchParams();
  const plotIdFromUrl = searchParams.get('id');

  const [bandName, setBandName] = useState('My Touring Band');
  const [venueName, setVenueName] = useState('The Mainstage Venue');
  const [showTime, setShowTime] = useState('9:00 PM');
  
  const [items, setItems] = useState<GearItem[]>([
    { id: '1', name: 'Lead Vocal Mic', x: 220, y: 40, channel: 'Ch 1', micPref: 'SM58' },
    { id: '2', name: 'Guitar Amp', x: 40, y: 40, channel: 'Ch 2', micPref: 'e609' },
    { id: '3', name: 'Drum Kit', x: 260, y: 220, channel: 'Ch 3-6', micPref: 'Full Mic Kit' }
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { isPro } = useProStatus();
  const [shareId, setShareId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSharedPlot() {
      if (!plotIdFromUrl) return;
      try {
        const docRef = doc(db, 'stage-plots', plotIdFromUrl);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBandName(data.bandName || 'My Touring Band');
          setVenueName(data.venueName || 'The Mainstage Venue');
          setShowTime(data.showTime || '9:00 PM');
          setItems(data.items || []);
          setShareId(plotIdFromUrl);
        }
      } catch (err) {
        console.error("Error loading plot:", err);
      }
    }
    loadSharedPlot();
  }, [plotIdFromUrl]);

  const addGear = (preset: typeof GEAR_PRESETS[0]) => {
    const newItem: GearItem = {
      id: Date.now().toString(),
      name: preset.name,
      x: 100 + (items.length * 20) % 200,
      y: 100 + (items.length * 20) % 150,
      channel: preset.defaultChannel,
      micPref: preset.defaultMic,
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<GearItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent, item: GearItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    setIsDragging(true);
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) - item.x,
        y: (e.clientY - rect.top) - item.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    let newX = (e.clientX - rect.left) - dragOffset.x;
    let newY = (e.clientY - rect.top) - dragOffset.y;

    newX = Math.max(0, Math.min(newX, rect.width - 150));
    newY = Math.max(0, Math.min(newY, rect.height - 80));

    updateItem(selectedId, { x: newX, y: newY });
  };

  // Touch Drag Handlers (Mobile Support)
  const handleTouchStart = (e: React.TouchEvent, item: GearItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    setIsDragging(true);
    if (stageRef.current && e.touches[0]) {
      const rect = stageRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.touches[0].clientX - rect.left) - item.x,
        y: (e.touches[0].clientY - rect.top) - item.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !selectedId || !stageRef.current || !e.touches[0]) return;
    const rect = stageRef.current.getBoundingClientRect();
    let newX = (e.touches[0].clientX - rect.left) - dragOffset.x;
    let newY = (e.touches[0].clientY - rect.top) - dragOffset.y;

    newX = Math.max(0, Math.min(newX, rect.width - 150));
    newY = Math.max(0, Math.min(newY, rect.height - 80));

    updateItem(selectedId, { x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleStripeCheckout = async () => {
    // Counted before the redirect to Stripe: this is the "started a checkout"
    // half of the conversion ratio, and it must not depend on the fetch below.
    trackCheckout();
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not initiate Stripe checkout.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error connecting to Stripe.');
    }
  };

  // Export = the browser's print/PDF dialog closing after the click, not the
  // click itself, so opening the dialog and walking away is not counted as an
  // export. `afterprint` is the browser's own "the print job finished" signal;
  // where it never fires (some embedded webviews) the timer is the fallback.
  // Either way `sent` keeps it to exactly one event per export.
  const handleExport = () => {
    const watermarked = !(isPro || shareId);
    let sent = false;
    const fire = () => {
      if (sent) return;
      sent = true;
      window.removeEventListener('afterprint', fire);
      trackExport(watermarked);
    };
    window.addEventListener('afterprint', fire);
    window.setTimeout(fire, 2000);
    window.print();
  };

  const saveToCloud = async () => {
    setIsSaving(true);
    try {
      const newId = shareId || Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'stage-plots', newId), {
        bandName,
        venueName,
        showTime,
        items,
        updatedAt: new Date().toISOString()
      });
      setShareId(newId);
      const shareUrl = `${window.location.origin}/plot/${newId}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Stage plot saved successfully!\n\nShare link copied to clipboard:\n${shareUrl}`);
    } catch (err) {
      console.error("Error saving plot:", err);
      alert("Failed to save stage plot to cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans print:bg-white print:text-black print:p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 print:border-none print:bg-transparent p-5 rounded-2xl gap-4 shadow-xl">
          <div className="space-y-1 w-full md:w-auto">
            <input 
              type="text" 
              value={bandName} 
              onChange={(e) => setBandName(e.target.value)}
              className="text-2xl md:text-3xl font-extrabold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none text-white print:text-black w-full"
              placeholder="Band Name"
            />
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 print:text-slate-700">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <input 
                  type="text" 
                  value={venueName} 
                  onChange={(e) => setVenueName(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none"
                  placeholder="Venue Name"
                />
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>🕒</span>
                <input 
                  type="text" 
                  value={showTime} 
                  onChange={(e) => setShowTime(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-24"
                  placeholder="Show Time"
                />
              </div>
            </div>
          </div>
          
          <div className="print:hidden flex flex-wrap gap-3 w-full md:w-auto">
            {!isPro && (
              <button 
                onClick={handleStripeCheckout}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold transition text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>⚡ Upgrade To Pro ($9)</span>
              </button>
            )}
            
            <button 
              onClick={saveToCloud}
              disabled={isSaving}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold transition text-sm border border-slate-700 shadow-lg"
            >
              {isSaving ? 'Saving...' : shareId ? '🔗 Copy Share Link' : '💾 Save to Cloud'}
            </button>

            <button 
              onClick={handleExport}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold transition text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <span>🖨️ Export PDF</span>
            </button>
          </div>
        </div>

        {/* Main Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar (Hidden on Print) */}
          <div className="print:hidden space-y-6 lg:col-span-1">
            <div className="bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-indigo-400">➕ Tap to Add Gear</h3>
              <div className="grid grid-cols-2 gap-2">
                {GEAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => addGear(preset)}
                    className="bg-slate-950 hover:bg-slate-800 hover:border-indigo-500/50 p-3 rounded-xl text-left text-xs font-semibold transition border border-slate-800 flex flex-col gap-1 group"
                  >
                    <span className="text-white group-hover:text-indigo-300">{preset.name}</span>
                    <span className="text-[10px] text-slate-500">{preset.defaultChannel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-indigo-400">📋 Input Patch List</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No gear added yet.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="truncate mr-2">
                        <span className="font-semibold text-indigo-400 mr-1.5">{item.channel}:</span>
                        <span className="text-slate-300">{item.name}</span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 font-bold px-1.5 py-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stage Workspace & Print Patch List */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Print-only patch list table */}
            <div className="hidden print:block bg-white p-4 rounded-xl border border-gray-300 mb-2">
              <h3 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider">📋 Input Patch List</h3>
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200 text-xs">
                    <div>
                      <span className="font-semibold text-indigo-700 mr-2">{item.channel}:</span>
                      <span className="text-black font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">{item.micPref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Canvas */}
            <div 
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
              className="bg-slate-900 print:bg-white border border-slate-800 print:border-gray-300 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col justify-between relative min-h-[500px]"
            >
              <div className="text-center py-2 bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-xl text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-widest mb-4 select-none">
                Front of Stage / Wedge Monitors &rarr; Audience View
              </div>
              
              <div className="relative flex-grow bg-slate-950/40 print:bg-white border-2 border-dashed border-slate-800 print:border-gray-300 rounded-2xl overflow-hidden min-h-[400px]">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                    onTouchStart={(e) => handleTouchStart(e, item)}
                    className={`absolute bg-slate-900 print:bg-gray-50 border ${selectedId === item.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-700 print:border-gray-400'} p-3 rounded-xl shadow-2xl w-36 text-center cursor-move select-none transition-shadow touch-none`}
                    style={{ left: `${item.x}px`, top: `${item.y}px` }}
                  >
                    <p className="font-bold text-sm text-white print:text-black truncate">{item.name}</p>
                    <div className="flex justify-center items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={item.channel}
                        onChange={(e) => updateItem(item.id, { channel: e.target.value })}
                        className="w-12 text-[10px] text-center text-indigo-300 print:text-indigo-700 bg-indigo-950/80 print:bg-indigo-100 px-1 py-0.5 rounded font-mono border border-indigo-900/50 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.micPref}
                        onChange={(e) => updateItem(item.id, { micPref: e.target.value })}
                        className="w-16 text-[10px] text-center text-slate-400 print:text-slate-600 bg-slate-800 print:bg-gray-200 px-1 py-0.5 rounded truncate border border-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 text-xs text-slate-500 print:text-slate-600 pt-2 border-t border-slate-800 print:border-gray-300 select-none">
                <span>Sound Engineer Stage Rider View</span>
                {!(isPro || shareId) && (
                  <span className="font-mono text-indigo-400 print:text-indigo-600">
                    Made with StagePlot Pro — stageplots.app
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <p className="text-indigo-400 animate-pulse">Loading StagePlot Pro...</p>
      </div>
    }>
      <StagePlotEditor />
    </Suspense>
  );
}
