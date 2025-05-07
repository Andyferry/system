import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HorarioService } from '../../servicios/HorarioService';  

interface Horario {
  id?: number;
  hora_salida: string;   // formato "HH:mm"
  notas?: string;
  estado: boolean;

}

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  form: FormGroup;
  horarios: Horario[] = [];
  editingId: number | null = null;
  searchId: number | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService
  ) {
    this.form = this.fb.group({
      hora_salida:   ['', Validators.required],
      notas:         [''],
      estado:        [true]
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.horarios = await this.horarioService.getHorarios();
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const data: Horario = this.form.value;

    try {
      if (this.editingId != null) {
        await this.horarioService.updateHorario(this.editingId, data);
      } else {
        await this.horarioService.addHorario(data);
      }
      this.cancelEdit();
      await this.loadAll();
    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error guardando horario.';
    }
  }

  edit(item: Horario) {
    this.editingId = item.id!;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ estado: true });
  }

  async delete(id: number) {
    if (!confirm('¿Eliminar este horario?')) return;
    await this.horarioService.deleteHorario(id);
    await this.loadAll();
  }

  async search() {
    if (!this.searchId) return this.loadAll();
    const h = await this.horarioService.getHorarioById(this.searchId);
    this.horarios = h ? [h] : [];
  }
}
