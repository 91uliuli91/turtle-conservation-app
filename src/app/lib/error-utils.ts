// src/app/lib/error-utils.ts

export const isPostgresError = (error: unknown, code: string): boolean => {
  return Boolean(error && 
         typeof error === 'object' && 
         'code' in error && 
         error.code === code);
};

export const handlePostgresError = (error: unknown) => {
  if (isPostgresError(error, '23505')) {
    return { type: 'unique_violation', message: 'Ya existe un registro con esos datos' };
  }
  
  if (isPostgresError(error, '23503')) {
    return { type: 'foreign_key_violation', message: 'No se puede eliminar porque tiene registros asociados' };
  }
  
  return { type: 'unknown', message: 'Error interno del servidor' };
};