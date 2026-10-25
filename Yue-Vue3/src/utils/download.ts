/**
 * 文件下载工具函数
 */

/**
 * 从响应头中提取文件名
 * @param contentDisposition Content-Disposition 响应头
 * @returns 解码后的文件名
 */
function extractFileName(contentDisposition: string): string {
  if (!contentDisposition) {
    return `download_${Date.now()}`;
  }

  // 尝试从 filename*=UTF-8'' 格式中提取
  const filenameRegex = /filename\*=UTF-8''(.+)/;
  const matches = filenameRegex.exec(contentDisposition);
  if (matches && matches[1]) {
    return decodeURIComponent(matches[1]);
  }

  // 尝试从 filename= 格式中提取
  const fallbackRegex = /filename=([^;]+)/;
  const fallbackMatches = fallbackRegex.exec(contentDisposition);
  if (fallbackMatches && fallbackMatches[1]) {
    return decodeURI(fallbackMatches[1].replace(/"/g, ""));
  }

  return `download_${Date.now()}`;
}

/**
 * 下载文件
 * @param response Axios 响应对象
 * @param customFileName 自定义文件名（可选）
 *
 * @example
 * ```ts
 * // 基础用法
 * const response = await UserAPI.export(queryParams);
 * downloadFile(response);
 *
 * // 自定义文件名
 * downloadFile(response, "用户列表.xlsx");
 * ```
 */

export function downloadFile(response: any, customFileName?: string): void {
  try {
    const fileData = response.data;
    const contentDisposition = response.headers["content-disposition"];
    const contentType = response.headers["content-type"];

    // 优先从响应头提取文件名，如果不存在则使用自定义文件名或默认文件名
    let fileName = extractFileName(contentDisposition);

    // 如果无法从响应头提取文件名，使用自定义文件名或带时间戳的默认文件名
    if (!fileName || fileName.startsWith("download_")) {
      fileName = customFileName || `export_${Date.now()}.xlsx`;
    }

    // 创建 Blob 对象，明确指定 MIME 类型
    const blobOptions = contentType
      ? { type: contentType }
      : {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
    const blob = new Blob([fileData], blobOptions);

    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("文件下载失败:", error);
    throw error;
  }
}
