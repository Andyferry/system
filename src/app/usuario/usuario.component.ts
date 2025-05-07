import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/UsuarioService';  

interface Usuario {
  id?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  cargo: string;
  clave: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  form: FormGroup;
  usuarios: Usuario[] = [];
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      cedula:    ['', [Validators.required, Validators.minLength(5)]],
      nombres:   ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono:  [''],
      correo:    ['', [Validators.email]],
      direccion: [''],
      cargo:     ['', Validators.required],
      clave:     ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.usuarios = await this.usuarioService.getUsuarios();
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Usuario = this.form.value;

    try {
      if (this.editingId != null) {
        await this.usuarioService.updateUsuario(this.editingId, data);
      } else {
        await this.usuarioService.addUsuario(data);
      }
      this.cancelEdit();
      await this.loadAll();
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error guardando usuario.';
    }
  }

  edit(item: Usuario) {
    this.editingId = item.id!;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    await this.usuarioService.deleteUsuario(id);
    await this.loadAll();
  }

  async search() {
    if (!this.searchId) return this.loadAll();
    const u = await this.usuarioService.getUsuarioById(this.searchId);
    this.usuarios = u ? [u] : [];
  }
}
