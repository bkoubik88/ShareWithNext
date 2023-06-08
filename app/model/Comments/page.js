import mongoose, { model, models } from "mongoose";

const CommentsSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    hadRead:{
        type:Boolean,
        default:false
    },
    productId:{
        type: String,
        required: true,
       },
    text:{
        type: String,
        required: true,
    }  
  },
  { timestamps: true }
);

const Comments = models.Comments || model("Comments", CommentsSchema);
export default Comments;
