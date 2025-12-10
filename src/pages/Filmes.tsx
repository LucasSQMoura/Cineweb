import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { type Filme, filmeSchema } from '../types'; // Note o 'type Filme' aqui

const Filmes = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(filmeSchema)
  });

  const loadFilmes = async () => {
    try {
        const response = await api.get('/filmes');
        setFilmes(response.data);
    } catch (error) {
        console.error("Erro ao carregar filmes", error);
    }
  };

  useEffect(() => { loadFilmes(); }, []);

  const onSubmit = async (data: any) => { 
    try {
        await api.post('/filmes', data);
        reset();
        loadFilmes();
    } catch (error) {
        console.error("Erro ao salvar filme", error);
    }
  };

  const deleteFilme = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      await api.delete(`/filmes/${id}`);
      loadFilmes();
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Filmes</h2>
      
      {/* Formulário de Cadastro */}
      <div className="card p-3 mb-4">
        {/* O restante do JSX continua igual... */}
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Título</label>
            {/* Como removemos o Genérico lá em cima, o TS pode não sugerir o 'titulo' 
                automaticamente aqui se o VS Code não indexar rápido, mas vai funcionar */}
            <input {...register('titulo')} className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.titulo?.message as string}</div>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Duração (min)</label>
            {/* Importante: type="number" retorna string, mas o Zod converte */}
            <input type="number" {...register('duracao')} className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.duracao?.message as string}</div>
          </div>

          <div className="col-md-3">
             <label className="form-label">Gênero</label>
             <select {...register('genero')} className="form-select">
                <option value="Ação">Ação</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
             </select>
          </div>

          <div className="col-md-4">
             <label className="form-label">Classificação</label>
             <input {...register('classificacao')} className={`form-control ${errors.classificacao ? 'is-invalid' : ''}`} />
          </div>

          <div className="col-md-12">
            <label className="form-label">Sinopse</label>
            <textarea {...register('sinopse')} className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.sinopse?.message as string}</div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Salvar Filme</button>
          </div>
        </form>
      </div>

      {/* Listagem */}
      <div className="row">
        {filmes.map(filme => (
          <div key={filme.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{filme.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{filme.genero} - {filme.duracao} min</h6>
                <p className="card-text">{filme.sinopse}</p>
                <button onClick={() => deleteFilme(filme.id)} className="btn btn-danger btn-sm">
                  <i className="bi bi-trash"></i> Excluir
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