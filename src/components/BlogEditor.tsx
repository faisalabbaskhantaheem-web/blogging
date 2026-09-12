import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Article, ContentBlock } from '../types';
import { 
  Plus, Trash2, Eye, EyeOff, Save, Check, Type, Heading1, Heading2, 
  Quote, Code, Image as ImageIcon, Video, HelpCircle, ArrowUp, ArrowDown, Upload 
} from 'lucide-react';

interface BlogEditorProps {
  initialArticle?: Article | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ initialArticle, onClose, onSaveSuccess }) => {
  const { addArticle, updateArticle, categories } = useBlog();

  const [title, setTitle] = useState(initialArticle ? initialArticle.title : '');
  const [excerpt, setExcerpt] = useState(initialArticle ? initialArticle.excerpt : '');
  const [category, setCategory] = useState(initialArticle ? initialArticle.category : 'Technology');
  const [coverImage, setCoverImage] = useState(initialArticle ? initialArticle.coverImage : 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1000&auto=format&fit=crop&q=80');
  const [tags, setTags] = useState<string[]>(initialArticle ? initialArticle.tags : []);
  const [tagInput, setTagInput] = useState('');
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(() => {
    if (initialArticle && initialArticle.contentBlocks && initialArticle.contentBlocks.length > 0) {
      return [...initialArticle.contentBlocks];
    }
    return [
      { type: 'paragraph', value: 'This is your first paragraph. Select from the toolbar below to add more content sections like headings, code blocks, images, or pull quotes!' }
    ];
  });

  const [status, setStatus] = useState<any>('draft'); // 'draft' | 'published'
  const [autosaveTime, setAutosaveTime] = useState<string>('');
  const [splitPreview, setSplitPreview] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Handle local image file uploads and convert to schema-compliant base64 data URL
  const handleLocalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onUploaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-save logic mimicking server updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAutosaveTime(now.toLocaleTimeString());
      setInfoMessage('Draft autosaved locally!');
      setTimeout(() => setInfoMessage(''), 3000);
    }, 45000); // Autosave every 45 seconds

    return () => clearInterval(interval);
  }, [title, excerpt, contentBlocks, category, coverImage, tags, status]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      type,
      value: '',
      extra: type === 'code' ? 'typescript' : type === 'image' ? 'Image caption text' : undefined
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockValue = (index: number, value: string) => {
    setContentBlocks(prev => prev.map((b, i) => i === index ? { ...b, value } : b));
  };

  const updateBlockExtra = (index: number, extra: string) => {
    setContentBlocks(prev => prev.map((b, i) => i === index ? { ...b, extra } : b));
  };

  const deleteBlock = (index: number) => {
    if (contentBlocks.length === 1) return; // Must keep at least one block
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;
    
    const updated = [...contentBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setContentBlocks(updated);
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/[^a-zA-Z0-9]/g, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please provide a title before saving.');
      return;
    }

    // Build plain description fallback
    const fallbackText = contentBlocks
      .filter(b => b.type === 'paragraph')
      .map(b => b.value)
      .join('\n\n');

    if (initialArticle) {
      updateArticle({
        ...initialArticle,
        title,
        excerpt,
        coverImage,
        category,
        tags,
        contentBlocks,
        status,
        content: fallbackText,
        readingTime: `${Math.max(1, Math.ceil((fallbackText.split(' ').length || 200) / 200))} min read`
      });
    } else {
      addArticle({
        title,
        excerpt,
        coverImage,
        category,
        tags,
        contentBlocks,
        status,
        content: fallbackText
      });
    }

    onSaveSuccess();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-850">
      
      {/* Editor Header controls */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            {initialArticle ? 'Edit Article Workspace' : 'Write New Masterpiece'}
          </h2>
          <p className="text-[10px] text-slate-400 font-mono">
            {autosaveTime ? `Last saved at ${autosaveTime}` : 'Draft ready'}
            {infoMessage && <span className="text-emerald-500 ml-2 font-sans font-bold">({infoMessage})</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitPreview(!splitPreview)}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5"
            title="Toggle split screen layout"
          >
            {splitPreview ? (
              <>
                <EyeOff className="h-4 w-4" /> Full Workspace
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Live Preview
              </>
            )}
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white dark:bg-slate-800 text-xs font-bold border rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Live</option>
          </select>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Save className="h-3.5 w-3.5" /> Save Post
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Editor Body Grid split layout dynamically */}
      <div className={`grid grid-cols-1 ${splitPreview ? 'lg:grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800' : ''}`}>
        
        {/* Left pane: Composition tools */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          
          {/* Metadata forms */}
          <div className="space-y-4 mb-6 pb-6 border-b border-dashed border-slate-100 dark:border-slate-850">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Ultimate guide to software engineering..."
                className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Channel / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Cover Image
                </label>
                <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/10 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover Preview" className="h-10 w-16 object-cover rounded border border-slate-200 dark:border-slate-800" />
                  ) : (
                    <div className="h-10 w-16 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold">No Image</div>
                  )}
                  <div className="flex-grow flex flex-col gap-1">
                    <label className="inline-flex items-center self-start justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
                      <Upload className="h-3 w-3" />
                      Upload from Gallery
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleLocalImageUpload(e, (dataUrl) => setCoverImage(dataUrl))} 
                      />
                    </label>
                    <span className="text-[8px] text-slate-450">PNG, JPG, WebP.</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] text-slate-450 block mb-0.5">Or paste direct Web Link:</span>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border bg-transparent text-[10px] text-slate-700 dark:text-slate-350 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Brief Excerpt / Summary
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Write a highly clickable meta description for listing maps..."
                className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none"
              />
            </div>

            {/* Tags Box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Tags (Press Enter)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    #{t}
                    <button onClick={() => handleRemoveTag(t)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Add design tools, AI, software models..."
                className="w-full px-4 py-2 rounded-xl border bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Dynamic ContentBlocks list */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Article Body Grid Elements</h4>
            
            {contentBlocks.map((block, index) => (
              <div 
                key={index} 
                className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/40 relative group transition-all duration-200 focus-within:shadow-md"
              >
                
                {/* Block Type Badge and Sort Tools */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-[9px] font-extrabold uppercase flex items-center gap-1">
                    {block.type === 'paragraph' && <Type className="h-3 w-3" />}
                    {block.type === 'heading1' && <Heading1 className="h-3 w-3" />}
                    {block.type === 'heading2' && <Heading2 className="h-3 w-3" />}
                    {block.type === 'quote' && <Quote className="h-3 w-3" />}
                    {block.type === 'code' && <Code className="h-3 w-3" />}
                    {block.type === 'image' && <ImageIcon className="h-3 w-3" />}
                    {block.type === 'video' && <Video className="h-3 w-3" />}
                    Block {index + 1}: {block.type}
                  </span>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveBlock(index, 'up')} 
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-35"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => moveBlock(index, 'down')} 
                      disabled={index === contentBlocks.length - 1}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-35"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => deleteBlock(index)}
                      className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-slate-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Input form based on type */}
                {block.type === 'paragraph' && (
                  <textarea
                    value={block.value}
                    onChange={(e) => updateBlockValue(index, e.target.value)}
                    rows={3}
                    placeholder="Type normal layout paragraph copy..."
                    className="w-full bg-white dark:bg-slate-800 border rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
                  />
                )}

                {(block.type === 'heading1' || block.type === 'heading2') && (
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => updateBlockValue(index, e.target.value)}
                    placeholder={block.type === 'heading1' ? 'Enter primary chapter head...' : 'Enter secondary section head...'}
                    className="w-full bg-white dark:bg-slate-800 border rounded-xl py-2 px-3 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}

                {block.type === 'quote' && (
                  <textarea
                    value={block.value}
                    onChange={(e) => updateBlockValue(index, e.target.value)}
                    rows={2}
                    placeholder="Enter inspiring quote text..."
                    className="w-full bg-white dark:bg-slate-800 border-l-4 border-blue-600 rounded-r-xl p-3 text-xs italic font-medium outline-none text-slate-600 dark:text-slate-300"
                  />
                )}

                {block.type === 'code' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Language:</span>
                      <select
                        value={block.extra || 'typescript'}
                        onChange={(e) => updateBlockExtra(index, e.target.value)}
                        className="bg-white dark:bg-slate-800 border text-[10px] rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="javascript">JavaScript</option>
                        <option value="css">CSS / Tailwind</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>
                    <textarea
                      value={block.value}
                      onChange={(e) => updateBlockValue(index, e.target.value)}
                      rows={4}
                      placeholder="Paste formatting style code here..."
                      className="w-full p-3 font-mono text-[10px] bg-slate-900 border border-slate-750 text-emerald-400 rounded-xl outline-none"
                    />
                  </div>
                )}

                {block.type === 'image' && (
                  <div className="space-y-2 bg-slate-50/50 dark:bg-slate-800/10 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      {block.value ? (
                        <img src={block.value} alt="Preview" className="h-10 w-16 object-cover rounded border border-slate-200 dark:border-slate-800" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold">No Image</div>
                      )}
                      <div>
                        <label className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
                          <Upload className="h-3 w-3" />
                          Upload from Gallery
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleLocalImageUpload(e, (dataUrl) => updateBlockValue(index, dataUrl))} 
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 block mb-1">Or paste direct Web Link:</span>
                      <input
                        type="text"
                        value={block.value}
                        onChange={(e) => updateBlockValue(index, e.target.value)}
                        placeholder="Image URL..."
                        className="w-full bg-white dark:bg-slate-800 border rounded-lg py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={block.extra || ''}
                      onChange={(e) => updateBlockExtra(index, e.target.value)}
                      placeholder="Caption text or description..."
                      className="w-full bg-white dark:bg-slate-800 border rounded-lg py-1.5 px-3 text-[10px] text-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block.value}
                      onChange={(e) => updateBlockValue(index, e.target.value)}
                      placeholder="Video Embed URL (YouTube/Vimeo)..."
                      className="w-full bg-white dark:bg-slate-800 border rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={block.extra || ''}
                      onChange={(e) => updateBlockExtra(index, e.target.value)}
                      placeholder="Caption text or description..."
                      className="w-full bg-white dark:bg-slate-800 border rounded-xl py-2 px-3 text-[10px] text-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Quick Add Block list element buttons */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/10 border border-blue-500/10 text-center">
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">
              Enrich with visual blocks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button onClick={() => addBlock('paragraph')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Plus className="h-3 w-3 text-blue-500" /> Paragraph
              </button>
              <button onClick={() => addBlock('heading1')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Heading1 className="h-3 w-3 text-purple-500" /> Title H1
              </button>
              <button onClick={() => addBlock('heading2')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Heading2 className="h-3 w-3 text-pink-500" /> Sub H2
              </button>
              <button onClick={() => addBlock('quote')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Quote className="h-3 w-3 text-orange-500" /> Pull Quote
              </button>
              <button onClick={() => addBlock('code')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Code className="h-3 w-3 text-emerald-500" /> Code Snippet
              </button>
              <button onClick={() => addBlock('image')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-blue-100 rounded-lg shadow-sm border text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <ImageIcon className="h-3 w-3 text-teal-500" /> Image File
              </button>
            </div>
          </div>

        </div>

        {/* Right pane: split preview screen */}
        {splitPreview && (
          <div className="p-6 overflow-y-auto max-h-[70vh] bg-slate-50/50 dark:bg-slate-950/20">
            <div className="prose dark:prose-invert max-w-none">
              
              {/* Category & Date */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase">
                  {category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </div>

              {/* Title heading */}
              <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2">
                {title || 'Untitled Article'}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 pl-3 mb-6">
                  {excerpt}
                </p>
              )}

              {/* Banner Cover */}
              {coverImage && (
                <img 
                  src={coverImage} 
                  alt="Post Cover Banner" 
                  className="w-full h-40 object-cover rounded-2xl mb-6 shadow-sm shadow-slate-100 dark:shadow-none"
                  onError={(e) => {
                    // fallback image
                    (e.target as any).src = "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              )}

              {/* Dynamic render of content blocks */}
              <div className="space-y-4">
                {contentBlocks.map((b, i) => (
                  <div key={i}>
                    {b.type === 'paragraph' && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {b.value || <span className="text-slate-400 italic">(Paragraph section is empty)</span>}
                      </p>
                    )}

                    {b.type === 'heading1' && (
                      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white mt-4 mb-2">
                        {b.value || <span className="text-slate-400 italic">(Heading 1 empty)</span>}
                      </h2>
                    )}

                    {b.type === 'heading2' && (
                      <h3 className="text-base font-bold text-slate-700 dark:text-slate-100 mt-3 mb-1">
                        {b.value || <span className="text-slate-400 italic">(Heading 2 empty)</span>}
                      </h3>
                    )}

                    {b.type === 'quote' && (
                      <blockquote className="my-4 p-4 border-l-4 border-blue-500 bg-slate-50 dark:bg-slate-800 rounded-r-xl italic text-xs font-semibold text-slate-600 dark:text-slate-300">
                        "{b.value || 'Quote text element'}"
                      </blockquote>
                    )}

                    {b.type === 'code' && (
                      <div className="bg-slate-900 border dark:border-slate-800 rounded-xl overflow-hidden p-3 font-mono text-[10px] text-emerald-400 text-left relative">
                        <span className="absolute right-3 top-2.5 text-[8px] text-slate-500 uppercase font-bold tracking-wide">
                          {b.extra || 'code'}
                        </span>
                        <pre className="overflow-x-auto">{b.value || '// Enter markup code snippet'}</pre>
                      </div>
                    )}

                    {b.type === 'image' && (
                      <div className="my-4">
                        <img 
                          src={b.value || 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80'} 
                          alt="Article illustration" 
                          className="w-full h-36 object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as any).src = "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&auto=format&fit=crop&q=80";
                          }}
                        />
                        {b.extra && <p className="text-[10px] text-slate-400 text-center mt-1">{b.extra}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
