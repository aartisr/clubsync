import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryItem, ContributionMetric, AuditLogEvent, VercelDeploymentStatus, BranchPermissionRule, UserRole } from '../types';

// Fetchers
async function fetchRepositories(): Promise<RepositoryItem[]> {
  const res = await fetch('/api/repositories');
  if (!res.ok) {
    throw new Error('Failed to fetch repositories');
  }
  const data = await res.json();
  return data.repositories;
}

async function fetchContributions(): Promise<ContributionMetric[]> {
  const res = await fetch('/api/contributions');
  if (!res.ok) {
    throw new Error('Failed to fetch contributions');
  }
  const data = await res.json();
  return data.contributions;
}

async function fetchAuditLogs(): Promise<AuditLogEvent[]> {
  const res = await fetch('/api/audit-logs');
  if (!res.ok) {
    throw new Error('Failed to fetch audit logs');
  }
  const data = await res.json();
  return data.auditLogs;
}

async function fetchVercelStatus(): Promise<VercelDeploymentStatus> {
  const res = await fetch('/api/vercel/status');
  if (!res.ok) {
    throw new Error('Failed to fetch Vercel status');
  }
  const data = await res.json();
  return data.status;
}

// Hooks
export function useRepositories() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: fetchRepositories,
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: fetchContributions,
    staleTime: 15000,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: fetchAuditLogs,
    staleTime: 5000,
  });
}

export function useVercelStatus() {
  return useQuery({
    queryKey: ['vercel-status'],
    queryFn: fetchVercelStatus,
    staleTime: 10000,
  });
}

// Mutations
export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      subteam: string;
      clubOwnerId: string;
      description: string;
      visibility: 'private' | 'public';
      creatorName: string;
      creatorEmail: string;
      creatorRole: UserRole;
      githubOrg?: string;
      githubToken?: string;
    }) => {
      const res = await fetch('/api/repositories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create repository');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });
}

export function useUpdateBranchRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      repositoryId: string;
      branchRules: BranchPermissionRule[];
      updatedBy: string;
      userRole: UserRole;
    }) => {
      const res = await fetch(`/api/repositories/${payload.repositoryId}/branch-rules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchRules: payload.branchRules,
          updatedBy: payload.updatedBy,
          userRole: payload.userRole,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to update branch rules');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useUpdateVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      repositoryId: string;
      visibility: 'private' | 'public';
      requestedBy: string;
      approvedByAdvisor?: boolean;
      advisorEmail?: string;
    }) => {
      const res = await fetch(`/api/repositories/${payload.repositoryId}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Failed to update repository visibility');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useMasterOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      repositoryId: string;
      actionType: 'lock_all_branches' | 'approve_public_showcase' | 'revoke_public_access';
      performedBy: string;
      reason: string;
    }) => {
      const res = await fetch('/api/oversight/master-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Master override action failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}

export function useTriggerVercelDeploy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/vercel/deploy-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Failed to trigger Vercel deployment');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vercel-status'] });
    },
  });
}

export function useSyncGitHubOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orgName: string; token?: string }) => {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to sync with GitHub API');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
}
