const path = require('path');
const { deleteFile, fileExists } = require('../utils/fileUtils');

// 上传图片
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '没有上传文件',
    });
  }

  // 生成文件的URL路径
  const fileUrl = `/uploads/images/${path.basename(req.file.path)}`;

  res.json({
    success: true,
    message: '文件上传成功',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
};

// 删除文件
exports.deleteFile = async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({
      success: false,
      message: '文件路径不能为空',
    });
  }

  try {
    // 检查文件是否存在
    const exists = await fileExists(filePath);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: '文件不存在',
      });
    }

    // 删除文件
    await deleteFile(filePath);

    res.json({
      success: true,
      message: '文件删除成功',
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文件失败',
    });
  }
};
