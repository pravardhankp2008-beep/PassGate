import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { TeamMember } from '../../types';
import { UserPlus, AtSign } from 'lucide-react';

export const InviteMemberModal: React.FC = () => {
  const { isInviteModalOpen, setIsInviteModalOpen, addTeamMember, team } = useApp();

  const [handle, setHandle] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Algorithm Specialist');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    addTeamMember(handle.trim(), role);
    setHandle('');
    setIsInviteModalOpen(false);
  };

  return (
    <Modal
      isOpen={isInviteModalOpen}
      onClose={() => setIsInviteModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#00c2e8]" />
          <span className="font-extrabold text-[#0d0e1e]">Invite Teammate to {team.name}</span>
        </div>
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[#191a2b]">
        <p className="text-xs text-[#5a647e]">
          Assemble your 4-player squad for the Stage 2 Regional Relays and 24-Hour Systems Marathon.
        </p>

        <div>
          <label className="block text-xs font-bold text-[#2d314e] uppercase tracking-wider mb-1.5 font-mono">
            Racer ByteRace Handle
          </label>
          <div className="relative">
            <AtSign className="w-4 h-4 text-[#6c797e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. TurboCoder or RustNinja"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              className="w-full bg-indigo-50/60 border border-indigo-200/80 rounded-full pl-10 pr-4 py-2.5 text-sm text-[#0d0e1e] placeholder-[#6c797e] focus:outline-none focus:border-[#00c2e8] font-sans font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2d314e] uppercase tracking-wider mb-1.5 font-mono">
            Squad Tactical Specialization
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-indigo-50/60 border border-indigo-200/80 rounded-full px-4 py-2.5 text-sm text-[#0d0e1e] focus:outline-none focus:border-[#00c2e8] font-sans font-medium"
          >
            <option value="Algorithm Specialist">Algorithm Specialist (DP & Graph Lead)</option>
            <option value="Optimizer">Optimizer (Zero-Allocation & Cache Locality)</option>
            <option value="Strategist">Strategist (Problem Selection & Time Mgmt)</option>
            <option value="Captain">Co-Captain</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsInviteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Send Squad Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
