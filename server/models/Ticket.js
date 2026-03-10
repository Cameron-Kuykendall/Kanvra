import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    ticketKey: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Backlog", "Todo", "In Progress", "Review", "Done"],
      default: "Backlog",
    },

    type: {
      type: String,
      enum: ["Bug", "Feature", "Task", "Improvement"],
      default: "Task",
    },

    assignee: {
      type: String,
      trim: true,
      default: null,
    },

    reporter: {
      type: String,
      trim: true,
      default: null,
    },

    labels: [
      {
        type: String,
        trim: true,
      },
    ],

    dueDate: {
      type: Date,
    },

    comments: [
      {
        author: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt + updatedAt
  },
);

export default mongoose.model("Ticket", ticketSchema);
