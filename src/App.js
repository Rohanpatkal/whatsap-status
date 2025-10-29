import React, { useEffect, useState } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Step 1: Try reading WhatsApp Status Folder directly
        const result = await Filesystem.readdir({
          path: "Android/media/com.whatsapp/WhatsApp/Media/.Statuses",
          directory: Directory.External,
        });

        console.log("Status Files:", result.files);

        // Step 2: Convert File Names to URLs
        const imageList = [];
        for (const file of result.files) {
          const fileData = await Filesystem.readFile({
            path: `Android/media/com.whatsapp/WhatsApp/Media/.Statuses/${file.name}`,
            directory: Directory.External,
          });
          imageList.push(`data:image/jpeg;base64,${fileData.data}`);
        }

        setImages(imageList);
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Could not access WhatsApp statuses. Please allow storage access in Settings."
        );
      }
    };

    init();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>📸 WhatsApp Status Gallery</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "10px",
          padding: "10px",
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Status ${index}`}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
