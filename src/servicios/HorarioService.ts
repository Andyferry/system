import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private supabase: SupabaseService) {  }





  async getHorarios(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('horario')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener horarios', error);
      return [];
    }
    return data as any[];
  }
  // 🔍 Buscar horario por ID
  async getHorarioById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('horario')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar horario id=${id}`, error);
      return null;
    }
    return data;
  }

  // ➕ Crear nuevo horario
  async addHorario(horario: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('horario')
      .insert(horario)
      .single();

    if (error) {
      console.error('Error al crear horario', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar horario existente
  async updateHorario(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('horario')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar horario id=${id}`, error);
      return null;
    }
    return data;
  }

  // ❌ Eliminar horario
  async deleteHorario(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('horario')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar horario id=${id}`, error);
      return false;
    }
    return true;
  }



}
