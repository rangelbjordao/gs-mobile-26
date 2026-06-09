export interface TicketBackend {
  id: number;
  userId: number;
  tourDateId: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  bookingDate: string;
  price: number;
  tourName?: string;
  destino?: string;
  dataPartida?: string;
  tourId?: number;
}

export interface DataDisponivel {
  id: number;
  tourId: number;
  departureDate: string;
  availableSpots: number;
}
