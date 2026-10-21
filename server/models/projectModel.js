import { model, Schema } from 'mongoose';
import {
  PROJECT_STATUS_VALUES,
  PROJECT_STATUS,
} from '../constants/project.constants.js';

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const PlannedFilesSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    files: {
      type: Schema.Types.Mixed,
      default: {},
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    version: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: PROJECT_STATUS_VALUES, //['pending', 'generating', 'revising', 'completed', 'failed'],
      default: PROJECT_STATUS.PENDING,
    },
    filesPlanned: {
      type: [PlannedFilesSchema],
      default: [],
    },
    filesGenerated: {
      type: [String],
      default: [],
    },
    currentFile: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Project = model('Project', ProjectSchema);
