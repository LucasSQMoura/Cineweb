import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Lanche, lancheSchema } from '../types';

const Lanches = () => {
  const [lanches, setLanches] = useState<Lanche[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(lancheSchema)
  });

  const loadLanches = async () => {
    try {
      const res = await api.get('/lanches');
      setLanches(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { loadLanches(); }, []);

  const onSubmit = async (data: any) => {
    try {
      await api.post('/lanches', data);
      reset();
      loadLanches();
    } catch (error) { console.error(error); }
  };

  const deleteLanche = async (id: string) => {
    if (confirm("Excluir lanche?")) {
      await api.delete(`/lanches/${id}`);
      loadLanches();
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Lanches (Bomboniere)</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-4 border p-3 rounded">
        <div className="col-md-4">
          <label className="form-label">Nome do Combo</label>
          <input {...register('nome')} className={`form-control ${errors.nome ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.nome?.message as string}</div>
        </div>
        
        <div className="col-md-3">
          <label className="form-label">Preço (R$)</label>
          <input type="number" step="0.01" {...register('valor')} className={`form-control ${errors.valor ? 'is-invalid' : ''}`} />
        </div>

        <div className="col-md-2">
          <label className="form-label">Qtd Itens</label>
          <input type="number" {...register('qtUnidade')} className={`form-control ${errors.qtUnidade ? 'is-invalid' : ''}`} />
        </div>

        <div className="col-md-12">
            <label className="form-label">Descrição</label>
            <input {...register('descricao')} className="form-control" placeholder="Ex: Pipoca G + Refri" />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-warning w-100">Cadastrar Lanche</button>
        </div>
      </form>

      <div className="row">
        {lanches.map(lanche => (
          <div key={lanche.id} className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{lanche.nome}</h5>
                <p className="card-text text-muted">{lanche.descricao}</p>
                <h4 className="text-success">R$ {Number(lanche.valor).toFixed(2)}</h4>
                <button onClick={() => deleteLanche(lanche.id)} className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lanches;