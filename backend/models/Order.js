import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export const ORDER_STATUS_VALUES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    orderItems: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, 'An order needs at least one item'],
    },

    shippingAddress: { type: shippingAddressSchema, required: true },

    paymentMethod: {
      type: String,
      required: true,
      enum: ['MTN MoMo', 'Telecel Cash', 'AirtelTigo Money', 'Card'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Failed'],
      default: 'Pending',
    },

    itemsPrice: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },

    orderStatus: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: 'Pending',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: 'Pending' }],
    },

    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.orderNumber = `LC-${ts}-${rand}`;
  }
  next();
});

orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({ status: this.orderStatus });
    if (this.orderStatus === 'Delivered') {
      this.deliveredAt = new Date();
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;