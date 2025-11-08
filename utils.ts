export const downloadDocument = async (
  documentId: string,
  token: string
): Promise<void> => {
  try {
    const toke = token;

    if (!toke) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `http://localhost:3000/api/documents/${documentId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${toke}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Download response status:", response.status);
    console.log(
      "Download response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(
        `Failed to download file: ${response.status} ${response.statusText}`
      );
    }

    // Check if response has content
    const contentLength = response.headers.get("Content-Length");
    console.log("Content length:", contentLength);

    if (contentLength === "0") {
      throw new Error("Server returned empty file");
    }

    // Convert the response into a blob
    const blob = await response.blob();

    console.log("Blob size:", blob.size);
    console.log("Blob type:", blob.type);

    if (blob.size === 0) {
      throw new Error("Downloaded file is empty");
    }

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Extract filename from the Content-Disposition header or use fallback
    const contentDisposition = response.headers.get("Content-Disposition");
    console.log("Content-Disposition:", contentDisposition);

    let fileName = "document";

    if (contentDisposition) {
      const fileNameMatch =
        contentDisposition.match(/filename="(.+)"/) ||
        contentDisposition.match(/filename=([^;]+)/);
      if (fileNameMatch) {
        fileName = fileNameMatch[1];
      }
    }

    // Add file extension if missing
    if (!fileName.includes(".")) {
      // Try to determine extension from blob type
      const extension = blob.type.split("/")[1] || "bin";
      fileName = `${fileName}.${extension}`;
    }

    console.log("Downloading file as:", fileName);

    // Create a temporary <a> element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error; // Re-throw to handle in component
  }
};
