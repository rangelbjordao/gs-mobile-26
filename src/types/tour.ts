export interface Tour {
  id: number;
  nome: string;
  destino: string;
  descricao: string;
  preco: number;
}

export interface DataTour {
  id: number;
  id_tour: number;
  data_partida: string;
  data_retorno: string;
  vagas_disponiveis: number;
}

export interface Ingresso {
  id: number;
  id_usuario: number;
  id_data_tour: number;
  codigo_unico: string;
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO";
  data_compra: string;
  valor_pago: number;
  tourName?: string;
  destino?: string;
  dataPartida?: string;
}
