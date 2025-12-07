import zod from 'zod';

export const createUserSchema = zod.object({
  body: zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    role: zod.string().min(3).max(20),
    id_empresa: zod.number().optional()
  }),
});

