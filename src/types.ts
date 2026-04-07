import { z } from 'zod';

//
// 🎬 FILME
//
export const filmeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  duracao: z.coerce.number().positive("Duração deve ser maior que 0"),
  classificacaoEtaria: z.string().min(1, "Classificação é obrigatória"),
  generoId: z.coerce.number()
});

//
// 🏢 SALA
//
export const salaSchema = z.object({
  numero: z.string().min(1),
  capacidade: z.coerce.number().positive()
});

//
// 🎟️ SESSÃO
//
export const sessaoSchema = z.object({
  filmeId: z.number(),
  salaId: z.number(),
  data: z.string(),
  valorIngresso: z.number()
});

//
// 🍔 LANCHE
//
export const lancheSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().min(1),
  preco: z.coerce.number().positive()
});

//
// 🧠 TYPES
//
export type Filme = {
  id: number;
  titulo: string;
  duracao: number;
  generoId: number;
  classificacaoEtaria: string;
};

export type Genero = {
  id: number;
  nome: string;
};

export type Sala = {
  id: number;
  numero: string;
  capacidade: number;
};

export type Sessao = {
  id: number;
  data: string;
  valorIngresso: number;

  filmeId: number;
  salaId: number;

  filme?: Filme;
  sala?: Sala;
};

export type Lanche = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
};

export type Ingresso = {
  id: number;
  sessaoId: number;
  tipo: 'INTEIRA' | 'MEIA';
  valorPago: number;
};