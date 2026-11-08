'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

function PlotViewerContent() {
  const params = useParams();
  const id = params?.id as string;

  const [plotData, setPlotData] = useState<{
    bandName: string;
    venueName: string;
    showTime: string;
    items: GearItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlot() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'stage-plots', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlotData(docSnap.data() as any);
        } else {
          console.error("No such stage plot found!");
        }
      } catch (err) {
        console.error("Error fetching stage plot:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlot();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <p className="text-indigo-400 animate-pulse">Loading Stage Plot...</p>
      </div>
    );
  }

  if (!id || !plotData) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-6 text-center gap-4">
        <h1 className="text-3xl font-bold text-indigo-400">StagePlot Pro Share Viewer</h1>
        <p className="text-slate-400 text-sm max-w-md">
          You have reached the viewer route without a valid plot ID. Head back to the generator editor, click &quot;Save to Cloud&quot;, and use your generated link!
        </p>
        <a 
          href="/" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition text-sm shadow-lg shadow-indigo-600/20"
        >
          &larr; Back to Generator Editor
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 print:border-none print:bg-transparent p-5 rounded-2xl gap-4 shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold text-white print:text-black">{plotData.bandName}</h1>
            <div className="flex gap-3 text-sm text-slate-400 print:text-slate-700 mt-1">
              <span>📍 {plotData.venueName}</span>
              <span>•</span>
              <span>🕒 {plotData.showTime}</span>
            </div>
          </div>
          
          <button 
            onClick={() => window.print()} 
            className="print:hidden bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <span>🖨️ Print / Save PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 print:bg-gray-50 p-4 md:p-5 rounded-2xl border border-slate-800 print:border-gray-300 shadow-xl h-fit">
            <h3 className="font-bold text-slate-200 print:text-black mb-3 text-xs uppercase tracking-wider text-indigo-400 print:text-indigo-700">📋 Input Patch List</h3>
            <div className="space-y-2">
              {plotData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-950 print:bg-white p-2.5 rounded-xl border border-slate-800 print:border-gray-200 text-sm">
                  <div>
                    <span className="font-semibold text-indigo-300 print:text-indigo-600 mr-2">{item.channel}:</span>
                    <span className="text-slate-200 print:text-black">{item.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 print:text-slate-600 bg-slate-800 print:bg-gray-100 px-1.5 py-0.5 rounded">{item.micPref}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-slate-900 print:bg-white border border-slate-800 print:border-gray-300 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col justify-between relative min-h-[500px]">
            <div className="text-center py-2 bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-xl text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-widest mb-4">
              Front of Stage / Wedge Monitors &rarr; Audience View
            </div>
            
            <div className="relative flex-grow bg-slate-950/40 print:bg-white border-2 border-dashed border-slate-800 print:border-gray-300 rounded-2xl overflow-hidden min-h-[400px]">
              {plotData.items.map((item) => (
                <div 
                  key={item.id}
                  className="absolute bg-slate-900 print:bg-slate-100 border border-slate-700 print:border-gray-400 p-3 rounded-xl shadow-2xl w-36 text-center select-none"
                  style={{ left: `${item.x}px`, top: `${item.y}px` }}
                >
                  <p className="font-bold text-sm text-white print:text-black truncate">{item.name}</p>
                  <div className="flex justify-center items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-indigo-300 print:text-indigo-700 bg-indigo-950/80 print:bg-indigo-100 px-2 py-0.5 rounded font-mono">{item.channel}</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 bg-slate-800 print:bg-gray-200 px-1.5 py-0.5 rounded truncate max-w-[60px]">{item.micPref}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 text-xs text-slate-500 print:text-slate-600 pt-2 border-t border-slate-800 print:border-gray-300">
              <span>Sound Engineer Stage Rider View</span>
              <span className="font-mono text-indigo-400 print:text-indigo-600">StagePlot Pro Share Link</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function SharedStagePlot() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <p className="text-indigo-400 animate-pulse">Loading Stage Plot...</p>
      </div>
    }>
      <PlotViewerContent />
    </Suspense>
  );
}