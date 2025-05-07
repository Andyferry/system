import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private supabase: SupabaseService) {  }





  async getRutas(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('ruta')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener rutas', error);
      return [];
    }
    return data as any[];
  }
  // 🔍 Buscar ruta por ID
  async getRutaById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('ruta')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar ruta id=${id}`, error);
      return null;
    }
    return data;
  }

  // ➕ Crear nuevo ruta
  async addRuta(ruta: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('ruta')
      .insert(ruta)
      .single();

    if (error) {
      console.error('Error al crear ruta', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar ruta existente
  async updateRuta(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('ruta')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar ruta id=${id}`, error);
      return null;
    }
    return data;
  }

  // ❌ Eliminar ruta
  async deleteRuta(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('ruta')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar ruta id=${id}`, error);
      return false;
    }
    return true;
  }



}
