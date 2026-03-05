import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ChemistryReading {
  id: string
  organization_id: string
  pool_name: string
  reading_time: string
  tested_by: string | null
  tester_name: string
  free_chlorine: number
  combined_chlorine: number | null
  ph_level: number
  alkalinity: number | null
  water_temp: number
  cyanuric_acid: number | null
  status: 'in_range' | 'warning' | 'out_of_range'
  chemicals_added: string | null
  notes: string | null
  created_at: string
}

export function useChemistryReadings(poolName?: string, date?: string) {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['chemistry-readings', profile?.organization_id, poolName, date],
    queryFn: async () => {
      if (!profile?.organization_id) return []

      let query = supabase
        .from('chemistry_readings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('reading_time', { ascending: false })

      if (poolName) {
        query = query.eq('pool_name', poolName)
      }

      if (date) {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        query = query
          .gte('reading_time', startOfDay.toISOString())
          .lte('reading_time', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      return data as ChemistryReading[]
    },
    enabled: !!profile?.organization_id,
  })
}

export function useCreateChemistryReading() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reading: Omit<ChemistryReading, 'id' | 'organization_id' | 'created_at'>) => {
      if (!profile?.organization_id) throw new Error('No organization')

      // Calculate status based on values
      const status = calculateStatus(reading)

      const { data, error } = await supabase
        .from('chemistry_readings')
        .insert({
          ...reading,
          organization_id: profile.organization_id,
          tested_by: profile.id,
          status,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chemistry-readings'] })
    },
  })
}

function calculateStatus(reading: Partial<ChemistryReading>): 'in_range' | 'warning' | 'out_of_range' {
  const { free_chlorine, ph_level } = reading

  // Check if values are critically out of range
  if (
    (free_chlorine && (free_chlorine < 1.0 || free_chlorine > 10.0)) ||
    (ph_level && (ph_level < 6.8 || ph_level > 8.2))
  ) {
    return 'out_of_range'
  }

  // Check if values are in warning range
  if (
    (free_chlorine && (free_chlorine < 2.0 || free_chlorine > 5.0)) ||
    (ph_level && (ph_level < 7.2 || ph_level > 7.8))
  ) {
    return 'warning'
  }

  return 'in_range'
}

export function useChemistryTrends(poolName: string, days: number = 7) {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['chemistry-trends', profile?.organization_id, poolName, days],
    queryFn: async () => {
      if (!profile?.organization_id) return []

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('chemistry_readings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('pool_name', poolName)
        .gte('reading_time', startDate.toISOString())
        .order('reading_time', { ascending: true })

      if (error) throw error
      return data as ChemistryReading[]
    },
    enabled: !!profile?.organization_id && !!poolName,
  })
}
