import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private supabase: SupabaseService) {  }





  async getUsuarios(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener usuarios', error);
      return [];
    }
    return data as any[];
  }
  // 🔍 Buscar usuario por ID
  async getUsuarioById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar usuario id=${id}`, error);
      return null;
    }
    return data;
  }

  // ➕ Crear nuevo usuario
  async addUsuario(usuario: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .insert(usuario)
      .single();

    if (error) {
      console.error('Error al crear usuario', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar usuario existente
  async updateUsuario(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar usuario id=${id}`, error);
      return null;
    }
    return data;
  }

  // ❌ Eliminar usuario
  async deleteUsuario(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('usuario')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar usuario id=${id}`, error);
      return false;
    }
    return true;
  }



}
