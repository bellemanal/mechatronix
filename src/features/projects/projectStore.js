import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const INITIAL_FORM = {
  // Step 1 — Basic Info
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  difficulty: '',
  tags: [],

  // Step 2 — Media
  coverImage: null,        // { file, preview, url, uploading, error }
  images: [],              // [{ id, file, preview, url, uploading, progress, error }]
  videoUrl: '',
  videoFile: null,
  files: [],               // [{ id, file, name, size, type, url, uploading, progress }]

  // Step 3 — Team
  teamMembers: [
    { id: 'author', name: '', role: 'Project Lead', github: '', linkedin: '', avatar: null, isAuthor: true },
  ],

  // Step 4 — Details
  problem: '',
  solution: '',
  features: [],
  technologies: [],
  challenges: '',
  futureImprovements: '',

  // Step 5 — Links
  links: [],               // [{ id, label, url, icon }]

  // Meta
  published: false,
  isDraft: false,
  projectId: null,         // set after first save
}

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // ── Form Data ──────────────────────────────────────────────────────────
      form: { ...INITIAL_FORM },

      // ── Navigation ────────────────────────────────────────────────────────
      currentStep: 1,
      totalSteps: 6,
      completedSteps: new Set(),
      isSubmitting: false,
      isSavingDraft: false,
      lastSavedAt: null,

      // ── Setters ───────────────────────────────────────────────────────────
      setField: (field, value) =>
        set((s) => ({ form: { ...s.form, [field]: value } })),

      setFields: (updates) =>
        set((s) => ({ form: { ...s.form, ...updates } })),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((s) => {
          const next = Math.min(s.currentStep + 1, s.totalSteps)
          const completed = new Set(s.completedSteps)
          completed.add(s.currentStep)
          return { currentStep: next, completedSteps: completed }
        }),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      markStepComplete: (step) =>
        set((s) => {
          const completed = new Set(s.completedSteps)
          completed.add(step)
          return { completedSteps: completed }
        }),

      // ── Tags ──────────────────────────────────────────────────────────────
      addTag: (tag) =>
        set((s) => {
          const trimmed = tag.trim().toLowerCase()
          if (!trimmed || s.form.tags.includes(trimmed) || s.form.tags.length >= 10) return s
          return { form: { ...s.form, tags: [...s.form.tags, trimmed] } }
        }),

      removeTag: (tag) =>
        set((s) => ({ form: { ...s.form, tags: s.form.tags.filter((t) => t !== tag) } })),

      // ── Features ──────────────────────────────────────────────────────────
      addFeature: (feature) =>
        set((s) => {
          const trimmed = feature.trim()
          if (!trimmed || s.form.features.includes(trimmed)) return s
          return { form: { ...s.form, features: [...s.form.features, trimmed] } }
        }),

      removeFeature: (feature) =>
        set((s) => ({ form: { ...s.form, features: s.form.features.filter((f) => f !== feature) } })),

      // ── Technologies ──────────────────────────────────────────────────────
      addTechnology: (tech) =>
        set((s) => {
          const trimmed = tech.trim()
          if (!trimmed || s.form.technologies.includes(trimmed)) return s
          return { form: { ...s.form, technologies: [...s.form.technologies, trimmed] } }
        }),

      removeTechnology: (tech) =>
        set((s) => ({ form: { ...s.form, technologies: s.form.technologies.filter((t) => t !== tech) } })),

      // ── Images ────────────────────────────────────────────────────────────
      setCoverImage: (img) =>
        set((s) => ({ form: { ...s.form, coverImage: img } })),

      addImage: (img) =>
        set((s) => ({ form: { ...s.form, images: [...s.form.images, img] } })),

      updateImage: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            images: s.form.images.map((img) => (img.id === id ? { ...img, ...updates } : img)),
          },
        })),

      removeImage: (id) =>
        set((s) => ({
          form: { ...s.form, images: s.form.images.filter((img) => img.id !== id) },
        })),

      // ── Files ─────────────────────────────────────────────────────────────
      addFile: (file) =>
        set((s) => ({ form: { ...s.form, files: [...s.form.files, file] } })),

      updateFile: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            files: s.form.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
          },
        })),

      removeFile: (id) =>
        set((s) => ({ form: { ...s.form, files: s.form.files.filter((f) => f.id !== id) } })),

      // ── Team Members ──────────────────────────────────────────────────────
      addTeamMember: () =>
        set((s) => {
          if (s.form.teamMembers.length >= 5) return s
          return {
            form: {
              ...s.form,
              teamMembers: [
                ...s.form.teamMembers,
                { id: crypto.randomUUID(), name: '', role: '', github: '', linkedin: '', avatar: null, isAuthor: false },
              ],
            },
          }
        }),

      updateTeamMember: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            teamMembers: s.form.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
          },
        })),

      removeTeamMember: (id) =>
        set((s) => ({
          form: {
            ...s.form,
            teamMembers: s.form.teamMembers.filter((m) => m.id !== id),
          },
        })),

      // ── Links ─────────────────────────────────────────────────────────────
      addLink: (link) =>
        set((s) => ({
          form: {
            ...s.form,
            links: [...s.form.links, { id: crypto.randomUUID(), ...link }],
          },
        })),

      updateLink: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            links: s.form.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
          },
        })),

      removeLink: (id) =>
        set((s) => ({ form: { ...s.form, links: s.form.links.filter((l) => l.id !== id) } })),

      // ── Draft / Submit state ──────────────────────────────────────────────
      setSubmitting: (v) => set({ isSubmitting: v }),
      setSavingDraft: (v) => set({ isSavingDraft: v }),
      setLastSavedAt: (v) => set({ lastSavedAt: v }),
      setProjectId: (id) => set((s) => ({ form: { ...s.form, projectId: id } })),

      // ── Reset ─────────────────────────────────────────────────────────────
      resetForm: () =>
        set({
          form: { ...INITIAL_FORM },
          currentStep: 1,
          completedSteps: new Set(),
          isSubmitting: false,
          isSavingDraft: false,
          lastSavedAt: null,
        }),
    }),
    {
      name: 'mechatronix-project-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        form: {
          ...s.form,
          // Don't persist File objects (not serializable)
          coverImage: s.form.coverImage
            ? { ...s.form.coverImage, file: null }
            : null,
          images: s.form.images.map((img) => ({ ...img, file: null })),
          files: s.form.files.map((f) => ({ ...f, file: null })),
        },
        currentStep: s.currentStep,
        lastSavedAt: s.lastSavedAt,
      }),
    },
  ),
)