import request from "@/utils/request";
import type { FileInfo } from "@/types/api";

const FileAPI = {
  /** 上传文件 */
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<any, FileInfo>({
      url: "/api/v1/files",
      method: "post",
      data: formData,
    });
  },

  /** 删除文件 */
  delete(filePath: string) {
    return request({
      url: "/api/v1/files",
      method: "delete",
      params: { filePath },
    });
  },
};

export default FileAPI;
