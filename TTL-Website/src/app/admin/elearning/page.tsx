'use client';

import { useState, useRef } from 'react';
import { GraduationCap, Plus, Trash2, Edit, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import Pagination from '@/components/admin/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { lessonService } from '@/service/lesson.service';
import { uploadFiles } from '@/service/client';
import { useAdminElearning } from '@/hook/admin/useAdminElearning';
import type { Lesson } from '@/types/content';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminELearningPage() {
  const { lessons, loading, page, total, totalPages, setPage, fetch } = useAdminElearning();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => { setTitle(''); setContent(''); setVideoUrl(''); setImages([]); setEditId(null); };

  const openEdit = (lesson: Lesson) => {
    setTitle(lesson.title);
    setContent(lesson.content || '');
    setVideoUrl(lesson.videoUrl || '');
    setImages(lesson.images as string[] || []);
    setEditId(lesson.id);
    setShowCreate(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const res = await uploadFiles<{ urls: string[] }>('/api/v1/lessons/upload', Array.from(files));
      setImages((prev) => [...prev, ...res.urls]);
    } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title) return;
    const data = { title, content: content || undefined, images, videoUrl: videoUrl || undefined };
    try {
      if (editId) {
        await lessonService.update(editId, data);
      } else {
        await lessonService.create(data);
      }
      setShowCreate(false);
      resetForm();
      fetch();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await lessonService.delete(deleteId);
      setDeleteId(null);
      fetch();
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 text-white select-none relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap size={20} className="text-primary" />
            <h1 className="text-lg font-bold">Quản lý E-learning</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreate(!showCreate); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary-light transition-all cursor-pointer"
          >
            <Plus size={12} /> Thêm bài học
          </button>
        </div>

        {showCreate && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài học"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all resize-none"
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Link video (YouTube URL) — không bắt buộc"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-all"
            />

            {/* Image upload */}
            <div>
              <p className="text-[11px] text-zinc-500 mb-2">Hình ảnh — không bắt buộc</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.startsWith('http') ? img : `${API_URL}${img}`}
                      alt=""
                      className="size-20 rounded-xl object-cover border border-white/10"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="size-20 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary/40 transition-all cursor-pointer"
                >
                  {uploading ? (
                    <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all cursor-pointer"
              >
                {editId ? 'Cập nhật' : 'Tạo bài học'}
              </button>
              <button
                onClick={() => { setShowCreate(false); resetForm(); }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Huỷ
              </button>
            </div>
          </div>
        )}

        <Skeleton name="admin-table" loading={loading} rows={lessons.length || 3}>
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">Chưa có bài học nào</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-white/6 bg-white/3 p-4 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap size={16} className="text-cyan shrink-0" />
                    <h3 className="text-sm font-bold text-white truncate flex-1">{lesson.title}</h3>
                  </div>
                  {lesson.images && (lesson.images as string[]).length > 0 && (
                    <img
                      src={(lesson.images as string[])[0].startsWith('http') ? (lesson.images as string[])[0] : `${API_URL}${(lesson.images as string[])[0]}`}
                      alt=""
                      className="w-full h-32 rounded-xl object-cover mb-3"
                    />
                  )}
                  {lesson.videoUrl && (
                    <p className="text-[11px] text-zinc-500 mb-2">🎬 Có video bài giảng</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(lesson)} className="p-1.5 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => setDeleteId(lesson.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="simple" />
        </Skeleton>
      </div>

      <ConfirmDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} title="Xoá bài học" message="Bạn có chắc muốn xoá bài học này?" confirmLabel="Xoá" />
    </div>
  );
}
