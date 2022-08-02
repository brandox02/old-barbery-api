import { model, Schema } from "mongoose";

export interface IHaircut {
  name: string;
  image: string;
  price: number;
}

const HaircutModel = model<IHaircut>(
  "haircuts",
  new Schema<IHaircut>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  })
);

export default HaircutModel;
