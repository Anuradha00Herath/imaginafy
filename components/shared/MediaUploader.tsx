"use client";

import { useToast } from "@/hooks/use-toast";
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary";

type ImageData = {
  publicId: string;
  width: number;
  height: number;
  secureURL: string;
};

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<React.SetStateAction<ImageData>>;
  publicId: string | undefined;
  image: ImageData;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info;

    // Check if 'info' is of type 'CloudinaryUploadWidgetInfo'
    if (typeof info === "object" && info !== null && "public_id" in info) {
      const { public_id, width, height, secure_url } = info as CloudinaryUploadWidgetInfo;

      setImage((prevState) => ({
        ...prevState,
        publicId: public_id,
        width,
        height,
        secureURL: secure_url,
      }));

      onValueChange(public_id);

      toast({
        title: "Image uploaded successfully",
        description: "1 credit was deducted from your account",
        duration: 5000,
        className: "success-toast",
      });
    } else {
      onUploadErrorHandler();
    }
  };

  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="jsm_imaginify"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>
          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="image"
                sizes="(max-width:767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image src="/assets/icons/add.svg" alt="Add image" width={24} height={24} />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
