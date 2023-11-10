import Constants from "./constants";

export function downloadFile(relativePath) {
  const fileUrl = Constants.backend_base + relativePath;
  console.log("FILE DOWNLAOD::", fileUrl);

  require("downloadjs")(fileUrl);
}
