import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ShiftReport } from '@/types'

export function useShiftReports() {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['shift-reports', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return []

      const { data, error } = await supabase
        .from('shift_reports')
        .select(`
          *,
          submitted_by_profile:profiles!shift_reports_submitted_by_fkey(first_name, last_name),
          reviewed_by_profile:profiles!shift_reports_reviewed_by_fkey(first_name, last_name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('report_date', { ascending: false })

      if (error) throw error
      return data as ShiftReport[]
    },
    enabled: !!profile?.organization_id,
  })
}

export function useShiftReport(id: string | undefined) {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['shift-report', id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from('shift_reports')
        .select(`
          *,
          submitted_by_profile:profiles!shift_reports_submitted_by_fkey(first_name, last_name, email),
          reviewed_by_profile:profiles!shift_reports_reviewed_by_fkey(first_name, last_name, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id && !!profile?.organization_id,
  })
}

export function useCreateShiftReport() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (report: Partial<ShiftReport>) => {
      if (!profile?.organization_id) throw new Error('No organization')

      const { data, error } = await supabase
        .from('shift_reports')
        .insert({
          ...report,
          organization_id: profile.organization_id,
          submitted_by: profile.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-reports'] })
    },
  })
}

export function useUpdateShiftReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShiftReport> }) => {
      const { data, error } = await supabase
        .from('shift_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shift-reports'] })
      queryClient.invalidateQueries({ queryKey: ['shift-report', variables.id] })
    },
  })
}

export function useDeleteShiftReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shift_reports')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-reports'] })
    },
  })
}

// Real-time subscription hook
export function useShiftReportsSubscription() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!profile?.organization_id) return

    const channel = supabase
      .channel('shift-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shift_reports',
          filter: `organization_id=eq.${profile.organization_id}`,
        },
        () => {
          // Invalidate queries when data changes
          queryClient.invalidateQueries({ queryKey: ['shift-reports'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile?.organization_id, queryClient])
}
