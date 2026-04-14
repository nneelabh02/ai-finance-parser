import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, DollarSign, Activity, AlertTriangle } from 'lucide-react';

// Define the shape of our API response so TypeScript doesn't yell at us
interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: string;
}

interface ParsedData {
  account_holder: string | null;
  statement_period: string | null;
  transactions: Transaction[];
}

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<ParsedData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("You must select a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // This is how we send files via HTTP in modern web apps
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Hit our local Python FastAPI server
      const response = await fetch("https://ai-finance-api-eo5z.onrender.com/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "The server rejected the file.");
      }

      // The Python engine returns our beautiful JSON structure
      const result = await response.json();
      setData(result);
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to the backend engine.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSystem = () => {
    setData(null);
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <header className="mb-12 border-b-4 border-brutal-dark pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">OCR // LLM Parser</h1>
          <p className="text-brutal-dark mt-2 font-bold bg-yellow-300 inline-block px-2 border-2 border-brutal-dark">
            v1.0.0_PRODUCTION
          </p>
        </div>
        <div className="flex items-center gap-2 font-bold text-sm">
          <Activity size={18} className="text-brutal-accent animate-pulse" />
          ENGINE_ONLINE
        </div>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="mb-8 p-4 border-4 border-brutal-dark bg-brutal-accent text-white font-bold flex items-center gap-3 shadow-hard">
          <AlertTriangle size={24} />
          SYSTEM ERROR: {error}
        </div>
      )}

      {/* UPLOAD SECTION (If no data) */}
      {!data && (
        <div className="border-4 border-brutal-dark bg-white p-12 text-center shadow-hard transition-transform hover:-translate-y-1 hover:-translate-x-1">
          <Upload size={48} className="mx-auto mb-6 text-brutal-dark" />
          <h2 className="text-2xl font-black mb-4 uppercase">Initialize Pipeline</h2>
          <p className="mb-8 font-medium">Upload an unstructured bank statement (PDF). The AI will structure it.</p>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 font-bold uppercase border-2 border-dashed border-brutal-dark bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {file ? `[ SELECTED: ${file.name} ]` : "[ SELECT PDF DOCUMENT ]"}
            </button>

            <button 
              onClick={handleUpload}
              disabled={isProcessing || !file}
              className={`px-8 py-4 font-black uppercase border-4 border-brutal-dark flex items-center justify-center gap-3 mx-auto shadow-hard transition-all ${isProcessing || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-brutal-accent text-white hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#0f0f0f]'}`}
            >
              {isProcessing ? 'EXTRACTING DATA...' : 'UPLOAD & PARSE'}
              {!isProcessing && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD SECTION (If data exists) */}
      {data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-brutal-dark bg-brutal-accent text-white p-6 shadow-hard">
              <p className="text-sm font-bold opacity-80 uppercase">Account Entity</p>
              <h3 className="text-3xl font-black">{data.account_holder || "UNKNOWN_ENTITY"}</h3>
            </div>
            <div className="border-4 border-brutal-dark bg-white p-6 shadow-hard">
              <p className="text-sm font-bold opacity-60 uppercase">Statement Period</p>
              <h3 className="text-xl font-black mt-2">{data.statement_period || "UNKNOWN_PERIOD"}</h3>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="border-4 border-brutal-dark bg-white shadow-hard overflow-hidden">
            <div className="bg-brutal-dark text-white p-4 flex items-center gap-3">
              <FileText size={20} />
              <h2 className="font-black uppercase tracking-wider">Structured Transactions ({data.transactions.length})</h2>
            </div>
            
            <div className="p-0 overflow-x-auto">
              {data.transactions.length === 0 ? (
                <div className="p-8 text-center font-bold text-gray-500">
                  NO VALID TRANSACTIONS DETECTED IN DOCUMENT.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-brutal-dark bg-gray-100">
                      <th className="p-4 font-black uppercase">Date</th>
                      <th className="p-4 font-black uppercase">Description</th>
                      <th className="p-4 font-black uppercase">Type</th>
                      <th className="p-4 font-black uppercase text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((tx, idx) => (
                      <tr key={idx} className="border-b-2 border-brutal-dark hover:bg-yellow-100 transition-colors">
                        <td className="p-4 font-bold whitespace-nowrap">{tx.date}</td>
                        <td className="p-4 font-medium">{tx.description}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-black uppercase border-2 border-brutal-dark ${tx.type?.toLowerCase() === 'credit' ? 'bg-green-400' : 'bg-red-400'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 font-black text-right flex items-center justify-end">
                          <DollarSign size={16} />
                          {Number(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="text-center pt-8">
            <button 
              onClick={resetSystem}
              className="text-sm font-bold uppercase underline hover:text-brutal-accent transition-colors"
            >
              [ RESET PIPELINE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;