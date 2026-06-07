import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
  Received = 'Received',
  InProduction = 'In Production',
  CastingDone = 'Casting Done',
  Finishing = 'Finishing',
  ReadyToDispatch = 'Ready to Dispatch',
  Dispatched = 'Dispatched',
}

export interface IOrder extends Document {
  orderNumber: number;
  customerName: string;
  companyName: string;
  orderDate: Date;
  vehicleNo?: string;
  orderQuantity: number;
  orderTotalWeight: number;
  orderItems: string[];
  orderValue: number;
  orderGST: number;
  orderNote?: string;
  status: OrderStatus;
  createdBy: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: Number, unique: true },
    customerName: { type: String, required: true, trim: true },
    orderDate: { type: Date, required: true, immutable: true },
    vehicleNo: { type: String },
    orderQuantity: { type: Number, required: true },
    orderTotalWeight: { type: Number, required: true },
    orderItems: [{ type: String, required: true }],
    orderValue: { type: Number, required: true },
    orderGST: { type: Number, required: true },
    orderNote: { type: String },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus['Received'],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = mongoose.model('Order').fin;
  }
});
