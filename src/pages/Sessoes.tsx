import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Sessao, type Filme, type Sala, sessaoSchema } from '../types';

const Sessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Sessao, 'id'>>({
    resolver: zodResolver(sessaoSchema)
  });

  const loadData = async () => {
    const [resSessoes, resFilmes, resSalas] = await Promise.all([
      api.get('/sessoes'),
      api.get('/filmes'),
      api.get('/salas')
    ]);
    setSessoes(resSessoes.data);
    setFilmes(resFilmes.data);
    setSalas(resSalas.data);
  };

  useEffect(() => { loadData(); }, []);

  const onSubmit = async (data: Omit<Sessao, 'id'>) => {
    await api.post('/sessoes', data);
    reset();
    loadData();
  };

  // Venda de Ingressos [cite: 97, 98]
  const venderIngresso = async (sessaoId: string) => {
    const tipo = prompt("Digite 1 para INTEIRA ou 2 para MEIA");
    if(!tipo) return;
    
    const valorBase = 60.00;
    const ehInteira = tipo === "1";
    const valorFinal = ehInteira ? valorBase : valorBase / 2;

    const novoIngresso = {
      sessaoId,
      tipo: ehInteira ? 'INTEIRA' : 'MEIA',
      valor: valorFinal
    };

    await api.post('/ingressos', novoIngresso);
    alert(`Ingresso vendido! Valor: R$ ${valorFinal.toFixed(2)}`);
  };

  // Helpers para cruzar dados (ID -> Nome) [cite: 78]
  const getFilmeTitulo = (id: string) => filmes.find(f => f.id === id)?.titulo || 'Desconhecido';
  const getSalaNumero = (id: string) => salas.find(s => s.id === id)?.numero || '?';

  return (
    <div className="container">
      <h2>Agendamento de Sessões</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 border p-3 rounded">
        <div className="col-md-4">
          <label>Filme</label>
          <select {...register('filmeId')} className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}>
            <option value="">Selecione...</option>
            {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>
          <div className="invalid-feedback">{errors.filmeId?.message}</div>
        </div>

        <div className="col-md-4">
          <label>Sala</label>
          <select {...register('salaId')} className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}>
            <option value="">Selecione...</option>
            {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero}</option>)}
          </select>
          <div className="invalid-feedback">{errors.salaId?.message}</div>
        </div>

        <div className="col-md-4">
          <label>Data e Hora</label>
          <input type="datetime-local" {...register('dataHora')} className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.dataHora?.message}</div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Agendar Sessão</button>
        </div>
      </form>

      <h3>Sessões Agendadas</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Filme</th>
            <th>Sala</th>
            <th>Horário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sessoes.map(sessao => (
            <tr key={sessao.id}>
              <td>{getFilmeTitulo(sessao.filmeId)}</td>
              <td>{getSalaNumero(sessao.salaId)}</td>
              <td>{new Date(sessao.dataHora).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => venderIngresso(sessao.id)} 
                  className="btn btn-success btn-sm"
                >
                  <i className="bi bi-ticket-perforated"></i> Vender Ingresso
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sessoes;