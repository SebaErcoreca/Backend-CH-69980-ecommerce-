import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;