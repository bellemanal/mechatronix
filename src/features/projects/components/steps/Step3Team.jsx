import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Trash2, Github, Linkedin, User, Briefcase, Mail, Phone, Camera, X } from 'lucide-react'
import { useProjectStore } from '../../projectStore'
import { useAvatarUpload } from '../../hooks/useUpload'

const ROLES = [
  'Project Lead', 'Hardware Engineer', 'Software Engineer', 'AI Engineer',
  'Robotics Engineer', 'Electronics Engineer', 'Mechanical Engineer',
  'UI/UX Designer', 'Research Engineer', 'Other',
]

function AvatarUpload({ member, onUpdate }) {
  const inputRef = useRef()
  const { upload, uploading } = useAvatarUpload({
    onSet: (url) => {
      if (url) onUpdate(member.id, { avatar: url })
    },
  })

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-bold text-base">
          {member.name ? member.name.charAt(0).toUpperCase() : '?'}
        </div>
      )}

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-brand-50 hover:border-brand-300 transition-all"
      >
        {uploading
          ? <div className="w-3 h-3 border border-brand-500 border-t-transparent rounded-full animate-spin"/>
          : <Camera size={10} className="text-gray-500"/>
        }
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && upload(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}

function RoleSelector({ member, onUpdate }) {
  const roles = Array.isArray(member.roles) ? member.roles : member.role ? [member.role] : []

  const addRole = (role) => {
    if (!role || roles.includes(role) || roles.length >= 3) return
    onUpdate(member.id, { roles: [...roles, role] })
  }

  const removeRole = (role) => {
    onUpdate(member.id, { roles: roles.filter(r => r !== role) })
  }

  return (
    <div>
      {roles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {roles.map(r => (
            <span key={r} className="flex items-center gap-1 px-2 py-1 bg-brand-50 border border-brand-200 text-brand-700 rounded-lg text-xs font-medium">
              {r}
              <button onClick={() => removeRole(r)} className="hover:text-danger-500 transition-colors">
                <X size={10}/>
              </button>
            </span>
          ))}
        </div>
      )}

      {roles.length < 3 && (
        <div className="relative">
          <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <select
            value=""
            onChange={(e) => addRole(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">
              {roles.length === 0 ? 'Select role...' : 'Add another role...'}
            </option>
            {ROLES.filter(r => !roles.includes(r)).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

function MemberCard({ member, index, onUpdate, onRemove, canRemove }) {
  const roles = Array.isArray(member.roles) ? member.roles : member.role ? [member.role] : []
  const roleLabel = roles.length > 0 ? roles.join(', ') : 'No role set'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="relative bg-white rounded-2xl border border-gray-200 p-5 shadow-card"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <AvatarUpload member={member} onUpdate={onUpdate}/>
          {member.isAuthor && (
            <div className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
              You
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {member.name || `Team Member ${index + 1}`}
          </p>
          <p className="text-xs text-gray-400 truncate">{roleLabel}</p>
        </div>
        {canRemove && !member.isAuthor && (
          <button
            onClick={() => onRemove(member.id)}
            className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-danger-500 hover:border-danger-200 hover:bg-danger-50 transition-all duration-150"
          >
            <Trash2 size={14}/>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            value={member.name}
            onChange={(e) => onUpdate(member.id, { name: e.target.value })}
            placeholder={member.isAuthor ? 'Your full name' : 'Full name'}
            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
        </div>

        <RoleSelector member={member} onUpdate={onUpdate}/>

        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="email"
            value={member.email || ''}
            onChange={(e) => onUpdate(member.id, { email: e.target.value })}
            placeholder="email@example.com"
            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
        </div>

        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="tel"
            value={member.phone || ''}
            onChange={(e) => onUpdate(member.id, { phone: e.target.value })}
            placeholder="+1 234 567 8900"
            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              value={member.github || ''}
              onChange={(e) => onUpdate(member.id, { github: e.target.value })}
              placeholder="github.com/..."
              className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              value={member.linkedin || ''}
              onChange={(e) => onUpdate(member.id, { linkedin: e.target.value })}
              placeholder="linkedin.com/in/..."
              className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Step3Team({ onNext, onPrev }) {
  const { form, addTeamMember, updateTeamMember, removeTeamMember } = useProjectStore()
  const canAdd    = form.teamMembers.length < 5
  const canRemove = form.teamMembers.length > 1

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
        <p className="text-sm text-brand-700 font-medium">
          Add the people who worked on this project. Each member can have up to 3 roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {form.teamMembers.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              onUpdate={updateTeamMember}
              onRemove={removeTeamMember}
              canRemove={canRemove}
            />
          ))}
        </AnimatePresence>

        {canAdd && (
          <motion.button
            layout
            onClick={addTeamMember}
            className="min-h-[200px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
              <UserPlus size={22} className="group-hover:text-brand-500 transition-colors"/>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Add Team Member</p>
              <p className="text-xs text-gray-400 mt-0.5">{5 - form.teamMembers.length} slots remaining</p>
            </div>
          </motion.button>
        )}
      </div>

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