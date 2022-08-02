import mongoose, { Error } from "mongoose";

export default async function initDBConnection() {
  const uri =
    "mongodb+srv://TqBifhlD4Dtwt2Yx:TqBifhlD4Dtwt2Yx@cluster0.7ixjw.mongodb.net/?retryWrites=true&w=majority";

  return await mongoose.connect(uri, { dbName: "barbery" });
}
