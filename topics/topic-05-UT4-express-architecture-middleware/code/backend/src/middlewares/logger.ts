import type { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now(); // Empieza a medir lo que tarda la petición

  res.on('finish', () => {
    // Se ejecuta cuando la petición ha terminado después de pasar por todos los middlewares y handlers
    const duration = Math.round(performance.now() - start);
    const entry = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(entry)); // Loguea en pantalla la información de la petición
  });

  next();
}
