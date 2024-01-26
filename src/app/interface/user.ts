export interface User {
    id: number | null;
    nombre: string;
    correo: string;
    password: string;
    empresaId: number | null;
    entidadId: number | null;
}
