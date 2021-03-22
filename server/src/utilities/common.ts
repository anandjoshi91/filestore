import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';

const fileFilter = function (req: Request, file: any, cb: any) {
  // content type whitelisting
  if (
    isEmpty(file.originalname) || !file.originalname.match(
      /\.(jpg|jpeg|png|gif|txt|doc|docx|pdf|mp4|avi|ppt|pptx|srt|yaml|json)$/
    )
  ) {
    return cb(new Error('This file type is not allowed'), false);
  }
  cb(null, true);
};

export { fileFilter };
