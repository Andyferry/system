import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';
import { SupabaseService } from './Supabase.service'; 
@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  constructor(private supabase: SupabaseService) {  }


  async getClienteByCedula(cedula: string): Promise<any|null> {
    const { data, error } = await this.supabase.client
      .from('cliente')
      .select('*')
      .eq('cedula', cedula)
      .single();
    if (error) return null;
    return data;
  }


  async getClientes(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('cliente')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al obtener Clientes', error);
      return [];
    }
    return data as any[];
  }
  // 🔍 Buscar cliente por ID
  async getClienteById(id: number): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('cliente')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al buscar cliente id=${id}`, error);
      return null;
    }
    return data;
  }

  // ➕ Crear nuevo cliente
  async addCliente(cliente: Omit<any, 'id'>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('cliente')
      .insert(cliente)
      .single();

    if (error) {
      console.error('Error al crear cliente', error);
      return null;
    }
    return data;
  }

  // ✏️ Actualizar cliente existente
  async updateCliente(id: number, cambios: Partial<any>): Promise<any | null> {
    const { data, error } = await this.supabase.client
      .from('cliente')
      .update(cambios)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al actualizar cliente id=${id}`, error);
      return null;
    }
    return data;
  }

  // ❌ Eliminar cliente
  async deleteCliente(id: number): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('cliente')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar cliente id=${id}`, error);
      return false;
    }
    return true;
  }



}
