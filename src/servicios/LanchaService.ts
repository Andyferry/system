import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
@Injectable({
  providedIn: 'root'
})
export class LanchaService {

  constructor(private supabase: SupabaseService) { }





  async getLanchas(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('lancha')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener lanchas', error);
      return [];
    }
    return data as any[];
  }

/** En LanchaService */
async getLanchasDisponibles(): Promise<any[]> {
  const { data, error } = await this.supabase.client
    .from('lancha')
    .select('*')
    .eq('estado', 'disponible')            // ← sólo las lanchas disponibles
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener lanchas disponibles', error);
    return [];
  }
  return data as any[];
}






  // 🔍 Buscar lancha por ID
  async getLanchaById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('lancha')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar lancha id=${id}`, error);
      return null;
    }
    return data;
  }

  // ➕ Crear nuevo lancha
  async addLancha(lancha: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('lancha')
      .insert(lancha)
      .single();

    if (error) {
      console.error('Error al crear lancha', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar lancha existente
  async updateLancha(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('lancha')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar lancha id=${id}`, error);
      return null;
    }
    return data;
  }


  /** Pone el estado de la lancha a "ocupado" */
  async ocuparLancha(id: number): Promise<any | null> {
    return this.updateLancha(id, { estado: 'ocupado' });
  }
  async ocuparLancha2(id: number): Promise<any | null> {
    return this.updateLancha(id, { estado: 'disponible' });
  }




  // ❌ Eliminar lancha
  async deleteLancha(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('lancha')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar lancha id=${id}`, error);
      return false;
    }
    return true;
  }



}
