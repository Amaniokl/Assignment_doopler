import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true, // Ensure filename is provided
    trim: true,     // Remove whitespace from both ends
  },
  url: {
    type: String,
    required: true, // Ensure URL is provided
    trim: true,     // Remove whitespace from both ends
    validate: {
      validator: function(v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Basic URL validation
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
}, {timestamps: true});

export default mongoose.model("Image", ImageSchema);