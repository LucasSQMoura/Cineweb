import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Sala, salaSchema } from '../types';
import { z } from 'zod';

type SalaFormData = z.input<typeof salaSchema>;

const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SalaFormData>({
    resolver: zodResolver(salaSchema)
  });

  const loadSalas = async () => {
    try {
      const res = await api.get<Sala[]>('/salas');
      setSalas(res.data);
    } catch (error) {
      console.error("Erro ao carregar salas", error);
    }
  };

  useEffect(() => { loadSalas(); }, []);

  const onSubmit = async (data: SalaFormData) => {
    try {
      await api.post('/salas', {
        numero: String(data.numero),
        capacidade: Number(data.capacidade)
      });

      reset();
      loadSalas();
    } catch (error) {
      console.error("Erro ao salvar sala", error);
    }
  };

  const deleteSala = async (id: string) => {
    if (confirm("Deseja excluir esta sala?")) {
      try {
        await api.delete(`/salas/${id}`);
        loadSalas();
      } catch (error) {
        console.error("Erro ao excluir", error);
      }
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Salas</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-4 align-items-end p-3 border rounded">
        <div className="col-md-4">
          <label className="form-label">Número da Sala</label>
          <input 
            type="number" 
            {...register('numero')} 
            className={`form-control ${errors.numero ? 'is-invalid' : ''}`} 
          />
          <div className="invalid-feedback">{errors.numero?.message as string}</div>
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Capacidade</label>
          <input 
            type="number" 
            {...register('capacidade')} 
            className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} 
          />
          <div className="invalid-feedback">{errors.capacidade?.message as string}</div>
        </div>
        
        <div className="col-md-4">
          <button type="submit" className="btn btn-success w-100">
            Cadastrar Sala
          </button>
        </div>
      </form>

      <ul className="list-group">
        {salas.map(sala => (
          <li key={sala.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Sala {sala.numero}</strong> 
              <span className="text-muted ms-2">(Capacidade: {sala.capacidade} pessoas)</span>
            </div>
            <button onClick={() => deleteSala(String(sala.id))} className="btn btn-outline-danger btn-sm">
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Salas;