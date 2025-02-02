"use client"

import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import Image from 'next/image'
import React from 'react'

interface ImageType {
  width: number;
  height: number;
  publicId: string;
  title: string;
}

interface TransformedImageProps {
  image?: ImageType;
  type: string;
  title: string;
  transformationConfig?: object;
  isTransforming: boolean;
  setIsTransforming?: (value: boolean) => void;
  hasDownload?: boolean;
}

const TransformedImage: React.FC<TransformedImageProps> = ({
  image,
  type,
  title,
  transformationConfig = {},
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}) => {
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (image) {
      download(
        getCldImageUrl({
          width: image.width,
          height: image.height,
          src: image.publicId,
          ...transformationConfig,
        }),
        title
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>

      {image && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, 'width')}
            height={getImageSize(type, image, 'height')}
            src={image.publicId}
            alt={image.title}
            sizes="(max-width: 767px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={dataUrl} // Corrected dataUrl usage
            className="transformed-image"
            onLoad={() => setIsTransforming && setIsTransforming(false)}
            onError={() => debounce(() => setIsTransforming && setIsTransforming(false), 8000)()}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="transforming-loader">
              <Image src="/assets/icons/spinner.svg" width={50} height={50} alt="spinner" />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;
