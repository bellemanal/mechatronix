import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, ImagePlus, X, Image as ImageIcon, Film,
  File, FileText, Loader, CheckCircle2, AlertCircle, Link
} from 'lucide-react'
import { useProjectStore } from '../../projectStore'
import { useImageUpload, useCoverUpload, useFileUpload, formatSize, ALLOWED_IMAGE_TYPES } from '../../hooks/useUpload'

// ── Image thumbnail ────────────────────────────────────────────────────────────
function ImageThumb({ img, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50"
    >
      <img src={img.preview || img.url} alt="" className="w-full h-full object-cover" />

      {/* Upload progress overlay */}
      {img.uploading && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-xs font-medium">{img.progress}%</span>
        </div>
      )}

      {/* Error overlay */}
      {img.error && (
        <div className="absolute inset-0 bg-danger-500/80 flex items-center justify-center p-2">
          <p className="text-white text-xs text-center">{img.error}</p>
        </div>
      )}

      {/* Success indicator */}
      {img.url && !img.uploading && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 size={16} className="text-success-500 drop-shadow" />
        </div>
      )}

      {/* Remove button */}
      {!img.uploading && (
        <button
          onClick={() => onRemove(img.id)}
          className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all duration-150"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  )
}

// ── File row ───────────────────────────────────────────────────────────────────
function FileRow({ file, onRemove }) {
  const ext = file.name.split('.').pop().toLowerCase()
  const icon = ['pdf'].includes(ext) ? FileText : File

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 group"
    >
      <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
        {file.uploading
          ? <Loader size={16} className="text-brand-500 animate-spin" />
          : file.url
            ? <CheckCircle2 size={16} className="text-success-500" />
            : React.createElement(icon, { size: 16, className: 'text-gray-400' })}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
          {file.uploading && (
            <>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-500 rounded-full"
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-xs text-brand-500">{file.progress}%</span>
            </>
          )}
          {file.error && <span className="text-xs text-danger-500">{file.error}</span>}
        </div>
      </div>
      {!file.uploading && (
        <button
          onClick={() => onRemove(file.id)}
          className="w-7 h-7 rounded-lg hover:bg-danger-50 flex items-center justify-center text-gray-400 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all duration-150"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}

export default function Step2Media({ onNext, onPrev }) {
  const {
    form, setCoverImage, addImage, updateImage, removeImage,
    addFile, updateFile, removeFile, setField,
  } = useProjectStore()

  const fileInputRef  = useRef()
  const coverInputRef = useRef()
  const engFileRef    = useRef()
  const [videoMode, setVideoMode] = useState('url') // 'url' | 'file'

  const { upload: uploadImage, uploadMultiple, isDragging, dragHandlers } = useImageUpload({
    projectId: form.projectId,
    onAdd: addImage,
    onUpdate: updateImage,
    onRemove: removeImage,
  })

  const { upload: uploadCover, uploading: coverUploading } = useCoverUpload({
    projectId: form.projectId,
    onSet: setCoverImage,
  })

  const { upload: uploadFile } = useFileUpload({
    projectId: form.projectId,
    onAdd: addFile,
    onUpdate: updateFile,
    onRemove: removeFile,
  })

  const handleFileInput = (e) => uploadMultiple(e.target.files)
  const handleCoverInput = (e) => e.target.files[0] && uploadCover(e.target.files[0])
  const handleEngFiles = (e) => Array.from(e.target.files).forEach(uploadFile)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* ── Cover Image ────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ImageIcon size={16} className="text-brand-500" />
          Cover Image
          <span className="text-brand-500">*</span>
        </h3>

        <div
          onClick={() => !coverUploading && coverInputRef.current.click()}
          className={`relative rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-200 ${
            form.coverImage?.preview
              ? 'border-transparent'
              : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
          }`}
        >
          {form.coverImage?.preview ? (
            <div className="relative">
              <img
                src={form.coverImage.preview}
                alt="Cover"
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white font-medium text-sm opacity-0 hover:opacity-100">Change Cover</span>
              </div>
              {form.coverImage.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}
              {form.coverImage.url && !form.coverImage.uploading && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={20} className="text-success-500 drop-shadow" />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setCoverImage(null) }}
                className="absolute top-3 left-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-danger-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 gap-3">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                <ImagePlus size={22} className="text-brand-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Click to upload cover image</p>
                <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP · Max 10MB · Recommended 1200×630</p>
              </div>
            </div>
          )}
        </div>

        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverInput} className="hidden" />
      </div>

      {/* ── Gallery Images ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Upload size={16} className="text-brand-500" />
          Project Images
          <span className="text-xs text-gray-400 font-normal">(up to 10)</span>
        </h3>

        {/* Drop zone */}
        <div
          {...dragHandlers}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 p-4 ${
            isDragging
              ? 'border-brand-400 bg-brand-50 scale-[1.01]'
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-brand-50/80 flex items-center justify-center z-10">
              <p className="text-brand-600 font-semibold text-sm">Drop images here!</p>
            </div>
          )}

          {/* Existing images grid */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
              <AnimatePresence>
                {form.images.map((img) => (
                  <ImageThumb key={img.id} img={img} onRemove={removeImage} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Upload button */}
          {form.images.length < 10 && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex flex-col items-center gap-2 py-6 text-gray-400 hover:text-brand-500 transition-colors"
            >
              <Upload size={24} />
              <span className="text-sm font-medium">
                {form.images.length ? 'Add more images' : 'Upload images or drag & drop'}
              </span>
              <span className="text-xs">JPEG, PNG, WebP, GIF · Max 10MB each</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* ── Video ──────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Film size={16} className="text-brand-500" />
          Project Video
          <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </h3>

        {/* Toggle */}
        <div className="flex items-center gap-2 mb-3">
          {['url', 'file'].map((mode) => (
            <button
              key={mode}
              onClick={() => setVideoMode(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                videoMode === mode
                  ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {mode === 'url' ? '🔗 YouTube / Vimeo URL' : '📁 Upload Video File'}
            </button>
          ))}
        </div>

        {videoMode === 'url' ? (
          <div className="relative">
            <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setField('videoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
            />
          </div>
        ) : (
          <div
            onClick={() => engFileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 text-gray-400 hover:text-brand-500 hover:border-brand-300 cursor-pointer transition-all"
          >
            <Film size={28} />
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload a video</p>
              <p className="text-xs mt-0.5">MP4, MOV, AVI · Max 200MB</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Engineering Files ──────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <File size={16} className="text-brand-500" />
          Engineering Files
          <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </h3>

        {form.files.length > 0 && (
          <div className="space-y-2 mb-3">
            <AnimatePresence>
              {form.files.map((f) => (
                <FileRow key={f.id} file={f} onRemove={removeFile} />
              ))}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={() => engFileRef.current?.click()}
          className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl px-6 py-5 text-gray-400 hover:text-brand-500 hover:border-brand-300 transition-all duration-200"
        >
          <File size={20} />
          <div className="text-left">
            <p className="text-sm font-medium">Upload engineering files</p>
            <p className="text-xs mt-0.5">.zip .rar .pdf .ino .stl .step .f3d .dwg · Max 50MB each</p>
          </div>
        </button>

        <input
          ref={engFileRef}
          type="file"
          multiple
          accept=".zip,.rar,.pdf,.ino,.stl,.step,.f3d,.dwg,application/pdf,application/zip"
          onChange={handleEngFiles}
          className="hidden"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={onPrev} className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
          ← Back
        </button>
        <button onClick={onNext} className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm">
          Continue →
        </button>
      </div>
    </motion.div>
  )
}