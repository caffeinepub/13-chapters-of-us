import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PhotoEntry {
    id: string;
    blob: ExternalBlob;
    name: string;
}
export interface backendInterface {
    getAllPhotoIds(): Promise<Array<string>>;
    getPhoto(id: string): Promise<PhotoEntry>;
    uploadPhoto(id: string, blob: ExternalBlob, name: string): Promise<void>;
}
