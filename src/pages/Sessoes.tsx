import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import {
  type Sessao,
  type Filme,
  type Sala,
  sessaoSchema
} from '../types';
import { z } from 'zod';

type SessaoFormData = z.infer<typeof sessaoSchema>;

const Sessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SessaoFormData>({
    resolver: zodResolver(sessaoSchema)
  });

  const loadData = async () => {
    try {
      const [resSessoes, resFilmes, resSalas] = await Promise.all([
        api.get('/sessoes'),
        api.get('/filme'),
        api.get('/salas')
      ]);

      setSessoes(resSessoes.data);
      setFilmes(resFilmes.data);
      setSalas(resSalas.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: SessaoFormData) => {
    try {
      const payload = {
        ...data,
        filmeId: Number(data.filmeId),
        salaId: Number(data.salaId),
        valorIngresso: Number(data.valorIngresso),
        data: new Date(data.data).toISOString(),
      };

      await api.post('/sessoes', payload);

      reset();
      loadData();
    } catch (error: any) {
      console.error('Erro ao criar sessão:', error.response?.data || error);
    }
  };

  const venderIngresso = async (sessao: Sessao) => {
    const tipoInteira = window.confirm('OK = Inteira | Cancelar = Meia');

    const valorBase = sessao.valorIngresso;
    const valorFinal = tipoInteira ? valorBase : valorBase / 2;

    try {
      await api.post('/ingressos', {
        sessaoId: sessao.id,
        tipo: tipoInteira ? 'INTEIRA' : 'MEIA',
        valorPago: valorFinal
      });

      alert(`Ingresso vendido! Valor: R$ ${valorFinal.toFixed(2)}`);
    } catch (error) {
      console.error('Erro ao vender ingresso:', error);
    }
  };

  const getFilmeNome = (id: number) =>
    filmes.find(f => Number(f.id) === id)?.titulo || 'Desconhecido';

  const getSalaNumero = (id: number) =>
    salas.find(s => s.id === id)?.numero || 'N/A';

  return (
    <div className="container">
      <h2>Agendamento de Sessões</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="row g-3 mb-5 border p-3 rounded"
      >
        {/* FILME */}
        <div className="col-md-3">
          <label>Filme</label>
          <select
            {...register('filmeId', {
              setValueAs: v => Number(v) // converte string para número antes da validação
            })}
            className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}
          >
            <option value="">Selecione...</option>
            {filmes.map(f => (
              <option key={f.id} value={f.id}>
                {f.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* SALA */}
        <div className="col-md-3">
          <label>Sala</label>
          <select
            {...register('salaId', {
              setValueAs: v => Number(v)
            })}
            className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}
          >
            <option value="">Selecione...</option>
            {salas.map(s => (
              <option key={s.id} value={s.id}>
                Sala {s.numero}
              </option>
            ))}
          </select>
        </div>

        {/* DATA */}
        <div className="col-md-3">
          <label>Data e Hora</label>
          <input
            type="datetime-local"
            {...register('data')}
            className={`form-control ${errors.data ? 'is-invalid' : ''}`}
          />
        </div>

        {/* VALOR */}
        <div className="col-md-3">
          <label>Valor do Ingresso</label>
          <input
            type="number"
            step="0.01"
            {...register('valorIngresso', { valueAsNumber: true })}
            className={`form-control ${errors.valorIngresso ? 'is-invalid' : ''}`}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Agendar Sessão
          </button>
        </div>
      </form>

      {/* LISTA */}
      <h3>Sessões Agendadas</h3>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Filme</th>
            <th>Sala</th>
            <th>Horário</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {sessoes.map(sessao => (
            <tr key={sessao.id}>
              <td>
                {sessao.filme?.titulo || getFilmeNome(sessao.filmeId)}
              </td>
              <td>
                {sessao.sala?.numero || getSalaNumero(sessao.salaId)}
              </td>
              <td>{new Date(sessao.data).toLocaleString()}</td>
              <td>R$ {sessao.valorIngresso}</td>
              <td>
                <button
                  onClick={() => venderIngresso(sessao)}
                  className="btn btn-success btn-sm"
                >
                  🎟️ Vender
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