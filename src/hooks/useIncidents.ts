import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Incident } from '@/types'

export function useIncidents() {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['incidents', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return []

      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reported_by_profile:profiles!incidents_reported_by_fkey(first_name, last_name),
          reviewed_by_profile:profiles!incidents_reviewed_by_fkey(first_name, last_name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('occurred_at', { ascending: false })

      if (error) throw error
      return data as Incident[]
    },
    enabled: !!profile?.organization_id,
  })
}

export function useIncident(id: string | undefined) {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reported_by_profile:profiles!incidents_reported_by_fkey(first_name, last_name, email),
          reviewed_by_profile:profiles!incidents_reviewed_by_fkey(first_name, last_name, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id && !!profile?.organization_id,
  })
}

export function useCreateIncident() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (incident: Partial<Incident>) => {
      if (!profile?.organization_id) throw new Error('No organization')

      const { data, error } = await supabase
        .from('incidents')
        .insert({
          ...incident,
          organization_id: profile.organization_id,
          reported_by: profile.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Incident> }) => {
      const { data, error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', variables.id] })
    },
  })
}

export function useDeleteIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

// Real-time subscription hook
export function useIncidentsSubscription() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!profile?.organization_id) return

    const channel = supabase
      .channel('incidents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
          filter: `organization_id=eq.${profile.organization_id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['incidents'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile?.organization_id, queryClient])
}
