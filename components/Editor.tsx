import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Image as ImageIcon, Plus, Trash2, ArrowLeft, Wand2, Send, RotateCcw, FileText, ChevronRight, Sparkles, PanelLeftClose, PanelLeftOpen, Download } from 'lucide-react';
import { Draft, ThreadItem, PostTone } from '../types';
import { enhanceText, generatePostImage } from '../services/geminiService';

interface EditorProps {
  draft: Draft | null;
  onUpdateDraft: (updatedDraft: Draft) => void;
  onPublish: (draftId: string) => void;
  isListVisible: boolean;
  onToggleList: () => void;
}

export const Editor: React.FC<EditorProps> = ({ draft, onUpdateDraft, onPublish, isListVisible, onToggleList }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [draft?.content]);

  if (!draft) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4 bg-[#0B0F12] relative">
         <button 
            onClick={onToggleList}
            className="absolute top-4 left-4 p-2 text-gray-500 hover:text-white hover:bg-[#1A1D23] rounded-md transition-colors"
            title={isListVisible ? "Hide list" : "Show list"}
        >
            {isListVisible ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
        <div className="w-16 h-16 rounded-full bg-[#1A1D23] flex items-center justify-center">
          <FileText size={24} className="text-gray-400" />
        </div>
        <p>Select a draft to start writing.</p>
      </div>
    );
  }

  const handleTitleChange = (newTitle: string) => {
    onUpdateDraft({ ...draft, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    // For now, we update the first item as the main body
    const updatedContent = draft.content.map((item, index) => 
      index === 0 ? { ...item, content: newContent } : item
    );
    // If empty, ensure we have one
    if (updatedContent.length === 0) {
        updatedContent.push({ id: Date.now().toString(), content: newContent, isMain: true });
    }
    onUpdateDraft({ ...draft, content: updatedContent });
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    const mainItem = draft.content[0];
    if (mainItem) {
        const enhanced = await enhanceText(mainItem.content, `Refine this for clarity and impact, keeping the tone ${PostTone.HUMBLE_BUILDER}`);
        handleContentChange(enhanced);
    }
    setIsEnhancing(false);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    const mainItem = draft.content[0];
    const prompt = `A professional, high-quality, minimal tech visualization suitable for a LinkedIn post about: ${mainItem.content.substring(0, 100)}. Use abstract geometric shapes, a dark background, and neon accents.`;
    const imageUrl = await generatePostImage(prompt, imageSize);
    if (imageUrl) {
        onUpdateDraft({ ...draft, imageUrl });
    }
    setIsGeneratingImage(false);
  };

  const mainContent = draft.content[0]?.content || "";

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#0B0F12]">
      {/* Header */}
      <div className="h-14 border-b border-[#262A33] flex items-center justify-between px-4 bg-[#0B0F12]">
        <div className="flex items-center gap-3">
             <button 
                onClick={onToggleList}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1A1D23] rounded-md transition-colors"
                title={isListVisible ? "Hide list" : "Show list"}
            >
                {isListVisible ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <div className="w-[1px] h-4 bg-[#262A33]"></div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText size={14} />
                <span>Public notes</span>
                <ChevronRight size={14} />
                <span className="text-gray-200 truncate max-w-[200px]">{draft.title || "Untitled"}</span>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <button className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal size={18} />
             </button>
             <button 
                onClick={() => onPublish(draft.id)}
                className="bg-white text-black hover:bg-gray-200 text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
             >
                Publish
             </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto px-8 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8 pb-32">
            
            {/* Toolbar Area */}
            <div className="flex items-center gap-4 group">
                <button className="p-2 hover:bg-[#1A1D23] rounded text-gray-400 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                {!draft.imageUrl ? (
                     <div className="flex items-center gap-2">
                        <select 
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value as "1K" | "2K" | "4K")}
                            disabled={isGeneratingImage}
                            className="bg-[#1A1D23] text-xs text-gray-300 border border-[#262A33] rounded px-2 py-1.5 focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                        >
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                        </select>
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className={`flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm px-3 py-1.5 rounded bg-[#1A1D23] border border-[#262A33] hover:border-gray-500 ${isGeneratingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isGeneratingImage ? (
                                <>
                                    <Sparkles size={14} className="animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <ImageIcon size={14} />
                                    <span>Generate Thumbnail</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-[#1A1D23] px-2 py-1 rounded border border-[#262A33]">{imageSize}</span>
                        <button 
                             onClick={() => onUpdateDraft({...draft, imageUrl: undefined})}
                             className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm px-2 py-1 rounded hover:bg-[#1A1D23]"
                        >
                            <Trash2 size={16} /> Remove thumbnail
                        </button>
                     </div>
                )}
            </div>

            {/* Image Preview */}
            {draft.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-[#262A33] shadow-lg relative group/image">
                    <img src={draft.imageUrl} alt="Thumbnail" className="w-full h-auto object-cover max-h-[400px]" />
                     <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                         <a href={draft.imageUrl} download="thumbnail.png" className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm block">
                             <Download size={16} />
                         </a>
                    </div>
                </div>
            )}

            {/* Title */}
            <input 
                type="text"
                value={draft.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                className="w-full bg-transparent text-5xl font-bold text-white placeholder-gray-600 focus:outline-none leading-tight"
            />

            {/* Content Body */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={mainContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing your public note..."
                    className="w-full bg-transparent text-lg text-gray-300 placeholder-gray-600 focus:outline-none resize-none leading-relaxed"
                    style={{ minHeight: '200px' }}
                />
                
                {/* Contextual AI Action (Floating) */}
                <button 
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className={`absolute -right-12 top-0 p-2 rounded-full text-[#3B82F6] hover:bg-[#1A1D23] transition-colors ${isEnhancing ? 'animate-spin' : ''}`}
                    title="Enhance with AI"
                >
                    {isEnhancing ? <Wand2 size={18} /> : <Sparkles size={18} />}
                </button>
            </div>

            {/* Spacer */}
            <div className="h-12"></div>

            {/* Related Logs Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Related logs</h3>
                    <button className="p-1 hover:bg-[#1A1D23] rounded text-gray-500 hover:text-white transition-colors">
                        <Plus size={16} />
                    </button>
                </div>

                {draft.relatedActivities && draft.relatedActivities.length > 0 ? (
                    <div className="space-y-2">
                        {draft.relatedActivities.map(activity => (
                             <div key={activity.id} className="bg-[#15171B] border border-[#262A33] rounded-md p-3 flex items-center justify-between group hover:border-[#3B82F6] transition-colors">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{activity.type}</div>
                                    <div className="text-sm text-gray-300">{activity.description}</div>
                                </div>
                                <div className="text-xs text-gray-600 font-mono">{activity.id.substring(0,6)}</div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-600 italic">No linked logs.</div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};