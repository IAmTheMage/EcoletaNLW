import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./styles.css";

interface Props {
  onFileUploaded: any;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileUploaded(acceptedFiles);
      const objectUrl = URL.createObjectURL(acceptedFiles[0]);
      setSelectedFileUrl(objectUrl);
    },
    [onFileUploaded]
  );
  const [selectedFileUrl, setSelectedFileUrl] = useState<any>();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()}></input>
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point thumbnail"></img>
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
