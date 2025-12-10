import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Sala, salaSchema } from '../types';

const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  
  // CORREÇÃO: Removemos a tipagem manual <Omit<Sala, 'id'>>
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(salaSchema)
  });

  const loadSalas = async () => {
    try {
      const res = await api.get('/salas');
      setSalas(res.data);
    } catch (error) {
      console.error("Erro ao carregar salas", error);
    }
  };

  useEffect(() => { loadSalas(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/salas', data);
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
      
      {/* Formulário */}
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
            <i className="bi bi-plus-circle"></i> Cadastrar Sala
          </button>
        </div>
      </form>

      {/* Lista */}
      <ul className="list-group">
        {salas.map(sala => (
          <li key={sala.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Sala {sala.numero}</strong> 
              <span className="text-muted ms-2">(Capacidade: {sala.capacidade} pessoas)</span>
            </div>
            <button onClick={() => deleteSala(sala.id)} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Salas;