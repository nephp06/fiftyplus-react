const fs = require('fs');
const path = require('path');

// 删除文件
exports.deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.join(__dirname, '../../', filePath);

    fs.unlink(absolutePath, (err) => {
      if (err) {
        // 如果文件不存在，视为删除成功
        if (err.code === 'ENOENT') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

// 检查文件是否存在
exports.fileExists = (filePath) => {
  return new Promise((resolve) => {
    const absolutePath = path.join(__dirname, '../../', filePath);
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};
