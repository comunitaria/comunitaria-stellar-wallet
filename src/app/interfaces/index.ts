
export interface Usuario {
    id?: number,
    login? : string;
    password? : string; 
    token? : string;
    clase? : string;
    secret? : string;
    public? : string;
    nombre?: string,
    apellidos?: string,
    autorizado_en?: {
        clase: string,
        texto: string
    },
    correo?: string,
    direccion?: string,
    movil?: string,
    monedero: Monedero,
    comercios: ReferenciaComercio[],
    actual?: boolean;

}


export interface Comercio {
    id? :          string;
    nombre? :      string;
    hash? :        string;
    logo? :       string;    
    public ?:      string;
    info? :       string;    
    cuenta?:      string;
    CIF?:         string;
    contacto?:    string;
    direccion?:   string;
    movil?:       string;
    correo?:      string;
    coordenadas?: string;

}


export interface logeoResponse {
    mensaje:      string;
    access_token: string;
    clase:        string;
}

export interface Monedero {
    cripto?:        string;
    emisora?:       string;
    distribuidora?: string;
    nombreMoneda?:  string;
    red?:           string;
    nodo?:          string;
    cuenta:        Cuenta;
}

export interface Cuenta {
    publica?:       string;
    privada?:       string;
    estado?:        string;
    balanceCripto?: string;
    balanceXLM?:    string;
    nivelDeCarga?:  number;
}



export interface ReferenciaComercio {
    id?:     string;
    nombre?: string;
    hash?:   string;
    info?:   string;
    clave?:  string;
}

export interface codigoError{
    codigo?: number;
    mensaje?: string;
}