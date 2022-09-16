import { v2 as Cloudinary } from "cloudinary";
import { Repository } from "typeorm";

async function _uploadImage(base64Image: string, public_id?: string) {
  if (public_id) {
    return Cloudinary.uploader.upload(base64Image, {
      public_id,
    });
  }

  return Cloudinary.uploader.upload(base64Image);
}

export const uploadImage = async (repo: Repository<any>, item: any) => {
  let payload: {} = { ...item };

  if (item?.image) {
    let imageId: string | null = null;
    let imageUrl: string | null = null;
    if (item.id) {
      const found = await repo.findOne({
        where: { id: item.id },
      });

      if (!found)
        throw new Error("Corte de pelo no encontrado con este identificador");

      const { public_id, url } = await _uploadImage(item.image, found?.imageId);
      imageId = public_id;
      imageUrl = url;
    } else {
      const { public_id, url } = await _uploadImage(item.image);
      imageId = public_id;
      imageUrl = url;
    }

    payload = { ...item, imageId, imageUrl };
  }

  return payload;
};
