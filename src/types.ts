import { z } from 'zod';

export const filmeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  sinopse: z.string().min(10, "Sinopse deve ter no mínimo 10 caracteres"),
  classificacao: z.string().min(1, "Classificação é obrigatória"),
  duracao: z.coerce.number().positive("Duração deve ser maior que 0"),
  genero: z.string().min(1, "Gênero é obrigatório")
});

export const salaSchema = z.object({
  numero: z.coerce.number().int().positive("Número deve ser positivo"),
  capacidade: z.coerce.number().int().positive("Capacidade deve ser positiva")
});

export const sessaoSchema = z.object({
  filmeId: z.string().min(1, "Selecione um filme"),
  salaId: z.string().min(1, "Selecione uma sala"),
  dataHora: z.string().refine((val) => new Date(val) >= new Date(), {
    message: "A data da sessão não pode ser retroativa"
  })
});

export const lancheSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  qtUnidade: z.coerce.number().int().positive("Qtd deve ser positiva")
});


export type Filme = z.infer<typeof filmeSchema> & { id: string };
export type Sala = z.infer<typeof salaSchema> & { id: string };
export type Sessao = z.infer<typeof sessaoSchema> & { id: string };
export type Lanche = z.infer<typeof lancheSchema> & { id: string };
export type Ingresso = {
  valorInteira(arg0: string, valorInteira: any): unknown;
  valorMeia(arg0: string, valorMeia: any): unknown;
  id: string;
  sessaoId: string;
  tipo: 'INTEIRA' | 'MEIA';
  valor: number;
};