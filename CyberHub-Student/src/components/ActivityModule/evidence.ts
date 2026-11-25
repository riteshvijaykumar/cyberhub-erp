export const evidenceAccept = "application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg";

export function isValidEvidenceFile(file: File) {
  return ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
    && file.size > 0 && file.size <= 5 * 1024 * 1024 && file.name.length <= 200;
}

export function encodeEvidenceFile(file: File) {
  return new Promise<{ fileName: string; mimeType: string; content: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ fileName: file.name, mimeType: file.type, content: String(reader.result).split(",")[1] });
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}
