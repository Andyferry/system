import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ClienteService } from '../../servicios/ClienteService';  

interface Cliente {
  id?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ,FormsModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  form: FormGroup;
  clientes: Cliente[] = [];
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';pageSize = 20;
  currentPage = 1;
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.clientes.length / this.pageSize));
  }
  get pagedClientes(): Cliente[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.clientes.slice(start, start + this.pageSize);
  }
  
  // 2) Métodos de navegación
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.form = this.fb.group({
      cedula:    ['', [Validators.required, Validators.minLength(5)]],
      nombres:   ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono:  [''],
      correo:    ['', [Validators.email]],
      direccion: ['']
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.clientes = await this.clienteService.getClientes();
    this.currentPage = 1;
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Cliente = this.form.value;

    try {
      if (this.editingId != null) {
        await this.clienteService.updateCliente(this.editingId, data);
      } else {
        await this.clienteService.addCliente(data);
      }
      this.cancelEdit();
      await this.loadAll();
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Ocurrió un error guardando el cliente.';
    }
  }

  edit(item: Cliente) {
    this.editingId = item.id!;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar este cliente?')) return;
    await this.clienteService.deleteCliente(id);
    await this.loadAll();
  }

  async search() {
    if (!this.searchId) return this.loadAll();
    const item = await this.clienteService.getClienteById(this.searchId);
    this.clientes = item ? [item] : [];
    this.currentPage = 1;
  }
}
