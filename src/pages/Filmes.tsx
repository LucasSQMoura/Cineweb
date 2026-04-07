import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Filme, filmeSchema } from '../types';
import { z } from 'zod';

type Genero = {
  id: number;
  nome: string;
};

// ✅ CORRETO
type FilmeFormData = z.input<typeof filmeSchema>;

const Filmes = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FilmeFormData>({
    resolver: zodResolver(filmeSchema)
  });

  const loadData = async () => {
    try {
      const [resFilmes, resGeneros] = await Promise.all([
        api.get('/filme'),
        api.get('/genero')
      ]);

      setFilmes(resFilmes.data);
      setGeneros(resGeneros.data);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: FilmeFormData) => {
    try {
      await api.post('/filme', data);
      reset();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar filme', error);
    }
  };

  // ID agora é number
  const deleteFilme = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      try {
        await api.delete(`/filme/${id}`);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir filme', error);
      }
    }
  };

  const getGeneroNome = (id: number) =>
    generos.find(g => g.id === id)?.nome || 'Desconhecido';

  return (
    <div className="container">
      <h2>Gerenciar Filmes</h2>

      {/* FORM */}
      <div className="card p-3 mb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">

          {/* TÍTULO */}
          <div className="col-md-6">
            <label className="form-label">Título</label>
            <input
              {...register('titulo')}
              className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">
              {errors.titulo?.message}
            </div>
          </div>

          {/* DURAÇÃO */}
          <div className="col-md-3">
            <label className="form-label">Duração (min)</label>
            <input
              type="number"
              {...register('duracao')}
              className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">
              {errors.duracao?.message}
            </div>
          </div>

          {/* GÊNERO */}
          <div className="col-md-3">
            <label className="form-label">Gênero</label>
            <select
              {...register('generoId')}
              className={`form-select ${errors.generoId ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione...</option>
              {generos.map(g => (
                <option key={g.id} value={g.id}>
                  {g.nome}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">
              {errors.generoId?.message}
            </div>
          </div>

          {/* CLASSIFICAÇÃO */}
          <div className="col-md-4">
            <label className="form-label">Classificação Etária</label>
            <input
              {...register('classificacaoEtaria')}
              className={`form-control ${errors.classificacaoEtaria ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">
              {errors.classificacaoEtaria?.message}
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              💾 Salvar Filme
            </button>
          </div>
        </form>
      </div>

      {/* LISTA */}
      <div className="row">
        {filmes.map(filme => (
          <div key={filme.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{filme.titulo}</h5>

                <h6 className="card-subtitle mb-2 text-muted">
                  {getGeneroNome(filme.generoId)} • {filme.duracao} min
                </h6>

                <p className="card-text">
                  Classificação: {filme.classificacaoEtaria}
                </p>

                <button
                  onClick={() => deleteFilme(filme.id)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filmes;