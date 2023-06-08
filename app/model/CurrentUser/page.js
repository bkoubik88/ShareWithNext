import mongoose, { model, models } from "mongoose";

const CurrentUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique:true
    },
    email:{
        type: String,
        required: true,
        unique:true
     },
    username:{
        type: String,
        default:""
    },
    profilImage:{
      type: String,
      default:""
    },
    bookmarks:{
      type:[String],
      default:[]
    },
    userOfferedServices:{
      type:[String]
    }
   
  },
  { timestamps: true }
);

const CurrentUser = models.CurrentUser || model("CurrentUser", CurrentUserSchema);
export default CurrentUser;
