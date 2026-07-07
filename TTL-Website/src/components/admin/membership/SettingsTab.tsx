"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Settings,
  BookOpen,
  Brain,
  FileText,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  ChevronRight,
  Trash2,
  Edit3,
} from "lucide-react";
import gsap from "gsap";
import { adminService } from "@/service/admin.service";
import { type MembershipSettings } from "@/service/membership.service";
import { Skeleton } from "@/components/ui/Skeleton";

const sectionStyle = {
  background: "color-mix(in srgb, var(--surface-elevated) 18%, transparent)",
  boxShadow:
    "0 4px 24px color-mix(in srgb, var(--clr-primary) 10%, transparent)",
  border: "0.5px solid var(--border-base)",
} as const;

export default function SettingsTab() {
  const [settings, setSettings] = useState<MembershipSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowPrice, setFlowPrice] = useState(6000000);
  const [flowRules, setFlowRules] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const s = await adminService.getMembershipSettings();
      setSettings(s);
      setFlowName(s.flow?.name || "");
      setFlowPrice(s.flow?.price || 6000000);
      setFlowRules(s.flow?.rules || "");
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".mf-section"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
      );
    }
  }, [settings]);

  const handleSaveFlow = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await adminService.updateMembershipFlow({
        name: flowName,
        price: flowPrice,
        rules: flowRules,
      });
      setMessage("Đã lưu cấu hình luồng");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Skeleton name="mf-settings" loading rows={8}>
        <div />
      </Skeleton>
    );
  }

  return (
    <div ref={listRef} className="space-y-8 px-2">
      {/* Flow settings */}
      <div
        className="mf-section rounded-2xl p-8 space-y-6"
        style={sectionStyle}
      >
        <div className="text-center">
          <div
            className="inline-flex p-2.5 rounded-xl mb-3"
            style={{
              background:
                "color-mix(in srgb, var(--clr-primary) 10%, transparent)",
            }}
          >
            <Settings size={20} style={{ color: "var(--clr-primary)" }} />
          </div>
          <h3 className="text-base font-semibold">Cấu hình luồng hội viên</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Thiết lập thông tin cơ bản cho luồng đăng ký
          </p>
        </div>

        <div className="max-w-lg mx-auto space-y-5">
          <div>
            <label
              className="text-xs font-medium mb-1.5 block"
              style={{ color: "var(--text-secondary)" }}
            >
              Tên luồng
            </label>
            <input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
              placeholder="VD: Luồng hội viên chính thức"
            />
          </div>
          <div>
            <label
              className="text-xs font-medium mb-1.5 block"
              style={{ color: "var(--text-secondary)" }}
            >
              Phí hội viên (VNĐ)
            </label>
            <input
              type="number"
              value={flowPrice}
              onChange={(e) => setFlowPrice(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
            />
          </div>
          <div>
            <label
              className="text-xs font-medium mb-1.5 block"
              style={{ color: "var(--text-secondary)" }}
            >
              Nội quy
            </label>
            <textarea
              value={flowRules}
              onChange={(e) => setFlowRules(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all resize-none"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
              placeholder="Nhập nội quy dành cho hội viên..."
            />
          </div>

          {message && (
            <p
              className="text-xs text-center font-medium"
              style={{
                color: message.startsWith("Đã")
                  ? "var(--color-success)"
                  : "var(--danger)",
              }}
            >
              {message}
            </p>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSaveFlow}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 hover:opacity-90"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div
        className="mf-section rounded-2xl p-8 space-y-6"
        style={sectionStyle}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BookOpen size={18} style={{ color: "var(--clr-primary)" }} />
              Bài học
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {settings?.lessons?.length || 0} bài học
            </p>
          </div>
          <AddLessonButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.lessons.length > 0 ? (
          <div className="space-y-2 max-w-2xl mx-auto">
            {settings.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onSuccess={fetchSettings}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-xs text-center py-8"
            style={{ color: "var(--text-dim)" }}
          >
            Chưa có buổi học nào
          </p>
        )}
      </div>

      {/* Quiz questions */}
      <div
        className="mf-section rounded-2xl p-8 space-y-6"
        style={sectionStyle}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Brain size={18} style={{ color: "var(--clr-primary)" }} />
              Câu hỏi trắc nghiệm
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {settings?.quizQuestions?.length || 0} câu hỏi
            </p>
          </div>
          <AddQuizQuestionButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.quizQuestions.length > 0 ? (
          <div className="space-y-2 max-w-2xl mx-auto">
            {settings.quizQuestions.map((q) => (
              <QuizQuestionCard
                key={q.id}
                question={q}
                onSuccess={fetchSettings}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-xs text-center py-8"
            style={{ color: "var(--text-dim)" }}
          >
            Chưa có câu hỏi nào
          </p>
        )}
      </div>

      {/* Exam Sets */}
      <div
        className="mf-section rounded-2xl p-8 space-y-6"
        style={sectionStyle}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Brain size={18} style={{ color: "var(--clr-primary)" }} />
              Bộ đề trắc nghiệm
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {settings?.examSets?.length || 0} bộ đề
            </p>
          </div>
          <AddExamSetButton
            flowId={settings?.flow?.id || ""}
            allQuestions={settings?.quizQuestions || []}
            onSuccess={fetchSettings}
          />
        </div>
        {settings && settings.examSets.length > 0 ? (
          <div className="space-y-3 max-w-2xl mx-auto">
            {settings.examSets.map((examSet) => (
              <ExamSetCard
                key={examSet.id}
                examSet={examSet}
                allQuestions={settings?.quizQuestions || []}
                onSuccess={fetchSettings}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-xs text-center py-8"
            style={{ color: "var(--text-dim)" }}
          >
            Chưa có bộ đề nào. Tạo bộ đề để nhóm các câu hỏi trắc nghiệm.
          </p>
        )}
      </div>

      {/* Situation questions */}
      <div
        className="mf-section rounded-2xl p-8 space-y-6"
        style={sectionStyle}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText size={18} style={{ color: "var(--clr-primary)" }} />
              Câu hỏi tình huống
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {settings?.situationQuestions?.length || 0} câu hỏi
            </p>
          </div>
          <AddSituationButton onSuccess={fetchSettings} />
        </div>
        {settings && settings.situationQuestions.length > 0 ? (
          <div className="space-y-2 max-w-2xl mx-auto">
            {settings.situationQuestions.map((s) => (
              <SituationCard
                key={s.id}
                situation={s}
                onSuccess={fetchSettings}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-xs text-center py-8"
            style={{ color: "var(--text-dim)" }}
          >
            Chưa có câu hỏi tình huống nào
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Lesson Card ─── */
export function LessonCard({
  lesson,
  onSuccess,
}: {
  lesson: MembershipSettings["lessons"][0];
  onSuccess: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || "");
  const [type, setType] = useState(lesson.type);
  const [content, setContent] = useState(lesson.content || "");

  const handleSave = async () => {
    try {
      setDeleting(true);
      await adminService.updateLesson(lesson.id, {
        title,
        description,
        type,
        content,
      });
      onSuccess();
      setEditing(false);
    } catch {
    } finally {
      setDeleting(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Xóa bài học này?")) return;
    try {
      setDeleting(true);
      await adminService.deleteLesson(lesson.id);
      onSuccess();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border-base)",
          }}
          placeholder="Tiêu đề"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border-base)",
          }}
          placeholder="Mô tả"
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
          >
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-[2] px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="URL nội dung"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : "Lưu"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-lg text-sm cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl p-4"
      style={{
        background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{lesson.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{
              background:
                "color-mix(in srgb, var(--clr-primary) 10%, transparent)",
              color: "var(--clr-primary)",
            }}
          >
            {lesson.type}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>
            Thứ tự {lesson.orderIndex}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Modal wrapper ─── */
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{
          background: "var(--surface-elevated)",
          border: "0.5px solid var(--border-base)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ─── Add Lesson Button ─── */
export function AddLessonButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("video");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      await adminService.createLesson({
        title,
        description,
        type,
        orderIndex: 0,
        content,
      } as any);
      onSuccess();
      setOpen(false);
      setTitle("");
      setDescription("");
      setContent("");
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
        style={{
          background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
          color: "var(--clr-primary)",
        }}
      >
        <Plus size={14} /> Thêm
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Thêm bài học</h4>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Tiêu đề bài học"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Mô tả"
          />
          <div className="flex gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-[2] px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
              placeholder="URL nội dung"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Thêm"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── Quiz Question Card ─── */
export function QuizQuestionCard({
  question,
  onSuccess,
}: {
  question: MembershipSettings["quizQuestions"][0];
  onSuccess: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [qText, setQText] = useState(question.question);
  const [options, setOptions] = useState(question.options);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setDeleting(true);
      setError(null);
      await adminService.updateQuizQuestion(question.id, {
        question: qText,
        options,
        correctAnswer,
      });
      onSuccess();
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xảy ra");
      console.error("save error", e);
    } finally {
      setDeleting(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Xóa câu hỏi này?")) return;
    try {
      setDeleting(true);
      setError(null);
      await adminService.deleteQuizQuestion(question.id);
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xảy ra");
      console.error("delete error", e);
    } finally {
      setDeleting(false);
    }
  };

  const addOption = () => {
    const key = String.fromCharCode(97 + Object.keys(options).length);
    setOptions({ ...options, [key]: "" });
  };
  const updateOption = (key: string, value: string) => {
    setOptions({ ...options, [key]: value });
  };
  const removeOption = (key: string) => {
    const next = { ...options };
    delete next[key];
    setOptions(next);
  };

  if (editing) {
    return (
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}
      >
        <textarea
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border-base)",
          }}
          placeholder="Câu hỏi"
        />
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-bold w-5 text-center"
              style={{
                color:
                  correctAnswer === key
                    ? "var(--color-success)"
                    : "var(--text-dim)",
              }}
            >
              {key.toUpperCase()}
            </span>
            <input
              value={value}
              onChange={(e) => updateOption(key, e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
            />
            <button
              onClick={() => {
                setCorrectAnswer(key);
              }}
              className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all"
              style={{
                background:
                  correctAnswer === key
                    ? "color-mix(in srgb, var(--color-success) 20%, transparent)"
                    : "transparent",
                color:
                  correctAnswer === key
                    ? "var(--color-success)"
                    : "var(--text-dim)",
              }}
            >
              Đúng
            </button>
            <button
              onClick={() => removeOption(key)}
              className="p-1 rounded cursor-pointer hover:bg-[var(--glass-hover)]"
              style={{ color: "var(--text-dim)" }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={addOption}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Plus size={12} /> Thêm đáp án
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : "Lưu"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-lg text-sm cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
          >
            Hủy
          </button>
        </div>
        {error && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl p-4"
      style={{
        background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
      }}
    >
      <p className="text-sm flex-1">{question.question}</p>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Add Quiz Question Button ─── */
export function AddQuizQuestionButton({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Record<string, string>>({
    a: "",
    b: "",
    c: "",
    d: "",
  });
  const [correctAnswer, setCorrectAnswer] = useState("a");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!question.trim() || !correctAnswer) return;
    try {
      setSaving(true);
      await adminService.createQuizQuestion({
        question,
        options,
        correctAnswer,
      } as any);
      onSuccess();
      setOpen(false);
      setQuestion("");
      setOptions({ a: "", b: "", c: "", d: "" });
      setCorrectAnswer("a");
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
        style={{
          background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
          color: "var(--clr-primary)",
        }}
      >
        <Plus size={14} /> Thêm
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Thêm câu hỏi trắc nghiệm</h4>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Nhập câu hỏi trắc nghiệm"
          />
          <div className="space-y-2">
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold w-5 text-center"
                  style={{
                    color:
                      correctAnswer === key
                        ? "var(--color-success)"
                        : "var(--text-dim)",
                  }}
                >
                  {key.toUpperCase()}
                </span>
                <input
                  value={value}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  style={{
                    background:
                      "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                    color: "var(--text-primary)",
                    border: "0.5px solid var(--border-base)",
                  }}
                />
                <button
                  onClick={() => {
                    setCorrectAnswer(key);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  style={{
                    background:
                      correctAnswer === key
                        ? "color-mix(in srgb, var(--color-success) 20%, transparent)"
                        : "transparent",
                    color:
                      correctAnswer === key
                        ? "var(--color-success)"
                        : "var(--text-dim)",
                  }}
                >
                  {correctAnswer === key ? "✓ Đúng" : "Chọn đúng"}
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !question.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Thêm"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── Situation Card ─── */
export function SituationCard({
  situation,
  onSuccess,
}: {
  situation: MembershipSettings["situationQuestions"][0];
  onSuccess: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(situation.title);
  const [description, setDescription] = useState(situation.description);

  const handleSave = async () => {
    try {
      setDeleting(true);
      await adminService.updateSituationQuestion(situation.id, {
        title,
        description,
      });
      onSuccess();
      setEditing(false);
    } catch {
    } finally {
      setDeleting(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Xóa câu hỏi tình huống này?")) return;
    try {
      setDeleting(true);
      await adminService.deleteSituationQuestion(situation.id);
      onSuccess();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border-base)",
          }}
          placeholder="Tiêu đề"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          style={{
            background:
              "color-mix(in srgb, var(--text-primary) 5%, transparent)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border-base)",
          }}
          placeholder="Mô tả tình huống"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : "Lưu"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-lg text-sm cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl p-4"
      style={{
        background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{situation.title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
          {situation.description}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
          style={{ color: "var(--danger)" }}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Add Situation Button ─── */
export function AddSituationButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      await adminService.createSituationQuestion({ title, description } as any);
      onSuccess();
      setOpen(false);
      setTitle("");
      setDescription("");
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
        style={{
          background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
          color: "var(--clr-primary)",
        }}
      >
        <Plus size={14} /> Thêm
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Thêm câu hỏi tình huống</h4>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Tiêu đề tình huống"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Mô tả tình huống"
          />
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Thêm"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── Exam Set Card ─── */
export function ExamSetCard({
  examSet,
  allQuestions,
  onSuccess,
}: {
  examSet: MembershipSettings["examSets"][0];
  allQuestions: MembershipSettings["quizQuestions"];
  onSuccess: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(examSet.name);
  const [passScore, setPassScore] = useState(examSet.passScore);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingQuestions, setAddingQuestions] = useState(false);
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await adminService.updateExamSet(examSet.id, { name, passScore });
      onSuccess();
      setEditing(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Xóa bộ đề này?")) return;
    try {
      setDeleting(true);
      await adminService.deleteExamSet(examSet.id);
      onSuccess();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const handleAddQuestions = async () => {
    if (selectedQIds.length === 0) return;
    try {
      setSaving(true);
      await adminService.addExamSetQuestions(examSet.id, selectedQIds);
      setSelectedQIds([]);
      setAddingQuestions(false);
      onSuccess();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await adminService.removeExamSetQuestion(examSet.id, questionId);
      onSuccess();
    } catch {}
  };

  const existingIds = new Set(examSet.questions.map((q) => q.questionId));
  const availableQuestions = allQuestions.filter((q) => !existingIds.has(q.id));

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
        >
          <ChevronRight
            size={16}
            className="shrink-0 transition-transform duration-200"
            style={{
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              color: "var(--text-dim)",
            }}
          />
          <span className="text-sm font-medium truncate">{examSet.name}</span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full shrink-0"
            style={{
              background:
                "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
              color: "var(--clr-primary)",
            }}
          >
            {examSet.questions.length} câu
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full shrink-0"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 8%, transparent)",
              color: "var(--text-tertiary)",
            }}
          >
            Pass {examSet.passScore}
          </span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--glass-hover)]"
            style={{ color: "var(--danger)" }}
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      {editing && (
        <div className="flex items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Tên bộ đề"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              Điểm đậu:
            </span>
            <input
              type="number"
              value={passScore}
              onChange={(e) => setPassScore(parseInt(e.target.value, 10) || 1)}
              className="w-20 px-3 py-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-center"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
            style={{ background: "var(--clr-primary)", color: "#fff" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Lưu"}
          </button>
        </div>
      )}

      {expanded && (
        <div
          className="pt-3 space-y-2 border-t"
          style={{ borderColor: "var(--border-base)" }}
        >
          <p
            className="text-xs font-medium"
            style={{ color: "var(--text-dim)" }}
          >
            Câu hỏi trong bộ đề:
          </p>
          {examSet.questions.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Chưa có câu hỏi
            </p>
          ) : (
            examSet.questions.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background:
                    "color-mix(in srgb, var(--text-primary) 4%, transparent)",
                }}
              >
                <span className="text-sm flex-1">{eq.question.question}</span>
                <button
                  onClick={() => handleRemoveQuestion(eq.questionId)}
                  className="p-1 rounded cursor-pointer hover:bg-[var(--glass-hover)]"
                  style={{ color: "var(--danger)" }}
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}

          {availableQuestions.length > 0 && (
            <>
              {!addingQuestions ? (
                <button
                  onClick={() => setAddingQuestions(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all hover:bg-[var(--glass-hover)]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Plus size={12} /> Thêm câu hỏi từ ngân hàng
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Chọn câu hỏi để thêm:
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {availableQuestions.map((q) => (
                      <label
                        key={q.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--glass-hover)]"
                        style={{
                          background:
                            "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedQIds.includes(q.id)}
                          onChange={() => {
                            setSelectedQIds((prev) =>
                              prev.includes(q.id)
                                ? prev.filter((id) => id !== q.id)
                                : [...prev, q.id],
                            );
                          }}
                          className="size-3.5 accent-[var(--clr-primary)] cursor-pointer"
                        />
                        <span className="text-sm">{q.question}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddQuestions}
                      disabled={selectedQIds.length === 0 || saving}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                      style={{
                        background: "var(--clr-primary)",
                        color: "#fff",
                      }}
                    >
                      {saving ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        `Thêm (${selectedQIds.length})`
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setAddingQuestions(false);
                        setSelectedQIds([]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Add Exam Set Button ─── */
export function AddExamSetButton({
  flowId,
  allQuestions,
  onSuccess,
}: {
  flowId: string;
  allQuestions: MembershipSettings["quizQuestions"];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [passScore, setPassScore] = useState(9);
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !flowId) return;
    try {
      setSaving(true);
      await adminService.createExamSet({
        membershipFlowId: flowId,
        name: name.trim(),
        passScore,
        questionIds: selectedQIds,
      });
      onSuccess();
      setOpen(false);
      setName("");
      setPassScore(9);
      setSelectedQIds([]);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
        style={{
          background: "color-mix(in srgb, var(--clr-primary) 12%, transparent)",
          color: "var(--clr-primary)",
        }}
      >
        <Plus size={14} /> Thêm bộ đề
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Thêm bộ đề</h4>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background:
                "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              color: "var(--text-primary)",
              border: "0.5px solid var(--border-base)",
            }}
            placeholder="Tên bộ đề (VD: Đề 1)"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "var(--text-dim)" }}>
              Điểm đậu:
            </span>
            <input
              type="number"
              value={passScore}
              onChange={(e) => setPassScore(parseInt(e.target.value, 10) || 1)}
              className="w-24 px-3 py-2.5 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-center"
              style={{
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
                color: "var(--text-primary)",
                border: "0.5px solid var(--border-base)",
              }}
            />
          </div>
          {allQuestions.length > 0 && (
            <div>
              <p
                className="text-xs font-medium mb-1.5"
                style={{ color: "var(--text-dim)" }}
              >
                Chọn câu hỏi cho bộ đề (không bắt buộc):
              </p>
              <div
                className="max-h-40 overflow-y-auto space-y-1 rounded-xl p-2"
                style={{
                  background:
                    "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                }}
              >
                {allQuestions.map((q) => (
                  <label
                    key={q.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--glass-hover)]"
                    style={{
                      background:
                        "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQIds.includes(q.id)}
                      onChange={() =>
                        setSelectedQIds((prev) =>
                          prev.includes(q.id)
                            ? prev.filter((id) => id !== q.id)
                            : [...prev, q.id],
                        )
                      }
                      className="size-3.5 accent-[var(--clr-primary)] cursor-pointer"
                    />
                    <span className="text-sm">{q.question}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || !flowId}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
              style={{ background: "var(--clr-primary)", color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Tạo"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm cursor-pointer"
              style={{
                color: "var(--text-tertiary)",
                background:
                  "color-mix(in srgb, var(--text-primary) 5%, transparent)",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
