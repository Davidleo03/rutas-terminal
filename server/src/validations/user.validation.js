import zod from 'zod';

export const createUserSchema = zod.object({
  body: zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    tipo_usuario: zod.string().min(3).max(20),
    id_empresa: zod.number().optional()
  }),
});

