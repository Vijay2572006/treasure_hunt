import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { FileText, Key, ShieldCheck, AlertCircle, ArrowRight, Eye, Code } from 'lucide-react';

export const Stage3Metadata = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setLoading(true);
    setFeedback(null);
    const submitFn = onCustomSubmit || submitKey;
    const res = await submitFn(keyInput.trim());
    setLoading(false);

    if (res.correct) {
      setFeedback({ type: 'success', text: res.message });
      setKeyInput('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 font-serif">
      
      {/* Live Stage Timer (Starts from 00:00, Stops when Answered) */}
      <StageTimer
        stageStartTime={stageData?.stage_start_time}
        isStopped={feedback?.type === 'success'}
      />
      
      {/* Island Header - Light Coffee Parchment Theme */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl text-[#23140c]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-[#3e2414] border-2 border-[#d4af37] rounded-2xl text-yellow-300 shadow-md">
            <FileText className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 3: The Metadata Vault"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Digital Forensics / File Inspection"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#3e2414] leading-relaxed font-sans mt-3 font-semibold">
          {stageData?.description || "A secured document file was recovered from the target server. The visible surface content is blank, but hidden technical parameters reside inside the file metadata layers."}
        </p>
      </div>

      {/* Metadata File Inspector */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#8b5a2b] pb-3">
          <span className="text-xs font-bold text-[#3e2414] flex items-center space-x-1.5">
            <Code className="w-4 h-4 text-[#8b5a2b]" />
            <span>METADATA_HEADER_VAULT.DAT</span>
          </span>
          <button
            type="button"
            onClick={() => setShowMetadata(!showMetadata)}
            className="text-[10px] bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] px-3 py-1.5 rounded-xl font-black transition-all shadow-md uppercase tracking-wider"
          >
            {showMetadata ? 'HIDE EXIF LAYERS' : 'INSPECT METADATA LAYERS'}
          </button>
        </div>

        {/* Visual File Surface */}
        <div className="bg-[#24150c] p-6 rounded-2xl border-2 border-[#8b5a2b] min-h-[160px] flex items-center justify-center text-center text-[#f4e8d3]">
          {showMetadata ? (
            <div className="text-left w-full font-mono text-xs space-y-1.5 text-yellow-300">
              <div className="text-[#d9c4a5]">[EXIF File Header Attributes]</div>
              <div>Camera Model: Pirate Stealth Lens 4.2</div>
              <div>GPS Altitude: -45m (Underground Vault)</div>
              <div className="text-yellow-300 font-extrabold text-sm">XMP:UserComment = "META" + "VOID"</div>
              <div>Encryption Standard: AES-256-CBC</div>
            </div>
          ) : (
            <div className="text-[#d9c4a5] text-xs italic">
              📄 Surface view is blank. Click "INSPECT METADATA LAYERS" to examine embedded parameters.
            </div>
          )}
        </div>
      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 3 Decryption Key Submission</span>
        </h3>

        {feedback && (
          <div className={`p-4 rounded-xl text-xs mb-4 flex items-center space-x-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold'
              : 'bg-red-950/90 border-red-500 text-red-300 font-bold'
          }`}>
            {feedback.type === 'success' ? (
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder=""
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="flex-1 bg-black border-2 border-[#8b5a2b] rounded-xl px-4 py-3 text-sm text-yellow-300 focus:outline-none focus:border-yellow-400 uppercase tracking-widest font-mono font-bold shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !keyInput.trim()}
            className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] hover:from-yellow-400 hover:to-[#d4af37] text-[#140c08] font-black text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 font-mono uppercase tracking-wider"
          >
            <span>{loading ? 'VERIFYING...' : 'SUBMIT PASSPHRASE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
