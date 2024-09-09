import Ticket from "../models/ticket.js";

class TicketRepository {
    constructor() {
    }
    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }
}

export default TicketRepository;